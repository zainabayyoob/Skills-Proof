import { db } from '../server/db.js';
import { app } from '../server/index.js';
import http from 'http';

let server;
const PORT = 3999;
const BASE_URL = `http://localhost:${PORT}`;

async function startServer() {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`[TestServer] Running on ${BASE_URL}`);
      resolve();
    });
  });
}

async function stopServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => resolve());
    } else {
      resolve();
    }
  });
}

async function apiCall(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n========================================');
  console.log('🧪 RUNNING FACULTY ROLE & RBAC TEST SUITE');
  console.log('========================================\n');

  await startServer();

  const timestamp = Date.now();
  const facultyEmail = `prof.test_${timestamp}@university.edu`;
  const facultyPhone = `91${String(timestamp).slice(-8)}`;
  const studentEmail = `student.test_${timestamp}@university.edu`;
  const studentPhone = `92${String(timestamp).slice(-8)}`;
  const recruiterEmail = `recruiter.test_${timestamp}@company.com`;
  const recruiterPhone = `93${String(timestamp).slice(-8)}`;
  const legacyEmail = `legacy.test_${timestamp}@university.edu`;
  const legacyPhone = `94${String(timestamp).slice(-8)}`;

  let facultyToken = '';
  let facultyUser = null;
  let studentToken = '';
  let recruiterToken = '';

  try {
    // TEST 1: Register Faculty User
    console.log('[Test 1] Register user with role="faculty"');
    const regRes = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Dr. Vikram Sarabhai',
        email: facultyEmail,
        password: 'Password@123',
        phone: facultyPhone,
        countryCode: '+91',
        role: 'faculty',
        college: 'Indian Institute of Science',
        degree: 'Ph.D. Computer Science'
      })
    });

    assert(regRes.status === 201, `Status code is 201 (got ${regRes.status})`);
    assert(Boolean(regRes.data.token), 'Valid JWT token returned');
    assert(regRes.data.user?.role === 'faculty', `User role is "faculty" (got "${regRes.data.user?.role}")`);
    assert(regRes.data.user?.id?.startsWith('SP-FAC-'), `User ID prefix is SP-FAC- (got "${regRes.data.user?.id}")`);

    facultyToken = regRes.data.token;
    facultyUser = regRes.data.user;

    // TEST 2: Login Faculty User
    console.log('\n[Test 2] Authenticate via /api/auth/login');
    const loginRes = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: facultyEmail,
        password: 'Password@123'
      })
    });

    assert(loginRes.status === 200, `Login status 200 (got ${loginRes.status})`);
    assert(loginRes.data.user?.role === 'faculty', `Login user role is "faculty" (got "${loginRes.data.user?.role}")`);

    // TEST 3: /api/auth/me returns role="faculty"
    console.log('\n[Test 3] Verify /api/auth/me returns role="faculty"');
    const meRes = await apiCall('/api/auth/me', {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    assert(meRes.status === 200, `Status 200 (got ${meRes.status})`);
    assert(meRes.data.user?.role === 'faculty', `User role in /me is "faculty" (got "${meRes.data.user?.role}")`);

    // TEST 4: Register Student & Recruiter Users for Cross-Role Matrix
    console.log('\n[Test 4] Register Student and Recruiter test users');
    const studentReg = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Student Tester',
        email: studentEmail,
        password: 'Password@123',
        phone: studentPhone,
        countryCode: '+91',
        role: 'candidate',
        college: 'National Institute of Technology',
        degree: 'B.Tech'
      })
    });
    assert(studentReg.status === 201, `Student registered (role: ${studentReg.data.user?.role})`);
    studentToken = studentReg.data.token;

    const recruiterReg = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Recruiter Tester',
        email: recruiterEmail,
        password: 'Password@123',
        phone: recruiterPhone,
        countryCode: '+91',
        role: 'recruiter'
      })
    });
    assert(recruiterReg.status === 201, `Recruiter registered (role: ${recruiterReg.data.user?.role})`);
    recruiterToken = recruiterReg.data.token;

    // TEST 5: Faculty Access to Faculty Endpoints (both /api/college and /api/faculty)
    console.log('\n[Test 5] Faculty access to faculty endpoints');
    const facStudentsCol = await apiCall('/api/college/students', {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    assert(facStudentsCol.status === 200, `/api/college/students returns 200 for faculty`);

    const facStudentsFac = await apiCall('/api/faculty/students', {
      headers: { Authorization: `Bearer ${facultyToken}` }
    });
    assert(facStudentsFac.status === 200, `/api/faculty/students alias returns 200 for faculty`);

    const createGroupRes = await apiCall('/api/faculty/groups', {
      method: 'POST',
      headers: { Authorization: `Bearer ${facultyToken}` },
      body: JSON.stringify({
        name: 'AI & Systems Cohort 2026',
        department: 'Computer Science',
        studentsCount: 45
      })
    });
    assert(createGroupRes.status === 201, `Faculty can create student cohorts (201 Created)`);

    const createActivityRes = await apiCall('/api/faculty/faculty/activity', {
      method: 'POST',
      headers: { Authorization: `Bearer ${facultyToken}` },
      body: JSON.stringify({
        type: 'FDP',
        title: 'Distributed Systems & Edge Computing Bootcamp',
        partner: 'IIT Bombay Research Lab',
        participants: 60
      })
    });
    assert(createActivityRes.status === 201, `Faculty can log faculty activities (201 Created)`);

    // TEST 6: Student Blocked from Faculty Operations (RBAC)
    console.log('\n[Test 6] Student blocked from faculty operations');
    const stuViewCohorts = await apiCall('/api/college/students', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(stuViewCohorts.status === 403, `Student blocked from viewing cohort rosters (HTTP 403)`);

    const stuCreateGroup = await apiCall('/api/college/groups', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ name: 'Hacked Cohort', department: 'CS' })
    });
    assert(stuCreateGroup.status === 403, `Student blocked from creating cohort (HTTP 403)`);

    const stuAssign = await apiCall('/api/college/assign', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ skillId: 'python', deadline: '2026-10-01' })
    });
    assert(stuAssign.status === 403, `Student blocked from assigning assessments (HTTP 403)`);

    // TEST 7: Recruiter Blocked from Faculty Operations (RBAC)
    console.log('\n[Test 7] Recruiter blocked from faculty operations');
    const recCreateGroup = await apiCall('/api/college/groups', {
      method: 'POST',
      headers: { Authorization: `Bearer ${recruiterToken}` },
      body: JSON.stringify({ name: 'Corporate Cohort' })
    });
    assert(recCreateGroup.status === 403, `Recruiter blocked from creating student cohorts (HTTP 403)`);

    // TEST 8: Faculty Blocked from Recruiter Operations (RBAC)
    console.log('\n[Test 8] Faculty blocked from posting recruiter opportunities');
    const facPostJob = await apiCall('/api/industry/opportunities', {
      method: 'POST',
      headers: { Authorization: `Bearer ${facultyToken}` },
      body: JSON.stringify({ title: 'Unauthorized Job' })
    });
    assert(facPostJob.status === 403, `Faculty blocked from posting recruiter jobs (HTTP 403)`);

    const facShortlist = await apiCall('/api/industry/shortlist', {
      method: 'POST',
      headers: { Authorization: `Bearer ${facultyToken}` },
      body: JSON.stringify({ studentId: 'SP-STU-3RTMJU1T' })
    });
    assert(facShortlist.status === 403, `Faculty blocked from shortlisting candidates (HTTP 403)`);

    // TEST 9: Legacy Role Migration & Backward Compatibility
    console.log('\n[Test 9] Legacy role="college" automatically migrates to "faculty"');
    const legacyReg = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Legacy Dean',
        email: legacyEmail,
        password: 'Password@123',
        phone: legacyPhone,
        countryCode: '+91',
        role: 'college' // Legacy role passed
      })
    });
    assert(legacyReg.status === 201, `Legacy registration succeeded`);
    assert(legacyReg.data.user?.role === 'faculty', `Legacy role "college" mapped to "faculty" in response`);

    const queriedFaculty = db.getUsers({ role: 'faculty' });
    const hasProf = queriedFaculty.some((u) => u.email === facultyEmail);
    const hasLegacy = queriedFaculty.some((u) => u.email === legacyEmail);
    assert(hasProf && hasLegacy, `db.getUsers({ role: 'faculty' }) returns both faculty accounts`);

    const queriedCollege = db.getUsers({ role: 'college' });
    assert(queriedCollege.length === queriedFaculty.length, `db.getUsers({ role: 'college' }) returns mapped faculty accounts`);

  } finally {
    // Clean up temporary test users created during test run to preserve clean data state
    console.log('\n[Cleanup] Removing temporary test records created during test run');
    const data = db.read();
    const testEmails = [facultyEmail, studentEmail, recruiterEmail, legacyEmail];
    data.users = data.users.filter((u) => !testEmails.includes(u.email));
    db.writeSync(data);

    await stopServer();
  }

  console.log('\n========================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
