// scripts/test-learning-roadmap-38.mjs
// Step 2D Verification Test Suite: Learning Roadmap 38-Skill Expansion

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let passedTests = 0;
let totalTests = 0;

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
  console.log('STEP 2D: EXPAND LEARNING ROADMAP TO 38 SKILLS TESTS');
  console.log('========================================================\n');

  // 1. Source Code Inspection
  console.log('1. Checking LearningRoadmap.jsx Source Integrity...');
  const roadmapFile = fs.readFileSync(path.join(rootDir, 'src/pages/LearningRoadmap.jsx'), 'utf-8');

  try {
    assert(!roadmapFile.includes('const allSkillsList = ['), 'Hardcoded 10-skill allSkillsList must be removed');
    pass('Hardcoded 10-skill allSkillsList has been completely removed');
  } catch (e) { fail('Hardcoded 10-skill list still present', e); }

  try {
    assert(roadmapFile.includes('masterSkillsCatalogue'), 'Must import and use masterSkillsCatalogue');
    pass('LearningRoadmap imports and uses masterSkillsCatalogue');
  } catch (e) { fail('masterSkillsCatalogue not used in LearningRoadmap', e); }

  try {
    assert(roadmapFile.includes('SKILL_CATEGORIES'), 'Must import and use SKILL_CATEGORIES for category filtering');
    pass('LearningRoadmap imports and uses SKILL_CATEGORIES');
  } catch (e) { fail('SKILL_CATEGORIES not used', e); }

  try {
    assert(roadmapFile.includes('All 38 Skills Catalog'), 'Filter button must reference All 38 Skills Catalog');
    pass('UI displays All 38 Skills Catalog');
  } catch (e) { fail('All 38 Skills Catalog label missing', e); }

  try {
    assert(roadmapFile.includes('Curated Path In Preparation') || roadmapFile.includes('Curriculum In Preparation'), 'Must render in-preparation status for skills without resources');
    pass('Honest "Curriculum In Preparation" status implemented');
  } catch (e) { fail('In-preparation status missing', e); }

  try {
    assert(roadmapFile.includes('item.concepts'), 'Must display concepts from skillsRegistry');
    pass('Displays real concepts from skills registry');
  } catch (e) { fail('Concepts display missing', e); }

  try {
    assert(roadmapFile.includes('getRolesRequiringSkill'), 'Must compute and display career tracks requiring each skill');
    pass('Calculates and displays target career tracks requiring each skill');
  } catch (e) { fail('Career tracks requirement calculation missing', e); }

  // 2. Data Registry & Mock Data Verification
  console.log('\n2. Checking Skills Registry & Learning Resource Coverage...');
  const { masterSkillsCatalogue, getSkillById, SKILL_CATEGORIES } = await import('../src/data/skillsRegistry.js');
  const { famousMentorsCourses } = await import('../src/data/mockData.js');
  const { comprehensiveCareerRoles } = await import('../src/data/careerRolesData.js');

  try {
    assert.strictEqual(masterSkillsCatalogue.length, 38, 'Must have exactly 38 canonical skills');
    pass(`masterSkillsCatalogue contains exactly 38 canonical skills`);
  } catch (e) { fail('Incorrect skill count in master registry', e); }

  const liveResourceSkillIds = Object.keys(famousMentorsCourses);
  try {
    assert.strictEqual(liveResourceSkillIds.length, 10, 'famousMentorsCourses must have exactly 10 base skills');
    pass(`famousMentorsCourses contains exactly 10 base skills with verified video courses`);
  } catch (e) { fail('famousMentorsCourses count mismatch', e); }

  // Check 28 in-preparation skills have NO fake courses in famousMentorsCourses
  const extensionSkillIds = masterSkillsCatalogue
    .filter(s => !liveResourceSkillIds.includes(s.id))
    .map(s => s.id);

  try {
    assert.strictEqual(extensionSkillIds.length, 28, 'Must have exactly 28 extension skills');
    pass(`Exactly 28 skills correctly identified as in-preparation`);
  } catch (e) { fail('Incorrect extension skill count', e); }

  let hasFakeCourses = false;
  extensionSkillIds.forEach(id => {
    if (famousMentorsCourses[id] && famousMentorsCourses[id].length > 0) {
      hasFakeCourses = true;
    }
  });

  try {
    assert(!hasFakeCourses, 'No fake courses or fake mentors may be added to mockData for extension skills');
    pass('Zero fake courses, fake mentors, or fake videos fabricated for extension skills');
  } catch (e) { fail('Fake courses found for extension skills', e); }

  // 3. Category Filtering across 38 Skills
  console.log('\n3. Checking Category Filtering Logic across All 38 Skills...');
  const categoryCounts = {};
  SKILL_CATEGORIES.forEach(cat => {
    const matched = masterSkillsCatalogue.filter(s => {
      if (cat.id === 'all') return true;
      if (cat.id === 'programming-languages') {
        return s.skillType === 'programming-language' || s.skillTypeLabel === 'Programming Language';
      }
      if (cat.id === 'frameworks-stacks') {
        return s.skillType === 'framework-stack' || s.skillType === 'markup-styling' || s.categoryGroup === 'frameworks-stacks';
      }
      if (cat.id === 'query-data') {
        return s.skillType === 'query-language' || s.categoryGroup === 'query-data';
      }
      if (cat.id === 'cloud-infrastructure') {
        return s.categoryGroup === 'cloud-infrastructure' || s.skillType === 'infrastructure-tools';
      }
      if (cat.id === 'security-systems') {
        return s.categoryGroup === 'security-systems' || s.skillTypeLabel === 'Security & Systems';
      }
      return s.categoryGroup === cat.id;
    });
    categoryCounts[cat.id] = matched.length;
    pass(`Category "${cat.label}" (${cat.id}) maps to ${matched.length} skills`);
  });

  try {
    assert.strictEqual(categoryCounts['all'], 38, 'All skills count must be 38');
    assert.strictEqual(categoryCounts['programming-languages'], 7, 'Programming Languages must be 7');
    assert.strictEqual(categoryCounts['frameworks-stacks'], 5, 'Frameworks & Stacks must be 5');
    assert.strictEqual(categoryCounts['query-data'], 11, 'Query & Data must be 11');
    assert.strictEqual(categoryCounts['cloud-infrastructure'], 7, 'Cloud & Infrastructure must be 7');
    assert.strictEqual(categoryCounts['security-systems'], 8, 'Security & Systems must be 8');
    pass('All category counts exactly match expected distribution');
  } catch (e) { fail('Category counts mismatch', e); }

  // 4. Role Requirement Mapping for 38 Skills
  console.log('\n4. Checking Career Role Requirement Mapping for All 38 Skills...');
  let skillsWithZeroRoles = [];
  masterSkillsCatalogue.forEach(skill => {
    const roles = comprehensiveCareerRoles.filter(r =>
      r.requiredSkills?.some(req => req.id.toLowerCase() === skill.id.toLowerCase())
    );
    if (roles.length === 0) {
      skillsWithZeroRoles.push(skill.id);
    }
  });

  try {
    assert.strictEqual(skillsWithZeroRoles.length, 0, `All 38 skills must be mapped to at least 1 career role. Unmapped: ${skillsWithZeroRoles.join(', ')}`);
    pass('All 38 canonical skills are linked to at least 1 canonical career track');
  } catch (e) { fail('Orphaned skills found in registry', e); }

  // 5. Skill Gap Calculation & Storage Integration
  console.log('\n5. Checking Skill Gap Calculation via Canonical IDs...');
  const { storageService } = await import('../src/services/storageService.js');

  // Test with student having verified python & docker-containers
  const mockVerified = [
    { skillId: 'python', name: 'Python', score: 85 },
    { skillId: 'docker-containers', name: 'Docker & Containerization', score: 82 }
  ];

  const devopsGaps = storageService.calculateSkillGapsForRole('track-devops', mockVerified);
  try {
    assert(devopsGaps.length >= 5, 'DevOps role should have at least 5 required skills');
    pass(`DevOps track has ${devopsGaps.length} required skill gaps`);

    const dockerGap = devopsGaps.find(g => g.skillId === 'docker-containers');
    assert(dockerGap, 'docker-containers must be in DevOps gaps');
    assert.strictEqual(dockerGap.gap, 0, 'docker-containers should be verified with 0 gap');
    assert.strictEqual(dockerGap.status, 'Verified', 'docker-containers status should be Verified');
    pass('Canonical ID matching verified for extension skill (docker-containers, gap = 0)');

    const k8sGap = devopsGaps.find(g => g.skillId === 'kubernetes');
    assert(k8sGap, 'kubernetes must be in DevOps gaps');
    assert(k8sGap.gap > 0, 'kubernetes should have an unverified gap');
    pass('Unverified extension skill (kubernetes) properly calculated with gap > 0');
  } catch (e) { fail('DevOps skill gaps calculation failed', e); }

  // 6. Preservation of 10 Live Tracks
  console.log('\n6. Checking Preservation of 10 Live Skill Tracks...');
  const base10Ids = ['python', 'sql', 'c', 'cpp', 'java', 'javascript', 'htmlcss', 'frontend', 'backend', 'dataanalytics'];
  base10Ids.forEach(id => {
    const courses = famousMentorsCourses[id];
    try {
      assert(Array.isArray(courses) && courses.length > 0, `Skill ${id} must have real mentor courses`);
      assert(courses[0].url.startsWith('http'), `Skill ${id} course URL must be valid HTTP(S)`);
      pass(`Live track "${id}" has ${courses.length} verified courses from "${courses[0].channel}"`);
    } catch (e) { fail(`Live track resource missing for ${id}`, e); }
  });

  console.log('\n========================================================');
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  console.log('========================================================\n');

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
