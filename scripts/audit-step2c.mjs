// scripts/audit-step2c.mjs
import { technologyDomains } from '../src/data/domainsData.js';
import { comprehensiveCareerRoles, getCareerRoleById, getCareerRoleByTitle } from '../src/data/careerRolesData.js';

const canonicalIds = new Set(comprehensiveCareerRoles.map((r) => r.id));
const canonicalTitles = new Set(comprehensiveCareerRoles.map((r) => r.title));

console.log('=== AUDITING ALL 18 DOMAINS FOR ROLE MATCHES ===\n');

let totalRolesAudited = 0;
let exactTitleMatches = 0;
let exactIdMatches = 0;
let mismatchedRoles = [];

technologyDomains.forEach((domain) => {
  console.log(`\n[Domain: ${domain.id}] "${domain.name}"`);
  const roles = [
    { field: 'primaryRole', val: domain.primaryRole },
    ...(domain.suggestedRoles || []).map((r, i) => ({ field: `suggestedRoles[${i}]`, val: r }))
  ];

  roles.forEach(({ field, val }) => {
    totalRolesAudited++;
    const isExactId = canonicalIds.has(val);
    const isExactTitle = canonicalTitles.has(val);
    const resolvedById = getCareerRoleById(val);
    const resolvedByTitle = getCareerRoleByTitle(val);
    const resolved = resolvedById || resolvedByTitle;

    if (isExactId) exactIdMatches++;
    if (isExactTitle) exactTitleMatches++;

    const status = isExactId ? 'EXACT_ID' : isExactTitle ? 'EXACT_TITLE' : 'MISMATCH';
    if (!isExactId && !isExactTitle) {
      mismatchedRoles.push({
        domainId: domain.id,
        domainName: domain.name,
        field,
        val,
        resolvedId: resolved ? resolved.id : 'NONE',
        resolvedTitle: resolved ? resolved.title : 'NONE'
      });
    }

    console.log(`  - ${field}: "${val}" [${status}] -> resolves to "${resolved?.id}" ("${resolved?.title}")`);
  });
});

console.log('\n=================================================');
console.log(`Total Roles Audited: ${totalRolesAudited}`);
console.log(`Exact Title Matches: ${exactTitleMatches}`);
console.log(`Exact ID Matches: ${exactIdMatches}`);
console.log(`Mismatched/Orphaned: ${mismatchedRoles.length}`);
if (mismatchedRoles.length > 0) {
  console.log('Mismatches Details:');
  console.log(JSON.stringify(mismatchedRoles, null, 2));
}
console.log('=== SEARCHING FOR HISTORICAL MISMATCHES IN CODEBASE ===\n');
import fs from 'fs';
import path from 'path';

function searchFiles(dir, terms) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist', '.gemini'].includes(entry.name)) {
        searchFiles(full, terms);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.jsx') || entry.name.endsWith('.json') || entry.name.endsWith('.md'))) {
      const content = fs.readFileSync(full, 'utf-8');
      terms.forEach((term) => {
        if (content.includes(term)) {
          console.log(`Found "${term}" in: ${full}`);
        }
      });
    }
  }
}

searchFiles('.', ['Enterprise Application Developer', 'Site Reliability Engineer', 'Security Analyst']);

