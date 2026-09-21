// test-account-profile.mjs
// Comprehensive automated test suite for SkillProof Sign In / Create Account & Profile Persistence
// Testing requirements A through O

import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3001/api';
let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`✅ PASS: ${message}`);
}

async function run() {
  console.log('====================================================');
  console.log('Starting SkillProof Account & Profile Persistence Tests');
  console.log('====================================================\n');

  // Test data
  const testSuffix = Date.now().toString().slice(-6);
  const testEmail = `candidate_${testSuffix}@example.com`;
  const testPassword = 'Password123!';
  const testPhone = '98765' + testSuffix.slice(-5); // 10 digits

  let candidateToken = '';
  let candidateId = '';

  // -----------------------------------------------------------
  // Requirement C: Phone Number Validation (India +91 strict 10 digits)
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirement C: Strict Phone Number Validation ---');
  {
    // Test C1: 9 digits with +91 should be rejected (HTTP 400)
    const res9 = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Nine',
        email: `nine_${testSuffix}@example.com`,
        password: testPassword,
        countryCode: '+91',
        phone: '987654321', // 9 digits
        degree: 'B.Tech',
        academicYear: '3rd Year',
        semester: 6,
        targetRole: 'Full Stack Engineer'
      })
    });
    assert(res9.status === 400, 'India +91 phone with 9 digits is rejected with 400 Bad Request');
    const err9 = await res9.json();
    assert(err9.error && err9.error.includes('10 digits'), 'Error message specifies 10 digits required for India');

    // Test C2: 11 digits with +91 should be rejected (HTTP 400)
    const res11 = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Eleven',
        email: `eleven_${testSuffix}@example.com`,
        password: testPassword,
        countryCode: '+91',
        phone: '98765432101', // 11 digits
        degree: 'B.Tech',
        academicYear: '3rd Year',
        semester: 6,
        targetRole: 'Full Stack Engineer'
      })
    });
    assert(res11.status === 400, 'India +91 phone with 11 digits is rejected with 400 Bad Request');
  }

  // -----------------------------------------------------------
  // Requirement A: New Candidate Account Registration & Unique ID
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirement A: New Candidate Registration & Persistent ID ---');
  {
    const registerPayload = {
      name: 'Priya Sharma',
      email: testEmail,
      password: testPassword,
      countryCode: '+91',
      phone: testPhone,
      collegeId: 'iit_bombay',
      college: 'Indian Institute of Technology Bombay',
      degree: 'B.Tech',
      academicYear: '3rd Year',
      semester: 5,
      targetRole: 'Cloud Solutions Architect',
      gender: 'Female'
    };

    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload)
    });

    assert(res.status === 201, 'Registration returns 201 Created');
    const data = await res.json();
    assert(data.token, 'Registration returns JWT auth token');
    assert(data.user, 'Registration returns user object');
    assert(data.user.id && data.user.id.startsWith('usr_'), `User ID is unique and prefixed with usr_ (${data.user.id})`);
    assert(data.user.email === testEmail, 'User email matches registered email');
    assert(data.user.countryCode === '+91', 'Country code is stored as +91');
    assert(data.user.phone === testPhone, 'Phone number is stored as 10 digits');
    assert(data.user.collegeId === 'iit_bombay', 'College ID is stored as iit_bombay');
    assert(data.user.college === 'Indian Institute of Technology Bombay', 'College display name stored');
    assert(data.user.degree === 'B.Tech', 'Degree stored as B.Tech');
    assert(data.user.academicYear === '3rd Year', 'Academic Year stored as 3rd Year');
    assert(String(data.user.semester) === '5', 'Semester stored as 5');
    assert(data.user.targetRole === 'Cloud Solutions Architect', 'Target career track stored');
    assert(data.user.gender === 'Female', 'Gender stored as Female');
    assert(data.user.emailVerified === false, 'emailVerified is initialized to false');
    assert(data.user.phoneVerified === false, 'phoneVerified is initialized to false');
    assert(!data.user.passwordHash && !data.user.password, 'passwordHash and password are NOT returned in response');
    assert(!data.user.emailVerificationCode && !data.user.phoneVerificationCode, 'Verification codes are NOT leaked in response');

    candidateToken = data.token;
    candidateId = data.user.id;

    // Verify DB file persistence
    const dbPath = path.resolve('server/data/db.json');
    const rawDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const savedUser = rawDb.users.find(u => u.id === candidateId);
    assert(savedUser !== undefined, 'User record is persistently written to server/data/db.json');
    assert(savedUser.passwordHash && savedUser.passwordHash.length > 20, 'Password is securely hashed in database');
    assert(savedUser.emailVerificationCode && savedUser.emailVerificationCode.code, 'Database contains email verification code record');
  }

  // -----------------------------------------------------------
  // Requirement B: Duplicate Email Registration Rejection
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirement B: Duplicate Email Rejection ---');
  {
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Imposter Priya',
        email: testEmail, // Duplicate!
        password: 'OtherPassword!',
        countryCode: '+91',
        phone: '9123456780',
        degree: 'B.Tech',
        academicYear: '2nd Year',
        semester: 3,
        targetRole: 'Data Engineer'
      })
    });
    assert(dupRes.status === 409, 'Duplicate email returns 409 Conflict');
    const dupData = await dupRes.json();
    assert(dupData.error && dupData.error.toLowerCase().includes('already exists'), 'Conflict error informs email is registered');
  }

  // -----------------------------------------------------------
  // Requirement D: Email Verification Flow
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirement D: Real Email Verification Flow ---');
  {
    // Retrieve the actual generated verification code from the database
    const dbPath = path.resolve('server/data/db.json');
    let rawDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    let dbUser = rawDb.users.find(u => u.id === candidateId);
    const validEmailCode = dbUser.emailVerificationCode.code;
    assert(typeof validEmailCode === 'string' && validEmailCode.length === 6, `Email verification code is a 6-digit string (${validEmailCode})`);

    // Test Resend verification code (before verification)
    const resendRes = await fetch(`${BASE_URL}/auth/resend-email-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      }
    });
    assert(resendRes.status === 200, 'Resend email verification code returns 200 OK');
    rawDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    dbUser = rawDb.users.find(u => u.id === candidateId);
    const newEmailCode = dbUser.emailVerificationCode.code;
    assert(newEmailCode !== validEmailCode, 'Resend generated a new, distinct verification code');

    // Test old superseded code is rejected
    const oldRes = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      },
      body: JSON.stringify({ code: validEmailCode })
    });
    assert(oldRes.status === 400, 'Old superseded email verification code is rejected (400)');

    // Test invalid code
    const invRes = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      },
      body: JSON.stringify({ code: '000000' })
    });
    assert(invRes.status === 400, 'Invalid email verification code returns 400 Bad Request');

    // Test valid newly generated code
    const validRes = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      },
      body: JSON.stringify({ code: newEmailCode })
    });
    assert(validRes.status === 200, 'Valid email verification code returns 200 OK');
    const verifiedData = await validRes.json();
    assert(verifiedData.user.emailVerified === true, 'Response indicates emailVerified is now true');

    // Verify DB updated
    rawDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    dbUser = rawDb.users.find(u => u.id === candidateId);
    assert(dbUser.emailVerified === true, 'Database has persisted emailVerified: true');
    assert(dbUser.emailVerificationCode.used === true, 'Code marked as used in database');

    // Test single-use enforcement: reuse valid code
    const reuseRes = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      },
      body: JSON.stringify({ code: newEmailCode })
    });
    assert(reuseRes.status === 400, 'Re-using the same verification code is rejected (single-use enforced)');
  }

  // -----------------------------------------------------------
  // Requirement E: Phone OTP Verification Flow
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirement E: Phone OTP Verification Flow ---');
  {
    // Request Phone OTP
    const sendOtpRes = await fetch(`${BASE_URL}/auth/send-phone-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      }
    });
    assert(sendOtpRes.status === 200, 'Send phone OTP returns 200 OK');

    const dbPath = path.resolve('server/data/db.json');
    let rawDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    let dbUser = rawDb.users.find(u => u.id === candidateId);
    const validPhoneOtp = dbUser.phoneVerificationCode.code;
    assert(typeof validPhoneOtp === 'string' && validPhoneOtp.length === 6, `Phone OTP is a 6-digit code (${validPhoneOtp})`);

    // Test invalid OTP
    const wrongOtpRes = await fetch(`${BASE_URL}/auth/verify-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      },
      body: JSON.stringify({ code: '999999' })
    });
    assert(wrongOtpRes.status === 400, 'Invalid phone OTP returns 400 Bad Request');

    // Test valid OTP
    const validOtpRes = await fetch(`${BASE_URL}/auth/verify-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      },
      body: JSON.stringify({ code: validPhoneOtp })
    });
    assert(validOtpRes.status === 200, 'Valid phone OTP returns 200 OK');
    const verifiedPhoneData = await validOtpRes.json();
    assert(verifiedPhoneData.user.phoneVerified === true, 'Response indicates phoneVerified is now true');

    // Verify DB updated
    rawDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    dbUser = rawDb.users.find(u => u.id === candidateId);
    assert(dbUser.phoneVerified === true, 'Database has persisted phoneVerified: true');
  }

  // -----------------------------------------------------------
  // Requirement F & G & H: College Autocomplete, Degree, Sem, Career Role
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirements F, G, H: Structured Profile Fields ---');
  {
    // Update profile with "Other / Not Listed" college and specialized role
    const updateRes = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      },
      body: JSON.stringify({
        collegeId: 'other',
        college: 'Aryabhatta Institute of Applied Technology',
        degree: 'MCA',
        academicYear: '2nd Year',
        semester: 4,
        targetRole: 'Machine Learning Engineer',
        gender: 'Female',
        bio: 'Aspiring ML engineer specializing in distributed training.',
        github: 'https://github.com/priyasharma',
        linkedin: 'https://linkedin.com/in/priyasharma'
      })
    });
    assert(updateRes.status === 200, 'PUT /api/profile returns 200 OK');
    const updateBody = await updateRes.json();
    const updatedUser = updateBody.user || updateBody.profile;
    assert(updatedUser.collegeId === 'other', 'collegeId "other" saved successfully');
    assert(updatedUser.college === 'Aryabhatta Institute of Applied Technology', 'Custom college name saved');
    assert(updatedUser.degree === 'MCA', 'Degree updated to MCA');
    assert(String(updatedUser.semester) === '4', 'Semester updated to 4');
    assert(updatedUser.targetRole === 'Machine Learning Engineer', 'Role updated to Machine Learning Engineer');
    assert(updatedUser.bio.includes('Aspiring ML engineer'), 'Bio updated');
  }

  // -----------------------------------------------------------
  // Requirement I: Resume Upload, Magic Bytes Validation & Download
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirement I: Resume Upload & Magic Byte Security ---');
  {
    // Test I1: Invalid Magic Bytes (Fake PDF with text/plain content)
    const fakePdfBase64 = Buffer.from('This is a plain text file pretending to be a PDF', 'utf8').toString('base64');
    const fakeRes = await fetch(`${BASE_URL}/profile/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      },
      body: JSON.stringify({
        fileName: 'resume.pdf',
        fileType: 'application/pdf',
        fileDataBase64: fakePdfBase64
      })
    });
    assert(fakeRes.status === 400, 'File with invalid magic bytes / mime mismatch is rejected (400)');
    const fakeErr = await fakeRes.json();
    assert(fakeErr.error && fakeErr.error.includes('signature'), 'Error message states invalid file signature/magic bytes');

    // Test I2: Valid PDF with %PDF magic bytes
    const samplePdfContent = '%PDF-1.4\n1 0 obj\n<< /Title (Priya Sharma Resume) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF';
    const validPdfBuffer = Buffer.from(samplePdfContent, 'utf8');
    const validPdfBase64 = validPdfBuffer.toString('base64');

    const uploadRes = await fetch(`${BASE_URL}/profile/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${candidateToken}`
      },
      body: JSON.stringify({
        fileName: 'Priya_Sharma_Resume.pdf',
        fileType: 'application/pdf',
        fileDataBase64: validPdfBase64
      })
    });
    assert(uploadRes.status === 200, 'Valid PDF resume upload returns 200 OK');
    const uploadData = await uploadRes.json();
    assert(uploadData.resume && uploadData.resume.fileName === 'Priya_Sharma_Resume.pdf', 'Resume metadata returned with correct fileName');
    assert(uploadData.resume.fileSizeBytes === validPdfBuffer.length, 'File size matches uploaded bytes');
    assert(uploadData.resume.filePath, 'Storage path recorded');

    // Verify file actually written to server/uploads/resumes/
    const diskPath = path.resolve(uploadData.resume.filePath);
    assert(fs.existsSync(diskPath), `Physical resume file exists on server disk: ${diskPath}`);
    const diskContent = fs.readFileSync(diskPath);
    assert(diskContent.toString('utf8') === samplePdfContent, 'Physical file content matches uploaded bytes');

    // Test I3: Resume Download API
    const downloadRes = await fetch(`${BASE_URL}/profile/resume/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${candidateToken}`
      }
    });
    assert(downloadRes.status === 200, 'GET /api/profile/resume/download returns 200 OK');
    const downloadedBuf = Buffer.from(await downloadRes.arrayBuffer());
    assert(downloadedBuf.toString('utf8') === samplePdfContent, 'Downloaded resume binary exactly matches uploaded content');
  }

  // -----------------------------------------------------------
  // Requirement J & K: Persistence Across Login & Token Verification
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirement J & K: Persistence Across Login ---');
  {
    // Login with credentials
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    assert(loginRes.status === 200, 'Login with registered credentials returns 200 OK');
    const loginData = await loginRes.json();
    assert(loginData.user.id === candidateId, 'User ID matches created account ID');
    assert(loginData.user.email === testEmail, 'Email matches exactly');
    assert(loginData.user.phone === testPhone, 'Phone matches exactly');
    assert(loginData.user.emailVerified === true, 'emailVerified status is preserved as true');
    assert(loginData.user.phoneVerified === true, 'phoneVerified status is preserved as true');
    assert(loginData.user.college === 'Aryabhatta Institute of Applied Technology', 'Updated college name preserved');
    assert(loginData.user.degree === 'MCA', 'Degree MCA preserved');
    assert(String(loginData.user.semester) === '4', 'Semester 4 preserved');
    assert(loginData.user.targetRole === 'Machine Learning Engineer', 'Target role preserved');
    assert(loginData.user.resume && loginData.user.resume.fileName === 'Priya_Sharma_Resume.pdf', 'Resume attachment preserved');
    assert(!loginData.user.passwordHash && !loginData.user.password, 'No password exposure on login');
  }

  // -----------------------------------------------------------
  // Requirement L: Industry Recruiter Candidate Discovery & Resume Access
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirement L: Industry Candidate Discovery ---');
  {
    // Login as Industry recruiter demo preset
    const recRes = await fetch(`${BASE_URL}/auth/demo-preset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'industry' })
    });
    assert(recRes.status === 200, 'Industry recruiter login succeeds (200)');
    const recData = await recRes.json();
    const recruiterToken = recData.token;

    // Fetch candidate discovery directory
    const candRes = await fetch(`${BASE_URL}/industry/candidates`, {
      headers: { 'Authorization': `Bearer ${recruiterToken}` }
    });
    assert(candRes.status === 200, 'GET /api/industry/candidates returns 200 OK');
    const candData = await candRes.json();
    assert(Array.isArray(candData.candidates), 'Candidate list returned as array');

    // Find our candidate in recruiter list
    const foundCandidate = candData.candidates.find(c => c.id === candidateId);
    assert(foundCandidate !== undefined, 'Created candidate is discoverable by Industry recruiter');
    assert(foundCandidate.degree === 'MCA', 'Recruiter sees candidate degree (MCA)');
    assert(String(foundCandidate.semester) === '4', 'Recruiter sees candidate semester (4)');
    assert(foundCandidate.academicYear === '2nd Year', 'Recruiter sees candidate academic year');
    assert(foundCandidate.targetRole === 'Machine Learning Engineer', 'Recruiter sees target career role');
    assert(foundCandidate.resume !== null && foundCandidate.resume.fileName === 'Priya_Sharma_Resume.pdf', 'Recruiter sees resume metadata indicator');
    assert(foundCandidate.emailVerified === true, 'Recruiter sees emailVerified status');
    assert(foundCandidate.phoneVerified === true, 'Recruiter sees phoneVerified status');
    assert(!foundCandidate.passwordHash, 'Recruiter response does not leak password hash');

    // Recruiter downloads candidate resume via authorized endpoint
    const candResumeRes = await fetch(`${BASE_URL}/industry/candidates/${candidateId}/resume`, {
      headers: { 'Authorization': `Bearer ${recruiterToken}` }
    });
    assert(candResumeRes.status === 200, 'Recruiter GET /candidates/:id/resume succeeds (200 OK)');
    const recDownloadedBuf = Buffer.from(await candResumeRes.arrayBuffer());
    assert(recDownloadedBuf.toString('utf8').includes('Priya Sharma Resume'), 'Recruiter downloaded exact binary resume content');
  }

  // -----------------------------------------------------------
  // Requirement M: Security & Unauthorized Protection
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirement M: Security & Unauthorized Access ---');
  {
    // Attempt to access profile without token
    const unauthProfile = await fetch(`${BASE_URL}/profile`);
    assert(unauthProfile.status === 401, 'Unauthenticated GET /api/profile rejected with 401');

    // Attempt to access candidate resume without industry role
    const unauthResume = await fetch(`${BASE_URL}/industry/candidates/${candidateId}/resume`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` } // candidate attempting recruiter endpoint
    });
    assert(unauthResume.status === 403, 'Candidate token accessing recruiter resume route rejected with 403 Forbidden');
  }

  // -----------------------------------------------------------
  // Requirement O: Existing Demo Presets Still Function
  // -----------------------------------------------------------
  console.log('\n--- Testing Requirement O: Existing Demo Presets Compatibility ---');
  {
    const roles = ['candidate', 'industry', 'admin'];
    for (const r of roles) {
      const presetRes = await fetch(`${BASE_URL}/auth/demo-preset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: r })
      });
      assert(presetRes.status === 200, `Demo preset for role "${r}" returns 200 OK`);
      const presetData = await presetRes.json();
      assert(presetData.token && presetData.user && presetData.user.role === r, `Demo preset user for "${r}" has valid token and role`);
    }
  }

  console.log('\n====================================================');
  console.log(`ALL AUTOMATED TESTS PASSED: ${passedTests}/${totalTests} checks succeeded!`);
  console.log('====================================================\n');
}

run().catch(err => {
  console.error('\n❌ Test Suite Failed with error:', err);
  process.exit(1);
});
