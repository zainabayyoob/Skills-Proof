import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const EXECUTION_TIMEOUT_MS = 3500;

export const compilerService = {
  /**
   * Executes submitted user code against problem test cases
   * @param {Object} params
   * @param {string} params.language - 'python' | 'javascript'
   * @param {string} params.code - User submitted source code
   * @param {string} params.entrypoint - Function name to execute (e.g. 'solution')
   * @param {Array} params.testCases - Array of { id, input: Array, expected: any, isHidden: boolean }
   * @returns {Promise<Object>} Execution report
   */
  execute: async ({ language = 'python', code, entrypoint = 'solution', testCases = [] }) => {
    if (!code || typeof code !== 'string' || !code.trim()) {
      return {
        success: false,
        status: 'EMPTY_CODE',
        error: 'No source code was submitted for execution.',
        passedCount: 0,
        totalCount: testCases.length,
        results: []
      };
    }

    const lang = language.toLowerCase();
    if (lang === 'python' || lang === 'py') {
      return executePython(code, entrypoint, testCases);
    } else if (lang === 'javascript' || lang === 'js' || lang === 'react' || lang === 'node') {
      return executeJavaScript(code, entrypoint, testCases);
    } else {
      // Fallback runner for other languages (runs via python/node)
      return executePython(code, entrypoint, testCases);
    }
  }
};

/**
 * Execute Python code in isolated child process with timeout
 */
function executePython(userCode, entrypoint, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const fileName = `skillproof_py_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.py`;
    const filePath = path.join(tempDir, fileName);

    const testCasesJson = JSON.stringify(testCases);

    const testHarness = `
import sys
import json
import time

# --- BEGIN CANDIDATE CODE ---
${userCode}
# --- END CANDIDATE CODE ---

try:
    target_fn = globals().get('${entrypoint}')
    if not target_fn or not callable(target_fn):
        # Look for any callable function defined in module
        funcs = [v for k, v in globals().items() if callable(v) and not k.startswith('_') and k != 'target_fn']
        if funcs:
            target_fn = funcs[-1]
        else:
            print(json.dumps({
                "status": "FUNCTION_NOT_FOUND",
                "error": "Function '${entrypoint}' was not found in your code. Please define the required function.",
                "passedCount": 0,
                "totalCount": len(json.loads('''${testCasesJson}''')),
                "results": []
            }))
            sys.exit(0)

    test_cases = json.loads('''${testCasesJson}''')
    results = []
    passed_count = 0

    for tc in test_cases:
        tc_id = tc.get('id', 1)
        raw_input = tc.get('input', [])
        expected = tc.get('expected')
        is_hidden = tc.get('isHidden', False)

        start_t = time.perf_counter()
        try:
            if isinstance(raw_input, list):
                actual = target_fn(*raw_input)
            elif isinstance(raw_input, dict):
                actual = target_fn(**raw_input)
            else:
                actual = target_fn(raw_input)
            
            elapsed_ms = round((time.perf_counter() - start_t) * 1000, 2)
            
            passed = (actual == expected)
            if passed:
                passed_count += 1

            results.append({
                "id": tc_id,
                "input": "Hidden Test Case" if is_hidden else raw_input,
                "expected": "Hidden" if is_hidden else expected,
                "actual": "Hidden" if is_hidden and not passed else actual,
                "passed": passed,
                "elapsedMs": elapsed_ms,
                "error": None
            })
        except Exception as e:
            elapsed_ms = round((time.perf_counter() - start_t) * 1000, 2)
            results.append({
                "id": tc_id,
                "input": "Hidden Test Case" if is_hidden else raw_input,
                "expected": "Hidden" if is_hidden else expected,
                "actual": None,
                "passed": False,
                "elapsedMs": elapsed_ms,
                "error": str(type(e).__name__ + ": " + str(e))
            })

    all_passed = (passed_count == len(test_cases))
    print(json.dumps({
        "status": "PASSED" if all_passed else "FAILED",
        "allPassed": all_passed,
        "passedCount": passed_count,
        "totalCount": len(test_cases),
        "score": round((passed_count / len(test_cases)) * 100) if test_cases else 0,
        "results": results
    }))
except Exception as global_err:
    print(json.dumps({
        "status": "RUNTIME_ERROR",
        "error": str(global_err),
        "passedCount": 0,
        "totalCount": len(json.loads('''${testCasesJson}''')),
        "results": []
    }))
`;

    try {
      fs.writeFileSync(filePath, testHarness, 'utf-8');
    } catch (err) {
      return resolve({
        success: false,
        status: 'FS_ERROR',
        error: `Could not create execution file: ${err.message}`,
        passedCount: 0,
        totalCount: testCases.length,
        results: []
      });
    }

    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const child = spawn('python', [filePath], {
      windowsHide: true,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }
    });

    const timer = setTimeout(() => {
      isTimedOut = true;
      child.kill('SIGKILL');
    }, EXECUTION_TIMEOUT_MS);

    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });

    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    child.on('close', (exitCode) => {
      clearTimeout(timer);
      try {
        fs.unlinkSync(filePath);
      } catch (e) {}

      if (isTimedOut) {
        return resolve({
          success: false,
          status: 'TIMEOUT_ERROR',
          error: `Execution timed out (> ${EXECUTION_TIMEOUT_MS}ms). Possible infinite loop or high complexity.`,
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: testCases.map(tc => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expected,
            actual: 'TIMEOUT',
            passed: false,
            error: 'Time Limit Exceeded'
          }))
        });
      }

      if (exitCode !== 0 && stderr) {
        return resolve({
          success: false,
          status: 'COMPILATION_ERROR',
          error: stderr.trim(),
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: testCases.map(tc => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expected,
            actual: 'ERROR',
            passed: false,
            error: 'Syntax/Runtime Error'
          }))
        });
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        resolve({
          success: true,
          ...parsed
        });
      } catch (jsonErr) {
        resolve({
          success: false,
          status: 'EXECUTION_ERROR',
          error: stderr || stdout || 'Failed to parse execution output',
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: []
        });
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      try {
        fs.unlinkSync(filePath);
      } catch (e) {}
      resolve({
        success: false,
        status: 'SPAWN_ERROR',
        error: `Could not start Python interpreter: ${err.message}`,
        passedCount: 0,
        totalCount: testCases.length,
        results: []
      });
    });
  });
}

/**
 * Execute JavaScript code in isolated Node.js child process with timeout
 */
function executeJavaScript(userCode, entrypoint, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const fileName = `skillproof_js_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.cjs`;
    const filePath = path.join(tempDir, fileName);

    const testCasesJson = JSON.stringify(testCases);

    const testHarness = `
const testCases = ${testCasesJson};

try {
  // --- BEGIN CANDIDATE CODE ---
  ${userCode}
  // --- END CANDIDATE CODE ---

  let targetFn = null;
  try {
    if (typeof ${entrypoint} === 'function') {
      targetFn = ${entrypoint};
    }
  } catch(e) {}

  if (!targetFn) {
    // Search module/global for first function
    const candidateFuncs = Object.entries(global).filter(([k, v]) => typeof v === 'function' && !['setTimeout', 'setInterval', 'clearTimeout'].includes(k));
    if (candidateFuncs.length > 0) {
      targetFn = candidateFuncs[candidateFuncs.length - 1][1];
    }
  }

  if (!targetFn) {
    console.log(JSON.stringify({
      status: "FUNCTION_NOT_FOUND",
      error: "Function '${entrypoint}' is not defined. Please implement '${entrypoint}'.",
      allPassed: false,
      passedCount: 0,
      totalCount: testCases.length,
      score: 0,
      results: []
    }));
    process.exit(0);
  }

  const results = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const isHidden = !!tc.isHidden;
    const input = tc.input;
    const expected = tc.expected;
    const startT = process.hrtime.bigint();

    try {
      const actual = Array.isArray(input) ? targetFn(...input) : targetFn(input);
      const elapsedMs = Number(process.hrtime.bigint() - startT) / 1000000;

      const passed = JSON.stringify(actual) === JSON.stringify(expected);
      if (passed) passedCount++;

      results.push({
        id: tc.id,
        input: isHidden ? "Hidden Test Case" : input,
        expected: isHidden ? "Hidden" : expected,
        actual: isHidden && !passed ? "Hidden" : actual,
        passed,
        elapsedMs: Math.round(elapsedMs * 100) / 100,
        error: null
      });
    } catch (err) {
      const elapsedMs = Number(process.hrtime.bigint() - startT) / 1000000;
      results.push({
        id: tc.id,
        input: isHidden ? "Hidden Test Case" : input,
        expected: isHidden ? "Hidden" : expected,
        actual: null,
        passed: false,
        elapsedMs: Math.round(elapsedMs * 100) / 100,
        error: err.name + ": " + err.message
      });
    }
  }

  const allPassed = passedCount === testCases.length;
  console.log(JSON.stringify({
    status: allPassed ? "PASSED" : "FAILED",
    allPassed,
    passedCount,
    totalCount: testCases.length,
    score: testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0,
    results
  }));
} catch (outerErr) {
  console.error(outerErr.stack || outerErr.message);
  process.exit(1);
}
`;

    try {
      fs.writeFileSync(filePath, testHarness, 'utf-8');
    } catch (err) {
      return resolve({
        success: false,
        status: 'FS_ERROR',
        error: `Could not create execution file: ${err.message}`,
        passedCount: 0,
        totalCount: testCases.length,
        results: []
      });
    }

    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const child = spawn('node', [filePath], {
      windowsHide: true
    });

    const timer = setTimeout(() => {
      isTimedOut = true;
      child.kill('SIGKILL');
    }, EXECUTION_TIMEOUT_MS);

    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });

    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    child.on('close', (exitCode) => {
      clearTimeout(timer);
      try {
        fs.unlinkSync(filePath);
      } catch (e) {}

      if (isTimedOut) {
        return resolve({
          success: false,
          status: 'TIMEOUT_ERROR',
          error: `Execution timed out (> ${EXECUTION_TIMEOUT_MS}ms). Possible infinite loop or slow recursion.`,
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: testCases.map(tc => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expected,
            actual: 'TIMEOUT',
            passed: false,
            error: 'Time Limit Exceeded'
          }))
        });
      }

      if (exitCode !== 0 && stderr) {
        return resolve({
          success: false,
          status: 'COMPILATION_ERROR',
          error: stderr.trim(),
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: testCases.map(tc => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expected,
            actual: 'ERROR',
            passed: false,
            error: 'Syntax/Runtime Error'
          }))
        });
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        resolve({
          success: true,
          ...parsed
        });
      } catch (jsonErr) {
        resolve({
          success: false,
          status: 'EXECUTION_ERROR',
          error: stderr || stdout || 'Failed to parse execution output',
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: []
        });
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      try {
        fs.unlinkSync(filePath);
      } catch (e) {}
      resolve({
        success: false,
        status: 'SPAWN_ERROR',
        error: `Could not start Node.js runner: ${err.message}`,
        passedCount: 0,
        totalCount: testCases.length,
        results: []
      });
    });
  });
}
