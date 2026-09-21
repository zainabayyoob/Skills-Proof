import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:3001/api';

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
};

async function runTests() {
  console.log('===============================================================');
  console.log('SKILLPROOF USER DATA RESET & REAL USER PERSISTENCE TEST SUITE');
  console.log('===============================================================');

  // -------------------------------------------------------------------------
  console.log('\n[1] Clean Database Baseline Verification');
  // -------------------------------------------------------------------------
  const candRes = await fetch(`${API_BASE}/industry/candidates`).then((r) => r.json());
  assert(Array.isArray(candRes.candidates), 'Industry candidates returned an array');
  assert(candRes.candidates.length === 0, `0 fake candidates on start (found: ${candRes.candidates.length})`);

  const collRes = await fetch(`${API_BASE}/college/students`).then((r) => r.json());
  assert(Array.isArray(collRes.students), 'College students returned an array');
  assert(collRes.students.length === 0, `0 fake students in college view (found: ${collRes.students.length})`);

  const analyticsRes = await fetch(`${API_BASE}/college/analytics`).then((r) => r.json());
  assert(analyticsRes.analytics.totalStudents === 0, `College analytics totalStudents is 0 (found: ${analyticsRes.analytics.totalStudents})`);

  const demoAttempt = await fetch(`${API_BASE}/auth/demo-preset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'candidate' })
  });
  assert(demoAttempt.status === 403, `POST /api/auth/demo-preset is permanently disabled (HTTP 403, got ${demoAttempt.status})`);

  const candResAfterDemo = await fetch(`${API_BASE}/industry/candidates`).then((r) => r.json());
  assert(candResAfterDemo.candidates.length === 0, 'Candidates list remains empty after blocked demo attempt');

  // -------------------------------------------------------------------------
  console.log('\n[2] Real Student A Registration & ID Standardization');
  // -------------------------------------------------------------------------
  const studentAPayload = {
    name: 'Aanya Sen',
    email: 'aanya.sen@university.edu',
    password: 'SecurePass@2026!',
    countryCode: '+91',
    phone: '9876500001',
    college: 'Bengal Institute of Technology',
    degree: 'B.Tech in Computer Science',
    graduationYear: 2026,
    targetRole: 'Full Stack Web Developer'
  };

  const regARes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentAPayload)
  });
  const regAData = await regARes.json();
  assert(regARes.status === 201, `Student A registered with HTTP 201 (status: ${regARes.status})`);

  const studentA = regAData.user;
  const tokenA = regAData.token;
  assert(/^SP-STU-[A-Z0-9]{8}$/.test(studentA.id), `Student A ID has permanent standardized format: ${studentA.id}`);
  assert(studentA.studentId === studentA.id, `studentId matches permanent canonical ID: ${studentA.studentId}`);
  assert(studentA.email === 'aanya.sen@university.edu', `Email normalized: ${studentA.email}`);

  // Upload Resume for Student A
  const samplePdfContent = '%PDF-1.4 sample resume content for Aanya Sen SkillProof 2026';
  const uploadResumeRes = await fetch(`${API_BASE}/profile/resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({
      fileName: 'Aanya_Sen_Resume.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: samplePdfContent.length,
      fileDataBase64: Buffer.from(samplePdfContent).toString('base64'),
      extractedSkills: ['Python', 'SQL', 'FastAPI', 'React']
    })
  });
  const uploadResumeData = await uploadResumeRes.json();
  assert(uploadResumeRes.status === 200, `Student A resume uploaded successfully (status: ${uploadResumeRes.status})`);

  // Update Student A Profile with verified skills & project
  const updateProfileRes = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({
      bio: 'Aspiring Full Stack Engineer passionate about high-throughput APIs and React interfaces.',
      github: 'https://github.com/aanya-sen',
      linkedin: 'https://linkedin.com/in/aanya-sen',
      verifiedSkills: [
        { name: 'Python', skillId: 'python', score: 88, level: 'Advanced', verifiedAt: '2026-09-19', badge: 'Gold' },
        { name: 'SQL', skillId: 'sql', score: 84, level: 'Proficient', verifiedAt: '2026-09-19', badge: 'Silver' }
      ],
      projects: [
        { id: 'proj-1', title: 'Distributed Event Broker', description: 'Zero-loss pub/sub engine built with Python asyncio.' }
      ]
    })
  });
  const updateProfileData = await updateProfileRes.json();
  assert(updateProfileRes.status === 200, 'Student A profile updated with verified skills and project');

  // Verify persistence after re-login
  const loginARes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aanya.sen@university.edu', password: 'SecurePass@2026!' })
  });
  const loginAData = await loginARes.json();
  assert(loginARes.status === 200, 'Student A logged back in successfully');
  assert(loginAData.user.id === studentA.id, `User ID persisted identically: ${loginAData.user.id}`);
  assert(loginAData.user.verifiedSkills.length === 2, `Verified skills persisted (count: ${loginAData.user.verifiedSkills.length})`);
  assert(Boolean(loginAData.user.resume), 'Resume metadata persisted');

  // -------------------------------------------------------------------------
  console.log('\n[3] Student B Registration & Data Isolation Check');
  // -------------------------------------------------------------------------
  const studentBPayload = {
    name: 'Devansh Kulkarni',
    email: 'devansh.k@institute.ac.in',
    password: 'DevanshPass@2026!',
    countryCode: '+91',
    phone: '9876500002',
    college: 'National Institute of Engineering',
    degree: 'B.Tech in Information Technology',
    graduationYear: 2026,
    targetRole: 'Cloud & DevOps Engineer'
  };

  const regBRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentBPayload)
  });
  const regBData = await regBRes.json();
  assert(regBRes.status === 201, `Student B registered with HTTP 201 (status: ${regBRes.status})`);

  const studentB = regBData.user;
  const tokenB = regBData.token;
  assert(/^SP-STU-[A-Z0-9]{8}$/.test(studentB.id), `Student B ID has permanent standardized format: ${studentB.id}`);
  assert(studentB.id !== studentA.id, `Student B ID is uniquely distinct from Student A (${studentB.id} !== ${studentA.id})`);

  // Student B attempts to download Student A's resume -> Must be 403 Forbidden
  const forbiddenDownloadRes = await fetch(`${API_BASE}/industry/candidates/${studentA.id}/resume`, {
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  assert(forbiddenDownloadRes.status === 403, `Student B cannot access Student A's resume (HTTP 403, got ${forbiddenDownloadRes.status})`);

  // -------------------------------------------------------------------------
  console.log('\n[4] Industry Recruiter Candidate Search by Permanent ID');
  // -------------------------------------------------------------------------
  // Register Real Recruiter
  const recruiterPayload = {
    name: 'Vikram Mehta',
    email: 'recruiter.vikram@techinnovations.com',
    password: 'RecruiterPass@2026!',
    countryCode: '+91',
    phone: '9876500003',
    role: 'industry',
    college: 'Tech Innovations HQ',
    targetRole: 'Engineering Talent Acquisition'
  };

  const regRecruiterRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recruiterPayload)
  });
  const regRecruiterData = await regRecruiterRes.json();
  assert(regRecruiterRes.status === 201, 'Real Industry Recruiter registered successfully');
  const tokenRecruiter = regRecruiterData.token;

  // Search all candidates
  const allCandidatesRes = await fetch(`${API_BASE}/industry/candidates`).then((r) => r.json());
  assert(allCandidatesRes.candidates.length === 2, `Industry candidates returns exactly the 2 real students (found: ${allCandidatesRes.candidates.length})`);

  // Search candidate by Student A's permanent ID
  const searchByIdRes = await fetch(`${API_BASE}/industry/candidates?studentId=${studentA.id}`).then((r) => r.json());
  assert(searchByIdRes.candidates.length === 1, `Candidate search by ID '${studentA.id}' found exactly 1 result`);
  assert(searchByIdRes.candidates[0].name === 'Aanya Sen', `Returned candidate matches Student A (${searchByIdRes.candidates[0].name})`);

  // Recruiter downloads Student A's resume
  const recruiterResumeRes = await fetch(`${API_BASE}/industry/candidates/${studentA.id}/resume`, {
    headers: { Authorization: `Bearer ${tokenRecruiter}` }
  });
  assert(recruiterResumeRes.status === 200, `Authorized Recruiter successfully downloaded Student A's resume (HTTP 200, got ${recruiterResumeRes.status})`);
  const downloadedText = await recruiterResumeRes.text();
  assert(downloadedText === samplePdfContent, 'Downloaded resume binary content matches original upload exactly');

  // -------------------------------------------------------------------------
  console.log('\n[5] Faculty Telemetry & Cohort Monitoring');
  // -------------------------------------------------------------------------
  const facultyStudentsRes = await fetch(`${API_BASE}/college/students`).then((r) => r.json());
  assert(facultyStudentsRes.students.length === 2, `Faculty cohort lists exactly the 2 real students (found: ${facultyStudentsRes.students.length})`);

  const facultyDetailRes = await fetch(`${API_BASE}/college/students/${studentA.id}`).then((r) => r.json());
  assert(facultyDetailRes.student.name === 'Aanya Sen', `Faculty can inspect Student A: ${facultyDetailRes.student.name}`);
  assert(facultyDetailRes.student.verifiedSkills.length === 2, `Faculty inspects Student A verified skills: ${facultyDetailRes.student.verifiedSkills.length}`);

  const facultyAnalytics = await fetch(`${API_BASE}/college/analytics`).then((r) => r.json());
  assert(facultyAnalytics.analytics.totalStudents === 2, `Faculty analytics reflects 2 registered students (found: ${facultyAnalytics.analytics.totalStudents})`);

  // -------------------------------------------------------------------------
  console.log('\n[6] Host / Admin User Management & Safe Deactivation');
  // -------------------------------------------------------------------------
  // Login as Host / Admin
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@skillproof.org', password: 'Admin@SkillProof2026!' })
  });
  const adminLoginData = await adminLoginRes.json();
  assert(adminLoginRes.status === 200, `Host / Admin logged in successfully (HTTP 200, role: ${adminLoginData.user.role})`);
  const tokenAdmin = adminLoginData.token;

  // Admin stats
  const adminStatsRes = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` }
  }).then((r) => r.json());
  assert(adminStatsRes.totalUsers === 4, `Admin stats reports 4 total users (1 admin, 2 students, 1 recruiter) (found: ${adminStatsRes.totalUsers})`);
  assert(adminStatsRes.candidatesCount === 2, `Admin stats reports 2 candidate accounts (found: ${adminStatsRes.candidatesCount})`);
  assert(adminStatsRes.activeCandidatesCount === 2, `Admin stats reports 2 active candidate accounts`);

  // Search user by Student A permanent ID in Admin
  const adminSearchRes = await fetch(`${API_BASE}/admin/users?search=${studentA.id}`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` }
  }).then((r) => r.json());
  assert(adminSearchRes.users.length === 1, `Admin search by ID found Student A`);
  assert(adminSearchRes.users[0].email === 'aanya.sen@university.edu', 'Admin search result matches Student A email');

  // Deactivate Student A
  const deactivateRes = await fetch(`${API_BASE}/admin/users/${studentA.id}/deactivate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenAdmin}` }
  });
  const deactivateData = await deactivateRes.json();
  assert(deactivateRes.status === 200, `Student A safely deactivated (status: ${deactivateRes.status})`);
  assert(deactivateData.user.isDeactivated === true, 'User record marked isDeactivated = true');

  // Verify Student A is immediately excluded from Industry Candidate Search
  const postDeactivateCandidates = await fetch(`${API_BASE}/industry/candidates`).then((r) => r.json());
  assert(postDeactivateCandidates.candidates.length === 1, `Industry search now returns only 1 active candidate (found: ${postDeactivateCandidates.candidates.length})`);
  assert(postDeactivateCandidates.candidates[0].id === studentB.id, `Only Student B remains visible in talent search (${postDeactivateCandidates.candidates[0].id})`);

  // Verify Student A cannot log in while deactivated
  const blockedLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aanya.sen@university.edu', password: 'SecurePass@2026!' })
  });
  assert(blockedLoginRes.status === 403, `Deactivated user blocked from login with HTTP 403 (got: ${blockedLoginRes.status})`);

  // Reactivate Student A
  const reactivateRes = await fetch(`${API_BASE}/admin/users/${studentA.id}/reactivate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenAdmin}` }
  });
  assert(reactivateRes.status === 200, `Student A reactivated successfully (status: ${reactivateRes.status})`);

  // Student A can log in again
  const restoredLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aanya.sen@university.edu', password: 'SecurePass@2026!' })
  });
  assert(restoredLoginRes.status === 200, `Reactivated student logged in successfully (HTTP 200)`);

  // -------------------------------------------------------------------------
  console.log('\n[7] Host / Admin User Permanent Removal (Purge & Cascading)');
  // -------------------------------------------------------------------------
  // Register a temporary user to test permanent removal
  const tempUserPayload = {
    name: 'Temporary Test Candidate',
    email: 'temp.candidate@domain.edu',
    password: 'TempPass@2026!',
    countryCode: '+91',
    phone: '9876500004'
  };

  const regTempRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tempUserPayload)
  });
  const regTempData = await regTempRes.json();
  const tempUser = regTempData.user;
  const tempToken = regTempData.token;

  // Upload temp resume
  await fetch(`${API_BASE}/profile/resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tempToken}` },
    body: JSON.stringify({
      fileName: 'temp_resume.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: 100,
      fileDataBase64: Buffer.from('%PDF-1.4 temp file').toString('base64'),
      extractedSkills: ['Java']
    })
  });

  // Non-admin attempts to delete user -> 403
  const unauthorizedDeleteRes = await fetch(`${API_BASE}/admin/users/${tempUser.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  assert(unauthorizedDeleteRes.status === 403, `Non-admin user cannot delete users (HTTP 403, got ${unauthorizedDeleteRes.status})`);

  // Host/Admin deletes temp user
  const adminDeleteRes = await fetch(`${API_BASE}/admin/users/${tempUser.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenAdmin}` }
  });
  assert(adminDeleteRes.status === 200, `Admin successfully removed temp user (HTTP 200, got ${adminDeleteRes.status})`);

  // Confirm temp user does not exist in db
  const postDeleteUserRes = await fetch(`${API_BASE}/admin/users/${tempUser.id}`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` }
  });
  assert(postDeleteUserRes.status === 404, `Deleted user returns 404 Not Found (got: ${postDeleteUserRes.status})`);

  console.log('\n===============================================================');
  console.log('🎉 ALL USER DATA RESET & REAL USER PERSISTENCE TESTS PASSED!');
  console.log('===============================================================\n');
}

runTests().catch((err) => {
  console.error('Test run failed with unhandled exception:', err);
  process.exit(1);
});
