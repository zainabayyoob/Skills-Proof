// scripts/test-postgres-persistence.mjs
// Comprehensive verification of SkillProof PostgreSQL persistence & data integrity
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../server/db.js';
import { calculateOpportunityMatch } from '../src/utils/matchingAlgorithm.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const DB_FILE = path.join(rootDir, 'server', 'data', 'db.json');

console.log('===============================================================');
console.log('SkillProof PostgreSQL Persistence & Integrity Verification');
console.log('===============================================================');

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

async function runTests() {
  try {
    // 1. Verify Mode
    console.log('\n--- 1. Connection & Mode Verification ---');
    assert(db.usePostgres === true, 'Database is running in PostgreSQL mode (Neon Pooler)');

    // 2. Anti-Split-Brain Check (record db.json mtime before tests)
    console.log('\n--- 2. Anti-Split-Brain Baseline Check ---');
    const dbJsonStatsBefore = fs.statSync(DB_FILE);
    const dbJsonContentBefore = fs.readFileSync(DB_FILE, 'utf-8');

    // 3. User Persistence & Migration Rules Verification
    console.log('\n--- 3. Users Persistence & Filter Rules ---');
    const allUsers = await db.getUsers();
    assert(allUsers.length >= 2, `Users count is >= 2 (Found: ${allUsers.length})`);

    const admin = await db.getUserById('SP-ADM-ROOT01');
    assert(admin !== null && admin.role === 'admin', 'Root administrator SP-ADM-ROOT01 is persisted and active');

    const candidate = await db.getUserById('SP-STU-3RTMJU1T');
    assert(candidate !== null, 'Candidate THEKEDAR (SP-STU-3RTMJU1T) is persisted in PostgreSQL');
    assert(candidate.email === 'thekedar@gmail.com', `Candidate email matches expected: ${candidate?.email}`);
    assert(Array.isArray(candidate.verifiedSkills), `Candidate verifiedSkills is an array (${candidate?.verifiedSkills?.length} skills)`);
    assert(candidate.resume !== null && candidate.resume.fileName, `Candidate resume metadata persisted: ${candidate?.resume?.fileName}`);

    // Verify 39 test accounts were NOT migrated
    const fakeCanonical = allUsers.filter(u => u.email.includes('domain-canonical.edu') || u.email.includes('@skillproof.edu'));
    assert(fakeCanonical.length === 0, `0 fake/seeded candidate accounts migrated to production PostgreSQL (Found: ${fakeCanonical.length})`);

    // 4. Stored Files Binary Retrieval & SHA-256 Integrity
    console.log('\n--- 4. Stored Files (BYTEA) Integrity Check ---');
    const resumeFile = await db.getStoredFile('SP-STU-3RTMJU1T', 'resume');
    assert(resumeFile !== null, 'Resume file found in stored_files table');
    assert(Buffer.isBuffer(resumeFile.file_data), 'Resume file_data is a valid binary Buffer');
    assert(Number(resumeFile.file_size) === 31921, `Resume file_size is exactly 31,921 bytes (Found: ${resumeFile?.file_size})`);
    
    const calculatedResumeSha = crypto.createHash('sha256').update(resumeFile.file_data).digest('hex');
    assert(calculatedResumeSha === resumeFile.sha256, `Resume SHA-256 integrity verified (${calculatedResumeSha.substring(0, 16)}...)`);

    const photoFile = await db.getStoredFile('SP-STU-3RTMJU1T', 'photo');
    assert(photoFile !== null, 'Photo file found in stored_files table');
    assert(Buffer.isBuffer(photoFile.file_data), 'Photo file_data is a valid binary Buffer');
    assert(Number(photoFile.file_size) === 20582, `Photo file_size is exactly 20,582 bytes (Found: ${photoFile?.file_size})`);
    
    const calculatedPhotoSha = crypto.createHash('sha256').update(photoFile.file_data).digest('hex');
    assert(calculatedPhotoSha === photoFile.sha256, `Photo SHA-256 integrity verified (${calculatedPhotoSha.substring(0, 16)}...)`);

    // 5. Opportunities Persistence
    console.log('\n--- 5. Opportunities Persistence ---');
    const opps = await db.getOpportunities();
    assert(opps.length >= 15, `Opportunities count is >= 15 (Found: ${opps.length})`);
    const googleOpp = opps.find(o => o.id === 'opp-google-swe');
    assert(googleOpp !== null && googleOpp !== undefined, 'Canonical opportunity opp-google-swe (Google) persisted');
    assert(Array.isArray(googleOpp?.requiredSkills) && googleOpp.requiredSkills.length > 0, `Opportunity requiredSkills array parsed correctly (${googleOpp?.requiredSkills?.length} skills)`);

    // 6. Test Attempts Persistence
    console.log('\n--- 6. Test Attempts Persistence ---');
    const attempts = await db.getTestAttemptsByUser('SP-STU-3RTMJU1T');
    assert(attempts.length >= 2, `Test attempts for SP-STU-3RTMJU1T count is >= 2 (Found: ${attempts.length})`);
    const htmlAttempt = attempts.find(a => a.skillId === 'htmlcss');
    assert(htmlAttempt !== null && htmlAttempt !== undefined, `HTML/CSS test attempt persisted for SP-STU-3RTMJU1T (status: ${htmlAttempt?.status})`);

    // 7. CRUD Lifecycle Verification
    console.log('\n--- 7. CRUD Lifecycle Verification ---');
    const tempOppId = `opp_test_${Date.now()}`;
    const newOpp = await db.addOpportunity({
      id: tempOppId,
      title: 'Automated Test Role',
      company: 'TestCorp',
      type: 'Full-time',
      requiredSkills: [{ name: 'Python', minScore: 80 }]
    });
    assert(newOpp.id === tempOppId, `Opportunity created via addOpportunity: ${newOpp.id}`);

    const retrievedOpp = await db.getOpportunityById(tempOppId);
    assert(retrievedOpp !== null && retrievedOpp.title === 'Automated Test Role', 'Retrieved opportunity matches created');

    const newApp = await db.createApplication({
      opportunityId: tempOppId,
      userId: 'SP-STU-3RTMJU1T',
      company: 'TestCorp',
      role: 'Automated Test Role',
      status: 'Applied'
    });
    assert(newApp !== null && newApp.id, `Application created: ${newApp?.id}`);

    const updatedApp = await db.updateApplication(newApp.id, {
      status: 'Shortlisted',
      statusChangeNote: 'Automated verification test'
    });
    assert(updatedApp.status === 'Shortlisted', `Application status updated to Shortlisted (Found: ${updatedApp?.status})`);
    assert(updatedApp.statusHistory.length >= 2, `Application status history tracked correctly (${updatedApp?.statusHistory?.length} events)`);

    const deletedApp = await db.deleteApplication(newApp.id, 'SP-STU-3RTMJU1T');
    assert(deletedApp === true, 'Application deleted successfully');

    const appAfterDelete = await db.getApplicationById(newApp.id);
    assert(appAfterDelete === null, 'Application verified deleted from database');

    // Clean up temporary opportunity
    await db.query('DELETE FROM opportunities WHERE id = $1', [tempOppId]);
    console.log('Cleaned up temporary opportunity');

    // 8. Anti-Split-Brain Post Check
    console.log('\n--- 8. Anti-Split-Brain Integrity Check ---');
    const dbJsonContentAfter = fs.readFileSync(DB_FILE, 'utf-8');
    assert(dbJsonContentBefore === dbJsonContentAfter, 'server/data/db.json remained completely untouched during PostgreSQL operations (NO SPLIT BRAIN)');

    // 9. Matching Parity Verification (Zero formula modification)
    console.log('\n--- 9. Matching Algorithm Parity Check ---');
    const oppForMatching = opps[0];
    const matchResult = calculateOpportunityMatch(oppForMatching, candidate);
    assert(typeof matchResult.matchPercentage === 'number' && matchResult.matchPercentage >= 0, `calculateOpportunityMatch executed successfully on PostgreSQL data: Match = ${matchResult.matchPercentage}%`);
    assert(Array.isArray(matchResult.matchingSkills), `calculateOpportunityMatch matchingSkills returned array (${matchResult.matchingSkills.length} matched)`);

    console.log('\n===============================================================');
    if (failures === 0) {
      console.log('🎉 ALL POSTGRESQL PERSISTENCE & INTEGRITY TESTS PASSED!');
    } else {
      console.error(`💥 FAILED WITH ${failures} ASSERTION FAILURES!`);
    }
    console.log('===============================================================');

  } catch (err) {
    console.error('Fatal error during test execution:', err);
    failures++;
  } finally {
    if (typeof db.close === 'function') {
      await db.close();
    }
    process.exit(failures === 0 ? 0 : 1);
  }
}

runTests();
