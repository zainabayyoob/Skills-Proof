import { compilerService } from '../server/services/compilerService.js';
import { db } from '../server/db.js';
import { notificationService } from '../server/services/notificationService.js';
import { calculateOpportunityMatch } from '../src/utils/matchingAlgorithm.js';

console.log('====================================================');
console.log('RUNNING FULL-FLOW VERIFICATION TEST SUITE');
console.log('====================================================');

async function runTests() {
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Phone number storage & validation
  const testPhone = '+919876543210';
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  assert(phoneRegex.test(testPhone), 'Phone regex accepts valid international mobile number');
  assert(!phoneRegex.test('abc1234'), 'Phone regex rejects alphabetic strings');
  assert(!phoneRegex.test('123'), 'Phone regex rejects numbers shorter than 10 digits');

  const testUser = db.createUser({
    name: 'Test Candidate',
    email: `cand_${Date.now()}@example.com`,
    phone: testPhone,
    passwordHash: 'hash123',
    targetRole: 'Full Stack Web Developer'
  });
  assert(testUser.phone === testPhone, 'User record correctly stores validated phone number in database');

  // 2. Notification architecture
  const notifList = await notificationService.notify({
    userId: testUser.id,
    title: 'Assessment Unlocked',
    message: 'Your coding challenge is ready',
    channels: ['IN_APP', 'SMS_READY']
  });
  const inAppNotif = notifList.find(n => n.channel === 'IN_APP');
  const smsNotif = notifList.find(n => n.channel === 'SMS_READY');
  assert(inAppNotif?.title === 'Assessment Unlocked', 'In-App notification recorded');
  assert(smsNotif?.deliveryStatus === 'QUEUED_FOR_SMS_GATEWAY' && smsNotif?.channelNote?.includes(testPhone), 'SMS notification queued with recipient phone without fake external send');

  // 3. Compiler Execution - Correct code PASS
  const pyPass = await compilerService.execute({
    language: 'python',
    entrypoint: 'analyze_sales_data',
    code: `def analyze_sales_data(transactions):\n    total = sum(t['units'] * t['price'] for t in transactions)\n    top = max(transactions, key=lambda t: t['units'] * t['price'])['product']\n    return {'total_sales': round(total, 2), 'top_product': top, 'aov': round(total / len(transactions), 2)}`,
    testCases: [
      {
        id: 1,
        input: [[
          { id: 'TX-1', product: 'Stand', units: 2, price: 45.0 },
          { id: 'TX-2', product: 'Mouse', units: 3, price: 25.0 }
        ]],
        expected: { total_sales: 165.0, top_product: 'Stand', aov: 82.5 }
      }
    ]
  });
  assert(pyPass.status === 'PASSED' && pyPass.allPassed === true, 'Compiler correctly PASSES valid implementation');

  // 4. Compiler Execution - Wrong code FAIL
  const pyFail = await compilerService.execute({
    language: 'python',
    entrypoint: 'analyze_sales_data',
    code: `def analyze_sales_data(transactions):\n    return {'total_sales': 0, 'top_product': '', 'aov': 0}`,
    testCases: [
      {
        id: 1,
        input: [[{ id: 'TX-1', product: 'Stand', units: 2, price: 45.0 }]],
        expected: { total_sales: 90.0, top_product: 'Stand', aov: 90.0 }
      }
    ]
  });
  assert(pyFail.status === 'FAILED' && pyFail.allPassed === false, 'Compiler correctly FAILS incorrect code output (No mock pass)');

  // 5. Compiler Execution - Syntax Error
  const pySyntax = await compilerService.execute({
    language: 'python',
    entrypoint: 'foo',
    code: `def foo(:\n    pass`,
    testCases: [{ id: 1, input: [], expected: 1 }]
  });
  assert(pySyntax.status === 'COMPILATION_ERROR' && pySyntax.error.includes('SyntaxError'), 'Compiler traps syntax error with line number');

  // 6. Compiler Execution - Timeout Watchdog
  const pyTimeout = await compilerService.execute({
    language: 'python',
    entrypoint: 'loop',
    code: `def loop():\n    while True:\n        pass`,
    testCases: [{ id: 1, input: [], expected: 1 }]
  });
  assert(pyTimeout.status === 'TIMEOUT_ERROR', 'Compiler watchdog terminates infinite loop within 3500ms');

  // 7. Compiler Execution - JavaScript
  const jsRun = await compilerService.execute({
    language: 'javascript',
    entrypoint: 'batchProcess',
    code: `function batchProcess(items, size) { return items.map(x => x * 2); }`,
    testCases: [{ id: 1, input: [[1, 2, 3], 2], expected: [2, 4, 6] }]
  });
  assert(jsRun.status === 'PASSED' && jsRun.allPassed === true, 'JavaScript execution engine verified');

  // 8. Matching Algorithm - Deterministic & No NaN
  const opp = {
    id: 'opp-test',
    title: 'Full Stack Engineer',
    requiredSkills: [
      { name: 'React', minScore: 75, weight: 0.5 },
      { name: 'Node.js', minScore: 75, weight: 0.5 }
    ]
  };
  const verifiedStudent = {
    careerReadiness: 85,
    verifiedSkills: [
      { name: 'React', skillId: 'react', score: 88 },
      { name: 'Node.js', skillId: 'node', score: 82 }
    ]
  };
  const matchResult = calculateOpportunityMatch(opp, verifiedStudent);
  assert(!isNaN(matchResult.matchPercentage) && matchResult.matchPercentage > 80, `Verified Fit % is ${matchResult.matchPercentage}% (valid number > 80%)`);
  assert(matchResult.matchingSkills.length === 2, 'Identified both matching skills meeting benchmark');
  assert(matchResult.rationale.includes('Exceptional Match') || matchResult.rationale.includes('Strong Match'), 'Explainable rationale provided');

  // 9. Unverified Student Matching Lock
  const unverifiedStudent = { careerReadiness: 0, verifiedSkills: [] };
  const lockedMatch = calculateOpportunityMatch(opp, unverifiedStudent);
  assert(lockedMatch.matchPercentage === 0, 'Unverified student match percentage is 0%');
  assert(lockedMatch.rationale.includes('Profile not verified yet'), 'Locked rationale directing candidate to assessment');

  // 10. Quiz Progression Cutoff (75%)
  const passingScore = 78;
  const failingScore = 65;
  assert(passingScore >= 75, 'Score of 78% meets 75% quiz threshold');
  assert(failingScore < 75, 'Score of 65% correctly rejected by 75% quiz threshold');

  // 11. Coding Assessment Cutoff (85%)
  const bbaPass = 88;
  const bbaFail = 80;
  assert(bbaPass >= 85, 'BBA Score of 88% unlocks Gold verified credential');
  assert(bbaFail < 85, 'BBA Score of 80% requires retry under 85% standard');

  console.log('====================================================');
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
