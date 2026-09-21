import assert from 'assert';
import { compilerService } from './server/services/compilerService.js';

async function runCompilerTests() {
  console.log('🧪 Testing Compiler Service with Real Code Execution...\n');

  // Test 1: Python Correct Code
  console.log('[1/5] Testing Python Correct Implementation...');
  const pyCorrect = await compilerService.execute({
    language: 'python',
    code: `
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i
    return []
`,
    entrypoint: 'two_sum',
    testCases: [
      { id: 1, input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { id: 2, input: [[3, 2, 4], 6], expected: [1, 2] },
      { id: 3, input: [[3, 3], 6], expected: [0, 1] }
    ]
  });
  assert.strictEqual(pyCorrect.status, 'PASSED', 'Python correct code must pass');
  assert.strictEqual(pyCorrect.allPassed, true);
  assert.strictEqual(pyCorrect.passedCount, 3);
  console.log('  ✓ Correct code PASSES all test cases with runtime timings!');

  // Test 2: Python Incorrect Code (Wrong output = FAIL)
  console.log('\n[2/5] Testing Python Incorrect Code (Must FAIL)...');
  const pyWrong = await compilerService.execute({
    language: 'python',
    code: `
def two_sum(nums, target):
    return [0, 0] # WRONG LOGIC
`,
    entrypoint: 'two_sum',
    testCases: [
      { id: 1, input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { id: 2, input: [[3, 2, 4], 6], expected: [1, 2] }
    ]
  });
  assert.strictEqual(pyWrong.status, 'FAILED', 'Python wrong code must fail');
  assert.strictEqual(pyWrong.allPassed, false);
  assert.strictEqual(pyWrong.passedCount, 0);
  console.log('  ✓ Wrong code FAILS test cases with delta output reporting!');

  // Test 3: Python Syntax / Compilation Error
  console.log('\n[3/5] Testing Python Syntax Error Handling...');
  const pySyntax = await compilerService.execute({
    language: 'python',
    code: `
def broken_fn(x)
    return x + 1  # Missing colon
`,
    entrypoint: 'broken_fn',
    testCases: [{ id: 1, input: [5], expected: 6 }]
  });
  assert.ok(pySyntax.status === 'SYNTAX_ERROR' || pySyntax.status === 'COMPILATION_ERROR');
  assert.ok(pySyntax.error.includes('SyntaxError'));
  console.log('  ✓ Syntax error caught cleanly without crashing server!');

  // Test 4: Python Infinite Loop / Timeout
  console.log('\n[4/5] Testing Python Timeout Protection (Infinite Loop)...');
  const pyTimeout = await compilerService.execute({
    language: 'python',
    code: `
def infinite_loop(x):
    while True:
        pass
`,
    entrypoint: 'infinite_loop',
    testCases: [{ id: 1, input: [1], expected: 1 }]
  });
  assert.strictEqual(pyTimeout.status, 'TIMEOUT_ERROR');
  console.log('  ✓ Infinite loop safely terminated by timeout watchdog!');

  // Test 5: JavaScript Execution
  console.log('\n[5/5] Testing JavaScript Execution Engine...');
  const jsTest = await compilerService.execute({
    language: 'javascript',
    code: `
function reverseString(str) {
  return str.split('').reverse().join('');
}
`,
    entrypoint: 'reverseString',
    testCases: [
      { id: 1, input: ["hello"], expected: "olleh" },
      { id: 2, input: ["SkillProof"], expected: "foorPllikS" }
    ]
  });
  assert.strictEqual(jsTest.status, 'PASSED');
  assert.strictEqual(jsTest.allPassed, true);
  console.log('  ✓ JavaScript code executed and verified cleanly!');

  // Test 6: SQL Execution Engine
  console.log('\n[6/7] Testing SQLite in-memory Database Execution...');
  const sqlTest = await compilerService.execute({
    language: 'sql',
    code: 'SELECT name, score FROM students WHERE score >= 80 ORDER BY score DESC;',
    testCases: [
      {
        id: 1,
        schema: 'CREATE TABLE students (id INT, name TEXT, score INT); INSERT INTO students VALUES (1, "Alice", 90), (2, "Bob", 70), (3, "Charlie", 85);',
        expected: [{ name: 'Alice', score: 90 }, { name: 'Charlie', score: 85 }]
      }
    ]
  });
  assert.strictEqual(sqlTest.status, 'PASSED', 'SQL query must pass');
  assert.strictEqual(sqlTest.allPassed, true);
  console.log('  ✓ SQL query executed on in-memory SQLite and verified!');

  // Test 7: C Code Execution with GCC
  console.log('\n[7/7] Testing C Execution Engine (GCC)...');
  const cTest = await compilerService.execute({
    language: 'c',
    code: `
int parse_sensor_payload(const char* payload, int* output_readings, int max_readings) {
    if (!payload || !output_readings || max_readings <= 0) return 0;
    int count = 0;
    char buffer[256];
    strncpy(buffer, payload, sizeof(buffer) - 1);
    buffer[sizeof(buffer) - 1] = '\\0';
    char* token = strtok(buffer, ",");
    while (token != NULL && count < max_readings) {
        output_readings[count++] = atoi(token);
        token = strtok(NULL, ",");
    }
    return count;
}
`,
    entrypoint: 'parse_sensor_payload',
    testCases: [{ id: 1, input: '10,25,80', expected: '3 readings [10, 25, 80]' }]
  });
  assert.strictEqual(cTest.status, 'PASSED', 'C code must compile and pass');
  assert.strictEqual(cTest.allPassed, true);
  // Test 8: Server-Side Hidden Test Cases & Answer Obfuscation
  console.log('\n[8/8] Testing Server-Side Hidden Test Cases & Answer Obfuscation...');
  const { getExecutableSpec } = await import('./server/data/assessmentTestCases.js');
  const spec = getExecutableSpec('python-kpi', 'python', '');
  assert.ok(spec.hiddenTestCases.length > 0, 'Server must have hidden test cases');

  const fullSuite = [...spec.sampleTestCases, ...spec.mutationTestCases, ...spec.hiddenTestCases];
  const pyHiddenReport = await compilerService.execute({
    language: 'python',
    code: `
def analyze_sales_data(transactions):
    total = 0.0
    products = {}
    valid_count = 0
    seen_ids = set()
    for tx in transactions:
        if not isinstance(tx, dict): continue
        tx_id = tx.get('id')
        if tx_id in seen_ids: continue
        units = tx.get('units')
        price = tx.get('price')
        if units is None or price is None: continue
        if isinstance(price, str):
            clean_str = ''.join(c for c in price if c.isdigit() or c == '.')
            price = float(clean_str) if clean_str else 0.0
        seen_ids.add(tx_id)
        subtotal = float(units) * float(price)
        total += subtotal
        prod = tx.get('product', 'Unknown')
        products[prod] = products.get(prod, 0.0) + subtotal
        valid_count += 1
    top_prod = max(products.items(), key=lambda x: x[1])[0] if products else ''
    aov = round(total / valid_count, 2) if valid_count > 0 else 0.0
    return {
        'total_sales': round(total, 2),
        'top_product': top_prod,
        'aov': aov
    }
`,
    entrypoint: spec.entrypoint,
    testCases: fullSuite
  });
  assert.strictEqual(pyHiddenReport.status, 'PASSED');
  assert.strictEqual(pyHiddenReport.allPassed, true);
  const hiddenCase = pyHiddenReport.results.find(r => r.input === 'Hidden Test Case' || r.expected === 'Hidden');
  assert.ok(hiddenCase, 'Hidden test case must have input marked as Hidden');
  assert.strictEqual(hiddenCase.expected, 'Hidden', 'Expected answer must be Hidden');
  console.log('  ✓ Server-side hidden test cases executed and answers protected from exposure!');

  console.log('\n🎉 ALL COMPILER SERVICE CHECKS PASSED PERFECTLY!\n');
}

runCompilerTests().catch((err) => {
  console.error('\n❌ Compiler test error:', err);
  process.exit(1);
});
