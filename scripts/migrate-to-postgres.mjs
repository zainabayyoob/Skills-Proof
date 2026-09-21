import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^(?:export\s+)?([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (match) {
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[match[1]] = val;
    }
  }
  return env;
}

const env = { ...loadEnv(), ...process.env };
const dbUrl = env.DATABASE_URL;

if (!dbUrl) {
  console.error('[Migration Error] DATABASE_URL is not configured in .env or environment.');
  process.exit(1);
}

const AUTHORIZED_USER_IDS = new Set(['SP-ADM-ROOT01', 'SP-STU-3RTMJU1T']);

export async function runMigration(poolInstance = null) {
  const pool = poolInstance || new pg.Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  const client = await pool.connect();
  console.log('========================================================================');
  console.log('       SkillProof — PostgreSQL Migration to Neon (Transactional)       ');
  console.log('========================================================================');

  try {
    await client.query('BEGIN');

    // 1. Create schema_migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'candidate',
        password_hash VARCHAR(255) NOT NULL,
        country_code VARCHAR(10) DEFAULT '+91',
        phone VARCHAR(50),
        phone_verified BOOLEAN DEFAULT false,
        phone_verification_code VARCHAR(20),
        email_verified BOOLEAN DEFAULT false,
        email_verification_code VARCHAR(20),
        college VARCHAR(255),
        college_id VARCHAR(100),
        degree VARCHAR(255),
        graduation_year INT,
        academic_year VARCHAR(50),
        semester VARCHAR(50),
        gender VARCHAR(50),
        target_role VARCHAR(255),
        target_role_id VARCHAR(100),
        primary_domain VARCHAR(255),
        domain_id VARCHAR(100),
        secondary_domains JSONB DEFAULT '[]'::jsonb,
        professional_headline TEXT,
        location VARCHAR(255) DEFAULT 'India',
        soft_skills JSONB DEFAULT '["Problem Solving", "Team Collaboration", "Technical Communication"]'::jsonb,
        career_preferences JSONB DEFAULT '{"preferredType": "Internship", "workMode": "Hybrid"}'::jsonb,
        career_readiness INT DEFAULT 0,
        verified_skills JSONB DEFAULT '[]'::jsonb,
        skills JSONB DEFAULT '[]'::jsonb,
        projects JSONB DEFAULT '[]'::jsonb,
        certifications JSONB DEFAULT '[]'::jsonb,
        experience JSONB DEFAULT '[]'::jsonb,
        achievements JSONB DEFAULT '[]'::jsonb,
        roadmap_progress JSONB DEFAULT '{}'::jsonb,
        skill_gaps JSONB DEFAULT '[]'::jsonb,
        recommended_roles JSONB DEFAULT '[]'::jsonb,
        notifications JSONB DEFAULT '[]'::jsonb,
        resume_meta JSONB,
        resume_analysis JSONB,
        oauth_providers JSONB DEFAULT '{}'::jsonb,
        reset_password_token VARCHAR(255),
        reset_password_expires BIGINT,
        is_deactivated BOOLEAN DEFAULT false,
        deactivated_at TIMESTAMPTZ,
        deactivated_by VARCHAR(50),
        passport_hash VARCHAR(100),
        avatar_url TEXT,
        photo_file_path TEXT,
        photo_mime_type VARCHAR(100),
        bio TEXT,
        github TEXT,
        linkedin TEXT,
        needs_profile_completion BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_student_id ON users(student_id);
    `);

    // 3. Create stored_files table for resumes and photos
    await client.query(`
      CREATE TABLE IF NOT EXISTS stored_files (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        file_type VARCHAR(50) NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_size BIGINT NOT NULL,
        sha256 VARCHAR(64) NOT NULL,
        file_data BYTEA NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_stored_files_user_type ON stored_files(user_id, file_type);
    `);

    // 4. Create test_attempts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_attempts (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        skill_id VARCHAR(100) NOT NULL,
        skill_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        score INT,
        started_at TIMESTAMPTZ NOT NULL,
        completed_at TIMESTAMPTZ,
        question_mappings JSONB,
        answers JSONB,
        compiler_results JSONB,
        total_questions INT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_test_attempts_user ON test_attempts(user_id);
    `);

    // 5. Create opportunities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS opportunities (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        work_mode VARCHAR(50) NOT NULL,
        stipend VARCHAR(100),
        type VARCHAR(50) NOT NULL,
        duration VARCHAR(100),
        target_role VARCHAR(255) NOT NULL,
        eligibility TEXT,
        required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
        description TEXT,
        openings INT DEFAULT 1,
        posted_date VARCHAR(50),
        source VARCHAR(100),
        official_url TEXT,
        application_type VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 6. Create applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(100) PRIMARY KEY,
        opportunity_id VARCHAR(100) NOT NULL,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        student_id VARCHAR(50) NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        student_email VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Applied',
        status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
        fit_score INT DEFAULT 0,
        verified_skills_count INT DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_updated TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
      CREATE INDEX IF NOT EXISTS idx_applications_opp ON applications(opportunity_id);
    `);

    // 7. Create company_profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS company_profiles (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255) NOT NULL,
        industry VARCHAR(255),
        website TEXT,
        location VARCHAR(255),
        contact_email VARCHAR(255),
        description TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 8. Create shortlisted_candidates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS shortlisted_candidates (
        id VARCHAR(100) PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        student_id VARCHAR(50) NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        role_title VARCHAR(255),
        shortlisted_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_shortlist_unique ON shortlisted_candidates(company_id, student_id);
    `);

    // 9. Create student_groups table
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_groups (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        students_count INT DEFAULT 0,
        active_assessments INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 10. Create assigned_assessments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS assigned_assessments (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        group_name VARCHAR(255) NOT NULL,
        skill VARCHAR(100) NOT NULL,
        deadline VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        assigned_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 11. Create faculty_data table
    await client.query(`
      CREATE TABLE IF NOT EXISTS faculty_data (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'primary',
        data JSONB NOT NULL
      );
    `);

    console.log('• Tables verified / created successfully.');

    // 12. Read local db.json
    const dbJsonPath = path.join(rootDir, 'server', 'data', 'db.json');
    if (!fs.existsSync(dbJsonPath)) {
      throw new Error(`db.json not found at ${dbJsonPath}`);
    }
    const dbJson = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

    // --- Migrate Users (ONLY Authorized Users) ---
    const allUsers = dbJson.users || [];
    const authorizedUsers = allUsers.filter(u => AUTHORIZED_USER_IDS.has(u.id));
    const excludedUsers = allUsers.filter(u => !AUTHORIZED_USER_IDS.has(u.id));

    console.log(`• Total users in db.json   : ${allUsers.length}`);
    console.log(`• Authorized for migration : ${authorizedUsers.length} (${authorizedUsers.map(u => `${u.id} - ${u.email}`).join(', ')})`);
    console.log(`• Excluded test fixtures   : ${excludedUsers.length} test accounts`);

    for (const u of authorizedUsers) {
      const query = `
        INSERT INTO users (
          id, student_id, name, email, role, password_hash, country_code, phone,
          phone_verified, email_verified, college, college_id, degree, graduation_year,
          academic_year, semester, gender, target_role, target_role_id, primary_domain,
          domain_id, secondary_domains, professional_headline, location, soft_skills,
          career_preferences, career_readiness, verified_skills, skills, projects,
          certifications, experience, achievements, roadmap_progress, skill_gaps,
          recommended_roles, notifications, resume_meta, resume_analysis, oauth_providers,
          is_deactivated, deactivated_at, deactivated_by, passport_hash, avatar_url,
          photo_file_path, photo_mime_type, bio, github, linkedin, needs_profile_completion,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
          $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32,
          $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47,
          $48, $49, $50, $51, $52, $53
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          password_hash = EXCLUDED.password_hash,
          verified_skills = EXCLUDED.verified_skills,
          skills = EXCLUDED.skills,
          projects = EXCLUDED.projects,
          certifications = EXCLUDED.certifications,
          experience = EXCLUDED.experience,
          achievements = EXCLUDED.achievements,
          roadmap_progress = EXCLUDED.roadmap_progress,
          skill_gaps = EXCLUDED.skill_gaps,
          recommended_roles = EXCLUDED.recommended_roles,
          notifications = EXCLUDED.notifications,
          resume_meta = EXCLUDED.resume_meta,
          resume_analysis = EXCLUDED.resume_analysis,
          updated_at = NOW();
      `;

      await client.query(query, [
        u.id,
        u.studentId || u.id,
        u.name || 'User',
        u.email.toLowerCase().trim(),
        u.role || 'candidate',
        u.passwordHash,
        u.countryCode || '+91',
        u.phone || '',
        Boolean(u.phoneVerified),
        Boolean(u.emailVerified),
        u.college || null,
        u.collegeId || null,
        u.degree || null,
        u.graduationYear || null,
        u.academicYear || null,
        u.semester || null,
        u.gender || null,
        u.targetRole || null,
        u.targetRoleId || null,
        u.primaryDomain || null,
        u.domainId || null,
        JSON.stringify(u.secondaryDomains || []),
        u.professionalHeadline || '',
        u.location || 'India',
        JSON.stringify(u.softSkills || []),
        JSON.stringify(u.careerPreferences || {}),
        u.careerReadiness || 0,
        JSON.stringify(u.verifiedSkills || []),
        JSON.stringify(u.skills || u.verifiedSkills || []),
        JSON.stringify(u.projects || []),
        JSON.stringify(u.certifications || []),
        JSON.stringify(u.experience || []),
        JSON.stringify(u.achievements || []),
        JSON.stringify(u.roadmapProgress || {}),
        JSON.stringify(u.skillGaps || []),
        JSON.stringify(u.recommendedRoles || []),
        JSON.stringify(u.notifications || []),
        u.resume ? JSON.stringify(u.resume) : null,
        u.resumeAnalysis ? JSON.stringify(u.resumeAnalysis) : null,
        JSON.stringify(u.oauthProviders || {}),
        Boolean(u.isDeactivated),
        u.deactivatedAt || null,
        u.deactivatedBy || null,
        u.passportHash || null,
        u.avatarUrl || null,
        u.photoFilePath || null,
        u.photoMimeType || null,
        u.bio || '',
        u.github || '',
        u.linkedin || '',
        Boolean(u.needsProfileCompletion),
        u.createdAt || new Date().toISOString(),
        u.updatedAt || new Date().toISOString()
      ]);
    }

    // --- Migrate Stored Binary Files ---
    let filesMigrated = 0;
    const resumesDir = path.join(rootDir, 'server', 'uploads', 'resumes');
    const photosDir = path.join(rootDir, 'server', 'uploads', 'photos');

    // 1. Resume for SP-STU-3RTMJU1T
    const candidateUser = authorizedUsers.find(u => u.id === 'SP-STU-3RTMJU1T');
    if (candidateUser && candidateUser.resume && candidateUser.resume.filePath) {
      const resumeDiskPath = path.resolve(candidateUser.resume.filePath);
      if (fs.existsSync(resumeDiskPath)) {
        const fileBuffer = fs.readFileSync(resumeDiskPath);
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        const fileId = `file_res_${candidateUser.id}`;

        await client.query(`
          INSERT INTO stored_files (
            id, user_id, file_type, original_filename, mime_type, file_size, sha256, file_data, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET
            original_filename = EXCLUDED.original_filename,
            mime_type = EXCLUDED.mime_type,
            file_size = EXCLUDED.file_size,
            sha256 = EXCLUDED.sha256,
            file_data = EXCLUDED.file_data,
            updated_at = NOW();
        `, [
          fileId,
          candidateUser.id,
          'resume',
          candidateUser.resume.fileName || 'Resume.pdf',
          candidateUser.resume.fileType || 'application/pdf',
          fileBuffer.length,
          hash,
          fileBuffer
        ]);
        filesMigrated++;
        console.log(`• Stored resume migrated  : ${candidateUser.resume.fileName} (${(fileBuffer.length / 1024).toFixed(1)} KB, SHA-256: ${hash.substring(0, 12)}...)`);
      }
    }

    // 2. Photo for SP-STU-3RTMJU1T
    if (candidateUser && candidateUser.photoFilePath) {
      const photoDiskPath = path.resolve(candidateUser.photoFilePath);
      if (fs.existsSync(photoDiskPath)) {
        const photoBuffer = fs.readFileSync(photoDiskPath);
        const hash = crypto.createHash('sha256').update(photoBuffer).digest('hex');
        const fileId = `file_photo_${candidateUser.id}`;

        await client.query(`
          INSERT INTO stored_files (
            id, user_id, file_type, original_filename, mime_type, file_size, sha256, file_data, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET
            original_filename = EXCLUDED.original_filename,
            mime_type = EXCLUDED.mime_type,
            file_size = EXCLUDED.file_size,
            sha256 = EXCLUDED.sha256,
            file_data = EXCLUDED.file_data,
            updated_at = NOW();
        `, [
          fileId,
          candidateUser.id,
          'photo',
          path.basename(photoDiskPath),
          candidateUser.photoMimeType || 'image/jpeg',
          photoBuffer.length,
          hash,
          photoBuffer
        ]);
        filesMigrated++;
        console.log(`• Stored photo migrated   : ${path.basename(photoDiskPath)} (${(photoBuffer.length / 1024).toFixed(1)} KB, SHA-256: ${hash.substring(0, 12)}...)`);
      }
    }

    // --- Migrate Test Attempts (Authorized user only) ---
    const allAttempts = dbJson.testAttempts || [];
    const authorizedAttempts = allAttempts.filter(t => AUTHORIZED_USER_IDS.has(t.userId));
    const orphanedAttempts = allAttempts.filter(t => !AUTHORIZED_USER_IDS.has(t.userId));

    console.log(`• Total test attempts     : ${allAttempts.length}`);
    console.log(`• Authorized attempts     : ${authorizedAttempts.length}`);
    console.log(`• Discarded guest attempts: ${orphanedAttempts.length} (orphaned test runs without user account)`);

    for (const t of authorizedAttempts) {
      await client.query(`
        INSERT INTO test_attempts (
          id, user_id, skill_id, skill_name, status, score, started_at, completed_at,
          question_mappings, answers, compiler_results, total_questions, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO NOTHING;
      `, [
        t.id,
        t.userId,
        t.skillId || 'unknown',
        t.skillName || t.skillId || 'Skill',
        t.status || 'completed',
        t.score || 0,
        t.startedAt || new Date().toISOString(),
        t.completedAt || null,
        JSON.stringify(t.questionMappings || null),
        JSON.stringify(t.answers || null),
        JSON.stringify(t.compilerResults || null),
        t.totalQuestions || null,
        t.createdAt || t.startedAt || new Date().toISOString()
      ]);
    }

    // --- Migrate Opportunities (All 15 Canonical Opportunities) ---
    const opportunities = dbJson.opportunities || [];
    console.log(`• Canonical opportunities : ${opportunities.length} opportunities`);

    for (const opp of opportunities) {
      await client.query(`
        INSERT INTO opportunities (
          id, title, company, location, work_mode, stipend, type, duration,
          target_role, eligibility, required_skills, description, openings,
          posted_date, source, official_url, application_type, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          company = EXCLUDED.company,
          required_skills = EXCLUDED.required_skills,
          eligibility = EXCLUDED.eligibility,
          target_role = EXCLUDED.target_role,
          description = EXCLUDED.description;
      `, [
        opp.id,
        opp.title,
        opp.company,
        opp.location || 'Remote',
        opp.workMode || 'Remote',
        opp.stipend || 'Competitive',
        opp.type || 'Internship',
        opp.duration || '3 Months',
        opp.targetRole,
        opp.eligibility || 'B.Tech / MCA',
        JSON.stringify(opp.requiredSkills || []),
        opp.description || '',
        opp.openings || 1,
        opp.postedDate || 'Active',
        opp.source || 'SkillProof Platform',
        opp.officialUrl || null,
        opp.applicationType || 'direct',
        opp.createdAt || new Date().toISOString()
      ]);
    }

    // --- Migrate Student Groups ---
    const groups = dbJson.studentGroups || [];
    for (const g of groups) {
      await client.query(`
        INSERT INTO student_groups (
          id, name, department, students_count, active_assessments, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          department = EXCLUDED.department,
          students_count = EXCLUDED.students_count;
      `, [
        g.id,
        g.name,
        g.department,
        g.studentsCount || 0,
        g.activeAssessments || 0,
        g.createdAt || new Date().toISOString()
      ]);
    }

    // --- Migrate Faculty Data ---
    if (dbJson.facultyData) {
      await client.query(`
        INSERT INTO faculty_data (id, data)
        VALUES ('primary', $1)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;
      `, [JSON.stringify(dbJson.facultyData)]);
    }

    // --- Record Schema Migration Completion ---
    await client.query(`
      INSERT INTO schema_migrations (version, name, applied_at)
      VALUES (1, 'v1_production_neon_migration', NOW())
      ON CONFLICT (version) DO NOTHING;
    `);

    // --- Strict Parity & Zero-Orphan Verification ---
    const userCountRes = await client.query('SELECT COUNT(*) as count FROM users');
    const oppCountRes = await client.query('SELECT COUNT(*) as count FROM opportunities');
    const attemptCountRes = await client.query('SELECT COUNT(*) as count FROM test_attempts');
    const fileCountRes = await client.query('SELECT COUNT(*) as count FROM stored_files');

    const totalUsers = parseInt(userCountRes.rows[0].count, 10);
    const totalOpps = parseInt(oppCountRes.rows[0].count, 10);
    const totalAttempts = parseInt(attemptCountRes.rows[0].count, 10);
    const totalFiles = parseInt(fileCountRes.rows[0].count, 10);

    if (totalUsers !== authorizedUsers.length) {
      throw new Error(`User count mismatch: expected ${authorizedUsers.length}, found ${totalUsers}`);
    }
    if (totalOpps !== opportunities.length) {
      throw new Error(`Opportunity count mismatch: expected ${opportunities.length}, found ${totalOpps}`);
    }
    if (totalAttempts !== authorizedAttempts.length) {
      throw new Error(`Attempt count mismatch: expected ${authorizedAttempts.length}, found ${totalAttempts}`);
    }

    // Verify zero orphaned foreign keys in test_attempts
    const orphanCheck = await client.query(`
      SELECT t.id, t.user_id FROM test_attempts t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE u.id IS NULL;
    `);
    if (orphanCheck.rows.length > 0) {
      throw new Error(`Detected ${orphanCheck.rows.length} orphaned test attempts with non-existent users!`);
    }

    await client.query('COMMIT');
    console.log('========================================================================');
    console.log('• TRANSACTION COMMITTED SUCCESSFULLY');
    console.log(`• Users in Postgres          : ${totalUsers} (100% authorized)`);
    console.log(`• Excluded Test Users        : ${excludedUsers.length} (filtered)`);
    console.log(`• Opportunities in Postgres  : ${totalOpps}`);
    console.log(`• Test Attempts in Postgres  : ${totalAttempts}`);
    console.log(`• Binary Stored Files        : ${totalFiles} (resumes & photos)`);
    console.log(`• Orphaned Foreign Keys      : 0`);
    console.log('========================================================================\n');

    return {
      success: true,
      totalUsers,
      totalOpps,
      totalAttempts,
      totalFiles,
      excludedUsersCount: excludedUsers.length
    };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n[MIGRATION FAILED - TRANSACTION ROLLED BACK]');
    console.error(err);
    throw err;
  } finally {
    client.release();
    if (!poolInstance) {
      await pool.end();
    }
  }
}

// Run directly if invoked via CLI
const isDirectCall = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/migrate-to-postgres.mjs');
if (isDirectCall) {
  runMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
