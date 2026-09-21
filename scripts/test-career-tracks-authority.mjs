// scripts/test-career-tracks-authority.mjs
// Verification Suite for Step 2A: Single Source of Truth for Career Track -> Skills

import { comprehensiveCareerRoles, getCareerRoleByTitle } from '../src/data/careerRolesData.js';
import { masterSkillsCatalogue, getRecommendedSkillsForStudent, getSkillById } from '../src/data/skillsRegistry.js';
import { storageService } from '../src/services/storageService.js';

console.log('========================================================================');
console.log('  TESTING CAREER ROLES SINGLE SOURCE OF TRUTH (STEP 2A AUDIT & FIX)');
console.log('========================================================================\n');

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    passedChecks++;
    console.log(`✓ PASS: ${message}`);
  }
}

// -------------------------------------------------------------
// TEST 1: Canonical Career Tracks Directory
// -------------------------------------------------------------
console.log('--- TEST 1: Canonical Career Tracks Directory ---');
assert(Array.isArray(comprehensiveCareerRoles), 'comprehensiveCareerRoles is an array');
assert(comprehensiveCareerRoles.length === 23, `Exactly 23 canonical career tracks defined (found: ${comprehensiveCareerRoles.length})`);

const trackIds = new Set(comprehensiveCareerRoles.map((t) => t.id));
assert(trackIds.size === 23, 'All 23 track IDs are unique');

// -------------------------------------------------------------
// TEST 2: Every Career Track Has Non-Empty Required Skills Mapped to Canonical 38 Skills
// -------------------------------------------------------------
console.log('\n--- TEST 2: Required Skills Mapping Integrity ---');
comprehensiveCareerRoles.forEach((track) => {
  assert(Array.isArray(track.requiredSkills) && track.requiredSkills.length >= 4, `Track "${track.title}" has >= 4 required skills (found: ${track.requiredSkills?.length})`);
  track.requiredSkills.forEach((req) => {
    assert(typeof req.id === 'string' && req.id.length > 0, `Track "${track.title}" has skill id: ${req.id}`);
    assert(typeof req.name === 'string' && req.name.length > 0, `Track "${track.title}" has skill name: ${req.name}`);
    assert(typeof req.minScore === 'number' && req.minScore >= 60, `Track "${track.title}" has valid minScore (${req.minScore}) for ${req.id}`);
    const catalogSkill = getSkillById(req.id);
    assert(!!catalogSkill, `Skill ID "${req.id}" exists in the 38 canonical master registry`);
  });
});

// -------------------------------------------------------------
// TEST 3: getCareerRoleByTitle Resolution Robustness
// -------------------------------------------------------------
console.log('\n--- TEST 3: getCareerRoleByTitle Resolution Robustness ---');

// Test 3a: Exact Title Lookup
comprehensiveCareerRoles.forEach((track) => {
  const resolved = getCareerRoleByTitle(track.title);
  assert(resolved.id === track.id, `Resolves exact title "${track.title}" -> ${track.id}`);
});

// Test 3b: Exact ID Lookup
comprehensiveCareerRoles.forEach((track) => {
  const resolved = getCareerRoleByTitle(track.id);
  assert(resolved.id === track.id, `Resolves direct ID "${track.id}" -> ${track.title}`);
});

// Test 3c: Common Industry Aliases
const aliasCases = [
  { input: 'Full Stack Web Developer', expectedId: 'track-fullstack' },
  { input: 'Software Engineer', expectedId: 'track-swe' },
  { input: 'SDE Intern', expectedId: 'track-swe' },
  { input: 'Backend Web Developer', expectedId: 'track-backend' },
  { input: 'Frontend React Developer', expectedId: 'track-frontend' },
  { input: 'Cybersecurity Analyst', expectedId: 'track-cybersecurity' },
  { input: 'Cloud Architect', expectedId: 'track-solutions-architect' },
  { input: 'Product Manager', expectedId: 'track-pm' },
  { input: 'QA Tester', expectedId: 'track-qa' },
  { input: 'DBA', expectedId: 'track-dba' },
  { input: 'ML Engineer', expectedId: 'track-ml-eng' },
  { input: 'Generative AI Specialist', expectedId: 'track-genai' },
  { input: 'Blockchain Developer', expectedId: 'track-blockchain' }
];

aliasCases.forEach(({ input, expectedId }) => {
  const resolved = getCareerRoleByTitle(input);
  assert(resolved.id === expectedId, `Alias "${input}" properly maps to authoritative track "${expectedId}"`);
});

// -------------------------------------------------------------
// TEST 4: getRecommendedSkillsForStudent Reads Directly From careerRolesData.js
// -------------------------------------------------------------
console.log('\n--- TEST 4: getRecommendedSkillsForStudent Integration ---');
comprehensiveCareerRoles.forEach((track) => {
  const recommended = getRecommendedSkillsForStudent({
    targetRole: track.title,
    primaryDomain: 'Computer Science / Software Development'
  });

  const recommendedIds = new Set(recommended.map((s) => s.id));
  
  // Every requiredSkill in track must be present in recommendations with "Core Track Skill"
  track.requiredSkills.forEach((req) => {
    assert(recommendedIds.has(req.id), `Track "${track.title}" required skill "${req.id}" is present in recommendations`);
  });
});

// -------------------------------------------------------------
// TEST 5: storageService.calculateSkillGapsForRole Reads Directly From careerRolesData.js
// -------------------------------------------------------------
console.log('\n--- TEST 5: storageService.calculateSkillGapsForRole ---');
comprehensiveCareerRoles.forEach((track) => {
  const gaps = storageService.calculateSkillGapsForRole(track.title, []);
  assert(gaps.length === track.requiredSkills.length, `Gaps for "${track.title}" match requiredSkills count (${gaps.length} == ${track.requiredSkills.length})`);
  track.requiredSkills.forEach((req, idx) => {
    assert(gaps[idx].skillId === req.id, `Gap skillId [${idx}] matches "${req.id}"`);
    assert(gaps[idx].requiredScore === req.minScore, `Gap minScore [${idx}] matches ${req.minScore}`);
  });
});

// -------------------------------------------------------------
// TEST 6: 38 Canonical Skills Remain Intact
// -------------------------------------------------------------
console.log('\n--- TEST 6: 38 Canonical Skills Integrity ---');
assert(masterSkillsCatalogue.length === 38, `masterSkillsCatalogue has exactly 38 skills (got: ${masterSkillsCatalogue.length})`);
const assessedCount = masterSkillsCatalogue.filter((s) => s.hasAssessment).length;
assert(assessedCount === 10, `Exactly 10 assessed skills (got: ${assessedCount})`);
const inDevCount = masterSkillsCatalogue.filter((s) => !s.hasAssessment).length;
assert(inDevCount === 28, `Exactly 28 in-dev skills (got: ${inDevCount})`);

console.log('\n========================================================================');
console.log(`  ALL ${passedChecks}/${totalChecks} TESTS PASSED WITH 100% SUCCESS!`);
console.log('========================================================================\n');
