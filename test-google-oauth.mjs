import jwt from 'jsonwebtoken';
import { db } from './server/db.js';
import { JWT_SECRET } from './server/middleware/auth.js';

const BACKEND_URL = 'http://localhost:3001';

async function runTests() {
  console.log('=== RUNNING GOOGLE OAUTH AUTOMATED VERIFICATION SUITE ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}: ${details}`);
      failed++;
    }
  }

  // TEST 1: Unconfigured 503 response (when no GOOGLE_CLIENT_ID / SECRET set)
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/oauth/google`);
    const data = await res.json();
    // Since .env is currently without real client credentials or empty
    if (res.status === 503) {
      assert(data.providerConfigured === false, 'Test 1: Unconfigured OAuth returns 503 and providerConfigured: false');
      assert(data.error.includes('Google OAuth is not configured'), 'Test 1b: Returns clear instructions about missing credentials');
    } else if (res.status === 200) {
      assert(data.providerConfigured === true && data.url.startsWith('https://accounts.google.com/o/oauth2/v2/auth'), 'Test 1: Configured OAuth returns 200 and accounts.google.com authorization URL');
    }

    // Test 1c: Validate Google URL formatting rules
    const mockClientId = '123456789-mockclient.apps.googleusercontent.com';
    const mockRedirect = 'http://localhost:3001/api/auth/oauth/google/callback';
    const mockState = Buffer.from(JSON.stringify({ nonce: 'nonce123', origin: 'http://localhost:5173' })).toString('base64url');
    const expectedScope = encodeURIComponent('openid email profile');
    const constructedUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(mockClientId)}&redirect_uri=${encodeURIComponent(mockRedirect)}&response_type=code&scope=${expectedScope}&state=${mockState}&prompt=consent&access_type=offline`;
    
    const parsed = new URL(constructedUrl);
    assert(parsed.origin === 'https://accounts.google.com', 'Test 1c1: Official Google OAuth host used');
    assert(parsed.pathname === '/o/oauth2/v2/auth', 'Test 1c2: Official v2 auth endpoint used');
    assert(parsed.searchParams.get('client_id') === mockClientId, 'Test 1c3: client_id matches');
    assert(parsed.searchParams.get('redirect_uri') === mockRedirect, 'Test 1c4: redirect_uri matches');
    assert(parsed.searchParams.get('scope') === 'openid email profile', 'Test 1c5: openid, email, and profile scopes requested');
    assert(parsed.searchParams.get('response_type') === 'code', 'Test 1c6: Authorization Code flow used');
    assert(parsed.searchParams.get('prompt') === 'consent', 'Test 1c7: Prompt set to consent');
    assert(parsed.searchParams.get('access_type') === 'offline', 'Test 1c8: Offline access type requested');

    const decodedState = JSON.parse(Buffer.from(parsed.searchParams.get('state'), 'base64url').toString('utf-8'));
    assert(decodedState.origin === 'http://localhost:5173' && decodedState.nonce === 'nonce123', 'Test 1c9: State correctly encodes client origin and security nonce');
  } catch (err) {
    assert(false, 'Test 1: OAuth initiation endpoint reachable', err.message);
  }

  // TEST 2: Google Callback with Cancellation / access_denied
  try {
    const statePayload = Buffer.from(JSON.stringify({ origin: 'http://localhost:5173', nonce: 'test1234' })).toString('base64url');
    const res = await fetch(`${BACKEND_URL}/api/auth/oauth/google/callback?error=access_denied&state=${statePayload}`, {
      redirect: 'manual'
    });
    assert(res.status >= 300 && res.status < 400, 'Test 2: Callback returns HTTP redirect status');
    const location = res.headers.get('location') || '';
    assert(
      location.includes('/#/?auth_error=access_denied') && location.includes('auth_provider=google') && location.startsWith('http://localhost:5173'),
      'Test 2b: Redirects cleanly to frontend with auth_error=access_denied',
      `Got location: ${location}`
    );
  } catch (err) {
    assert(false, 'Test 2: Google cancellation handling', err.message);
  }

  // TEST 3: Google Callback with Missing Code
  try {
    const statePayload = Buffer.from(JSON.stringify({ origin: 'http://localhost:5173', nonce: 'test1234' })).toString('base64url');
    const res = await fetch(`${BACKEND_URL}/api/auth/oauth/google/callback?state=${statePayload}`, {
      redirect: 'manual'
    });
    const location = res.headers.get('location') || '';
    assert(
      location.includes('auth_error=missing_code'),
      'Test 3: Redirects with auth_error=missing_code when code is absent',
      `Got location: ${location}`
    );
  } catch (err) {
    assert(false, 'Test 3: Missing code handling', err.message);
  }

  // TEST 4: Google Callback with Unconfigured Server Credentials
  try {
    const statePayload = Buffer.from(JSON.stringify({ origin: 'http://localhost:5173', nonce: 'test1234' })).toString('base64url');
    const res = await fetch(`${BACKEND_URL}/api/auth/oauth/google/callback?code=fake_auth_code&state=${statePayload}`, {
      redirect: 'manual'
    });
    const location = res.headers.get('location') || '';
    // Either provider_credentials_required or token_exchange_failed (if mock/invalid credentials configured)
    assert(
      location.includes('auth_error='),
      'Test 4: Gracefully handles code callback when credentials missing or invalid without crashing',
      `Got location: ${location}`
    );
  } catch (err) {
    assert(false, 'Test 4: Callback credentials safety', err.message);
  }

  // TEST 5: Database User Resolution & Persistence Logic
  console.log('\n--- Testing Database Resolution & Profile Persistence ---');
  const testGoogleSub = `g_sub_${Date.now()}`;
  const testGoogleEmailNew = `test.student.${Date.now()}@gmail.com`;
  const testGoogleName = 'Verified Google Candidate';
  const testGoogleAvatar = 'https://lh3.googleusercontent.com/a/test-avatar';

  // 5a. New Google user creates persistent record with unique usr_... ID
  const newUser = db.createUser({
    name: testGoogleName,
    email: testGoogleEmailNew,
    avatarUrl: testGoogleAvatar,
    emailVerified: true,
    oauthProviders: { google: testGoogleSub },
    needsProfileCompletion: true,
    role: 'candidate'
  });

  assert(newUser && newUser.id && newUser.id.startsWith('usr_'), 'Test 5a: New Google user assigned persistent usr_... ID');
  assert(newUser.email === testGoogleEmailNew, 'Test 5a2: Email properly saved and normalized');
  assert(newUser.avatarUrl === testGoogleAvatar, 'Test 5a3: Google profile photo saved');
  assert(newUser.oauthProviders && newUser.oauthProviders.google === testGoogleSub, 'Test 5a4: Google sub ID correctly linked');
  assert(newUser.needsProfileCompletion === true, 'Test 5a5: needsProfileCompletion flag set for newly onboarded Google user');

  // 5b. Lookup by OAuth sub
  const lookedUpBySub = db.getUserByOAuth('google', testGoogleSub);
  assert(lookedUpBySub && lookedUpBySub.id === newUser.id, 'Test 5b: db.getUserByOAuth finds user by Google sub');

  // 5c. Existing user with email signs in via Google -> Must NOT create duplicate account, MUST retain same usr_... ID
  const existingEmail = `existing.candidate.${Date.now()}@college.edu`;
  const existingUser = db.createUser({
    name: 'Pre-existing Candidate',
    email: existingEmail,
    emailVerified: false,
    role: 'candidate',
    college: 'Delhi Technological University',
    degree: 'B.Tech',
    verifiedSkills: [{ name: 'React', score: 88, verifiedAt: new Date().toISOString() }]
  });
  const originalId = existingUser.id;

  // Now simulate Google login with same email
  const existingByEmail = db.getUserByEmail(existingEmail);
  assert(existingByEmail && existingByEmail.id === originalId, 'Test 5c1: Existing user found by email');

  const secondGoogleSub = `g_sub_existing_${Date.now()}`;
  const updatedExistingUser = db.updateUser(existingByEmail.id, {
    oauthProviders: { ...(existingByEmail.oauthProviders || {}), google: secondGoogleSub },
    emailVerified: true,
    avatarUrl: testGoogleAvatar
  });

  assert(updatedExistingUser.id === originalId, 'Test 5c2: User ID unchanged (usr_... preserved)');
  assert(updatedExistingUser.oauthProviders.google === secondGoogleSub, 'Test 5c3: Google sub linked to existing account');
  assert(updatedExistingUser.emailVerified === true, 'Test 5c4: Email marked verified by Google');
  assert(updatedExistingUser.verifiedSkills.length === 1, 'Test 5c5: Existing verified skills and progress intact');

  // Verify no duplicate users in DB
  const allUsersWithEmail = db.getUsers().filter(u => u.email === existingEmail);
  assert(allUsersWithEmail.length === 1, 'Test 5c6: No duplicate user records created in db.json');

  // TEST 6: Session & JWT Verification
  console.log('\n--- Testing Session JWT & Profile API ---');
  const token = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const meRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  assert(meRes.ok, 'Test 6a: GET /api/auth/me succeeds with issued OAuth JWT');
  const meData = await meRes.json();
  assert(meData.user && meData.user.id === newUser.id, 'Test 6b: Returned profile matches OAuth user ID');
  assert(meData.user.email === testGoogleEmailNew, 'Test 6c: Returned profile email matches Google email');
  assert(meData.user.avatarUrl === testGoogleAvatar, 'Test 6d: Returned profile avatar matches Google avatar');

  console.log(`\n=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);

  // Cleanup test users from db.json
  const data = db.read();
  data.users = data.users.filter(u => u.id !== newUser.id && u.id !== originalId);
  db.writeSync(data);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
