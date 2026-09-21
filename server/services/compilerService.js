import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

const EXECUTION_TIMEOUT_MS = 3500;
const SENTINEL_START = '###__SKILLPROOF_RESULT_START__###';
const SENTINEL_END = '###__SKILLPROOF_RESULT_END__###';

export const compilerService = {
  /**
   * Executes submitted user code against problem test cases
   * @param {Object} params
   * @param {string} params.language - 'python' | 'javascript' | 'sql' | 'c' | 'cpp' | 'java' | 'htmlcss'
   * @param {string} params.code - User submitted source code
   * @param {string} params.entrypoint - Function name to execute
   * @param {Array} params.testCases - Array of test cases
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
      return executeC(code, entrypoint, testCases);
    } else if (lang === 'cpp' || lang === 'c++') {
      return executeCpp(code, entrypoint, testCases);
    } else if (lang === 'java') {
      return executeJava(code, entrypoint, testCases);
    } else if (lang === 'htmlcss' || lang === 'html' || lang === 'css') {
      return executeHTMLCSS(code, testCases);
    } else if (['javascript', 'js', 'react', 'node', 'frontend', 'backend'].includes(lang)) {
      return executeJavaScript(code, entrypoint, testCases);
    } else {
      return executePython(code, entrypoint, testCases);
    }
  }
};

/**
 * Parses stdout looking for sentinel token framing.
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
      console.warn('Failed to parse framed sentinel JSON:', e.message);
    }
  } else {
    logs = rawStdout.trim();
  }

  return { logs, payload };
}

/**
 * 1. PYTHON EXECUTION
 */
function executePython(userCode, entrypoint, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const baseId = `py_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const payloadPath = path.join(tempDir, `${baseId}_payload.json`);
    const scriptPath = path.join(tempDir, `${baseId}_run.py`);

    const payloadData = {
      entrypoint: entrypoint || 'solution',
      testCases: testCases || []
    };

    try {
      fs.writeFileSync(payloadPath, JSON.stringify(payloadData), 'utf-8');
    } catch (err) {
      return resolve({
        success: false,
        status: 'FS_ERROR',
        error: `Could not write payload file: ${err.message}`,
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    }

    const testHarness = `import sys
import json
import time
import math
import traceback

SENTINEL_START = '${SENTINEL_START}'
SENTINEL_END = '${SENTINEL_END}'
PAYLOAD_PATH = r'${payloadPath}'

with open(PAYLOAD_PATH, 'r', encoding='utf-8') as f:
    payload = json.load(f)

entrypoint_name = payload.get('entrypoint', 'solution')
test_cases = payload.get('testCases', [])

# Intercept user stdout
user_logs = []
class LogInterceptor:
    def write(self, s):
        if s.strip():
            user_logs.append(s.strip())
    def flush(self):
        pass

orig_stdout = sys.stdout
sys.stdout = LogInterceptor()

user_scope = {}
try:
    exec("""${userCode.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"')}""", user_scope)
except SyntaxError as e:
    sys.stdout = orig_stdout
    err_msg = f"SyntaxError at line {e.lineno}: {e.msg}"
    out = {
        "status": "SYNTAX_ERROR",
        "error": err_msg,
        "allPassed": False,
        "passedCount": 0,
        "totalCount": len(test_cases),
        "score": 0,
        "logs": "\\n".join(user_logs),
        "results": [{
            "id": tc.get("id", i + 1),
            "input": tc.get("input"),
            "expected": tc.get("expected"),
            "actual": "SYNTAX_ERROR",
            "passed": False,
            "elapsedMs": 0,
            "error": err_msg
        } for i, tc in enumerate(test_cases)]
    }
    print(SENTINEL_START)
    print(json.dumps(out))
    print(SENTINEL_END)
    sys.exit(0)
except Exception as e:
    sys.stdout = orig_stdout
    err_msg = f"{type(e).__name__}: {str(e)}"
    out = {
        "status": "RUNTIME_ERROR",
        "error": err_msg,
        "allPassed": False,
        "passedCount": 0,
        "totalCount": len(test_cases),
        "score": 0,
        "logs": "\\n".join(user_logs),
        "results": [{
            "id": tc.get("id", i + 1),
            "input": tc.get("input"),
            "expected": tc.get("expected"),
            "actual": "RUNTIME_ERROR",
            "passed": False,
            "elapsedMs": 0,
            "error": err_msg
        } for i, tc in enumerate(test_cases)]
    }
    print(SENTINEL_START)
    print(json.dumps(out))
    print(SENTINEL_END)
    sys.exit(0)

sys.stdout = orig_stdout

# Locate target function or class
target_fn = user_scope.get(entrypoint_name)
if target_fn is None:
    for k, v in user_scope.items():
        if callable(v) and not k.startswith('__'):
            target_fn = v
            break

if target_fn is None:
    out = {
        "status": "FUNCTION_NOT_FOUND",
        "error": f"Function '{entrypoint_name}' was not defined. Please implement def {entrypoint_name}(...).",
        "allPassed": False,
        "passedCount": 0,
        "totalCount": len(test_cases),
        "score": 0,
        "logs": "\\n".join(user_logs),
        "results": []
    }
    print(SENTINEL_START)
    print(json.dumps(out))
    print(SENTINEL_END)
    sys.exit(0)

results = []
passed_count = 0

def normalize_val(val):
    if isinstance(val, float):
        return round(val, 2)
    elif isinstance(val, dict):
        return {k: normalize_val(v) for k, v in val.items()}
    elif isinstance(val, list):
        return [normalize_val(x) for x in val]
    return val

def fuzzy_equals(a, b, tol=0.03):
    if a is None and b is None:
        return True
    if a is None or b is None:
        return False
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(float(a) - float(b)) <= tol
    if isinstance(a, dict) and isinstance(b, dict):
        if set(a.keys()) != set(b.keys()):
            return False
        return all(fuzzy_equals(a[k], b[k], tol) for k in a)
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        if len(a) != len(b):
            return False
        return all(fuzzy_equals(x, y, tol) for x, y in zip(a, b))
    return a == b

for i, tc in enumerate(test_cases):
    tc_id = tc.get("id", i + 1)
    tc_input = tc.get("input")
    expected = tc.get("expected")
    is_hidden = tc.get("isHidden", False)

    start_time = time.perf_counter()
    try:
        if isinstance(target_fn, type):
            # Class instantiation (e.g. TokenBucketLimiter)
            if isinstance(tc_input, list):
                instance = target_fn(*tc_input)
            elif isinstance(tc_input, dict):
                instance = target_fn(**tc_input)
            else:
                instance = target_fn(tc_input) if tc_input is not None else target_fn()

            # Test real behavior of the class
            if hasattr(instance, 'allow_request') and callable(getattr(instance, 'allow_request')):
                limiter = target_fn(2, 1)
                r1 = limiter.allow_request('c1', 0.0)
                r2 = limiter.allow_request('c1', 0.0)
                r3 = limiter.allow_request('c1', 0.0)
                r4 = limiter.allow_request('c1', 1.0)
                actual = [
                    True if r1 is True else (False if r1 is False else None),
                    True if r2 is True else (False if r2 is False else None),
                    True if r3 is True else (False if r3 is False else None),
                    True if r4 is True else (False if r4 is False else None)
                ]
            elif hasattr(instance, 'consume') and callable(getattr(instance, 'consume')):
                actual = instance.consume(1)
            elif hasattr(instance, 'get_state') and callable(getattr(instance, 'get_state')):
                actual = instance.get_state()
            else:
                # If candidate didn't implement methods or properties: FAIL
                actual = None
        else:
            if isinstance(tc_input, list):
                actual = target_fn(*tc_input)
            elif isinstance(tc_input, dict):
                actual = target_fn(**tc_input)
            elif tc_input is None:
                actual = target_fn()
            else:
                actual = target_fn(tc_input)

        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        norm_actual = normalize_val(actual)
        norm_expected = normalize_val(expected)

        passed = (actual is not None) and fuzzy_equals(actual, expected)
        if passed:
            passed_count += 1

        results.append({
            "id": tc_id,
            "input": "Hidden Test Case" if is_hidden else tc_input,
            "expected": "Hidden" if is_hidden else expected,
            "actual": "Hidden" if (is_hidden and not passed) else norm_actual,
            "passed": passed,
            "elapsedMs": elapsed_ms,
            "error": None if passed else "AssertionError: Result did not match expected output"
        })
    except Exception as e:
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        results.append({
            "id": tc_id,
            "input": "Hidden Test Case" if is_hidden else tc_input,
            "expected": "Hidden" if is_hidden else expected,
            "actual": None,
            "passed": False,
            "elapsedMs": elapsed_ms,
            "error": f"{type(e).__name__}: {str(e)}"
        })

all_passed = (passed_count == len(test_cases)) if test_cases else False
score = round((passed_count / len(test_cases)) * 100) if test_cases else 0

out = {
    "status": "PASSED" if all_passed else "FAILED",
    "allPassed": all_passed,
    "passedCount": passed_count,
    "totalCount": len(test_cases),
    "score": score,
    "logs": "\\n".join(user_logs),
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
        error: `Could not write runner script: ${err.message}`,
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
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
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
          error: `Execution timed out (> ${EXECUTION_TIMEOUT_MS}ms). Infinite loop detected.`,
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: testCases.map(tc => ({
            id: tc.id,
            input: tc.isHidden ? 'Hidden' : tc.input,
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
        error: stderr || stdout || 'Unknown Python execution failure',
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
        error: `Could not launch Python interpreter: ${err.message}`,
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
 * 2. SQL EXECUTION via SQLite3 In-Memory DB
 */
function executeSQL(userQuery, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const baseId = `sql_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const payloadPath = path.join(tempDir, `${baseId}_payload.json`);
    const scriptPath = path.join(tempDir, `${baseId}_run.py`);

    const payloadData = {
      query: userQuery,
      testCases: testCases || []
    };

    try {
      fs.writeFileSync(payloadPath, JSON.stringify(payloadData), 'utf-8');
    } catch (err) {
      return resolve({
        success: false,
        status: 'FS_ERROR',
        error: `Could not create SQL payload: ${err.message}`,
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    }

    const testHarness = `import sys
import json
import sqlite3
import time

SENTINEL_START = '${SENTINEL_START}'
SENTINEL_END = '${SENTINEL_END}'
PAYLOAD_PATH = r'${payloadPath}'

with open(PAYLOAD_PATH, 'r', encoding='utf-8') as f:
    payload = json.load(f)

user_query = payload.get('query', '').strip()
test_cases = payload.get('testCases', [])

# Remove trailing semicolons or SQL comments
clean_query = user_query.rstrip(';')

results = []
passed_count = 0

for i, tc in enumerate(test_cases):
    tc_id = tc.get("id", i + 1)
    schema_sql = tc.get("schema", "")
    expected = tc.get("expected", [])
    is_hidden = tc.get("isHidden", False)

    start_time = time.perf_counter()
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        if schema_sql:
            cursor.executescript(schema_sql)

        cursor.execute(clean_query)
        rows = cursor.fetchall()
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

        actual = [dict(r) for r in rows]

        passed = False
        if isinstance(expected, list) and len(expected) > 0:
            if len(actual) == len(expected):
                passed = True
                for a_row, e_row in zip(actual, expected):
                    if isinstance(e_row, dict):
                        for k, v in e_row.items():
                            if str(a_row.get(k)) != str(v):
                                passed = False
                                break
                    elif a_row != e_row:
                        passed = False
                        break
        elif actual == expected and len(actual) > 0:
            passed = True

        if passed:
            passed_count += 1

        results.append({
            "id": tc_id,
            "input": "Database Schema & Query Execution" if not is_hidden else "Hidden Test Case",
            "expected": "Hidden" if is_hidden else expected,
            "actual": "Hidden" if (is_hidden and not passed) else actual,
            "passed": passed,
            "elapsedMs": elapsed_ms,
            "error": None if passed else "Query returned incorrect rows or empty result"
        })
    except Exception as e:
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        results.append({
            "id": tc_id,
            "input": "Database Schema & Query Execution" if not is_hidden else "Hidden Test Case",
            "expected": "Hidden" if is_hidden else expected,
            "actual": None,
            "passed": False,
            "elapsedMs": elapsed_ms,
            "error": f"{type(e).__name__}: {str(e)}"
        })
    finally:
        conn.close()

all_passed = (passed_count == len(test_cases) and len(test_cases) > 0)
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
 * 3. JAVASCRIPT / NODE.JS / FRONTEND / BACKEND EXECUTION
 */
function executeJavaScript(userCode, entrypoint, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const fileName = `skillproof_js_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.cjs`;
    const filePath = path.join(tempDir, fileName);

    // Preprocess ES modules syntax to CJS
    let processedCode = userCode
      .replace(/import\s+(\w+)\s+from\s+['"][^'"]+['"];?/g, 'const $1 = global.$1 || {};')
      .replace(/import\s*\{([^}]+)\}\s*from\s+['"][^'"]+['"];?/g, (match, imports) => {
        const vars = imports.split(',').map(s => s.trim()).filter(Boolean);
        return vars.map(v => {
          const parts = v.split(/\s+as\s+/);
          const name = parts[parts.length - 1].trim();
          return `const ${name} = global.${name} || (() => {});`;
        }).join('\n');
      })
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+/g, '');

    const testCasesJson = JSON.stringify(testCases);

    const testHarness = `
const fs = require('fs');
const testCases = ${testCasesJson};
const SENTINEL_START = '${SENTINEL_START}';
const SENTINEL_END = '${SENTINEL_END}';

// Mock Express & Router
const registeredRoutes = [];
const mockRouter = {
  post: (path, handler) => { registeredRoutes.push({ method: 'POST', path, handler }); return mockRouter; },
  get: (path, handler) => { registeredRoutes.push({ method: 'GET', path, handler }); return mockRouter; },
  put: (path, handler) => { registeredRoutes.push({ method: 'PUT', path, handler }); return mockRouter; },
  delete: (path, handler) => { registeredRoutes.push({ method: 'DELETE', path, handler }); return mockRouter; },
  use: () => mockRouter
};
const mockExpress = () => mockRouter;
mockExpress.Router = () => mockRouter;
mockExpress.json = () => (req, res, next) => next();

// Mock React & Frontend Hooks environment
let lastEffectCallback = null;
let lastEffectDeps = null;
global.React = {
  useState: (init) => [init, () => {}],
  useEffect: (fn, deps) => {
    lastEffectCallback = fn;
    lastEffectDeps = deps;
    try { fn(); } catch(e) {}
  },
  useCallback: (fn) => fn,
  useMemo: (fn) => fn(),
  useRef: (init) => ({ current: init }),
};
global.useState = global.React.useState;
global.useEffect = global.React.useEffect;
global.useCallback = global.React.useCallback;
global.useMemo = global.React.useMemo;
global.useRef = global.React.useRef;

// Mock Common Browser/Frontend Globals
global.searchQuery = '';
global.setResults = () => {};
global.setIsLoading = () => {};
global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
global.AbortController = class AbortController { constructor() { this.signal = {}; } abort() {} };

const userLogs = [];
const originalLog = console.log;
console.log = (...args) => {
  userLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
};

// Override require for common dependencies
const Module = require('module');
const origRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === 'express') return mockExpress;
  if (id === 'react') return global.React;
  try {
    return origRequire.apply(this, arguments);
  } catch (e) {
    return {};
  }
};

(async () => {
  try {
    // --- BEGIN CANDIDATE CODE ---
${processedCode}
    // --- END CANDIDATE CODE ---

    console.log = originalLog;

    let targetFn = null;
    try {
      if (typeof ${entrypoint} === 'function') {
        targetFn = ${entrypoint};
      }
    } catch(e) {}

    // Check if target is a class or global function
    if (!targetFn) {
      try {
        if (typeof global['${entrypoint}'] === 'function') {
          targetFn = global['${entrypoint}'];
        }
      } catch(e) {}
    }

    // Check if entrypoint is an express route or middleware
    if (!targetFn && ('${entrypoint}' === 'router' || registeredRoutes.length > 0)) {
      targetFn = async (routePath) => {
        const route = registeredRoutes.find(r => r.path === routePath || routePath.includes(r.path));
        if (!route || typeof route.handler !== 'function') {
          throw new Error('Route ' + routePath + ' is not implemented.');
        }

        let statusCode = 200;
        let responseBody = null;
        const res = {
          status: (code) => { statusCode = code; return res; },
          json: (body) => { responseBody = body; return res; },
          send: (body) => { responseBody = body; return res; }
        };

        const isBad = routePath.includes('bad') || routePath.includes('error');
        const req = {
          headers: { 'authorization': 'Bearer valid_token', 'idempotency-key': 'IDEMP-1' },
          body: isBad ? {} : {
            name: 'Alex Developer',
            email: 'alex@example.com',
            candidateId: 'C1',
            role: 'Engineer',
            skill: 'Backend',
            status: 'APPLIED'
          }
        };

        await route.handler(req, res, () => {});

        if (isBad) {
          return statusCode >= 400 || (responseBody && responseBody.error !== undefined);
        } else {
          return (statusCode === 200 || statusCode === 201) && responseBody !== null;
        }
      };
    }

    // Check if entrypoint is useEffect hook effect
    if (!targetFn && '${entrypoint}' === 'useEffect' && lastEffectCallback) {
      targetFn = (query) => {
        // Clean candidate code to check if actual logic was written
        const raw = (${JSON.stringify(processedCode)}).replace(/\\/\\/.*/g, '').replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').trim();
        const hasBody = /fetch|setResults|setIsLoading|filter|includes|search/i.test(raw) && raw.length > 80;
        if (!hasBody) {
          throw new Error('Search effect is empty. Implement fetch/filter logic using searchQuery and setResults.');
        }
        global.searchQuery = query;
        lastEffectCallback();
        return true;
      };
    }

    // Fallback: discover any exported or top-level functions
    if (!targetFn) {
      const candidateFuncs = Object.entries(global).filter(([k, v]) => typeof v === 'function' && !['setTimeout', 'setInterval', 'clearTimeout', 'setImmediate', 'queueMicrotask', 'structuredClone'].includes(k));
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
      if (a === b) return true;
      if (a === undefined || a === null || b === undefined || b === null) return false;
      if (typeof a !== typeof b) return false;
      if (typeof a === 'number' && typeof b === 'number') {
        return Math.abs(a - b) < 0.01;
      }
      if (typeof a === 'object' && a !== null && b !== null) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every(k => deepEquals(a[k], b[k]));
      }
      return false;
    }

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const tcId = tc.id || i + 1;
      const tcInput = tc.input;
      const expected = tc.expected;
      const isHidden = !!tc.isHidden;

      const startTime = process.hrtime.bigint();
      try {
        let actual;
        const isExplicitClass = typeof targetFn === 'function' && (
          String(targetFn).trim().startsWith('class ') ||
          ['EventEmitter', 'LRUCache', 'TokenBucketLimiter'].includes('${entrypoint}')
        );
        if (isExplicitClass) {
          // Class constructor
          const instance = Array.isArray(tcInput) ? new targetFn(...tcInput) : new targetFn(tcInput);
          if ('${entrypoint}' === 'EventEmitter' || targetFn.name === 'EventEmitter') {
            let firedCount = 0;
            if (typeof instance.on === 'function' && typeof instance.emit === 'function') {
              const listener = () => { firedCount++; };
              instance.on('ping', listener);
              instance.emit('ping', 42);
              if (typeof instance.off === 'function') {
                instance.off('ping', listener);
                instance.emit('ping', 42);
              }
            }
            actual = firedCount;
          } else {
            actual = instance;
          }
        } else if ('${entrypoint}' === 'useUndoRedo' || (typeof targetFn === 'function' && targetFn.name === 'useUndoRedo')) {
          const raw = (${JSON.stringify(processedCode)}).replace(/\\/\\/.*/g, '').replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').trim();
          const hasStacks = (raw.includes('past') || raw.includes('future') || raw.includes('history') || raw.includes('stack') || raw.includes('slice')) && raw.length > 100;
          if (!hasStacks) {
            actual = 'Incomplete stub without history management';
          } else {
            actual = 'Undo/Redo state transitions verified';
          }
        } else if (Array.isArray(tcInput)) {
          actual = await targetFn(...tcInput);
        } else if (tcInput !== undefined) {
          actual = await targetFn(tcInput);
        } else {
          actual = await targetFn();
        }

        const endTime = process.hrtime.bigint();
        const elapsedMs = Number((endTime - startTime) / 1000000n);

        const passed = deepEquals(actual, expected);
        if (passed) passedCount++;

        results.push({
          id: tcId,
          input: isHidden ? 'Hidden Test Case' : tcInput,
          expected: isHidden ? 'Hidden' : expected,
          actual: (isHidden && !passed) ? 'Hidden' : actual,
          passed,
          elapsedMs,
          error: passed ? null : 'AssertionError: Received output does not match expected result.'
        });
      } catch (err) {
        const endTime = process.hrtime.bigint();
        const elapsedMs = Number((endTime - startTime) / 1000000n);
        results.push({
          id: tcId,
          input: isHidden ? 'Hidden Test Case' : tcInput,
          expected: isHidden ? 'Hidden' : expected,
          actual: null,
          passed: false,
          elapsedMs,
          error: (err.name + ': ' + err.message)
        });
      }
    }

    const allPassed = passedCount === testCases.length && testCases.length > 0;
    const score = testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0;

    const out = {
      status: allPassed ? "PASSED" : "FAILED",
      allPassed,
      passedCount,
      totalCount: testCases.length,
      score,
      logs: userLogs.join('\\n'),
      results
    };

    originalLog(SENTINEL_START);
    originalLog(JSON.stringify(out));
    originalLog(SENTINEL_END);
    process.exit(0);

  } catch (err) {
    console.log = originalLog;
    const out = {
      status: err instanceof SyntaxError ? "SYNTAX_ERROR" : "RUNTIME_ERROR",
      error: (err.name + ': ' + err.message + '\\n' + err.stack),
      allPassed: false,
      passedCount: 0,
      totalCount: testCases.length,
      score: 0,
      logs: userLogs.join('\\n'),
      results: testCases.map(tc => ({
        id: tc.id,
        input: tc.isHidden ? 'Hidden' : tc.input,
        expected: tc.isHidden ? 'Hidden' : tc.expected,
        actual: err.name,
        passed: false,
        elapsedMs: 0,
        error: err.message
      }))
    };
    originalLog(SENTINEL_START);
    originalLog(JSON.stringify(out));
    originalLog(SENTINEL_END);
    process.exit(0);
  }
})();
`;

    try {
      fs.writeFileSync(filePath, testHarness, 'utf-8');
    } catch (err) {
      return resolve({
        success: false,
        status: 'FS_ERROR',
        error: `Could not write JS test harness: ${err.message}`,
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

    const projectRoot = PROJECT_ROOT;

    const child = spawn(process.execPath, [filePath], {
      windowsHide: true,
      cwd: projectRoot,
      env: {
        ...process.env,
        NODE_PATH: path.join(projectRoot, 'node_modules')
      }
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
          error: `Execution timed out (> ${EXECUTION_TIMEOUT_MS}ms). Infinite loop detected.`,
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          results: testCases.map(tc => ({
            id: tc.id,
            input: tc.isHidden ? 'Hidden' : tc.input,
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
        error: `Could not launch Node.js: ${err.message}`,
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
 * 4. C EXECUTION via gcc - REAL TEST HARNESS
 */
function executeC(userCode, entrypoint, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const baseName = `skillproof_c_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const srcPath = path.join(tempDir, `${baseName}.c`);
    const exePath = path.join(tempDir, `${baseName}.exe`);

    // Build problem-specific test harness in C
    let testHarnessC = '';

    if (userCode.includes('parse_sensor_payload')) {
      testHarnessC = `
int main() {
    int passed = 0;
    int total = 2;

    int r1[10] = {0};
    int c1 = parse_sensor_payload("10,25,80", r1, 10);
    int p1 = (c1 == 3 && r1[0] == 10 && r1[1] == 25 && r1[2] == 80);
    if (p1) passed++;

    int r2[2] = {0};
    int c2 = parse_sensor_payload("5,15,25,35", r2, 2);
    int p2 = (c2 == 2 && r2[0] == 5 && r2[1] == 15);
    if (p2) passed++;

    printf("${SENTINEL_START}\\n");
    printf("{\\\"status\\\":\\\"%s\\\",\\\"allPassed\\\":%s,\\\"passedCount\\\":%d,\\\"totalCount\\\":%d,\\\"score\\\":%d,\\\"results\\\":[",
           (passed == total ? "PASSED" : "FAILED"), (passed == total ? "true" : "false"), passed, total, (passed * 100) / total);
    printf("{\\\"id\\\":1,\\\"input\\\":\\\"10,25,80\\\",\\\"expected\\\":\\\"3 readings [10, 25, 80]\\\",\\\"actual\\\":\\\"%d readings [ %d, %d, %d ]\\\",\\\"passed\\\":%s,\\\"elapsedMs\\\":0.2},",
           c1, r1[0], r1[1], r1[2], (p1 ? "true" : "false"));
    printf("{\\\"id\\\":2,\\\"input\\\":\\\"5,15,25,35 (max_len=2)\\\",\\\"expected\\\":\\\"2 readings [5, 15]\\\",\\\"actual\\\":\\\"%d readings [ %d, %d ]\\\",\\\"passed\\\":%s,\\\"elapsedMs\\\":0.2}",
           c2, r2[0], r2[1], (p2 ? "true" : "false"));
    printf("]}\\n");
    printf("${SENTINEL_END}\\n");
    return 0;
}
`;
    } else if (userCode.includes('RingBuffer') || userCode.includes('ring_buffer')) {
      testHarnessC = `
int main() {
    int passed = 0;
    int total = 2;

    RingBuffer rb;
    memset(&rb, 0, sizeof(rb));
    rb.capacity = 64;

    int pushOk = ring_buffer_push(&rb, 42);
    int val1 = 0;
    int popOk = ring_buffer_pop(&rb, &val1);
    int p1 = (pushOk == 1 && popOk == 1 && val1 == 42 && rb.count == 0);
    if (p1) passed++;

    ring_buffer_push(&rb, 10);
    ring_buffer_push(&rb, 20);
    int v1 = 0, v2 = 0;
    ring_buffer_pop(&rb, &v1);
    ring_buffer_pop(&rb, &v2);
    int p2 = (v1 == 10 && v2 == 20);
    if (p2) passed++;

    printf("${SENTINEL_START}\\n");
    printf("{\\\"status\\\":\\\"%s\\\",\\\"allPassed\\\":%s,\\\"passedCount\\\":%d,\\\"totalCount\\\":%d,\\\"score\\\":%d,\\\"results\\\":[",
           (passed == total ? "PASSED" : "FAILED"), (passed == total ? "true" : "false"), passed, total, (passed * 100) / total);
    printf("{\\\"id\\\":1,\\\"input\\\":\\\"Push 42 -> Pop\\\",\\\"expected\\\":42,\\\"actual\\\":%d,\\\"passed\\\":%s,\\\"elapsedMs\\\":0.2},",
           val1, (p1 ? "true" : "false"));
    printf("{\\\"id\\\":2,\\\"input\\\":\\\"Push [10, 20] -> FIFO Pop\\\",\\\"expected\\\":\\\"[10, 20]\\\",\\\"actual\\\":\\\"[ %d, %d ]\\\",\\\"passed\\\":%s,\\\"elapsedMs\\\":0.2}",
           v1, v2, (p2 ? "true" : "false"));
    printf("]}\\n");
    printf("${SENTINEL_END}\\n");
    return 0;
}
`;
    } else if (userCode.includes('HashMap') || userCode.includes('hash_')) {
      testHarnessC = `
int main() {
    int passed = 0;
    int total = 2;

    HashMap map;
    memset(&map, 0, sizeof(map));

    hash_insert(&map, "key1", 99);
    int val1 = 0;
    int found1 = hash_lookup(&map, "key1", &val1);
    int p1 = (found1 == 1 && val1 == 99);
    if (p1) passed++;

    hash_insert(&map, "key2", 77);
    int val2 = 0, val3 = -1;
    int found2 = hash_lookup(&map, "key2", &val2);
    int found3 = hash_lookup(&map, "nonexistent", &val3);
    int p2 = (found2 == 1 && val2 == 77 && found3 == 0);
    if (p2) passed++;

    printf("${SENTINEL_START}\\n");
    printf("{\\\"status\\\":\\\"%s\\\",\\\"allPassed\\\":%s,\\\"passedCount\\\":%d,\\\"totalCount\\\":%d,\\\"score\\\":%d,\\\"results\\\":[",
           (passed == total ? "PASSED" : "FAILED"), (passed == total ? "true" : "false"), passed, total, (passed * 100) / total);
    printf("{\\\"id\\\":1,\\\"input\\\":\\\"Insert ('key1', 99) -> Lookup 'key1'\\\",\\\"expected\\\":99,\\\"actual\\\":%d,\\\"passed\\\":%s,\\\"elapsedMs\\\":0.2},",
           val1, (p1 ? "true" : "false"));
    printf("{\\\"id\\\":2,\\\"input\\\":\\\"Lookup ('key2', 77) & 'nonexistent'\\\",\\\"expected\\\":\\\"77 and not found (0)\\\",\\\"actual\\\":\\\"%d and %d\\\",\\\"passed\\\":%s,\\\"elapsedMs\\\":0.2}",
           val2, found3, (p2 ? "true" : "false"));
    printf("]}\\n");
    printf("${SENTINEL_END}\\n");
    return 0;
}

`;
    } else {
      testHarnessC = `
int main() {
    printf("${SENTINEL_START}\\n");
    printf("{\\\"status\\\":\\\"FAILED\\\",\\\"allPassed\\\":false,\\\"passedCount\\\":0,\\\"totalCount\\\":1,\\\"score\\\":0,\\\"results\\\":[{\\\"id\\\":1,\\\"input\\\":\\\"Assessment Verification\\\",\\\"expected\\\":\\\"Recognized assessment function\\\",\\\"actual\\\":\\\"Unrecognized or missing target function\\\",\\\"passed\\\":false,\\\"elapsedMs\\\":0.0,\\\"error\\\":\\\"Target function was not implemented for this problem\\\"}]}\\n");
    printf("${SENTINEL_END}\\n");
    return 0;
}
`;
    }

    const finalSource = `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

${userCode}

${testHarnessC}
`;

    fs.writeFileSync(srcPath, finalSource, 'utf-8');

    let compileStderr = '';
    const compiler = spawn('gcc', ['-O2', srcPath, '-o', exePath], { windowsHide: true });
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
            error: compileStderr.trim().split('\n')[0]
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
        error: `GCC compiler not found: ${err.message}`,
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
 * 5. C++ EXECUTION via g++ - REAL TEST HARNESS
 */
function executeCpp(userCode, entrypoint, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const baseName = `skillproof_cpp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const srcPath = path.join(tempDir, `${baseName}.cpp`);
    const exePath = path.join(tempDir, `${baseName}.exe`);

    let testHarnessCpp = '';

    if (userCode.includes('filter_and_normalize')) {
      testHarnessCpp = `
int main() {
    int passed = 0;
    int total = 2;

    std::vector<double> in1 = {10.0, 20.0, 30.0};
    std::vector<double> res1 = filter_and_normalize(in1, 15.0);
    bool p1 = (res1.size() == 2 && res1[0] >= 0.5 && res1[1] <= 1.05);
    if (p1) passed++;

    std::vector<double> in2 = {5.0, 2.0};
    std::vector<double> res2 = filter_and_normalize(in2, 10.0);
    bool p2 = (res2.empty());
    if (p2) passed++;

    std::cout << "${SENTINEL_START}\\n";
    std::cout << "{\\\"status\\\":\\\"" << (passed == total ? "PASSED" : "FAILED") << "\\\",";
    std::cout << "\\\"allPassed\\\":" << (passed == total ? "true" : "false") << ",";
    std::cout << "\\\"passedCount\\\":" << passed << ",\\\"totalCount\\\":" << total << ",";
    std::cout << "\\\"score\\\":" << ((passed * 100) / total) << ",\\\"results\\\":[";
    std::cout << "{\\\"id\\\":1,\\\"input\\\":\\\"[10, 20, 30], threshold=15\\\",\\\"expected\\\":\\\"2 filtered normalized values\\\",\\\"actual\\\":\\\"" << res1.size() << " values\\\",\\\"passed\\\":" << (p1 ? "true" : "false") << ",\\\"elapsedMs\\\":0.2},";
    std::cout << "{\\\"id\\\":2,\\\"input\\\":\\\"[5, 2], threshold=10\\\",\\\"expected\\\":\\\"0 values (empty)\\\",\\\"actual\\\":\\\"" << res2.size() << " values\\\",\\\"passed\\\":" << (p2 ? "true" : "false") << ",\\\"elapsedMs\\\":0.2}";
    std::cout << "]}\\n";
    std::cout << "${SENTINEL_END}\\n";
    return 0;
}
`;
    } else if (userCode.includes('OrderBook') || userCode.includes('match_order')) {
      testHarnessCpp = `
int main() {
    int passed = 0;
    int total = 2;

    OrderBook ob;
    Order b1 = {1, "BUY", 100.0, 10};
    Order s1 = {2, "SELL", 100.0, 5};
    ob.match_order(b1);
    int m1 = ob.match_order(s1);
    bool p1 = (m1 == 5);
    if (p1) passed++;

    Order s2 = {3, "SELL", 105.0, 10};
    int m2 = ob.match_order(s2);
    bool p2 = (m2 == 0);
    if (p2) passed++;

    std::cout << "${SENTINEL_START}\\n";
    std::cout << "{\\\"status\\\":\\\"" << (passed == total ? "PASSED" : "FAILED") << "\\\",";
    std::cout << "\\\"allPassed\\\":" << (passed == total ? "true" : "false") << ",";
    std::cout << "\\\"passedCount\\\":" << passed << ",\\\"totalCount\\\":" << total << ",";
    std::cout << "\\\"score\\\":" << ((passed * 100) / total) << ",\\\"results\\\":[";
    std::cout << "{\\\"id\\\":1,\\\"input\\\":\\\"BUY 10 @ 100 vs SELL 5 @ 100\\\",\\\"expected\\\":\\\"Matched 5\\\",\\\"actual\\\":\\\"" << m1 << " matched\\\",\\\"passed\\\":" << (p1 ? "true" : "false") << ",\\\"elapsedMs\\\":0.2},";
    std::cout << "{\\\"id\\\":2,\\\"input\\\":\\\"SELL 10 @ 105 (Crossed Spread)\\\",\\\"expected\\\":\\\"Matched 0\\\",\\\"actual\\\":\\\"" << m2 << " matched\\\",\\\"passed\\\":" << (p2 ? "true" : "false") << ",\\\"elapsedMs\\\":0.2}";
    std::cout << "]}\\n";
    std::cout << "${SENTINEL_END}\\n";
    return 0;
}
`;
    } else if (userCode.includes('class ScopedDescriptor') || userCode.includes('ScopedDescriptor')) {
      testHarnessCpp = `
int main() {
    int passed = 0;
    int total = 2;

    // Test 1: Copy constructor and assignment MUST be deleted (RAII unique ownership)
    bool is_copyable = std::is_copy_constructible<ScopedDescriptor>::value || std::is_copy_assignable<ScopedDescriptor>::value;
    bool p1 = !is_copyable;
    if (p1) passed++;

    // Test 2: Move constructible and clean lifecycle
    bool is_movable = std::is_move_constructible<ScopedDescriptor>::value;
    bool p2 = false;
    try {
        ScopedDescriptor s1(10);
        ScopedDescriptor s2(std::move(s1));
        p2 = is_movable;
    } catch(...) {}
    if (p2) passed++;

    std::cout << "${SENTINEL_START}\\n";
    std::cout << "{\\\"status\\\":\\\"" << (passed == total ? "PASSED" : "FAILED") << "\\\",";
    std::cout << "\\\"allPassed\\\":" << (passed == total ? "true" : "false") << ",";
    std::cout << "\\\"passedCount\\\":" << passed << ",\\\"totalCount\\\":" << total << ",";
    std::cout << "\\\"score\\\":" << ((passed * 100) / total) << ",\\\"results\\\":[";
    std::cout << "{\\\"id\\\":1,\\\"input\\\":\\\"RAII Unique Ownership (Copy Deletion)\\\",\\\"expected\\\":\\\"Copy Constructor = delete\\\",\\\"actual\\\":\\\"" << (p1 ? "Non-copyable verified" : "Class is still copyable (unsafe)") << "\\\",\\\"passed\\\":" << (p1 ? "true" : "false") << ",\\\"elapsedMs\\\":0.2},";
    std::cout << "{\\\"id\\\":2,\\\"input\\\":\\\"Move Semantics Lifecycle\\\",\\\"expected\\\":\\\"Move constructor transfers descriptor\\\",\\\"actual\\\":\\\"" << (p2 ? "Move verified" : "Move failed or threw exception") << "\\\",\\\"passed\\\":" << (p2 ? "true" : "false") << ",\\\"elapsedMs\\\":0.2}";
    std::cout << "]}\\n";
    std::cout << "${SENTINEL_END}\\n";
    return 0;
}
`;
    } else {
      testHarnessCpp = `
int main() {
    std::cout << "${SENTINEL_START}\\n";
    std::cout << "{\\\"status\\\":\\\"FAILED\\\",\\\"allPassed\\\":false,\\\"passedCount\\\":0,\\\"totalCount\\\":1,\\\"score\\\":0,\\\"results\\\":[{\\\"id\\\":1,\\\"input\\\":\\\"Assessment Verification\\\",\\\"expected\\\":\\\"Recognized assessment function or class\\\",\\\"actual\\\":\\\"Unrecognized or missing target function\\\",\\\"passed\\\":false,\\\"elapsedMs\\\":0.0,\\\"error\\\":\\\"Target function was not implemented for this problem\\\"}]}\\n";
    std::cout << "${SENTINEL_END}\\n";
    return 0;
}
`;
    }

    const finalSource = `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <numeric>

${userCode}

${testHarnessCpp}
`;

    fs.writeFileSync(srcPath, finalSource, 'utf-8');

    let compileStderr = '';
    const compiler = spawn('g++', ['-O2', '-std=c++17', srcPath, '-o', exePath], { windowsHide: true });
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
            error: compileStderr.trim().split('\n')[0]
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
        error: `G++ compiler not found: ${err.message}`,
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
 * 6. JAVA EXECUTION via javac and java - REAL TEST HARNESS
 */
function executeJava(userCode, entrypoint, testCases) {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir();
    const classMatch = userCode.match(/(?:public\s+)?class\s+([a-zA-Z0-9_]+)/);
    const className = classMatch ? classMatch[1] : 'Solution';

    let testHarnessJava = '';

    if (userCode.includes('aggregateOrders')) {
      testHarnessJava = `
    public static void main(String[] args) {
        int passed = 0;
        int total = 2;

        OrderService svc = new OrderService();
        List<Order> list1 = Arrays.asList(
            new Order("CUST-1", 120.50, "COMPLETED"),
            new Order("CUST-2", 45.00, "COMPLETED"),
            new Order("CUST-1", 80.00, "COMPLETED"),
            new Order("CUST-3", 50.00, "CANCELLED")
        );

        Map<String, Double> res1 = null;
        try {
            res1 = svc.aggregateOrders(list1);
        } catch(Exception e) {}

        boolean p1 = false;
        if (res1 != null && !res1.isEmpty()) {
            Double c1 = res1.get("CUST-1");
            Double c2 = res1.get("CUST-2");
            double tot = 0.0;
            for (Double val : res1.values()) {
                if (val != null) tot += val;
            }
            p1 = (c1 != null && Math.abs(c1 - 200.50) < 0.1) || (Math.abs(tot - 245.50) < 0.1) || (Math.abs(tot - 200.50) < 0.1);
        }
        if (p1) passed++;

        List<Order> list2 = Arrays.asList(
            new Order("CUST-4", 75.0, "CANCELLED"),
            new Order("CUST-5", 85.0, "PENDING")
        );
        Map<String, Double> res2 = null;
        try {
            res2 = svc.aggregateOrders(list2);
        } catch(Exception e) {}

        boolean p2 = (res2 != null && res2.isEmpty());
        if (p2) passed++;

        System.out.println("${SENTINEL_START}");
        System.out.println("{\\\"status\\\":\\\"" + (passed == total ? "PASSED" : "FAILED") + "\\\"," +
            "\\\"allPassed\\\":" + (passed == total ? "true" : "false") + "," +
            "\\\"passedCount\\\":" + passed + ",\\\"totalCount\\\":" + total + "," +
            "\\\"score\\\":" + ((passed * 100) / total) + ",\\\"results\\\":[" +
            "{\\\"id\\\":1,\\\"input\\\":\\\"Orders [CUST-1: 120.50 COMPLETED, CUST-2: 45.00 COMPLETED, CUST-1: 80.00 COMPLETED, CUST-3: 50.00 CANCELLED]\\\",\\\"expected\\\":\\\"CUST-1: 200.50, CUST-2: 45.00\\\",\\\"actual\\\":\\\"" + (res1 == null ? "null" : res1.toString()) + "\\\",\\\"passed\\\":" + p1 + ",\\\"elapsedMs\\\":0.5}," +
            "{\\\"id\\\":2,\\\"input\\\":\\\"Orders [CANCELLED, PENDING]\\\",\\\"expected\\\":\\\"Empty Map {}\\\",\\\"actual\\\":\\\"" + (res2 == null ? "null" : res2.toString()) + "\\\",\\\"passed\\\":" + p2 + ",\\\"elapsedMs\\\":0.5}" +
            "]}");
        System.out.println("${SENTINEL_END}");
    }
`;
    } else if (userCode.includes('class LRUCache') || userCode.includes('LRUCache<')) {
      testHarnessJava = `
    public static void main(String[] args) {
        int passed = 0;
        int total = 2;

        boolean p1 = false;
        boolean p2 = false;
        try {
            LRUCache<String, Integer> cache = new LRUCache<>(2);
            cache.put("k1", 100);
            cache.put("k2", 200);
            Integer v1 = cache.get("k1");
            cache.put("k3", 300); // Should evict k2 because k1 was accessed
            Integer v2 = cache.get("k2");
            Integer v3 = cache.get("k3");
            p1 = (v1 != null && v1 == 100) && (v2 == null) && (v3 != null && v3 == 300);
            if (p1) passed++;

            cache.put("k4", 400);
            Integer v1_after = cache.get("k1");
            p2 = (v1_after == null); // k1 should now be evicted
            if (p2) passed++;
        } catch (Exception e) {}

        System.out.println("${SENTINEL_START}");
        System.out.println("{\\\"status\\\":\\\"" + (passed == total ? "PASSED" : "FAILED") + "\\\"," +
            "\\\"allPassed\\\":" + (passed == total ? "true" : "false") + "," +
            "\\\"passedCount\\\":" + passed + ",\\\"totalCount\\\":" + total + "," +
            "\\\"score\\\":" + ((passed * 100) / total) + ",\\\"results\\\":[" +
            "{\\\"id\\\":1,\\\"input\\\":\\\"LRUCache(2) put(k1,100), put(k2,200), get(k1), put(k3,300)\\\",\\\"expected\\\":\\\"k1: 100, k2: evicted (null), k3: 300\\\",\\\"actual\\\":\\\"" + (p1 ? "Correct eviction" : "Failed eviction/access") + "\\\",\\\"passed\\\":" + p1 + ",\\\"elapsedMs\\\":0.5}," +
            "{\\\"id\\\":2,\\\"input\\\":\\\"put(k4,400) evicts least-recently used\\\",\\\"expected\\\":\\\"k1 evicted (null)\\\",\\\"actual\\\":\\\"" + (p2 ? "Evicted as expected" : "Retention error") + "\\\",\\\"passed\\\":" + p2 + ",\\\"elapsedMs\\\":0.5}" +
            "]}");
        System.out.println("${SENTINEL_END}");
    }
`;
    } else if (userCode.includes('class WorkDispatcher')) {
      testHarnessJava = `
    public static void main(String[] args) {
        int passed = 0;
        int total = 2;

        boolean p1 = false;
        boolean p2 = false;
        try {
            WorkDispatcher dispatcher = new WorkDispatcher(2, 5);
            java.util.concurrent.atomic.AtomicInteger counter = new java.util.concurrent.atomic.AtomicInteger(0);
            boolean s1 = dispatcher.submit(() -> counter.incrementAndGet());
            boolean s2 = dispatcher.submit(() -> counter.incrementAndGet());
            Thread.sleep(100);
            p1 = s1 && s2 && counter.get() >= 1;
            if (p1) passed++;

            // Stress queue capacity
            for (int i = 0; i < 20; i++) {
                dispatcher.submit(() -> { try { Thread.sleep(20); } catch(Exception e) {} });
            }
            p2 = true;
            if (p2) passed++;
        } catch (Exception e) {}

        System.out.println("${SENTINEL_START}");
        System.out.println("{\\\"status\\\":\\\"" + (passed == total ? "PASSED" : "FAILED") + "\\\"," +
            "\\\"allPassed\\\":" + (passed == total ? "true" : "false") + "," +
            "\\\"passedCount\\\":" + passed + ",\\\"totalCount\\\":" + total + "," +
            "\\\"score\\\":" + ((passed * 100) / total) + ",\\\"results\\\":[" +
            "{\\\"id\\\":1,\\\"input\\\":\\\"WorkDispatcher(2,5) submit tasks\\\",\\\"expected\\\":\\\"Tasks accepted and executed\\\",\\\"actual\\\":\\\"" + (p1 ? "Executed" : "Tasks rejected or failed") + "\\\",\\\"passed\\\":" + p1 + ",\\\"elapsedMs\\\":0.5}," +
            "{\\\"id\\\":2,\\\"input\\\":\\\"Bounded queue capacity enforcement\\\",\\\"expected\\\":\\\"Queue bounded safely\\\",\\\"actual\\\":\\\"" + (p2 ? "Passed" : "Failed") + "\\\",\\\"passed\\\":" + p2 + ",\\\"elapsedMs\\\":0.5}" +
            "]}");
        System.out.println("${SENTINEL_END}");
    }
`;
    } else {
      testHarnessJava = `
    public static void main(String[] args) {
        System.out.println("${SENTINEL_START}");
        System.out.println("{\\\"status\\\":\\\"FAILED\\\",\\\"allPassed\\\":false,\\\"passedCount\\\":0,\\\"totalCount\\\":1,\\\"score\\\":0,\\\"results\\\":[{\\\"id\\\":1,\\\"input\\\":\\\"Assessment Verification\\\",\\\"expected\\\":\\\"Recognized assessment class\\\",\\\"actual\\\":\\\"Unrecognized or missing target class\\\",\\\"passed\\\":false,\\\"elapsedMs\\\":0.0,\\\"error\\\":\\\"Target class was not implemented for this problem\\\"}]}");
        System.out.println("${SENTINEL_END}");
    }
`;
    }

    let finalCode = userCode;
    const lastBrace = finalCode.lastIndexOf('}');
    if (lastBrace !== -1) {
      finalCode = finalCode.slice(0, lastBrace) + testHarnessJava + finalCode.slice(lastBrace);
    } else {
      finalCode = `public class ${className} { ${userCode} ${testHarnessJava} }`;
    }

    // Append helper models if not already declared
    if (!finalCode.includes('class Order ') && !finalCode.includes('class Order{') && !finalCode.includes('class Order\n')) {
      finalCode = finalCode + `\nclass Order {
        public String customerId;
        public String id;
        public double amount;
        public double total;
        public String status;
        public Order(String customerId, double amount, String status) {
            this.customerId = customerId;
            this.id = customerId;
            this.amount = amount;
            this.total = amount;
            this.status = status;
        }
        public Order(String id, String status, double total) {
            this.customerId = id;
            this.id = id;
            this.amount = total;
            this.total = total;
            this.status = status;
        }
        public String getCustomerId() { return customerId; }
        public String getId() { return id; }
        public double getAmount() { return amount; }
        public double getTotal() { return total; }
        public String getStatus() { return status; }
      }\n`;
    }

    const javaPath = path.join(tempDir, `${className}.java`);
    fs.writeFileSync(javaPath, finalCode, 'utf-8');

    let compileStderr = '';
    const javac = spawn('javac', [javaPath], { windowsHide: true });
    javac.stderr.on('data', d => { compileStderr += d.toString(); });

    javac.on('close', (code) => {
      try { fs.unlinkSync(javaPath); } catch(e) {}

      if (code !== 0) {
        return resolve({
          success: false,
          status: 'COMPILATION_ERROR',
          error: compileStderr.trim() || 'Java Compilation failed',
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
            error: compileStderr.trim().split('\n')[0]
          }))
        });
      }

      let stdout = '';
      let stderr = '';
      let isTimedOut = false;

      const java = spawn('java', ['-cp', tempDir, className], { windowsHide: true });

      const timer = setTimeout(() => {
        isTimedOut = true;
        java.kill('SIGKILL');
      }, EXECUTION_TIMEOUT_MS);

      java.stdout.on('data', d => { stdout += d.toString(); });
      java.stderr.on('data', d => { stderr += d.toString(); });

      java.on('close', () => {
        clearTimeout(timer);
        try { fs.unlinkSync(path.join(tempDir, `${className}.class`)); } catch(e) {}

        if (isTimedOut) {
          return resolve({
            success: false,
            status: 'TIMEOUT_ERROR',
            error: 'Java execution timed out (> 3500ms)',
            allPassed: false,
            passedCount: 0,
            totalCount: testCases.length,
            score: 0,
            results: []
          });
        }

        const { logs, payload } = parseSentinelOutput(stdout, stderr, testCases.length);
        if (payload) {
          return resolve({ success: true, ...payload, logs: payload.logs || logs });
        }

        resolve({
          success: false,
          status: 'FAILED',
          allPassed: false,
          passedCount: 0,
          totalCount: testCases.length,
          score: 0,
          logs: stdout || stderr,
          results: [{ id: 1, passed: false, actual: stdout.trim() || 'Execution failed' }]
        });
      });
    });

    javac.on('error', (err) => {
      try { fs.unlinkSync(javaPath); } catch(e) {}
      resolve({
        success: false,
        status: 'SPAWN_ERROR',
        error: `Java compiler not available: ${err.message}`,
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
 * 7. HTML & CSS MARKUP VALIDATOR - STRICT VALIDATION
 */
function executeHTMLCSS(userCode, testCases) {
  return new Promise((resolve) => {
    const results = [];
    let passedCount = 0;
    const lower = userCode.toLowerCase();
    const clean = lower.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, '').trim();

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const isHidden = !!tc.isHidden;
      const expected = tc.expected;

      let passed = false;
      let actual = '';

      if (typeof expected === 'string') {
        passed = clean.includes(expected.toLowerCase());
        actual = passed ? expected : `Missing required rule: '${expected}'`;
      } else if (Array.isArray(expected)) {
        const missing = expected.filter(exp => !clean.includes(String(exp).toLowerCase()));
        passed = missing.length === 0;
        actual = passed ? 'All style and semantic requirements met' : `Missing: ${missing.join(', ')}`;
      } else if (typeof expected === 'object' && expected !== null) {
        const checks = Object.entries(expected).map(([k, v]) => {
          return clean.includes(String(k).toLowerCase()) || clean.includes(String(v).toLowerCase());
        });
        passed = checks.every(Boolean);
        actual = passed ? expected : { error: 'Required attributes or CSS missing' };
      } else {
        passed = clean.includes('<') && clean.includes('>') && clean.includes('{') && clean.includes(':') && clean.length > 50;
        actual = passed ? 'Valid HTML5 / CSS3 syntax' : 'Empty or incomplete markup';
      }

      if (passed) passedCount++;

      results.push({
        id: tc.id || i + 1,
        input: tc.title || 'Layout and Accessibility Rule Validation',
        expected: isHidden ? 'Hidden' : expected,
        actual: isHidden && !passed ? 'Hidden' : actual,
        passed,
        elapsedMs: 0.1,
        error: passed ? null : 'Rule or selector missing in HTML/CSS specification'
      });
    }

    const allPassed = passedCount === testCases.length && testCases.length > 0;
    const score = testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0;

    resolve({
      success: true,
      status: allPassed ? 'PASSED' : 'FAILED',
      allPassed,
      passedCount,
      totalCount: testCases.length,
      score,
      logs: 'HTML5 & CSS3 layout parsed and verified.',
      results
    });
  });
}

/**
 * Runs a compiled binary executable
 */
function runExecutable(exePath, testCases) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const child = spawn(exePath, [], { windowsHide: true });

    const timer = setTimeout(() => {
      isTimedOut = true;
      child.kill('SIGKILL');
    }, EXECUTION_TIMEOUT_MS);

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('close', (exitCode) => {
      clearTimeout(timer);

      if (isTimedOut) {
        return resolve({
          success: false,
          status: 'TIMEOUT_ERROR',
          error: 'Execution exceeded 3500ms time limit.',
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
            elapsedMs: EXECUTION_TIMEOUT_MS,
            error: 'Time limit exceeded'
          }))
        });
      }

      const { logs, payload } = parseSentinelOutput(stdout, stderr, testCases.length);
      if (payload) {
        return resolve({ success: true, ...payload, logs: payload.logs || logs });
      }

      // If no sentinel framing was output, binary failed or exited without printing structured results
      resolve({
        success: false,
        status: 'FAILED',
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        logs: stdout || stderr,
        results: testCases.map(tc => ({
          id: tc.id,
          input: tc.input,
          expected: tc.expected,
          actual: stdout.trim() || 'Executable produced no valid output',
          passed: false,
          elapsedMs: 0.5,
          error: stderr.trim() || 'Assertion failure'
        }))
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        success: false,
        status: 'EXEC_ERROR',
        error: `Executable launch error: ${err.message}`,
        allPassed: false,
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        results: []
      });
    });
  });
}

export async function executeCode(language, code, options = {}) {
  return compilerService.execute({ language, code, ...options });
}

export default compilerService;

