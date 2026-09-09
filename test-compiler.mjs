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
  assert.strictEqual(pySyntax.status, 'COMPILATION_ERROR');
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

  console.log('\n🎉 ALL COMPILER SERVICE CHECKS PASSED PERFECTLY!\n');
}

runCompilerTests().catch((err) => {
  console.error('\n❌ Compiler test error:', err);
  process.exit(1);
});
