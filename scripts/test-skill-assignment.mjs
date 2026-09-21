// scripts/test-skill-assignment.mjs
// Automated Verification for Domain -> Career Track -> Skill Assignment

import { masterSkillsCatalogue, getRecommendedSkillsForStudent, getSkillById } from '../src/data/skillsRegistry.js';
import { comprehensiveCareerRoles } from '../src/data/careerRolesData.js';
import fs from 'fs';

const BASE_URL = 'http://localhost:3001';

async function runTests() {
  console.log('================================================================');
  console.log('  STARTING SKILL ASSIGNMENT & RECOMMENDATION VERIFICATION SUITE');
  console.log('================================================================\n');

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
  // TEST 1: Master Registry Integrity & Canonical IDs
  // -------------------------------------------------------------
  console.log('\n--- TEST 1: Central Master Skills Registry Integrity ---');
  assert(Array.isArray(masterSkillsCatalogue), 'masterSkillsCatalogue is an array');
  assert(masterSkillsCatalogue.length === 38, `masterSkillsCatalogue contains exactly 38 canonical skills (found: ${masterSkillsCatalogue.length})`);

  const uniqueIds = new Set(masterSkillsCatalogue.map(s => s.id));
  assert(uniqueIds.size === 38, 'All 38 canonical skill IDs are unique with no duplicates');

  const assessedSkills = masterSkillsCatalogue.filter(s => s.hasAssessment);
  assert(assessedSkills.length === 10, `Exactly 10 skills have functional interactive sandboxes (found: ${assessedSkills.length})`);
  
  const expectedLive = ['python', 'sql', 'c', 'cpp', 'java', 'javascript', 'htmlcss', 'frontend', 'backend', 'dataanalytics'];
  const actualLive = assessedSkills.map(s => s.id);
  assert(expectedLive.every(id => actualLive.includes(id)), 'Live skills match exact 10 interactive sandboxes');

  const inDevSkills = masterSkillsCatalogue.filter(s => !s.hasAssessment);
  assert(inDevSkills.length === 28, `Exactly 28 extension skills are marked hasAssessment: false (found: ${inDevSkills.length})`);
  assert(inDevSkills.every(s => s.status.includes('In Development')), 'All non-assessed skills explicitly state "In Development"');

  // -------------------------------------------------------------
  // TEST 2: Career Track Mapping in comprehensiveCareerRoles
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: Career Tracks Skill Alignment ---');
  assert(Array.isArray(comprehensiveCareerRoles), 'comprehensiveCareerRoles is an array');
  assert(comprehensiveCareerRoles.length >= 20, `Contains all canonical tech roles (found: ${comprehensiveCareerRoles.length})`);

  // Ensure all requiredSkills in all career tracks exist in the masterSkillsCatalogue
  comprehensiveCareerRoles.forEach(track => {
    track.requiredSkills.forEach(req => {
      const found = getSkillById(req.id);
      assert(!!found, `Track "${track.title}" skill ID "${req.id}" exists in master registry`);
    });
  });

  // -------------------------------------------------------------
  // TEST 3: Six Target Student Personas Recommendations
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: Persona-Specific Skill Recommendations ---');

  // Persona 1: AI / Machine Learning
  console.log('\n[Persona 1: AI / Machine Learning Engineer]');
  const p1Skills = getRecommendedSkillsForStudent({
    primaryDomain: 'Artificial Intelligence & Machine Learning',
    secondaryDomains: ['Deep Learning & Neural Networks', 'Generative AI & LLMs'],
    targetRole: 'Machine Learning Engineer'
  });
  console.log('Recommended IDs:', p1Skills.map(s => s.id).join(', '));
  assert(p1Skills.length >= 6, 'AI/ML persona gets at least 6 recommendations');
  assert(p1Skills.some(s => s.id === 'python'), 'Includes Python');
  assert(p1Skills.some(s => s.id === 'machine-learning'), 'Includes Machine Learning');
  assert(p1Skills.some(s => s.id === 'deep-learning'), 'Includes Deep Learning');
  assert(p1Skills.some(s => s.id === 'pandas'), 'Includes Pandas');
  assert(p1Skills.some(s => s.id === 'numpy'), 'Includes NumPy');
  assert(p1Skills.some(s => s.id === 'statistics'), 'Includes Statistics');

  // Persona 2: Data Science
  console.log('\n[Persona 2: Data Scientist]');
  const p2Skills = getRecommendedSkillsForStudent({
    primaryDomain: 'Data Science',
    secondaryDomains: ['Statistics & Probability', 'Data Analytics'],
    targetRole: 'Data Scientist'
  });
  console.log('Recommended IDs:', p2Skills.map(s => s.id).join(', '));
  assert(p2Skills.length >= 6, 'Data Science persona gets at least 6 recommendations');
  assert(p2Skills.some(s => s.id === 'python'), 'Includes Python');
  assert(p2Skills.some(s => s.id === 'sql'), 'Includes SQL');
  assert(p2Skills.some(s => s.id === 'statistics'), 'Includes Statistics');
  assert(p2Skills.some(s => s.id === 'pandas'), 'Includes Pandas');
  assert(p2Skills.some(s => s.id === 'dataanalytics'), 'Includes Data Analytics');

  // Persona 3: Cybersecurity
  console.log('\n[Persona 3: Cybersecurity Analyst / Engineer]');
  const p3Skills = getRecommendedSkillsForStudent({
    primaryDomain: 'Cybersecurity',
    secondaryDomains: ['Network Security', 'Penetration Testing / Ethical Hacking'],
    targetRole: 'Cybersecurity Engineer / Analyst'
  });
  console.log('Recommended IDs:', p3Skills.map(s => s.id).join(', '));
  assert(p3Skills.length >= 6, 'Cybersecurity persona gets at least 6 recommendations');
  assert(p3Skills.some(s => s.id === 'network-security'), 'Includes Network Security');
  assert(p3Skills.some(s => s.id === 'linux-systems'), 'Includes Linux Systems');
  assert(p3Skills.some(s => s.id === 'cybersecurity-fundamentals'), 'Includes Cybersecurity Fundamentals');
  assert(p3Skills.some(s => s.id === 'web-security'), 'Includes Web Security');
  assert(p3Skills.some(s => s.id === 'auth-iam'), 'Includes Auth & IAM');

  // Persona 4: Frontend Development
  console.log('\n[Persona 4: Frontend Developer]');
  const p4Skills = getRecommendedSkillsForStudent({
    primaryDomain: 'Web Development',
    secondaryDomains: ['React / Frontend Frameworks', 'UI/UX Design'],
    targetRole: 'Frontend Developer'
  });
  console.log('Recommended IDs:', p4Skills.map(s => s.id).join(', '));
  assert(p4Skills.length >= 5, 'Frontend persona gets at least 5 recommendations');
  assert(p4Skills.some(s => s.id === 'htmlcss'), 'Includes HTML/CSS');
  assert(p4Skills.some(s => s.id === 'javascript'), 'Includes JavaScript');
  assert(p4Skills.some(s => s.id === 'frontend'), 'Includes Frontend');
  assert(p4Skills.some(s => s.id === 'typescript'), 'Includes TypeScript');
  assert(p4Skills.some(s => s.id === 'ui-design-systems'), 'Includes UI Design Systems');

  // Persona 5: Backend Development
  console.log('\n[Persona 5: Backend Developer]');
  const p5Skills = getRecommendedSkillsForStudent({
    primaryDomain: 'Computer Science / Software Development',
    secondaryDomains: ['API Architecture & Microservices', 'Databases & SQL'],
    targetRole: 'Backend Developer'
  });
  console.log('Recommended IDs:', p5Skills.map(s => s.id).join(', '));
  assert(p5Skills.length >= 5, 'Backend persona gets at least 5 recommendations');
  assert(p5Skills.some(s => s.id === 'backend'), 'Includes Backend');
  assert(p5Skills.some(s => s.id === 'sql'), 'Includes SQL');
  assert(p5Skills.some(s => s.id === 'python'), 'Includes Python');
  assert(p5Skills.some(s => s.id === 'java'), 'Includes Java');
  assert(p5Skills.some(s => s.id === 'rest-apis'), 'Includes REST APIs');

  // Persona 6: Cloud / DevOps
  console.log('\n[Persona 6: DevOps Engineer]');
  const p6Skills = getRecommendedSkillsForStudent({
    primaryDomain: 'Cloud Computing',
    secondaryDomains: ['Docker & Containerization', 'Kubernetes Orchestration', 'CI/CD Pipelines'],
    targetRole: 'DevOps Engineer'
  });
  console.log('Recommended IDs:', p6Skills.map(s => s.id).join(', '));
  assert(p6Skills.length >= 5, 'DevOps persona gets at least 5 recommendations');
  assert(p6Skills.some(s => s.id === 'cloud-fundamentals'), 'Includes Cloud Fundamentals');
  assert(p6Skills.some(s => s.id === 'docker-containers'), 'Includes Docker Containers');
  assert(p6Skills.some(s => s.id === 'kubernetes'), 'Includes Kubernetes');
  assert(p6Skills.some(s => s.id === 'cicd-automation'), 'Includes CI/CD Automation');
  assert(p6Skills.some(s => s.id === 'linux-systems'), 'Includes Linux Systems');

  // -------------------------------------------------------------
  // TEST 4: Backend Integration & Question Bank Isolation
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: Backend API & Quiz Gate Integrity ---');

  // 4a. Live skill (python) must successfully start a quiz
  const liveQuizRes = await fetch(`${BASE_URL}/api/tests/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillId: 'python' })
  });
  const liveQuizData = await liveQuizRes.json();
  assert(liveQuizRes.status === 200 || liveQuizRes.status === 201, `Starting Python quiz returns 200/201 (got: ${liveQuizRes.status})`);
  assert(liveQuizData.questions && liveQuizData.questions.length >= 20, `Python quiz returns 20+ questions (got: ${liveQuizData.questions?.length})`);

  // 4b. In-development skill (machine-learning) must return 404 (no fake questions allowed)
  const inDevQuizRes = await fetch(`${BASE_URL}/api/tests/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillId: 'machine-learning' })
  });
  assert(inDevQuizRes.status === 404, `Starting In-Dev skill (machine-learning) quiz returns 404 (got: ${inDevQuizRes.status})`);
  const inDevQuizData = await inDevQuizRes.json();
  assert(inDevQuizData.error.includes('No questions found'), `Proper 404 error returned: "${inDevQuizData.error}"`);

  // -------------------------------------------------------------
  // TEST 5: Full Registration, Profile Persistence, & Dynamic Track Switching
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: User Persistence & Dynamic Track Switch ---');
  const testEmail = `skilltest.${Date.now()}@domain-test.edu`;
  const testPassword = 'Password@2026!';
  const testPhone = `97${Math.floor(10000000 + Math.random() * 90000000)}`;

  // 5a. Register new user as Frontend Developer
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Mehta',
      email: testEmail,
      countryCode: '+91',
      phone: testPhone,
      password: testPassword,
      college: 'Delhi Technological University (DTU)',
      collegeId: 'dtu-delhi',
      degree: 'B.Tech (Bachelor of Technology)',
      academicYear: '4th Year',
      semester: '7th Semester',
      gender: 'Male',
      primaryDomain: 'Web Development',
      secondaryDomains: ['React / Frontend Frameworks'],
      targetRole: 'Frontend Developer'
    })
  });
  const regData = await regRes.json();
  assert(regRes.status === 201, 'Student registered successfully');
  const token = regData.token;
  const userId = regData.user.id;

  // 5b. Initial recommendations for Frontend Developer
  const frontendRecs = getRecommendedSkillsForStudent({
    primaryDomain: regData.user.primaryDomain,
    secondaryDomains: regData.user.secondaryDomains,
    targetRole: regData.user.targetRole
  });
  assert(frontendRecs.some(s => s.id === 'frontend'), 'Initial recommendation contains frontend');
  assert(!frontendRecs.some(s => s.id === 'kubernetes'), 'Initial recommendation does NOT contain kubernetes');

  // 5c. Update Target Role to "DevOps Engineer" and Primary Domain to "Cloud Computing"
  const updateRes = await fetch(`${BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      primaryDomain: 'Cloud Computing',
      secondaryDomains: ['Docker & Containerization', 'Kubernetes Orchestration'],
      targetRole: 'DevOps Engineer'
    })
  });
  const updateData = await updateRes.json();
  assert(updateRes.status === 200, 'Profile updated successfully to Cloud/DevOps');
  assert(updateData.user.targetRole === 'DevOps Engineer', 'Target role successfully changed to DevOps Engineer');
  assert(updateData.user.primaryDomain === 'Cloud Computing', 'Primary domain changed to Cloud Computing');

  // 5d. Recommendations immediately switch to DevOps skills
  const devopsRecs = getRecommendedSkillsForStudent({
    primaryDomain: updateData.user.primaryDomain,
    secondaryDomains: updateData.user.secondaryDomains,
    targetRole: updateData.user.targetRole
  });
  assert(devopsRecs.some(s => s.id === 'cloud-fundamentals'), 'Updated recommendations contain cloud-fundamentals');
  assert(devopsRecs.some(s => s.id === 'docker-containers'), 'Updated recommendations contain docker-containers');
  assert(devopsRecs.some(s => s.id === 'kubernetes'), 'Updated recommendations contain kubernetes');

  // 5e. Verify persistence in db.json across fresh login
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200, 'Student re-login successfully');
  assert(loginData.user.targetRole === 'DevOps Engineer', 'Persisted targetRole is DevOps Engineer after login');
  assert(loginData.user.primaryDomain === 'Cloud Computing', 'Persisted primaryDomain is Cloud Computing after login');

  // 5f. Clean up test user from db.json
  const dbPath = 'server/data/db.json';
  if (fs.existsSync(dbPath)) {
    const rawDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const beforeCount = rawDb.users.length;
    rawDb.users = rawDb.users.filter(u => u.id !== userId);
    fs.writeFileSync(dbPath, JSON.stringify(rawDb, null, 2), 'utf8');
    assert(rawDb.users.length === beforeCount - 1, `Cleaned up test user ${userId} from database`);
  }

  console.log('\n================================================================');
  console.log(`  ALL ${passedChecks}/${totalChecks} TESTS PASSED PERFECTLY! (100% SUCCESS)`);
  console.log('================================================================\n');
}

runTests().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
