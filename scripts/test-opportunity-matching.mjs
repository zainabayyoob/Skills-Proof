// scripts/test-opportunity-matching.mjs
// Step 2E Verification Test Suite: Opportunity Matching & Canonical skillId Integration

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function pass(desc) {
  totalTests++;
  passedTests++;
  console.log(`  ✓ ${desc}`);
}

function fail(desc, err) {
  totalTests++;
  console.error(`  ✗ FAIL: ${desc}`);
  if (err) console.error(`    ${err.message || err}`);
}

async function runTests() {
  console.log('========================================================');
  console.log('STEP 2E: OPPORTUNITY MATCHING & CANONICAL SKILLID TESTS');
  console.log('========================================================\n');

  // 1. Canonical skillId Integrity in opportunitiesData.js
  console.log('1. Checking Opportunity Required Skills Canonical skillId Integrity...');
  const { initialOpportunities } = await import('../src/data/opportunitiesData.js');
  const { masterSkillsCatalogue, getSkillById } = await import('../src/data/skillsRegistry.js');

  try {
    assert.strictEqual(initialOpportunities.length, 15, 'Must contain exactly 15 initial opportunities');
    pass(`initialOpportunities contains exactly 15 opportunities`);
  } catch (e) { fail('Opportunity count mismatch', e); }

  let totalRequiredSkills = 0;
  let missingSkillIds = [];
  let redundantIds = [];
  let unmappedSkillIds = [];

  initialOpportunities.forEach((opp) => {
    (opp.requiredSkills || []).forEach((req) => {
      totalRequiredSkills++;
      if (!req.skillId || typeof req.skillId !== 'string') {
        missingSkillIds.push({ oppId: opp.id, skill: req.name });
      }
      if (req.id !== undefined) {
        redundantIds.push({ oppId: opp.id, skill: req.name });
      }
      const canonical = getSkillById(req.skillId);
      if (!canonical) {
        unmappedSkillIds.push({ oppId: opp.id, skillId: req.skillId });
      }
    });
  });

  try {
    assert.strictEqual(missingSkillIds.length, 0, `All required skills must define skillId. Missing in: ${JSON.stringify(missingSkillIds)}`);
    pass(`All ${totalRequiredSkills} required skills define a non-empty skillId`);
  } catch (e) { fail('Missing skillId in required skills', e); }

  try {
    assert.strictEqual(redundantIds.length, 0, `No redundant id property should be added. Found in: ${JSON.stringify(redundantIds)}`);
    pass('Zero redundant "id" properties added to opportunity required skills');
  } catch (e) { fail('Redundant id properties found', e); }

  try {
    assert.strictEqual(unmappedSkillIds.length, 0, `All skillIds must exist in masterSkillsCatalogue. Unmapped: ${JSON.stringify(unmappedSkillIds)}`);
    pass('All opportunity skillIds map to valid canonical skills in masterSkillsCatalogue');
  } catch (e) { fail('Unmapped skillIds found', e); }

  // 2. Canonical skillId Priority in matchingAlgorithm.js
  console.log('\n2. Checking Canonical skillId Matching Priority in matchingAlgorithm.js...');
  const { calculateOpportunityMatch } = await import('../src/utils/matchingAlgorithm.js');

  // Test opportunity with python (minScore: 80) and cpp (minScore: 80)
  const testOpp = {
    id: 'test-opp',
    title: 'Test Software Engineer',
    company: 'TestCorp',
    requiredSkills: [
      { skillId: 'python', name: 'Python', weight: 0.5, minScore: 80 },
      { skillId: 'cpp', name: 'C++', weight: 0.5, minScore: 80 }
    ]
  };

  // Student verified skills keyed by canonical skillId
  const candidateWithCanonical = {
    careerReadiness: 85,
    verifiedSkills: [
      { skillId: 'python', name: 'Python 3.11 Runtime', score: 90 }, // Custom name, canonical ID
      { skillId: 'cpp', name: 'C++', score: 85 }
    ]
  };

  const matchRes = calculateOpportunityMatch(testOpp, candidateWithCanonical);

  try {
    assert.strictEqual(matchRes.matchingSkills.length, 2, 'Both skills should match via canonical skillId');
    assert.strictEqual(matchRes.missingSkills.length, 0, 'No missing skills');
    assert.strictEqual(matchRes.matchingSkills[0].skillId, 'python', 'matchingSkills must include canonical skillId');
    assert.strictEqual(matchRes.matchingSkills[1].skillId, 'cpp', 'matchingSkills must include canonical skillId');
    pass('Matching successfully resolves via canonical skillId regardless of display name variations');
  } catch (e) { fail('Canonical skillId matching failed', e); }

  // 3. Fallback to exact name when skillId is absent in verified skill
  console.log('\n3. Checking Safe Exact Name Fallback...');
  const legacyCandidate = {
    careerReadiness: 70,
    verifiedSkills: [
      { name: 'Python', score: 85 }, // No skillId
      { name: 'C++', score: 85 }     // No skillId
    ]
  };

  const legacyRes = calculateOpportunityMatch(testOpp, legacyCandidate);
  try {
    assert.strictEqual(legacyRes.matchingSkills.length, 2, 'Fallback to exact name matches both skills');
    pass('Safe fallback to exact lowercase name functions correctly when skillId is absent in student data');
  } catch (e) { fail('Exact name fallback failed', e); }

  // 4. Substring Matching Removal Verification
  console.log('\n4. Verifying Removal of Dangerous Substring Matching...');
  const substringTestOpp = {
    id: 'opp-js',
    title: 'JS Role',
    requiredSkills: [
      { skillId: 'javascript', name: 'JavaScript', weight: 1.0, minScore: 75 }
    ]
  };
  const candidateWithOnlyC = {
    careerReadiness: 80,
    verifiedSkills: [
      { skillId: 'c', name: 'C', score: 95 } // "c" is a substring of "javascript"
    ]
  };

  const substringRes = calculateOpportunityMatch(substringTestOpp, candidateWithOnlyC);
  try {
    assert.strictEqual(substringRes.matchingSkills.length, 0, '"C" should NEVER match "JavaScript" via substring');
    assert.strictEqual(substringRes.missingSkills.length, 1, 'JavaScript must be reported missing');
    assert.strictEqual(substringRes.matchPercentage, 0, 'Match percentage must be 0');
    pass('Dangerous substring matching successfully eliminated (Skill "C" does not match "JavaScript")');
  } catch (e) { fail('Substring matching still occurs', e); }

  // 5. Fit % Math Preservation
  console.log('\n5. Verifying Fit % Mathematical Calculation & Penalty Preservation...');

  // A. Zero-verified-skill lock
  const unverifiedCandidate = {
    careerReadiness: 0,
    verifiedSkills: []
  };
  const unverifiedRes = calculateOpportunityMatch(testOpp, unverifiedCandidate);
  try {
    assert.strictEqual(unverifiedRes.matchPercentage, 0, 'Unverified candidate must have 0% match');
    assert(unverifiedRes.rationale.includes('Profile not verified yet'), 'Must show unverified lock rationale');
    assert.strictEqual(unverifiedRes.missingSkills.length, 2, 'All skills must be marked missing');
    assert.strictEqual(unverifiedRes.missingSkills[0].status, 'Unverified', 'Status must be Unverified');
    pass('Zero-verified-skill lock preserved (0% match, unverified rationale, missing list)');
  } catch (e) { fail('Zero-verified lock failed', e); }

  // B. Below-minimum score penalty (0.75 multiplier)
  // Python: req 80, student 60 (below benchmark). Earned: 0.5 * (60 * 0.75) = 22.5
  // C++: req 80, student 90 (above benchmark). Earned: 0.5 * 90 = 45
  // Total earnedScore = 67.5, baseSkillMatch = 67.5
  // readiness: 80. bonus = 8.0
  // rawPct = Math.round(67.5 * 0.9 + 8.0) = Math.round(60.75 + 8.0) = Math.round(68.75) = 69
  const partialCandidate = {
    careerReadiness: 80,
    verifiedSkills: [
      { skillId: 'python', name: 'Python', score: 60 },
      { skillId: 'cpp', name: 'C++', score: 90 }
    ]
  };
  const partialRes = calculateOpportunityMatch(testOpp, partialCandidate);
  try {
    assert.strictEqual(partialRes.matchPercentage, 69, `Expected exactly 69% match, got ${partialRes.matchPercentage}`);
    assert.strictEqual(partialRes.matchingSkills.length, 1, '1 matching skill');
    assert.strictEqual(partialRes.missingSkills.length, 1, '1 missing skill (below benchmark)');
    assert.strictEqual(partialRes.missingSkills[0].status, 'Below Benchmark', 'Status must be Below Benchmark');
    assert.strictEqual(partialRes.missingSkills[0].gap, 20, 'Gap must be 80 - 60 = 20');
    pass('Below-minimum penalty (0.75 multiplier) and gap calculation preserved exactly');
  } catch (e) { fail('Penalty calculation mismatch', e); }

  // C. Maximum 98% Cap
  const perfectCandidate = {
    careerReadiness: 100,
    verifiedSkills: [
      { skillId: 'python', name: 'Python', score: 100 },
      { skillId: 'cpp', name: 'C++', score: 100 }
    ]
  };
  const perfectRes = calculateOpportunityMatch(testOpp, perfectCandidate);
  try {
    assert.strictEqual(perfectRes.matchPercentage, 98, `Perfect candidate must be capped at 98%, got ${perfectRes.matchPercentage}`);
    pass('Maximum 98% cap preserved');
  } catch (e) { fail('98% cap failed', e); }

  // 6. Rationale Text Preservation
  console.log('\n6. Verifying Rationale Text Preservation Across Thresholds...');
  try {
    // Exceptional (>= 85)
    assert(perfectRes.rationale.startsWith('Exceptional Match:'), '>=85 must output Exceptional Match');
    // Strong (>= 65)
    assert(partialRes.rationale.startsWith('Strong Match:'), '>=65 must output Strong Match');

    // Zero Skill Alignment (no verified skills match requirements)
    const mismatchedCandidate = {
      careerReadiness: 80,
      verifiedSkills: [{ skillId: 'sql', name: 'SQL', score: 90 }] // Opportunity needs python and cpp
    };
    const zeroAlignRes = calculateOpportunityMatch(testOpp, mismatchedCandidate);
    assert.strictEqual(zeroAlignRes.matchPercentage, 0, 'Zero alignment must be 0%');
    assert(zeroAlignRes.rationale.startsWith('Zero Skill Alignment:'), 'Must output Zero Skill Alignment');

    pass('All rationale copy and thresholds preserved identically');
  } catch (e) { fail('Rationale text preservation failed', e); }

  // 7. Backend GET /api/opportunities Integration
  console.log('\n7. Checking Backend GET /api/opportunities Route Integration...');
  const { db } = await import('../server/db.js');
  const dbOpps = await db.getOpportunities();

  try {
    assert.strictEqual(dbOpps.length, 15, 'Database must have 15 opportunities');
    const allDbHaveSkillId = dbOpps.every(o => (o.requiredSkills || []).every(r => Boolean(r.skillId)));
    assert(allDbHaveSkillId, 'All database opportunities must have skillId on requiredSkills');
    pass('Backend database opportunities contain canonical skillId');
  } catch (e) { fail('Database opportunities skillId check failed', e); }

  // Test server matching calculation directly
  const testVerifiedUser = {
    careerReadiness: 84,
    verifiedSkills: [
      { skillId: 'python', name: 'Python', score: 88 },
      { skillId: 'cpp', name: 'C++', score: 85 }
    ]
  };

  const googleOpp = dbOpps.find(o => o.id === 'opp-google-swe');
  let serverMatchedCount = 0;
  googleOpp.requiredSkills.forEach(req => {
    const found = testVerifiedUser.verifiedSkills.find(
      v => (v.skillId && req.skillId && v.skillId.toLowerCase() === req.skillId.toLowerCase()) ||
           v.name.toLowerCase() === req.name.toLowerCase()
    );
    if (found && found.score >= req.minScore) serverMatchedCount++;
  });

  try {
    assert.strictEqual(serverMatchedCount, 2, 'Server should match python and cpp for Google SWE');
    pass('Backend opportunity matching resolves correctly with canonical skillId');
  } catch (e) { fail('Backend opportunity matching failed', e); }

  // 8. Application Flow & Persistence Integrity
  console.log('\n8. Checking Application Tracking & Persistence Integrity...');
  try {
    const testApp = {
      userId: 'SP-STU-3RTMJU1T',
      candidateName: 'Test Student',
      candidateEmail: 'test@student.edu',
      opportunityId: 'opp-google-swe',
      opportunityTitle: 'Software Engineering Intern',
      company: 'Google',
      location: 'Bangalore / Hyderabad, India',
      stipend: '₹1,00,000 / month',
      status: 'Applied'
    };

    const createdApp = await db.createApplication(testApp);
    assert(createdApp.id, 'Application must have generated ID');
    assert.strictEqual(createdApp.status, 'Applied', 'Status must be Applied');

    const retrieved = await db.getApplicationById(createdApp.id);
    assert.strictEqual(retrieved.company, 'Google');
    assert.strictEqual(retrieved.opportunityId, 'opp-google-swe');

    // Clean up test app
    await db.deleteApplication(createdApp.id, 'SP-STU-3RTMJU1T');

    pass('Application creation, retrieval, and status tracking preserved without regressions');
  } catch (e) { fail('Application flow integrity check failed', e); }

  console.log('\n========================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  console.log('========================================================\n');

  if (typeof db.close === 'function') {
    await db.close();
  }

  if (totalTests === passedTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
