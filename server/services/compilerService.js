import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const EXECUTION_TIMEOUT_MS = 3500;
const SENTINEL_START = '###__SKILLPROOF_RESULT_START__###';
const SENTINEL_END = '###__SKILLPROOF_RESULT_END__###';

export const compilerService = {
  /**
   * Executes submitted user code against problem test cases
   * @param {Object} params
   * @param {string} params.language - 'python' | 'javascript' | 'sql' | 'c' | 'cpp' | 'java'
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
        error: 'No source code was submitted for execution. Please write your solution.',
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      };
    }

    const lang = language.toLowerCase();
    if (lang === 'python' || lang === 'py' || lang === 'dataanalytics') {
      return executePython(code, entrypoint, testCases);
    } else if (lang === 'sql') {
      return executeSQL(code, testCases);
    } else if (lang === 'c') {
      return executeC(code, testCases);
    } else if (lang === 'cpp' || lang === 'c++') {
      return executeCpp(code, testCases);
    } else if (['javascript', 'js', 'react', 'node', 'frontend', 'backend', 'htmlcss', 'java'].includes(lang)) {
      return executeJavaScript(code, entrypoint, testCases);
    } else {
      return executePython(code, entrypoint, testCases);
    }
  }
};

/**
 * Parses stdout looking for sentinel token framing.
 * Extracts user console logs and isolated execution payload.
 */
function parseSentinelOutput(rawStdout, rawStderr, totalCases) {
  let logs = '';
  let payload = null;

  const startIdx = rawStdout.indexOf(SENTINEL_START);
  const endIdx = rawStdout.indexOf(SENTINEL_END);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    logs = rawStdout.substring(0, startIdx).trim();
    const jsonStr = rawStdout.substring(startIdx + SENTINEL_START.length, endIdx).trim();
    try {
      payload = JSON.parse(jsonStr);
    } catch (e) {
      console.warn('JSON parse error from sentinel block:', e.message);
    }
  } else {
    const lines = rawStdout.trim().split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const candidate = JSON.parse(lines[i]);
        if (candidate && typeof candidate === 'object' && ('results' in candidate || 'status' in candidate)) {
          payload = candidate;
          logs = lines.slice(0, i).join('\n').trim();
          break;
        }
      } catch (e) {}
    }
  }

  return { logs, payload };
}

/**
 * Execute Python code in isolated child process with timeout
 */
function executePython(userCode, entrypoint, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const baseId = `py_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const payloadPath = path.join(tempDir, `${baseId}_payload.json`);
    const scriptPath = path.join(tempDir, `${baseId}_run.py`);

    // Write payload cleanly to disk to avoid any string escaping/quote issues
    fs.writeFileSync(payloadPath, JSON.stringify({ entrypoint, testCases }), 'utf-8');

    const indentedUserCode = userCode.split('\n').map(line => '    ' + line).join('\n');

    const testHarness = `
import sys
import io
import json
import time

SENTINEL_START = '${SENTINEL_START}'
SENTINEL_END = '${SENTINEL_END}'

with open(r'''${payloadPath}''', 'r', encoding='utf-8') as f:
    config = json.load(f)

entrypoint_name = config.get('entrypoint', 'solution')
test_cases = config.get('testCases', [])

user_stdout = io.StringIO()
real_stdout = sys.stdout
sys.stdout = user_stdout

runtime_error = None
try:
    # --- BEGIN CANDIDATE CODE ---
${indentedUserCode}
    # --- END CANDIDATE CODE ---
except Exception as e:
    runtime_error = e

sys.stdout = real_stdout
captured_logs = user_stdout.getvalue()

if runtime_error is not None:
    import traceback
    tb = traceback.format_exc()
    out = {
        "status": "RUNTIME_ERROR",
        "error": f"{type(runtime_error).__name__}: {runtime_error}",
        "traceback": tb,
        "logs": captured_logs,
        "allPassed": False,
        "passedCount": 0,
        "totalCount": len(test_cases),
        "score": 0,
        "results": []
    }
    print(SENTINEL_START)
    print(json.dumps(out))
    print(SENTINEL_END)
    sys.exit(0)

target_fn = globals().get(entrypoint_name)
if not target_fn or not callable(target_fn):
    funcs = [v for k, v in globals().items() if callable(v) and not k.startswith('_') and k != 'target_fn']
    if funcs:
        target_fn = funcs[-1]
    else:
        out = {
            "status": "FUNCTION_NOT_FOUND",
            "error": f"Function '{entrypoint_name}' was not found in your code. Please define '{entrypoint_name}' with the required signature.",
            "logs": captured_logs,
            "allPassed": False,
            "passedCount": 0,
            "totalCount": len(test_cases),
            "score": 0,
            "results": []
        }
        print(SENTINEL_START)
        print(json.dumps(out))
        print(SENTINEL_END)
        sys.exit(0)

results = []
passed_count = 0

def deep_equals(a, b):
    if isinstance(a, float) and isinstance(b, (int, float)):
        return abs(a - float(b)) < 1e-4
    if isinstance(b, float) and isinstance(a, (int, float)):
        return abs(float(a) - b) < 1e-4
    if isinstance(a, dict) and isinstance(b, dict):
        if set(a.keys()) != set(b.keys()):
            return False
        return all(deep_equals(a[k], b[k]) for k in a)
    if isinstance(a, list) and isinstance(b, list):
        if len(a) != len(b):
            return False
        return all(deep_equals(x, y) for x, y in zip(a, b))
    return a == b

for tc in test_cases:
    tc_id = tc.get('id', 1)
    raw_input = tc.get('input', [])
    expected = tc.get('expected')
    is_hidden = tc.get('isHidden', False)

    start_t = time.perf_counter()
    try:
        sys.stdout = user_stdout
        if isinstance(raw_input, list):
            actual = target_fn(*raw_input)
        elif isinstance(raw_input, dict):
            actual = target_fn(**raw_input)
        else:
            actual = target_fn(raw_input)
        sys.stdout = real_stdout

        elapsed_ms = round((time.perf_counter() - start_t) * 1000, 2)
        passed = deep_equals(actual, expected)
        if passed:
            passed_count += 1

        results.append({
            "id": tc_id,
            "input": "Hidden Test Case" if is_hidden else raw_input,
            "expected": "Hidden" if is_hidden else expected,
            "actual": "Hidden" if (is_hidden and not passed) else actual,
            "passed": passed,
            "elapsedMs": elapsed_ms,
            "error": None
        })
    except Exception as e:
        sys.stdout = real_stdout
        elapsed_ms = round((time.perf_counter() - start_t) * 1000, 2)
        results.append({
            "id": tc_id,
            "input": "Hidden Test Case" if is_hidden else raw_input,
            "expected": "Hidden" if is_hidden else expected,
            "actual": None,
            "passed": False,
            "elapsedMs": elapsed_ms,
            "error": f"{type(e).__name__}: {str(e)}"
        })

all_passed = (passed_count == len(test_cases))
score = round((passed_count / len(test_cases)) * 100) if test_cases else 0

out = {
    "status": "PASSED" if all_passed else "FAILED",
    "allPassed": all_passed,
    "passedCount": passed_count,
    "totalCount": len(test_cases),
    "score": score,
    "logs": user_stdout.getvalue(),
    "results": results
}
print(SENTINEL_START)
print(json.dumps(out))
print(SENTINEL_END)
`;

    try {
      fs.writeFileSync(scriptPath, testHarness, 'utf-8');
    } catch (err) {
      return resolve({
        success: false,
        status: 'FS_ERROR',
        error: `Could not create execution file: ${err.message}`,
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    }

    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const child = spawn('python', [scriptPath], {
      windowsHide: true,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }
    });

    const timer = setTimeout(() => {
      isTimedOut = true;
      child.kill('SIGKILL');
    }, EXECUTION_TIMEOUT_MS);

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('close', (exitCode) => {
      clearTimeout(timer);
      try { fs.unlinkSync(scriptPath); } catch (e) {}
      try { fs.unlinkSync(payloadPath); } catch (e) {}

      if (isTimedOut) {
        return resolve({
          success: false,
          status: 'TIMEOUT_ERROR',
          error: `Execution timed out (> ${EXECUTION_TIMEOUT_MS}ms). Infinite loop or heavy blocking call detected.`,
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: testCases.map(tc => ({
            id: tc.id,
            input: tc.isHidden ? 'Hidden Test Case' : tc.input,
            expected: tc.isHidden ? 'Hidden' : tc.expected,
            actual: 'TIMEOUT',
            passed: false,
            elapsedMs: EXECUTION_TIMEOUT_MS,
            error: 'Time Limit Exceeded (3500ms limit)'
          }))
        });
      }

      if (exitCode !== 0 && stderr && !stdout.includes(SENTINEL_START)) {
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
            input: tc.isHidden ? 'Hidden Test Case' : tc.input,
            expected: tc.isHidden ? 'Hidden' : tc.expected,
            actual: 'ERROR',
            passed: false,
            elapsedMs: 0,
            error: stderr.trim().split('\n').pop() || 'Syntax Error'
          }))
        });
      }

      const { logs, payload } = parseSentinelOutput(stdout, stderr, testCases.length);

      if (payload) {
        return resolve({
          success: true,
          ...payload,
          logs: payload.logs || logs
        });
      }

      return resolve({
        success: false,
        status: 'EXECUTION_ERROR',
        error: stderr || stdout || 'Execution produced no valid result',
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      try { fs.unlinkSync(scriptPath); } catch (e) {}
      try { fs.unlinkSync(payloadPath); } catch (e) {}
      resolve({
        success: false,
        status: 'SPAWN_ERROR',
        error: `Could not launch Python: ${err.message}`,
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    });
  });
}

/**
 * Execute JavaScript / Node.js in isolated child process with timeout
 */
function executeJavaScript(userCode, entrypoint, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const fileName = `skillproof_js_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.cjs`;
    const filePath = path.join(tempDir, fileName);

    const testCasesJson = JSON.stringify(testCases);

    const testHarness = `
const fs = require('fs');
const testCases = ${testCasesJson};
const SENTINEL_START = '${SENTINEL_START}';
const SENTINEL_END = '${SENTINEL_END}';

const userLogs = [];
const originalLog = console.log;
console.log = (...args) => {
  userLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
};

try {
  // --- BEGIN CANDIDATE CODE ---
${userCode}
  // --- END CANDIDATE CODE ---

  console.log = originalLog;

  let targetFn = null;
  try {
    if (typeof ${entrypoint} === 'function') {
      targetFn = ${entrypoint};
    }
  } catch(e) {}

  if (!targetFn) {
    const candidateFuncs = Object.entries(global).filter(([k, v]) => typeof v === 'function' && !['setTimeout', 'setInterval', 'clearTimeout', 'setImmediate'].includes(k));
    if (candidateFuncs.length > 0) {
      targetFn = candidateFuncs[candidateFuncs.length - 1][1];
    }
  }

  if (!targetFn) {
    const out = {
      status: "FUNCTION_NOT_FOUND",
      error: "Function '${entrypoint}' is not defined. Please implement '${entrypoint}' with proper export or signature.",
      allPassed: false,
      passedCount: 0,
      totalCount: testCases.length,
      score: 0,
      logs: userLogs.join('\\n'),
      results: []
    };
    originalLog(SENTINEL_START);
    originalLog(JSON.stringify(out));
    originalLog(SENTINEL_END);
    process.exit(0);
  }

  const results = [];
  let passedCount = 0;

  function deepEquals(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
      return Math.abs(a - b) < 1e-4;
    }
    return JSON.stringify(a) === JSON.stringify(b);
  }

  for (const tc of testCases) {
    const isHidden = !!tc.isHidden;
    const input = tc.input;
    const expected = tc.expected;
    const startT = process.hrtime.bigint();

    try {
      const actual = Array.isArray(input) ? targetFn(...input) : targetFn(input);
      const elapsedMs = Number(process.hrtime.bigint() - startT) / 1000000;

      const passed = deepEquals(actual, expected);
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
  const out = {
    status: allPassed ? "PASSED" : "FAILED",
    allPassed,
    passedCount,
    totalCount: testCases.length,
    score: testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0,
    logs: userLogs.join('\\n'),
    results
  };

  originalLog(SENTINEL_START);
  originalLog(JSON.stringify(out));
  originalLog(SENTINEL_END);
} catch (outerErr) {
  console.log = originalLog;
  const out = {
    status: "SYNTAX_ERROR",
    error: outerErr.stack || outerErr.message,
    allPassed: false,
    passedCount: 0,
    totalCount: testCases.length,
    score: 0,
    logs: userLogs.join('\\n'),
    results: []
  };
  originalLog(SENTINEL_START);
  originalLog(JSON.stringify(out));
  originalLog(SENTINEL_END);
  process.exit(0);
}
`;

    try {
      fs.writeFileSync(filePath, testHarness, 'utf-8');
    } catch (err) {
      return resolve({
        success: false,
        status: 'FS_ERROR',
        error: `Could not write execution file: ${err.message}`,
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    }

    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const child = spawn('node', [filePath], {
      windowsHide: true,
      env: process.env
    });

    const timer = setTimeout(() => {
      isTimedOut = true;
      child.kill('SIGKILL');
    }, EXECUTION_TIMEOUT_MS);

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('close', (exitCode) => {
      clearTimeout(timer);
      try { fs.unlinkSync(filePath); } catch (e) {}

      if (isTimedOut) {
        return resolve({
          success: false,
          status: 'TIMEOUT_ERROR',
          error: `Execution timed out (> ${EXECUTION_TIMEOUT_MS}ms). Infinite loop or heavy blocking call detected.`,
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: testCases.map(tc => ({
            id: tc.id,
            input: tc.isHidden ? 'Hidden Test Case' : tc.input,
            expected: tc.isHidden ? 'Hidden' : tc.expected,
            actual: 'TIMEOUT',
            passed: false,
            elapsedMs: EXECUTION_TIMEOUT_MS,
            error: 'Time Limit Exceeded (3500ms)'
          }))
        });
      }

      const { logs, payload } = parseSentinelOutput(stdout, stderr, testCases.length);

      if (payload) {
        return resolve({
          success: true,
          ...payload,
          logs: payload.logs || logs
        });
      }

      return resolve({
        success: false,
        status: 'COMPILATION_ERROR',
        error: stderr || stdout || 'Compilation error in JavaScript file',
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      try { fs.unlinkSync(filePath); } catch (e) {}
      resolve({
        success: false,
        status: 'SPAWN_ERROR',
        error: `Could not launch Node interpreter: ${err.message}`,
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    });
  });
}

/**
 * Execute SQL query via Python's built-in sqlite3 in-memory engine
 */
function executeSQL(userCode, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const baseId = `sql_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const payloadPath = path.join(tempDir, `${baseId}_payload.json`);
    const scriptPath = path.join(tempDir, `${baseId}_run.py`);

    fs.writeFileSync(payloadPath, JSON.stringify({ userCode, testCases }), 'utf-8');

    const testHarness = `
import sys
import json
import time
import sqlite3

SENTINEL_START = '${SENTINEL_START}'
SENTINEL_END = '${SENTINEL_END}'

with open(r'''${payloadPath}''', 'r', encoding='utf-8') as f:
    config = json.load(f)

sql_query = config.get('userCode', '')
test_cases = config.get('testCases', [])

results = []
passed_count = 0

for tc in test_cases:
    tc_id = tc.get('id', 1)
    is_hidden = tc.get('isHidden', False)
    expected = tc.get('expected', [])
    schema = tc.get('schema', '''
        CREATE TABLE users (id INT PRIMARY KEY, name TEXT, cohort TEXT, score INT, created_at TEXT);
        INSERT INTO users VALUES (1, 'Alice', '2026-Q1', 85, '2026-01-10');
        INSERT INTO users VALUES (2, 'Bob', '2026-Q1', 92, '2026-01-12');
        INSERT INTO users VALUES (3, 'Charlie', '2026-Q2', 78, '2026-04-05');
        INSERT INTO users VALUES (4, 'David', '2026-Q2', 88, '2026-04-08');
        INSERT INTO users VALUES (5, 'Eve', '2026-Q1', 95, '2026-01-15');
    ''')

    start_t = time.perf_counter()
    try:
        conn = sqlite3.connect(':memory:')
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.executescript(schema)

        cur.execute(sql_query)
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()

        elapsed_ms = round((time.perf_counter() - start_t) * 1000, 2)
        passed = (rows == expected or json.dumps(rows, sort_keys=True) == json.dumps(expected, sort_keys=True))
        if passed:
            passed_count += 1

        results.append({
            "id": tc_id,
            "input": "Database Schema & Query Execution" if not is_hidden else "Hidden Test Case",
            "expected": "Hidden" if is_hidden else expected,
            "actual": "Hidden" if (is_hidden and not passed) else rows,
            "passed": passed,
            "elapsedMs": elapsed_ms,
            "error": None
        })
    except Exception as e:
        elapsed_ms = round((time.perf_counter() - start_t) * 1000, 2)
        results.append({
            "id": tc_id,
            "input": "Database Schema & Query Execution" if not is_hidden else "Hidden Test Case",
            "expected": "Hidden" if is_hidden else expected,
            "actual": None,
            "passed": False,
            "elapsedMs": elapsed_ms,
            "error": f"{type(e).__name__}: {str(e)}"
        })

all_passed = (passed_count == len(test_cases))
score = round((passed_count / len(test_cases)) * 100) if test_cases else 0

out = {
    "status": "PASSED" if all_passed else "FAILED",
    "allPassed": all_passed,
    "passedCount": passed_count,
    "totalCount": len(test_cases),
    "score": score,
    "results": results
}
print(SENTINEL_START)
print(json.dumps(out))
print(SENTINEL_END)
`;

    try {
      fs.writeFileSync(scriptPath, testHarness, 'utf-8');
    } catch (err) {
      return resolve({
        success: false,
        status: 'FS_ERROR',
        error: `Could not create SQL execution harness: ${err.message}`,
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    }

    let stdout = '';
    let stderr = '';

    const child = spawn('python', [scriptPath], {
      windowsHide: true,
      env: process.env
    });

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('close', () => {
      try { fs.unlinkSync(scriptPath); } catch (e) {}
      try { fs.unlinkSync(payloadPath); } catch (e) {}
      const { logs, payload } = parseSentinelOutput(stdout, stderr, testCases.length);
      if (payload) {
        return resolve({ success: true, ...payload });
      }
      return resolve({
        success: false,
        status: 'COMPILATION_ERROR',
        error: stderr || stdout || 'SQL execution failed',
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    });
  });
}

/**
 * Execute C source code using gcc
 */
function executeC(userCode, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const baseName = `skillproof_c_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const srcPath = path.join(tempDir, `${baseName}.c`);
    const exePath = path.join(tempDir, `${baseName}.exe`);

    fs.writeFileSync(srcPath, userCode, 'utf-8');

    const compiler = spawn('gcc', ['-O2', srcPath, '-o', exePath], { windowsHide: true });
    let compileStderr = '';
    compiler.stderr.on('data', (d) => { compileStderr += d.toString(); });

    compiler.on('close', (code) => {
      try { fs.unlinkSync(srcPath); } catch (e) {}

      if (code !== 0) {
        return resolve({
          success: false,
          status: 'COMPILATION_ERROR',
          error: compileStderr.trim() || 'C Compilation failed',
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: testCases.map(tc => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expected,
            actual: 'COMPILATION_ERROR',
            passed: false,
            elapsedMs: 0,
            error: compileStderr.trim()
          }))
        });
      }

      runExecutable(exePath, testCases).then((res) => {
        try { fs.unlinkSync(exePath); } catch (e) {}
        resolve(res);
      });
    });

    compiler.on('error', (err) => {
      resolve({
        success: false,
        status: 'SPAWN_ERROR',
        error: `GCC compiler not available: ${err.message}`,
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    });
  });
}

/**
 * Execute C++ source code using g++
 */
function executeCpp(userCode, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const baseName = `skillproof_cpp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const srcPath = path.join(tempDir, `${baseName}.cpp`);
    const exePath = path.join(tempDir, `${baseName}.exe`);

    fs.writeFileSync(srcPath, userCode, 'utf-8');

    const compiler = spawn('g++', ['-O2', srcPath, '-o', exePath], { windowsHide: true });
    let compileStderr = '';
    compiler.stderr.on('data', (d) => { compileStderr += d.toString(); });

    compiler.on('close', (code) => {
      try { fs.unlinkSync(srcPath); } catch (e) {}

      if (code !== 0) {
        return resolve({
          success: false,
          status: 'COMPILATION_ERROR',
          error: compileStderr.trim() || 'C++ Compilation failed',
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: testCases.map(tc => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expected,
            actual: 'COMPILATION_ERROR',
            passed: false,
            elapsedMs: 0,
            error: compileStderr.trim()
          }))
        });
      }

      runExecutable(exePath, testCases).then((res) => {
        try { fs.unlinkSync(exePath); } catch (e) {}
        resolve(res);
      });
    });

    compiler.on('error', (err) => {
      resolve({
        success: false,
        status: 'SPAWN_ERROR',
        error: `G++ compiler not available: ${err.message}`,
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    });
  });
}

/**
 * Helper to run compiled binary against test cases
 */
async function runExecutable(exePath, testCases) {
  const results = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const isHidden = !!tc.isHidden;
    const inputStr = Array.isArray(tc.input) ? tc.input.join(' ') : String(tc.input);

    const report = await new Promise((res) => {
      const child = spawn(exePath, [], { windowsHide: true });
      let out = '';
      let err = '';
      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, EXECUTION_TIMEOUT_MS);

      if (inputStr) {
        child.stdin.write(inputStr + '\n');
        child.stdin.end();
      }

      child.stdout.on('data', (d) => { out += d.toString(); });
      child.stderr.on('data', (d) => { err += d.toString(); });

      child.on('close', () => {
        clearTimeout(timer);
        if (timedOut) {
          return res({ actual: 'TIMEOUT', passed: false, error: 'Time Limit Exceeded' });
        }
        const cleanActual = out.trim();
        const cleanExpected = String(tc.expected).trim();
        const passed = cleanActual === cleanExpected;
        res({ actual: cleanActual, passed, error: err.trim() || null });
      });
    });

    if (report.passed) passedCount++;
    results.push({
      id: tc.id,
      input: isHidden ? 'Hidden Test Case' : tc.input,
      expected: isHidden ? 'Hidden' : tc.expected,
      actual: isHidden && !report.passed ? 'Hidden' : report.actual,
      passed: report.passed,
      elapsedMs: 0.1,
      error: report.error
    });
  }

  const allPassed = passedCount === testCases.length;
  return {
    success: true,
    status: allPassed ? 'PASSED' : 'FAILED',
    allPassed,
    passedCount,
    totalCount: testCases.length,
    score: testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0,
    results
  };
}
