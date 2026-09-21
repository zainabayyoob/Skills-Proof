// test-account-profile-full.mjs
// Comprehensive automated verification test suite for SkillProof Account, Profile & Security Requirements A through V

const API_BASE = 'http://localhost:3001/api';

async function runTests() {
  console.log('================================================================');
  console.log('🚀 SKILLPROOF ACCOUNT, PROFILE & SECURITY TEST SUITE (A - V)');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test A: Healthcheck
    // -------------------------------------------------------------
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    assert(
      healthRes.ok && (healthData.status === 'ok' || healthData.status === 'online'),
      'Test A: Backend Healthcheck',
      JSON.stringify(healthData)
    );

    // Unique email and phone for this test run
    const testTimestamp = Date.now();
    const testEmail = `test.candidate.${testTimestamp}@university.edu`;
    const testPhone = `98${String(testTimestamp).slice(-8)}`; // Exactly 10 digits starting with 98
    const weakPassword = 'weak';
    const strongPassword = 'Password@123';
    const updatedPassword = 'NewSecure@Password2026';

    // -------------------------------------------------------------
    // Test B: Registration with weak password fails policy check
    // -------------------------------------------------------------
    const weakRegRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Candidate',
        email: testEmail,
        countryCode: '+91',
        phone: testPhone,
        password: weakPassword,
        college: 'Indian Institute of Technology Bombay (IIT Bombay)',
        targetRole: 'Full Stack Developer'
      })
    });
    const weakRegData = await weakRegRes.json();
    assert(
      weakRegRes.status === 400 && weakRegData.error && weakRegData.missingRequirements,
      'Test B: Registration with weak password rejected by password policy',
      weakRegData.error
    );

    // -------------------------------------------------------------
    // Test C: Registration with invalid India phone fails
    // -------------------------------------------------------------
    const invalidPhoneRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Candidate',
        email: testEmail,
        countryCode: '+91',
        phone: '12345', // Only 5 digits
        password: strongPassword,
        college: 'Indian Institute of Technology Bombay (IIT Bombay)',
        targetRole: 'Full Stack Developer'
      })
    });
    const invalidPhoneData = await invalidPhoneRes.json();
    assert(
      invalidPhoneRes.status === 400 && invalidPhoneData.error.includes('10 digits'),
      'Test C: Registration with invalid India phone (< 10 digits) rejected',
      invalidPhoneData.error
    );

    // -------------------------------------------------------------
    // Test D: Valid registration succeeds with usr_... ID and JWT
    // -------------------------------------------------------------
    const validRegRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Zainab Ayoob',
        email: testEmail,
        countryCode: '+91',
        phone: testPhone,
        password: strongPassword,
        college: 'Indian Institute of Technology Delhi (IIT Delhi)',
        degree: 'B.Tech in Computer Science',
        academicYear: '4th Year',
        semester: '8th Semester',
        gender: 'Female',
        targetRole: 'Full Stack Developer'
      })
    });
    const validRegData = await validRegRes.json();
    const token = validRegData.token;
    const userId = validRegData.user?.id;

    assert(
      validRegRes.ok && userId && userId.startsWith('usr_') && token,
      'Test D: Valid registration creates persistent usr_... user and returns JWT',
      `ID: ${userId}`
    );

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // -------------------------------------------------------------
    // Test E: Duplicate email registration rejected (409 Conflict)
    // -------------------------------------------------------------
    const dupEmailRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Different Candidate',
        email: testEmail, // Same email
        countryCode: '+91',
        phone: '9988776655', // Different phone
        password: strongPassword,
        college: 'BITS Pilani',
        targetRole: 'Backend Developer'
      })
    });
    const dupEmailData = await dupEmailRes.json();
    assert(
      dupEmailRes.status === 409 && dupEmailData.error.includes('email'),
      'Test E: Duplicate email registration blocked with 409 Conflict',
      dupEmailData.error
    );

    // -------------------------------------------------------------
    // Test F: Duplicate phone registration rejected (409 Conflict)
    // -------------------------------------------------------------
    const dupPhoneRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another Candidate',
        email: `another.${testTimestamp}@university.edu`, // Different email
        countryCode: '+91',
        phone: testPhone, // Same phone
        password: strongPassword,
        college: 'BITS Pilani',
        targetRole: 'Backend Developer'
      })
    });
    const dupPhoneData = await dupPhoneRes.json();
    assert(
      dupPhoneRes.status === 409 && dupPhoneData.error.includes('phone'),
      'Test F: Duplicate phone registration blocked with 409 Conflict',
      dupPhoneData.error
    );

    // -------------------------------------------------------------
    // Test G: Verify Email with valid OTP
    // -------------------------------------------------------------
    const invalidEmailOtpRes = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ code: '000000' })
    });
    assert(
      invalidEmailOtpRes.status === 400,
      'Test G1: Invalid email verification code rejected'
    );

    // Read db to get actual code for verification test
    const fs = await import('fs');
    const dbPath = './server/data/db.json';
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const currentUser = dbData.users.find((u) => u.id === userId);
    const emailCode = currentUser?.emailVerificationCode?.code;

    const verifyEmailRes = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ code: emailCode })
    });
    const verifyEmailData = await verifyEmailRes.json();
    assert(
      verifyEmailRes.ok && verifyEmailData.user?.emailVerified === true,
      'Test G2: Valid email verification code verifies email and persists to DB'
    );

    // -------------------------------------------------------------
    // Test H: Verify Mobile Phone with valid OTP
    // -------------------------------------------------------------
    await fetch(`${API_BASE}/auth/send-phone-otp`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ countryCode: '+91', phone: testPhone })
    });
    const dbData2 = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const currentUser2 = dbData2.users.find((u) => u.id === userId);
    const phoneCode = currentUser2?.phoneVerificationCode?.code;

    const verifyPhoneRes = await fetch(`${API_BASE}/auth/verify-phone`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ code: phoneCode })
    });
    const verifyPhoneData = await verifyPhoneRes.json();
    assert(
      verifyPhoneRes.ok && verifyPhoneData.user?.phoneVerified === true,
      'Test H: Valid mobile phone OTP verifies phone and persists to DB'
    );

    // -------------------------------------------------------------
    // Test I: Profile photo upload with invalid mime / magic bytes rejected
    // -------------------------------------------------------------
    const fakeImageBase64 = 'data:image/png;base64,' + Buffer.from('NOT_AN_IMAGE_PAYLOAD').toString('base64');
    const invalidPhotoRes = await fetch(`${API_BASE}/profile/photo`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        fileName: 'fake.png',
        fileType: 'image/png',
        fileDataBase64: fakeImageBase64
      })
    });
    const invalidPhotoData = await invalidPhotoRes.json();
    assert(
      invalidPhotoRes.status === 400 && invalidPhotoData.error,
      'Test I: Non-image file payload rejected via magic byte inspection',
      invalidPhotoData.error
    );

    // -------------------------------------------------------------
    // Test J: Valid Profile Photo Upload (Real PNG Magic Bytes)
    // -------------------------------------------------------------
    // 1x1 transparent PNG in base64
    const validPngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const validPhotoRes = await fetch(`${API_BASE}/profile/photo`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        fileName: 'avatar.png',
        fileType: 'image/png',
        fileDataBase64: validPngBase64
      })
    });
    const validPhotoData = await validPhotoRes.json();
    assert(
      validPhotoRes.ok && validPhotoData.avatarUrl && validPhotoData.avatarUrl.includes(`/api/profile/photo/${userId}`),
      'Test J: Valid PNG photo uploaded, saved to disk, and avatarUrl updated on user',
      validPhotoData.avatarUrl
    );

    // -------------------------------------------------------------
    // Test K: Profile photo binary retrieval
    // -------------------------------------------------------------
    const getPhotoRes = await fetch(`http://localhost:3001/api/profile/photo/${userId}`);
    const photoContentType = getPhotoRes.headers.get('content-type');
    const photoBuffer = await getPhotoRes.arrayBuffer();
    assert(
      getPhotoRes.ok && photoContentType === 'image/png' && photoBuffer.byteLength > 0,
      'Test K: GET /api/profile/photo/:userId serves photo binary with Content-Type: image/png',
      `Size: ${photoBuffer.byteLength} bytes`
    );

    // -------------------------------------------------------------
    // Test L: Colleges Directory Search (250+ accredited Indian institutions)
    // -------------------------------------------------------------
    const { collegesDirectory, searchColleges } = await import('./src/data/collegesData.js');
    const iitSearch = searchColleges('IIT Bombay');
    const nitSearch = searchColleges('NIT Trichy');
    const privateSearch = searchColleges('BITS Pilani');
    assert(
      collegesDirectory.length >= 250 && iitSearch.length > 0 && nitSearch.length > 0 && privateSearch.length > 0,
      'Test L: Colleges Directory expanded to 250+ accredited Indian institutions with multi-word search',
      `Total: ${collegesDirectory.length} institutions`
    );

    // -------------------------------------------------------------
    // Test M: Target Career Tracks streamlined to 23 canonical technology roles
    // -------------------------------------------------------------
    const { comprehensiveCareerRoles } = await import('./src/data/careerRolesData.js');
    const fullStackTrack = comprehensiveCareerRoles.find((r) => r.id === 'track-fullstack');
    const devopsTrack = comprehensiveCareerRoles.find((r) => r.id === 'track-devops');
    const aiTrack = comprehensiveCareerRoles.find((r) => r.id === 'track-ai-eng');
    assert(
      comprehensiveCareerRoles.length === 23 && fullStackTrack && devopsTrack && aiTrack,
      'Test M: Career tracks streamlined to 23 canonical technology roles mapped to skill battery',
      `Total: ${comprehensiveCareerRoles.length} tracks`
    );

    // -------------------------------------------------------------
    // Test N: Resume Upload and Deep Technical Skill Analysis
    // -------------------------------------------------------------
    // Construct real %PDF buffer containing technical keywords: Python, React, Docker, SQL, Git, Node.js
    const sampleResumeText = `%PDF-1.4\n%Dr. Zainab Ayoob Portfolio\nSkills: Proficient in Python, JavaScript, React, Node.js, Express, Docker, PostgreSQL, SQL, and Git.\nExperience: Built full-stack microservices and REST APIs with automated testing.\n%%EOF`;
    const resumeBase64 = 'data:application/pdf;base64,' + Buffer.from(sampleResumeText).toString('base64');

    const resumeRes = await fetch(`${API_BASE}/profile/resume`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        fileName: 'zainab_cv.pdf',
        fileType: 'application/pdf',
        fileDataBase64: resumeBase64
      })
    });
    const resumeData = await resumeRes.json();
    const analysis = resumeData.resumeAnalysis;

    assert(
      resumeRes.ok &&
      analysis &&
      analysis.skillsDetected &&
      analysis.skillsDetected.length >= 4 &&
      analysis.matchScore > 0 &&
      Array.isArray(analysis.recommendedProjects),
      'Test N: Resume analyzed, skills detected against catalogue, gaps & projects computed',
      `Detected: ${analysis?.skillsDetected?.join(', ')} | Match: ${analysis?.matchScore}%`
    );

    // -------------------------------------------------------------
    // Test O: Candidate Profile Retrieval shows complete persisted data
    // -------------------------------------------------------------
    const getProfileRes = await fetch(`${API_BASE}/profile`, { headers: authHeaders });
    const profileData = await getProfileRes.json();
    assert(
      getProfileRes.ok &&
      profileData.user?.id === userId &&
      profileData.user?.emailVerified === true &&
      profileData.user?.phoneVerified === true &&
      profileData.user?.resumeAnalysis?.skillsDetected?.length >= 4,
      'Test O: GET /api/profile returns complete verified candidate data tied to usr_... ID'
    );

    // -------------------------------------------------------------
    // Test P: Industry Recruiter Candidate Projection includes resume analysis
    // -------------------------------------------------------------
    const candRes = await fetch(`${API_BASE}/industry/candidates`, { headers: authHeaders });
    const candData = await candRes.json();
    const candidateRecord = candData.candidates?.find((c) => c.id === userId);

    assert(
      candRes.ok &&
      candidateRecord &&
      candidateRecord.id === userId &&
      candidateRecord.resumeAnalysis?.skillsCount >= 4,
      'Test P: Recruiter candidates projection includes candidate with usr_... ID and resume intelligence',
      `Recruiter view ID: ${candidateRecord?.id}`
    );

    // -------------------------------------------------------------
    // Test Q: Opportunity Types (Internship, Full-Time Job, Part-Time Job, etc.)
    // -------------------------------------------------------------
    const postOppRes = await fetch(`${API_BASE}/industry/opportunities`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Senior Full Stack Engineer',
        company: 'CloudTech Systems',
        type: 'Full-Time Job',
        location: 'Bengaluru / Remote',
        workMode: 'Hybrid',
        stipend: '₹18,00,000 - ₹24,00,000 PA',
        description: 'Lead engineering on high-throughput backend and responsive frontend systems.',
        requiredSkills: [{ name: 'Python', weight: 0.5, minScore: 80 }]
      })
    });
    const postOppData = await postOppRes.json();
    assert(
      postOppRes.ok && postOppData.opportunity?.type === 'Full-Time Job',
      'Test Q: Recruiter can create opportunity with supported Opportunity Type (Full-Time Job)',
      `Created Type: ${postOppData.opportunity?.type}`
    );

    // -------------------------------------------------------------
    // Test R: Forgot Password Flow (Non-enumerating + Dispatches Token)
    // -------------------------------------------------------------
    const forgotRes = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    const forgotData = await forgotRes.json();
    const devToken = forgotData.devToken;

    assert(
      forgotRes.ok && forgotData.message.includes('dispatched') && devToken,
      'Test R: Forgot password dispatches secure 15-minute token safely',
      `Token: ${devToken?.slice(0, 16)}...`
    );

    // -------------------------------------------------------------
    // Test S: Reset Password with Weak Password rejected
    // -------------------------------------------------------------
    const weakResetRes = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: devToken, newPassword: 'weak' })
    });
    const weakResetData = await weakResetRes.json();
    assert(
      weakResetRes.status === 400 && weakResetData.error,
      'Test S: Reset password enforces strong password policy',
      weakResetData.error
    );

    // -------------------------------------------------------------
    // Test T: Reset Password with Strong Password succeeds
    // -------------------------------------------------------------
    const validResetRes = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: devToken, newPassword: updatedPassword })
    });
    const validResetData = await validResetRes.json();
    assert(
      validResetRes.ok && validResetData.message.includes('reset successfully'),
      'Test T: Valid password reset updates hash and invalidates reset token'
    );

    // Attempting to re-use the same reset token should now fail
    const reuseResetRes = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: devToken, newPassword: 'Another@Password123' })
    });
    assert(
      reuseResetRes.status === 400,
      'Test T2: Expired / single-use reset token cannot be re-used'
    );

    // -------------------------------------------------------------
    // Test U: Authenticated Change Password Flow
    // -------------------------------------------------------------
    // Sign in with the new password first to get fresh token
    const newLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: updatedPassword })
    });
    const newLoginData = await newLoginRes.json();
    const freshToken = newLoginData.token;

    const changePasswordRes = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${freshToken}`
      },
      body: JSON.stringify({
        currentPassword: updatedPassword,
        newPassword: 'Final@SecurePassword2026',
        confirmPassword: 'Final@SecurePassword2026'
      })
    });
    const changePasswordData = await changePasswordRes.json();
    assert(
      changePasswordRes.ok && changePasswordData.message.includes('successfully'),
      'Test U: Authenticated change password verifies current password and updates hash'
    );

    // -------------------------------------------------------------
    // Test V: Sign in with final password yields the exact same usr_... ID
    // -------------------------------------------------------------
    const finalLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'Final@SecurePassword2026' })
    });
    const finalLoginData = await finalLoginRes.json();
    assert(
      finalLoginRes.ok && finalLoginData.user?.id === userId,
      'Test V: Sign in with updated credentials succeeds and retains the identical persistent usr_... user ID',
      `Persistent User ID: ${finalLoginData.user?.id}`
    );

    // -------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------
    console.log('\n================================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected test error:', err);
    process.exit(1);
  }
}

runTests();
