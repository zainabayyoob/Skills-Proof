// scripts/test-canonical-ids.mjs
// Comprehensive verification suite for Step 2B Canonical IDs

import assert from 'assert';
import { db } from '../server/db.js';
import {
  technologyDomains,
  getDomainById,
  getDomainByName,
  getDomainByIdOrName,
  defaultPrimaryDomainId,
  defaultPrimaryDomain
} from '../src/data/domainsData.js';
import {
  comprehensiveCareerRoles,
  getCareerRoleById,
  getCareerRoleByTitle,
  defaultCareerRoleId,
  defaultCareerRoleTitle
} from '../src/data/careerRolesData.js';
import {
  masterSkillsCatalogue,
  getRecommendedSkillsForStudent
} from '../src/data/skillsRegistry.js';
import { storageService } from '../src/services/storageService.js';

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}:`, err.message);
    throw err;
  }
}

async function asyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}:`, err.message);
    throw err;
  }
}

console.log('\n========================================');
console.log('STEP 2B: CANONICAL IDs VERIFICATION');
console.log('========================================\n');

// --- 1. DOMAIN CANONICAL IDs (18 DOMAINS) ---
console.log('1. Checking Domain Canonical IDs (18 Domains)...');

test('technologyDomains contains exactly 18 canonical domains', () => {
  assert.strictEqual(technologyDomains.length, 18);
});

test('Every domain has a unique, non-empty canonical ID', () => {
  const ids = new Set();
  technologyDomains.forEach((d) => {
    assert(d.id && typeof d.id === 'string' && d.id.trim().length > 0, `Domain ${d.name} missing id`);
    assert(!ids.has(d.id), `Duplicate domain ID: ${d.id}`);
    ids.add(d.id);
  });
  assert.strictEqual(ids.size, 18);
});

test('getDomainById retrieves all 18 domains by their canonical ID', () => {
  technologyDomains.forEach((d) => {
    const found = getDomainById(d.id);
    assert(found, `Failed to find domain by ID: ${d.id}`);
    assert.strictEqual(found.id, d.id);
    assert.strictEqual(found.name, d.name);
  });
});

test('getDomainByIdOrName works for both ID and display name', () => {
  const byId = getDomainByIdOrName('cs-software-dev');
  assert.strictEqual(byId.name, 'Computer Science / Software Development');

  const byName = getDomainByIdOrName('Computer Science / Software Development');
  assert.strictEqual(byName.id, 'cs-software-dev');

  const byPartial = getDomainByIdOrName('Artificial Intelligence');
  assert.strictEqual(byPartial.id, 'ai-ml');
});

test('Fallback handles unknown domain safely', () => {
  const fallback = getDomainByIdOrName('Nonexistent Galaxy Domain');
  assert.strictEqual(fallback.id, defaultPrimaryDomainId);
});

// --- 2. CAREER TRACK CANONICAL IDs (23 TRACKS) ---
console.log('\n2. Checking Career Track Canonical IDs (23 Tracks)...');

test('comprehensiveCareerRoles contains exactly 23 canonical tracks', () => {
  assert.strictEqual(comprehensiveCareerRoles.length, 23);
});

test('Every career track has a unique, non-empty canonical ID starting with track-', () => {
  const ids = new Set();
  comprehensiveCareerRoles.forEach((r) => {
    assert(r.id && r.id.startsWith('track-'), `Role ${r.title} invalid id: ${r.id}`);
    assert(!ids.has(r.id), `Duplicate role ID: ${r.id}`);
    ids.add(r.id);
  });
  assert.strictEqual(ids.size, 23);
});

test('getCareerRoleById retrieves all 23 roles by their canonical ID', () => {
  comprehensiveCareerRoles.forEach((r) => {
    const found = getCareerRoleById(r.id);
    assert(found, `Failed to find role by ID: ${r.id}`);
    assert.strictEqual(found.id, r.id);
    assert.strictEqual(found.title, r.title);
  });
});

test('getCareerRoleByTitle works for ID, exact title, and common aliases', () => {
  const byId = getCareerRoleByTitle('track-fullstack');
  assert.strictEqual(byId.title, 'Full Stack Developer');

  const byTitle = getCareerRoleByTitle('Full Stack Developer');
  assert.strictEqual(byTitle.id, 'track-fullstack');

  const byAlias1 = getCareerRoleByTitle('Full Stack Web Developer');
  assert.strictEqual(byAlias1.id, 'track-fullstack');

  const byAlias2 = getCareerRoleByTitle('Cloud Architect');
  assert.strictEqual(byAlias2.id, 'track-solutions-architect');

  const byAlias3 = getCareerRoleByTitle('Data Scientist / Analyst');
  assert.strictEqual(byAlias3.id, 'track-data-scientist');
});

// --- 3. SKILL CANONICAL IDs (38 SKILLS) ---
console.log('\n3. Checking Canonical Skill IDs (38 Skills)...');

test('masterSkillsCatalogue contains exactly 38 skills with intact IDs', () => {
  assert.strictEqual(masterSkillsCatalogue.length, 38);
  const ids = new Set();
  masterSkillsCatalogue.forEach((s) => {
    assert(s.id && typeof s.id === 'string' && s.id.length > 0);
    assert(!ids.has(s.id), `Duplicate skill ID: ${s.id}`);
    ids.add(s.id);
  });
  assert.strictEqual(ids.size, 38);
});

test('Every required skill in every career track references a valid 38-skill canonical ID', () => {
  const validIds = new Set(masterSkillsCatalogue.map((s) => s.id.toLowerCase()));
  comprehensiveCareerRoles.forEach((track) => {
    track.requiredSkills.forEach((req) => {
      assert(validIds.has(req.id.toLowerCase()), `Track ${track.id} has invalid skill ID ${req.id}`);
    });
  });
});

// --- 4. RECOMMENDATIONS VIA CANONICAL IDs ---
console.log('\n4. Checking Skill Recommendations via Canonical IDs...');

test('getRecommendedSkillsForStudent resolves using canonical IDs', () => {
  const recs = getRecommendedSkillsForStudent({
    domainId: 'cs-software-dev',
    targetRoleId: 'track-swe',
    verifiedSkills: []
  });
  assert(recs.length > 0);
  const sweRole = getCareerRoleById('track-swe');
  const sweReqIds = sweRole.requiredSkills.map((r) => r.id);
  const recIds = recs.map((r) => r.id);
  sweReqIds.forEach((id) => {
    assert(recIds.includes(id), `Missing required track skill ${id} in recommendations`);
  });
});

test('getRecommendedSkillsForStudent resolves legacy profile with title strings', () => {
  const recs = getRecommendedSkillsForStudent({
    primaryDomain: 'Artificial Intelligence & Machine Learning',
    targetRole: 'Data Scientist',
    verifiedSkills: []
  });
  assert(recs.length > 0);
  const recIds = recs.map((r) => r.id);
  assert(recIds.includes('python'));
  assert(recIds.includes('sql'));
});

// --- 5. DYNAMIC SKILL GAP CALCULATIONS VIA CANONICAL IDs ---
console.log('\n5. Checking Skill Gap Calculations via Canonical IDs...');

test('db.calculateSkillGapsForRole matches on canonical skillId', () => {
  const verified = [
    { skillId: 'python', name: 'Python', score: 85 },
    { skillId: 'sql', name: 'SQL', score: 70 }
  ];
  const gaps = db.calculateSkillGapsForRole('track-swe', verified);
  assert(Array.isArray(gaps));

  const pyGap = gaps.find((g) => g.skillId === 'python');
  assert(pyGap);
  assert.strictEqual(pyGap.currentScore, 85);
  assert.strictEqual(pyGap.gap, 0);
  assert.strictEqual(pyGap.status, 'Verified');

  const sqlGap = gaps.find((g) => g.skillId === 'sql');
  assert(sqlGap);
  assert.strictEqual(sqlGap.currentScore, 70);
  assert.strictEqual(sqlGap.requiredScore, 75);
  assert.strictEqual(sqlGap.gap, 5);
  assert.strictEqual(sqlGap.status, 'Moderate Gap');

  const jsGap = gaps.find((g) => g.skillId === 'javascript');
  assert(jsGap);
  assert.strictEqual(jsGap.currentScore, 0);
  assert.strictEqual(jsGap.status, 'Critical Gap');
});

test('storageService.calculateSkillGapsForRole matches on canonical skillId and handles role ID or title', () => {
  const verified = [{ skillId: 'python', name: 'Python', score: 90 }];
  const gapsById = storageService.calculateSkillGapsForRole('track-swe', verified);
  const gapsByTitle = storageService.calculateSkillGapsForRole('Software Engineer / Developer', verified);

  assert.strictEqual(gapsById.length, gapsByTitle.length);
  const pyById = gapsById.find((g) => g.skillId === 'python');
  const pyByTitle = gapsByTitle.find((g) => g.skillId === 'python');
  assert.strictEqual(pyById.gap, 0);
  assert.strictEqual(pyByTitle.gap, 0);
});

// --- 6. STORAGE & DATABASE PERSISTENCE OF CANONICAL IDs ---
console.log('\n6. Checking Profile Creation & Update with Canonical IDs...');

test('db.createUser automatically resolves and stores domainId and targetRoleId', () => {
  const testEmail = `test.user.${Date.now()}@domain-canonical.edu`;
  const created = db.createUser({
    name: 'Canonical Test User',
    email: testEmail,
    role: 'candidate',
    primaryDomain: 'Cybersecurity',
    targetRole: 'Cybersecurity Engineer / Analyst',
    passwordHash: 'dummyhash'
  });

  assert.strictEqual(created.domainId, 'cybersecurity');
  assert.strictEqual(created.primaryDomain, 'Cybersecurity');
  assert.strictEqual(created.targetRoleId, 'track-cybersecurity');
  assert.strictEqual(created.targetRole, 'Cybersecurity Engineer / Analyst');
});

test('db.createUser directly accepts canonical domainId and targetRoleId', () => {
  const testEmail = `test.user.direct.${Date.now()}@domain-canonical.edu`;
  const created = db.createUser({
    name: 'Direct Canonical User',
    email: testEmail,
    role: 'candidate',
    domainId: 'cloud-computing',
    targetRoleId: 'track-devops',
    passwordHash: 'dummyhash'
  });

  assert.strictEqual(created.domainId, 'cloud-computing');
  assert.strictEqual(created.primaryDomain, 'Cloud Computing');
  assert.strictEqual(created.targetRoleId, 'track-devops');
  assert.strictEqual(created.targetRole, 'DevOps Engineer');
});

test('db.updateUser updates domainId and targetRoleId when IDs or names are updated', () => {
  const testEmail = `test.update.${Date.now()}@domain-canonical.edu`;
  const created = db.createUser({
    name: 'Update Canonical User',
    email: testEmail,
    role: 'candidate',
    domainId: 'cs-software-dev',
    targetRoleId: 'track-swe',
    passwordHash: 'dummyhash'
  });

  const updated = db.updateUser(created.id, {
    targetRoleId: 'track-data-eng',
    domainId: 'data-science'
  });

  assert.strictEqual(updated.targetRoleId, 'track-data-eng');
  assert.strictEqual(updated.targetRole, 'Data Engineer');
  assert.strictEqual(updated.domainId, 'data-science');
  assert.strictEqual(updated.primaryDomain, 'Data Science');
});

// --- 7. BACKEND API LIVE HTTP TESTS ---
console.log('\n7. Checking Live Backend API (port 3001)...');

await asyncTest('GET /api/health responds with 200 OK', async () => {
  const res = await fetch('http://localhost:3001/api/health');
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.status, 'online');
});

await asyncTest('POST /api/auth/register supports domainId and targetRoleId', async () => {
  const rand = 9000000000 + Math.floor(Math.random() * 999999999);
  const res = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'API Registration Tester',
      email: `api.test.${Date.now()}.${Math.random().toString(36).substring(2, 6)}@skillproof.edu`,
      password: 'SecurePassword123!',
      countryCode: '+91',
      phone: String(rand),
      domainId: 'cs-software-dev',
      targetRoleId: 'track-frontend'
    })
  });

  const json = await res.json();
  if (res.status !== 201) {
    console.error('Registration failed:', json);
  }
  assert.strictEqual(res.status, 201);
  assert(json.token, 'Token was not returned');
  assert.strictEqual(json.user.domainId, 'cs-software-dev');
  assert.strictEqual(json.user.targetRoleId, 'track-frontend');
  assert.strictEqual(json.user.targetRole, 'Frontend Developer');

  // Test PUT /api/profile with this token
  const putRes = await fetch('http://localhost:3001/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${json.token}`
    },
    body: JSON.stringify({
      targetRoleId: 'track-fullstack',
      domainId: 'cloud-computing'
    })
  });

  assert.strictEqual(putRes.status, 200);
  const putJson = await putRes.json();
  assert.strictEqual(putJson.profile.targetRoleId, 'track-fullstack');
  assert.strictEqual(putJson.profile.targetRole, 'Full Stack Developer');
  assert.strictEqual(putJson.profile.domainId, 'cloud-computing');
  assert.strictEqual(putJson.profile.primaryDomain, 'Cloud Computing');
});

console.log('\n========================================');
console.log(`ALL TESTS PASSED: ${passedTests}/${totalTests}`);
console.log('========================================\n');
