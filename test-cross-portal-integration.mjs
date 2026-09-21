import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

console.log('====================================================');
console.log(' SKILLPROOF CROSS-PORTAL DATA INTEGRATION TEST SUITE');
console.log(` Target Server: ${BASE_URL}`);
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED [${totalTests}]: ${message}`);
    throw new Error(message);
  } else {
    passedTests++;
    console.log(`✅ PASSED [${totalTests}]: ${message}`);
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, headers: res.headers, data, res };
}

async function runTests() {
  const timestamp = Date.now();
  const testPhoneA = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const testPhoneB = `97${Math.floor(10000000 + Math.random() * 90000000)}`;

  // --------------------------------------------------------------------------
  // STEP 1: Register Student A
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 1: Registering Student A ---');
  const studentAPayload = {
    name: `Devika Sharma ${timestamp}`,
    email: `devika_${timestamp}@university.edu`,
    password: 'SecurePassword123!',
    countryCode: '+91',
    phone: testPhoneA,
    college: 'Delhi Technological University',
    degree: 'B.Tech in Computer Engineering',
    graduationYear: 2026,
    academicYear: '3rd Year',
    semester: '6th Semester',
    targetRole: 'Full Stack Web Developer'
  };

  const regResA = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentAPayload)
  });

  assert(regResA.status === 201, `Student A registered successfully with status 201 (got ${regResA.status})`);
  assert(Boolean(regResA.data.token), 'Registration returned JWT authentication token');
  assert(Boolean(regResA.data.user), 'Registration returned user payload');
  assert(Boolean(regResA.data.user.id), `Generated permanent User ID: ${regResA.data.user.id}`);
  
  const tokenStudentA = regResA.data.token;
  const studentAId = regResA.data.user.id;
  const studentAStudentId = regResA.data.user.studentId || studentAId;

  assert(studentAId.startsWith('usr_'), `User ID follows unified usr_... format: ${studentAId}`);

  // --------------------------------------------------------------------------
  // STEP 2: Update Profile and Technical Portfolio for Student A
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 2: Updating Profile and Technical Portfolio for Student A ---');
  const portfolioData = {
    projects: [
      {
        id: `proj_${timestamp}_1`,
        title: 'Distributed Event Broker',
        description: 'High-throughput append-only event streaming engine written in Go and Node.js.',
        techStack: ['Node.js', 'Go', 'Docker', 'Redis'],
        liveUrl: 'https://eventbroker.skillproof.dev',
        githubUrl: 'https://github.com/devika/eventbroker'
      }
    ],
    certifications: [
      {
        id: `cert_${timestamp}_1`,
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2026-03-15',
        credentialId: 'AWS-CSA-94821'
      }
    ],
    experience: [
      {
        id: `exp_${timestamp}_1`,
        role: 'Backend Engineering Intern',
        company: 'CloudMatrix Technologies',
        duration: 'Jan 2026 - Present',
        description: 'Architected async message queues and reduced API p99 latency by 35%.'
      }
    ],
    achievements: [
      {
        id: `ach_${timestamp}_1`,
        title: '1st Place - National Hackathon 2026',
        date: 'Feb 2026'
      }
    ],
    bio: 'Dedicated backend systems builder interested in fault-tolerant microservices.',
    github: 'https://github.com/devika-sharma',
    linkedin: 'https://linkedin.com/in/devika-sharma'
  };

  const updateProfileRes = await request('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenStudentA}`
    },
    body: JSON.stringify(portfolioData)
  });

  assert(updateProfileRes.status === 200, `Profile update succeeded with 200 (got ${updateProfileRes.status})`);
  assert(updateProfileRes.data.profile.projects?.length === 1, 'Projects persisted in user profile');
  assert(updateProfileRes.data.profile.certifications?.length === 1, 'Certifications persisted in user profile');

  // Verify via dedicated GET /api/profile/portfolio
  const portfolioRes = await request('/api/profile/portfolio', {
    headers: { 'Authorization': `Bearer ${tokenStudentA}` }
  });
  assert(portfolioRes.status === 200, 'GET /api/profile/portfolio succeeded');
  assert(portfolioRes.data.portfolio.projects.length === 1, 'Portfolio endpoint returned persisted projects');
  assert(portfolioRes.data.portfolio.projects[0].title === 'Distributed Event Broker', 'Project title matches');

  // --------------------------------------------------------------------------
  // STEP 3: Upload Real Resume with Magic Bytes for Student A
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 3: Uploading Resume with Magic Byte Validation ---');
  // Create valid PDF binary buffer: starts with %PDF-1.5
  const samplePdfContent = Buffer.from('%PDF-1.5\n%SkillProof Verified Candidate Resume\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
  const base64Resume = samplePdfContent.toString('base64');

  const resumeUploadRes = await request('/api/profile/resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenStudentA}`
    },
    body: JSON.stringify({
      fileName: 'Devika_Sharma_Resume.pdf',
      fileType: 'application/pdf',
      fileDataBase64: `data:application/pdf;base64,${base64Resume}`
    })
  });

  assert(resumeUploadRes.status === 200, `Resume uploaded and verified successfully with 200 (got ${resumeUploadRes.status})`);
  assert(Boolean(resumeUploadRes.data.resume), 'Resume metadata returned');
  assert(resumeUploadRes.data.resume.fileExt === 'pdf', 'File extension verified as PDF');
  assert(fs.existsSync(resumeUploadRes.data.resume.filePath), 'Physical resume file exists on server disk');

  // --------------------------------------------------------------------------
  // STEP 4: Record Verified Skills & Code Challenge for Student A
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 4: Recording Build-Break-Adapt Verified Skills ---');
  const codeVerificationRes = await request('/api/tests/verify-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenStudentA}`
    },
    body: JSON.stringify({
      skillId: 'python',
      skillName: 'Python',
      overallScore: 92,
      isCodingPassed: true,
      roundsEvidence: {
        problemSolving: 95,
        debugging: 90,
        adaptability: 91
      }
    })
  });

  console.log('codeVerificationRes status:', codeVerificationRes.status, 'data:', codeVerificationRes.data);
  assert(codeVerificationRes.status === 200, `Coding challenge recorded and verified with 200 (got ${codeVerificationRes.status})`);
  assert(codeVerificationRes.data.user.verifiedSkills.some(s => s.name === 'Python' && s.score === 92), 'Python verified skill recorded with score 92%');
  const studentPassportHash = codeVerificationRes.data.user.passportHash;
  assert(Boolean(studentPassportHash), `Passport hash generated: ${studentPassportHash}`);

  // --------------------------------------------------------------------------
  // STEP 5: Persistence Across Logout & Login
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 5: Testing Persistence Across Logout & Login ---');
  const loginResA = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: studentAPayload.email,
      password: studentAPayload.password
    })
  });

  assert(loginResA.status === 200, 'Student A logged back in successfully');
  assert(loginResA.data.user.id === studentAId, 'Logged-in user has identical permanent User ID');
  assert(loginResA.data.user.projects.length === 1, 'Projects persisted across login');
  assert(Boolean(loginResA.data.user.resume && loginResA.data.user.resume.filePath), 'Resume metadata persisted across login');
  assert(loginResA.data.user.verifiedSkills.some(s => s.name === 'Python'), 'Verified skills persisted across login');

  // --------------------------------------------------------------------------
  // STEP 6: Direct Single Source of Truth Database File Verification
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 6: Verifying Direct Database File (db.json) ---');
  const dbFilePath = path.join(__dirname, 'server', 'data', 'db.json');
  assert(fs.existsSync(dbFilePath), 'db.json file exists on persistent filesystem');
  const rawDb = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
  const foundUserInDb = rawDb.users.find(u => u.id === studentAId);
  assert(Boolean(foundUserInDb), 'Student A record exists in persistent db.json file');
  assert(foundUserInDb.role === 'candidate', 'Student role is candidate in db.json');
  assert(foundUserInDb.projects?.length === 1, 'Projects found in raw db.json');
  assert(fs.existsSync(foundUserInDb.resume.filePath), 'Physical resume on disk verified from raw db.json pointer');

  // --------------------------------------------------------------------------
  // STEP 7: Industry Portal Candidate Search & Lookup
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 7: Industry Candidate Search & Details Lookup ---');
  // 7A: Search by skill
  const searchSkillRes = await request(`/api/industry/candidates?skill=Python&minScore=80`);
  assert(searchSkillRes.status === 200, 'GET /api/industry/candidates with skill filter succeeded');
  const foundBySkill = searchSkillRes.data.candidates.find(c => c.id === studentAId || c.studentId === studentAStudentId);
  assert(Boolean(foundBySkill), 'Student A found in recruiter candidate search by verified skill');
  assert(foundBySkill.hasResume === true, 'Recruiter candidate card shows hasResume: true');
  assert(foundBySkill.verifiedSkills.some(s => s.name === 'Python' && s.score >= 80), 'Verified skill benchmark score matches');

  // 7B: Search by Student ID
  const searchIdRes = await request(`/api/industry/candidates?search=${studentAId}`);
  assert(searchIdRes.status === 200, 'GET /api/industry/candidates with search query succeeded');
  const foundById = searchIdRes.data.candidates.find(c => c.id === studentAId);
  assert(Boolean(foundById), 'Student A found in recruiter search using unified Student ID');

  // 7C: Candidate detail lookup
  const candDetailRes = await request(`/api/industry/candidates/${studentAId}`);
  assert(candDetailRes.status === 200, 'GET /api/industry/candidates/:studentId succeeded');
  assert(candDetailRes.data.candidate.projects?.length === 1, 'Recruiter candidate inspection includes projects portfolio');
  assert(candDetailRes.data.candidate.experience?.length === 1, 'Recruiter candidate inspection includes experience');

  // --------------------------------------------------------------------------
  // STEP 8: Industry Recruiter Resume Download
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 8: Industry Recruiter Resume Access & Authorization ---');
  // Create an authorized recruiter account
  const recruiterPayload = {
    name: `TechRecruiter ${timestamp}`,
    email: `recruiter_${timestamp}@techscale.io`,
    password: 'RecruiterSecure123!',
    role: 'industry',
    countryCode: '+91',
    phone: `91${Math.floor(10000000 + Math.random() * 90000000)}`
  };

  const regRecruiterRes = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recruiterPayload)
  });
  const tokenRecruiter = regRecruiterRes.data.token;
  assert(Boolean(tokenRecruiter), 'Recruiter account registered with industry role');

  // Recruiter downloads Student A's resume
  const recruiterResumeRes = await fetch(`${BASE_URL}/api/industry/candidates/${studentAId}/resume`, {
    headers: { 'Authorization': `Bearer ${tokenRecruiter}` }
  });
  assert(recruiterResumeRes.status === 200, `Recruiter downloaded Student A's resume with status 200 (got ${recruiterResumeRes.status})`);
  const resumeBufferRecruiter = Buffer.from(await recruiterResumeRes.arrayBuffer());
  assert(resumeBufferRecruiter.toString().startsWith('%PDF-1.5'), 'Downloaded resume content matches original uploaded binary PDF');

  // --------------------------------------------------------------------------
  // STEP 9: Cross-Portal Opportunity Posting & Student Application Flow
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 9: Recruiter Posts Opportunity -> Student Applies -> Status Updates ---');
  const newOppPayload = {
    title: `Lead Systems Intern ${timestamp}`,
    company: 'Apex Data Systems',
    type: 'Internship',
    location: 'Bangalore (Hybrid)',
    workMode: 'Hybrid',
    stipend: '₹55,000 / month',
    description: 'Build mission-critical edge processing pipelines.',
    requiredSkills: [{ name: 'Python', minScore: 80 }],
    openings: 2
  };

  const postOppRes = await request('/api/industry/opportunities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenRecruiter}`
    },
    body: JSON.stringify(newOppPayload)
  });

  assert(postOppRes.status === 201, 'Opportunity posted successfully by Recruiter');
  const createdOppId = postOppRes.data.opportunity.id;
  assert(Boolean(createdOppId), `Created Opportunity ID: ${createdOppId}`);

  // Student A views opportunities
  const studentOppsRes = await request('/api/opportunities', {
    headers: { 'Authorization': `Bearer ${tokenStudentA}` }
  });
  assert(studentOppsRes.status === 200, 'Student fetched opportunities list');
  const foundOpp = studentOppsRes.data.opportunities.find(o => o.id === createdOppId);
  assert(Boolean(foundOpp), 'Student portal immediately reflects new opportunity posted by recruiter');

  // Student A applies to the opportunity
  const applyRes = await request('/api/opportunities/apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenStudentA}`
    },
    body: JSON.stringify({
      opportunityId: createdOppId,
      candidateNote: 'Excited about distributed edge pipelines!'
    })
  });
  assert(applyRes.status === 201, 'Student A applied to the opportunity');
  const applicationId = applyRes.data.application.id;

  // Recruiter views incoming applications
  const recruiterAppsRes = await request('/api/industry/applications', {
    headers: { 'Authorization': `Bearer ${tokenRecruiter}` }
  });
  assert(recruiterAppsRes.status === 200, 'Recruiter retrieved incoming applications');
  const foundApp = recruiterAppsRes.data.applications.find(a => a.id === applicationId);
  assert(Boolean(foundApp), 'Recruiter incoming applications includes Student A submission');
  assert(foundApp.status === 'Applied', 'Initial stage is Applied');

  // Recruiter advances application to 'Interview'
  const updateStageRes = await request(`/api/industry/applications/${applicationId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenRecruiter}`
    },
    body: JSON.stringify({
      status: 'Interview',
      note: 'Selected for technical interview on Friday'
    })
  });
  assert(updateStageRes.status === 200, 'Recruiter updated candidate stage to Interview');

  // Student A views application tracker
  const studentAppsRes = await request('/api/applications', {
    headers: { 'Authorization': `Bearer ${tokenStudentA}` }
  });
  assert(studentAppsRes.status === 200, 'Student fetched application tracker');
  const updatedStudentApp = studentAppsRes.data.applications.find(a => a.id === applicationId);
  assert(Boolean(updatedStudentApp), 'Application found in Student tracker');
  assert(updatedStudentApp.status === 'Interview', 'Student tracker reflects updated status "Interview" from Recruiter');

  // --------------------------------------------------------------------------
  // STEP 10: Faculty / College Portal Telemetry & Student Tracking
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 10: Faculty Telemetry & Cohort Progress Tracking ---');
  // Faculty queries telemetry analytics
  const collegeAnalyticsRes = await request('/api/college/analytics');
  assert(collegeAnalyticsRes.status === 200, 'GET /api/college/analytics succeeded');
  assert(collegeAnalyticsRes.data.analytics.totalStudents > 0, 'Analytics totalStudents reflects real database candidates');
  assert(collegeAnalyticsRes.data.analytics.studentsAssessed > 0, 'Analytics studentsAssessed reflects tested candidates');

  // Faculty queries student list
  const collegeStudentsRes = await request(`/api/college/students?search=${studentAId}`);
  assert(collegeStudentsRes.status === 200, 'Faculty queried registered students list');
  const foundStudentFaculty = collegeStudentsRes.data.students.find(s => s.id === studentAId);
  assert(Boolean(foundStudentFaculty), 'Faculty student list includes Student A');

  // Faculty inspects single student progress
  const studentProgressRes = await request(`/api/college/students/${studentAId}`);
  assert(studentProgressRes.status === 200, 'GET /api/college/students/:studentId succeeded');
  assert(studentProgressRes.data.student.name === studentAPayload.name, 'Student name matches in Faculty detail');
  assert(studentProgressRes.data.student.verifiedSkills.some(s => s.name === 'Python'), 'Student verified skills match in Faculty detail');
  assert(studentProgressRes.data.applications.length >= 1, 'Faculty view shows student applications history');

  // --------------------------------------------------------------------------
  // STEP 11: Security & RBAC Isolation Tests
  // --------------------------------------------------------------------------
  console.log('\n--- STEP 11: Security, RBAC & Isolation Checks ---');
  // Register Student B
  const studentBPayload = {
    name: `Bob Candidate ${timestamp}`,
    email: `bob_${timestamp}@university.edu`,
    password: 'SecurePassword123!',
    countryCode: '+91',
    phone: testPhoneB,
    college: 'Delhi Technological University',
    degree: 'B.Tech in Computer Engineering',
    graduationYear: 2026
  };

  const regResB = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentBPayload)
  });
  const tokenStudentB = regResB.data.token;
  const studentBId = regResB.data.user.id;

  // Student B attempts to download Student A's resume via industry route
  const unauthorizedResumeRes = await fetch(`${BASE_URL}/api/industry/candidates/${studentAId}/resume`, {
    headers: { 'Authorization': `Bearer ${tokenStudentB}` }
  });
  assert(unauthorizedResumeRes.status === 403, `Student B cannot download Student A's resume (expected 403, got ${unauthorizedResumeRes.status})`);

  // Student B attempts to update Student A's application
  const unauthorizedAppEditRes = await request(`/api/applications/${applicationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenStudentB}`
    },
    body: JSON.stringify({ status: 'Hacked' })
  });
  assert(unauthorizedAppEditRes.status === 403, `Student B cannot modify Student A's application (expected 403, got ${unauthorizedAppEditRes.status})`);

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n====================================================');
  console.log(` ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log(' Cross-portal persistent data integration is fully verified.');
  console.log('====================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ TEST RUN TERMINATED WITH ERROR:', err.message);
  process.exit(1);
});
