// scripts/test-domain-profile.mjs
// Automated Verification for Domain Selection & Professional Profile Persistence

import fs from 'fs';

const BASE_URL = 'http://localhost:3001';

async function runTest() {
  console.log('--- Starting Automated Test: Domain Selection & Profile Presentation ---');

  const testEmail = `candidate.${Date.now()}@domain-test.edu`;
  const testPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const testPassword = 'Password@2026!';

  // Step 1: Register student with Primary Domain and Secondary Domains
  console.log('1. Registering real candidate with Primary Domain and Secondary Interests...');
  const regPayload = {
    name: 'Ananya Deshmukh',
    email: testEmail,
    countryCode: '+91',
    phone: testPhone,
    password: testPassword,
    college: 'Indian Institute of Technology Bombay (IIT Bombay)',
    collegeId: 'iit-bombay',
    degree: 'B.Tech (Bachelor of Technology)',
    academicYear: '3rd Year',
    semester: '6th Semester',
    gender: 'Female',
    primaryDomain: 'Artificial Intelligence & Machine Learning',
    secondaryDomains: ['Deep Learning & Neural Networks', 'Generative AI & LLMs'],
    targetRole: 'AI Engineer'
  };

  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload)
  });

  const regData = await regRes.json();
  if (!regRes.ok) {
    throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  }

  console.log('   Registration Success! Status:', regRes.status);
  console.log('   User ID:', regData.user.id);
  console.log('   Primary Domain:', regData.user.primaryDomain);
  console.log('   Secondary Domains:', regData.user.secondaryDomains);
  console.log('   Target Role:', regData.user.targetRole);

  if (!regData.user.id.startsWith('SP-STU-')) {
    throw new Error(`Invalid ID format: expected SP-STU-XXXXXXXX, got ${regData.user.id}`);
  }
  if (regData.user.primaryDomain !== 'Artificial Intelligence & Machine Learning') {
    throw new Error(`Primary domain mismatch: ${regData.user.primaryDomain}`);
  }
  if (!Array.isArray(regData.user.secondaryDomains) || regData.user.secondaryDomains.length !== 2) {
    throw new Error(`Secondary domains mismatch: ${JSON.stringify(regData.user.secondaryDomains)}`);
  }

  const token = regData.token;
  const studentId = regData.user.id;

  // Step 2: Verify direct persistence in server/data/db.json
  console.log('\n2. Verifying persistence in server/data/db.json...');
  const dbRaw = fs.readFileSync('server/data/db.json', 'utf-8');
  const dbJson = JSON.parse(dbRaw);
  const userInDb = dbJson.users.find((u) => u.id === studentId);

  if (!userInDb) {
    throw new Error(`Candidate not found in server/data/db.json!`);
  }
  if (userInDb.primaryDomain !== 'Artificial Intelligence & Machine Learning') {
    throw new Error(`db.json primaryDomain mismatch: ${userInDb.primaryDomain}`);
  }
  console.log('   Confirmed in db.json! Primary domain is permanently stored.');

  // Step 3: Fetch profile via GET /api/profile
  console.log('\n3. Fetching profile via GET /api/profile...');
  const profileRes = await fetch(`${BASE_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const profileData = await profileRes.json();
  if (!profileRes.ok) {
    throw new Error(`Fetch profile failed: ${JSON.stringify(profileData)}`);
  }
  console.log('   Profile retrieved successfully. Primary Domain:', profileData.user.primaryDomain);
  console.log('   Headline:', profileData.user.professionalHeadline || '(Empty as expected)');

  // Step 4: Update Profile with new domain, headline, and project
  console.log('\n4. Updating Profile via PUT /api/profile...');
  const updatePayload = {
    professionalHeadline: 'AI & Neural Systems Specialist | LLM Fine-Tuning',
    primaryDomain: 'Data Science',
    secondaryDomains: ['Statistical Analysis', 'Predictive Modeling', 'Feature Engineering'],
    targetRole: 'Data Scientist',
    location: 'Mumbai, India',
    bio: 'Researcher focused on Transformer fine-tuning and production data pipelines.',
    projects: [
      {
        id: 'proj_1',
        title: 'Distributed Vector RAG Pipeline',
        description: 'Sub-50ms hybrid sparse-dense retrieval engine with automated reranking.',
        techStack: ['Python', 'FastAPI', 'Qdrant', 'Docker'],
        githubUrl: 'https://github.com/ananya/vector-rag',
        demoUrl: 'https://rag-demo.skillproof.org'
      }
    ],
    certifications: [
      {
        id: 'cert_1',
        name: 'Deep Learning Specialization',
        issuer: 'DeepLearning.AI',
        issueYear: '2025',
        credentialUrl: 'https://coursera.org/verify/dl-spec'
      }
    ]
  };

  const updateRes = await fetch(`${BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updatePayload)
  });

  const updateData = await updateRes.json();
  if (!updateRes.ok) {
    throw new Error(`Profile update failed: ${JSON.stringify(updateData)}`);
  }

  console.log('   Profile update successful!');
  console.log('   Updated Primary Domain:', updateData.user.primaryDomain);
  console.log('   Updated Headline:', updateData.user.professionalHeadline);
  console.log('   Updated Projects Count:', updateData.user.projects.length);
  console.log('   Updated Certifications Count:', updateData.user.certifications.length);

  if (updateData.user.primaryDomain !== 'Data Science') {
    throw new Error(`Expected updated primary domain to be 'Data Science', got ${updateData.user.primaryDomain}`);
  }

  // Step 5: Industry candidate query verification
  console.log('\n5. Querying Industry Candidate discovery via GET /api/industry/candidates...');
  const industryRes = await fetch(`${BASE_URL}/api/industry/candidates?studentId=${studentId}`);
  const industryData = await industryRes.json();
  if (!industryRes.ok) {
    throw new Error(`Industry query failed: ${JSON.stringify(industryData)}`);
  }

  const candInIndustry = industryData.candidates.find((c) => c.id === studentId);
  if (!candInIndustry) {
    throw new Error(`Candidate ${studentId} not discoverable by Industry!`);
  }

  console.log('   Discovered in Industry portal!');
  console.log('   Candidate Name:', candInIndustry.name);
  console.log('   Primary Domain:', candInIndustry.primaryDomain);
  console.log('   Headline:', candInIndustry.professionalHeadline);
  console.log('   Secondary Domains:', candInIndustry.secondaryDomains);
  console.log('   Verified Skills Array:', candInIndustry.verifiedSkills);

  if (candInIndustry.primaryDomain !== 'Data Science') {
    throw new Error(`Industry view primary domain mismatch: ${candInIndustry.primaryDomain}`);
  }
  if (!candInIndustry.professionalHeadline.includes('AI & Neural Systems')) {
    throw new Error(`Industry view headline mismatch: ${candInIndustry.professionalHeadline}`);
  }

  // Step 6: Faculty student query verification
  console.log('\n6. Querying Faculty Students roster via GET /api/college/students...');
  const collegeRes = await fetch(`${BASE_URL}/api/college/students?search=${studentId}`);
  const collegeData = await collegeRes.json();
  if (!collegeRes.ok) {
    throw new Error(`College students query failed: ${JSON.stringify(collegeData)}`);
  }

  const candInCollege = collegeData.students.find((s) => s.id === studentId);
  if (!candInCollege) {
    throw new Error(`Student ${studentId} not found in Faculty roster!`);
  }
  console.log('   Discovered in Faculty portal!');
  console.log('   Student Name:', candInCollege.name);
  console.log('   Primary Domain:', candInCollege.primaryDomain);

  // Step 7: Clean up test account via Admin Purge
  console.log('\n7. Cleaning up test candidate via Admin Purge...');
  // Log in as admin
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@skillproof.org', password: 'Admin@SkillProof2026!' })
  });
  const adminData = await adminLoginRes.json();
  const adminToken = adminData.token;

  const purgeRes = await fetch(`${BASE_URL}/api/admin/users/${studentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` }
  });

  if (!purgeRes.ok) {
    console.warn('   Note: Admin purge returned status:', purgeRes.status);
  } else {
    console.log('   Test account purged successfully from persistent storage.');
  }

  console.log('\n ALL AUTOMATED VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
}

runTest().catch((err) => {
  console.error('\n❌ Test Error:', err);
  process.exit(1);
});
