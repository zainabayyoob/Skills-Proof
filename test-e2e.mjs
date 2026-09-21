import http from 'http';
import { app } from './server/index.js';

let server;
let port;
let baseUrl;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            resolve({ status: res.statusCode, data });
          } catch {
            resolve({ status: res.statusCode, body });
          }
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`[Test Server] Running on ${baseUrl}`);
      resolve();
    });
  });

  const timestamp = Date.now();
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
    passed++;
    console.log(`✓ PASS: ${message}`);
  }

  try {
    console.log('\n--- 1. AUTHENTICATION & USER ISOLATION ---');
    const aliceRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Alice Smith',
        email: `alice_${timestamp}@test.edu`,
        phone: '+919876543210',
        password: 'password123',
        college: 'National Institute of Technology',
        targetRole: 'Full Stack Web Developer'
      }
    });
    assert(aliceRes.status === 201, 'User A registered successfully');
    const aliceToken = aliceRes.data.token;
    const aliceId = aliceRes.data.user.id;
    assert(Boolean(aliceToken && aliceId), 'User A received JWT token and user ID');

    const bobRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Bob Jones',
        email: `bob_${timestamp}@test.edu`,
        phone: '+919876543211',
        password: 'password123',
        college: 'State University',
        targetRole: 'Data & AI Engineer'
      }
    });
    assert(bobRes.status === 201, 'User B registered successfully');
    const bobToken = bobRes.data.token;
    const bobId = bobRes.data.user.id;
    assert(aliceId !== bobId, 'User A and User B have completely distinct IDs');

    const meAlice = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${aliceToken}` }
    });
    const meBob = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${bobToken}` }
    });
    assert(meAlice.data.user.name === 'Alice Smith', "User A /me returns Alice's profile");
    assert(meBob.data.user.name === 'Bob Jones', "User B /me returns Bob's profile");
    assert(meAlice.data.user.verifiedSkills.length === 0, 'New User A has 0 verified skills initially');
    assert(meBob.data.user.verifiedSkills.length === 0, 'New User B has 0 verified skills initially');

    console.log('\n--- 2. REAL COMPILER SUBMIT & TEST EXECUTION ---');
    const pythonCode = `
def compute_sales_metrics(transactions):
    total = 0.0
    products = {}
    valid_count = 0
    seen_ids = set()
    for tx in transactions:
        if not isinstance(tx, dict): continue
        tx_id = tx.get('id')
        if tx_id in seen_ids: continue
        units = tx.get('units')
        price = tx.get('price')
        if units is None or price is None: continue
        if isinstance(price, str):
            clean_str = ''.join(c for c in price if c.isdigit() or c == '.')
            price = float(clean_str) if clean_str else 0.0
        seen_ids.add(tx_id)
        subtotal = float(units) * float(price)
        total += subtotal
        prod = tx.get('product', 'Unknown')
        products[prod] = products.get(prod, 0.0) + subtotal
        valid_count += 1
    top_prod = max(products.items(), key=lambda x: x[1])[0] if products else ''
    aov = round(total / valid_count, 2) if valid_count > 0 else 0.0
    return {
        'total_sales': round(total, 2),
        'top_product': top_prod,
        'aov': aov
    }
`;
    const submitRes = await request('/api/compiler/submit', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: {
        language: 'python',
        code: pythonCode,
        conceptId: 'python-kpi',
        entrypoint: 'compute_sales_metrics',
        skillId: 'python',
        skillName: 'Python',
        roundName: 'ADAPT'
      }
    });
    assert(submitRes.status === 200, 'Compiler /submit responds with 200');
    assert(submitRes.data.score === 100, 'Correct Python solution achieves 100% on full test suite');
    assert(submitRes.data.allPassed === true, 'All test cases including hidden cases passed');
    const hiddenCases = (submitRes.data.results || []).filter((r) => r.title && r.title.includes('Hidden'));
    assert(hiddenCases.length > 0, 'Response includes hidden test cases');
    for (const hc of hiddenCases) {
      assert(hc.input === 'Hidden Test Case', 'Hidden test case input is sanitized and masked');
      assert(hc.expected === 'Hidden', 'Hidden test case expected value is masked');
    }

    const verifyRes = await request('/api/tests/verify-code', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: {
        skillId: 'python',
        skillName: 'Python',
        overallScore: 92,
        roundsEvidence: { problemSolving: 92, debugging: 90, adaptability: 94 }
      }
    });
    assert(verifyRes.status === 200, 'User A verified Python skill recorded');
    assert(verifyRes.data.user.verifiedSkills.some((s) => s.name.toLowerCase() === 'python' && s.score === 92), 'User A has verified Python skill in db');

    const checkBob = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${bobToken}` }
    });
    assert(checkBob.data.user.verifiedSkills.length === 0, 'User B verified skills remain empty (no bleed from User A)');

    console.log('\n--- 3. DETERMINISTIC OPPORTUNITY MATCHING ---');
    const oppsAlice = await request('/api/opportunities', {
      headers: { Authorization: `Bearer ${aliceToken}` }
    });
    assert(oppsAlice.status === 200, 'Opportunities fetched for User A');
    const pythonOppAlice = oppsAlice.data.opportunities.find((o) =>
      (o.requiredSkills || []).some((r) => r.name.toLowerCase() === 'python')
    );
    assert(Boolean(pythonOppAlice), 'Found opportunity requiring Python');
    assert(pythonOppAlice.matchScore > 0, `User A with verified Python gets positive match score (${pythonOppAlice.matchScore}%)`);

    const oppsBob = await request('/api/opportunities', {
      headers: { Authorization: `Bearer ${bobToken}` }
    });
    const pythonOppBob = oppsBob.data.opportunities.find((o) =>
      (o.requiredSkills || []).some((r) => r.name.toLowerCase() === 'python')
    );
    assert(pythonOppBob.matchScore === 0, `User B with 0 verified skills gets 0% match score (${pythonOppBob.matchScore}%)`);

    console.log('\n--- 4. APPLICATION TRACKER CRUD & USER ISOLATION ---');
    const createAppRes = await request('/api/applications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: {
        company: 'Google Careers',
        role: 'Cloud Engineering Intern',
        opportunityType: 'Internship',
        source: 'Google Careers Portal',
        applicationUrl: 'https://careers.google.com/jobs/results/12345',
        location: 'Bangalore / Remote',
        stipend: '₹85,000 / month',
        status: 'Applied',
        notes: 'Application submitted on official Google Careers portal.'
      }
    });
    assert(createAppRes.status === 201, 'User A created application successfully');
    const createdAppId = createAppRes.data.application.id;
    assert(createAppRes.data.application.isExternal === true, 'Application marked as isExternal: true');

    const listAliceApps = await request('/api/applications', {
      headers: { Authorization: `Bearer ${aliceToken}` }
    });
    assert(listAliceApps.data.applications.length === 1, 'User A has exactly 1 tracked application');
    assert(listAliceApps.data.applications[0].company === 'Google Careers', 'Application belongs to Google Careers');

    const listBobApps = await request('/api/applications', {
      headers: { Authorization: `Bearer ${bobToken}` }
    });
    assert(listBobApps.data.applications.length === 0, 'User B has 0 applications (complete isolation between accounts)');

    const updateAppRes = await request(`/api/applications/${createdAppId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${aliceToken}` },
      body: {
        status: 'Shortlisted',
        notes: 'Passed initial screening resume review.'
      }
    });
    assert(updateAppRes.status === 200, 'User A updated application stage to Shortlisted');
    assert(updateAppRes.data.application.status === 'Shortlisted', 'Status persisted as Shortlisted');

    const illegalUpdateRes = await request(`/api/applications/${createdAppId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${bobToken}` },
      body: { status: 'Rejected' }
    });
    assert(illegalUpdateRes.status === 403, 'User B cannot modify User A application (403 Forbidden)');

    const illegalDeleteRes = await request(`/api/applications/${createdAppId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${bobToken}` }
    });
    assert(illegalDeleteRes.status === 403, 'User B cannot delete User A application (403 Forbidden)');

    console.log('\n--- 5. INDUSTRY RECRUITER CONSOLE ---');
    const candidatesRes = await request('/api/industry/candidates?skill=python&minScore=80');
    assert(candidatesRes.status === 200, 'Recruiter candidate search succeeds');
    const foundAlice = candidatesRes.data.candidates.find((c) => c.id === aliceId);
    assert(Boolean(foundAlice), 'Recruiter candidate search successfully discovers Alice with verified Python >= 80%');

    const shortlistRes = await request('/api/industry/shortlist', {
      method: 'POST',
      body: {
        studentId: aliceId,
        studentName: 'Alice Smith',
        roleTitle: 'Full Stack Engineer'
      }
    });
    assert(shortlistRes.status === 200 && shortlistRes.data.shortlisted === true, 'Recruiter successfully shortlists candidate');

    const recruiterStatusRes = await request(`/api/industry/applications/${createdAppId}/status`, {
      method: 'PUT',
      body: {
        status: 'Interview',
        note: 'Recruiter scheduled technical system design round'
      }
    });
    assert(recruiterStatusRes.status === 200, 'Recruiter updated candidate application stage');
    assert(recruiterStatusRes.data.application.status === 'Interview', 'Stage updated to Interview');

    const aliceUpdatedApps = await request('/api/applications', {
      headers: { Authorization: `Bearer ${aliceToken}` }
    });
    assert(aliceUpdatedApps.data.applications[0].status === 'Interview', "Alice's tracker reflects Interview stage updated by recruiter");

    console.log('\n--- 6. COLLEGE / ACADEMIA MODULE ---');
    const analyticsRes = await request('/api/college/analytics');
    assert(analyticsRes.status === 200, 'College analytics computed successfully');
    assert(analyticsRes.data.analytics.studentsAssessed > 0, 'College analytics reflects assessed students');

    const createGroupRes = await request('/api/college/groups', {
      method: 'POST',
      body: {
        name: `Cohort 2026 Batch ${timestamp.toString().slice(-4)}`,
        department: 'Information Science',
        studentsCount: 45
      }
    });
    assert(createGroupRes.status === 201, 'Cohort created successfully');

    const assignRes = await request('/api/college/assign', {
      method: 'POST',
      body: {
        skillId: 'python',
        skillName: 'Python',
        title: 'Production Python Benchmark',
        deadline: '2026-10-30'
      }
    });
    assert(assignRes.status === 201, 'Assessment assigned to cohort successfully');

    const listAssignments = await request('/api/college/assignments');
    assert(listAssignments.status === 200, 'Assignments fetched successfully');
    assert(listAssignments.data.assignments.some((a) => a.skillId === 'python'), 'Assigned challenge persists in database');

    const facultyActRes = await request('/api/college/faculty/activity', {
      method: 'POST',
      body: {
        type: 'Workshop',
        title: 'Zero-Downtime Microservices',
        partner: 'Google Cloud Training',
        date: '2026-09-15',
        participants: 80
      }
    });
    assert(facultyActRes.status === 201, 'Faculty activity logged successfully');

    const facultyData = await request('/api/college/faculty');
    assert(facultyData.status === 200, 'Faculty data fetched successfully');
    assert(facultyData.data.faculty.activities.some((a) => a.title === 'Zero-Downtime Microservices'), 'Faculty activity persists in database');

    console.log(`\n========================================`);
    console.log(`✅ ALL ${passed}/${total} E2E INTEGRATION TESTS PASSED!`);
    console.log(`========================================\n`);
  } finally {
    if (server) server.close();
  }
}

runTests().catch((err) => {
  console.error('\n❌ TEST RUN FAILED:', err);
  if (server) server.close();
  process.exit(1);
});
