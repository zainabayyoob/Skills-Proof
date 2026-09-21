// scripts/test-domain-career-tracks.mjs
// Step 2C Verification Suite: Domain -> Career Track Canonical Mapping

import assert from 'assert';
import {
  technologyDomains,
  getDomainById,
  getDomainByIdOrName,
  getSuggestedRolesForDomain,
  getSuggestedRoleIdsForDomain,
  getSuggestedRoleTitlesForDomain,
  getSuggestedCareerTracksForDomain
} from '../src/data/domainsData.js';
import {
  comprehensiveCareerRoles,
  getCareerRoleById,
  getCareerRoleByTitle
} from '../src/data/careerRolesData.js';

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

console.log('\n========================================================');
console.log('STEP 2C: DOMAIN -> CAREER TRACK CANONICAL MAPPING TESTS');
console.log('========================================================\n');

const canonicalTrackIds = new Set(comprehensiveCareerRoles.map((r) => r.id));
const canonicalTrackTitles = new Set(comprehensiveCareerRoles.map((r) => r.title));

// --- 1. AUDIT ALL 18 DOMAINS ---
console.log('1. Checking All 18 Domains for Canonical Role IDs...');

test('Exactly 18 technology domains exist', () => {
  assert.strictEqual(technologyDomains.length, 18);
});

test('Every domain primaryRoleId exists and is an exact canonical career-track ID', () => {
  technologyDomains.forEach((d) => {
    assert(d.primaryRoleId, `Domain ${d.id} missing primaryRoleId`);
    assert(
      canonicalTrackIds.has(d.primaryRoleId),
      `Domain ${d.id} primaryRoleId "${d.primaryRoleId}" is NOT in 23 canonical tracks`
    );
    const resolved = getCareerRoleById(d.primaryRoleId);
    assert(resolved, `Failed to resolve primaryRoleId "${d.primaryRoleId}" via getCareerRoleById`);
    assert.strictEqual(resolved.id, d.primaryRoleId);
  });
});

test('Every suggested role in every domain is a valid canonical career-track ID', () => {
  technologyDomains.forEach((d) => {
    const suggestions = d.suggestedRoleIds || d.suggestedRoles;
    assert(Array.isArray(suggestions) && suggestions.length > 0, `Domain ${d.id} has empty suggestions`);
    suggestions.forEach((roleId) => {
      assert(
        canonicalTrackIds.has(roleId),
        `Domain ${d.id} has non-canonical suggested role ID: "${roleId}"`
      );
      const track = getCareerRoleById(roleId);
      assert(track, `getCareerRoleById("${roleId}") returned null`);
      assert.strictEqual(track.id, roleId);
    });
  });
});

test('Every suggested role resolves directly to getCareerRoleById(canonicalRoleId)', () => {
  technologyDomains.forEach((d) => {
    d.suggestedRoles.forEach((roleId) => {
      const track = getCareerRoleById(roleId);
      assert.strictEqual(track.id, roleId);
      assert(canonicalTrackTitles.has(track.title));
    });
  });
});

test('No domain suggestion silently falls back to track-swe when it should not', () => {
  // Only domains genuinely focused on software engineering (cs-software-dev, other) or
  // having SWE as a multi-role option should include track-swe
  const nonSweDomains = [
    'data-science',
    'ai-ml',
    'cloud-computing',
    'devops',
    'database-sql',
    'uiux-design',
    'business-product-mgmt'
  ];

  nonSweDomains.forEach((domId) => {
    const dom = getDomainById(domId);
    assert(dom, `Domain ${domId} not found`);
    assert.notStrictEqual(
      dom.primaryRoleId,
      'track-swe',
      `Domain ${domId} should not have primaryRoleId as track-swe`
    );
    const suggestions = getSuggestedRoleIdsForDomain(domId);
    assert(
      !suggestions.includes('track-swe'),
      `Domain ${domId} suggestions should not contain track-swe, got: ${suggestions.join(', ')}`
    );
  });
});

// --- 2. REPRESENTATIVE DOMAIN CHECKS ---
console.log('\n2. Checking Representative Domains...');

test('Computer Science (cs-software-dev) suggests SWE, Full Stack, and Backend', () => {
  const dom = getDomainById('cs-software-dev');
  assert.strictEqual(dom.primaryRoleId, 'track-swe');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-swe', 'track-fullstack', 'track-backend']);
});

test('Cybersecurity (cybersecurity) suggests Cybersecurity, Network, and DevOps', () => {
  const dom = getDomainById('cybersecurity');
  assert.strictEqual(dom.primaryRoleId, 'track-cybersecurity');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-cybersecurity', 'track-network', 'track-devops']);
});

test('Data Science (data-science) suggests Data Scientist, Data Analyst, ML Engineer', () => {
  const dom = getDomainById('data-science');
  assert.strictEqual(dom.primaryRoleId, 'track-data-scientist');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-data-scientist', 'track-data-analyst', 'track-ml-eng']);
});

test('AI/ML (ai-ml) suggests AI Engineer, ML Engineer, GenAI Engineer', () => {
  const dom = getDomainById('ai-ml');
  assert.strictEqual(dom.primaryRoleId, 'track-ai-eng');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-ai-eng', 'track-ml-eng', 'track-genai']);
});

test('Web Development (web-development) suggests Full Stack, Frontend, Backend', () => {
  const dom = getDomainById('web-development');
  assert.strictEqual(dom.primaryRoleId, 'track-fullstack');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-fullstack', 'track-frontend', 'track-backend']);
});

test('Cloud Computing (cloud-computing) suggests Cloud Engineer, DevOps, Solutions Architect', () => {
  const dom = getDomainById('cloud-computing');
  assert.strictEqual(dom.primaryRoleId, 'track-cloud-eng');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-cloud-eng', 'track-devops', 'track-solutions-architect']);
});

test('DevOps (devops) suggests DevOps, Cloud Engineer, QA / Automation', () => {
  const dom = getDomainById('devops');
  assert.strictEqual(dom.primaryRoleId, 'track-devops');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-devops', 'track-cloud-eng', 'track-qa']);
});

test('Networking (networking) suggests Network Engineer, Cybersecurity, Cloud Engineer', () => {
  const dom = getDomainById('networking');
  assert.strictEqual(dom.primaryRoleId, 'track-network');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-network', 'track-cybersecurity', 'track-cloud-eng']);
});

test('UI/UX (uiux-design) suggests UI/UX Designer, Frontend, Product Manager', () => {
  const dom = getDomainById('uiux-design');
  assert.strictEqual(dom.primaryRoleId, 'track-uiux');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-uiux', 'track-frontend', 'track-pm']);
});

test('QA (qa-software-testing) suggests QA Engineer, Software Engineer, DevOps', () => {
  const dom = getDomainById('qa-software-testing');
  assert.strictEqual(dom.primaryRoleId, 'track-qa');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-qa', 'track-swe', 'track-devops']);
});

test('Business/Product (business-product-mgmt) suggests PM, BA, Solutions Architect', () => {
  const dom = getDomainById('business-product-mgmt');
  assert.strictEqual(dom.primaryRoleId, 'track-pm');
  assert.deepStrictEqual(dom.suggestedRoleIds, ['track-pm', 'track-ba', 'track-solutions-architect']);
});

// --- 3. AUDIT MISMATCHES RESOLUTION ---
console.log('\n3. Checking Previous Mismatched / Orphaned Roles in Aliases...');

test('"Enterprise Application Developer" resolves to track-backend', () => {
  const resolved = getCareerRoleByTitle('Enterprise Application Developer');
  assert.strictEqual(resolved.id, 'track-backend');
  assert.strictEqual(resolved.title, 'Backend Developer');
});

test('"Site Reliability Engineer" resolves to track-devops', () => {
  const resolved = getCareerRoleByTitle('Site Reliability Engineer');
  assert.strictEqual(resolved.id, 'track-devops');
  assert.strictEqual(resolved.title, 'DevOps Engineer');
});

test('"Security Analyst" resolves to track-cybersecurity', () => {
  const resolved = getCareerRoleByTitle('Security Analyst');
  assert.strictEqual(resolved.id, 'track-cybersecurity');
  assert.strictEqual(resolved.title, 'Cybersecurity Engineer / Analyst');
});

// --- 4. HELPER FUNCTIONS INTEGRITY ---
console.log('\n4. Checking Helper Functions...');

test('getSuggestedRolesForDomain returns canonical IDs', () => {
  const roles = getSuggestedRolesForDomain('cloud-computing');
  assert.deepStrictEqual(roles, ['track-cloud-eng', 'track-devops', 'track-solutions-architect']);
});

test('getSuggestedRoleTitlesForDomain returns human-readable canonical titles', () => {
  const titles = getSuggestedRoleTitlesForDomain('cloud-computing');
  assert.deepStrictEqual(titles, ['Cloud Engineer', 'DevOps Engineer', 'Solutions Architect']);
});

test('getSuggestedCareerTracksForDomain returns complete track objects', () => {
  const tracks = getSuggestedCareerTracksForDomain('cloud-computing');
  assert.strictEqual(tracks.length, 3);
  assert.strictEqual(tracks[0].id, 'track-cloud-eng');
  assert.strictEqual(tracks[0].title, 'Cloud Engineer');
  assert.strictEqual(tracks[1].id, 'track-devops');
  assert.strictEqual(tracks[2].id, 'track-solutions-architect');
});

console.log('\n========================================================');
console.log(`ALL TESTS PASSED: ${passedTests}/${totalTests}`);
console.log('========================================================\n');
