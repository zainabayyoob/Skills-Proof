import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pg from 'pg';
import dns from 'dns';
import { fileURLToPath } from 'url';

try {
  dns.setDefaultResultOrder('verbatim');
} catch (_) {}
import { initialOpportunities } from '../src/data/opportunitiesData.js';
import {
  comprehensiveCareerRoles,
  getCareerRoleByTitle,
  defaultCareerRoleId,
  defaultCareerRoleTitle
} from './data/careerRolesData.js';
import {
  getDomainByIdOrName,
  defaultPrimaryDomainId,
  defaultPrimaryDomain
} from './data/domainsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load environment variables from .env if present
const envPath = path.resolve(rootDir, '.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function' && !process.env.DATABASE_URL) {
  try {
    process.loadEnvFile(envPath);
  } catch (err) {
    console.warn('[SkillProof] Warning loading .env file:', err.message);
  }
}

export const roleTracks = comprehensiveCareerRoles;
export const defaultOpportunities = initialOpportunities;

// Helper to safely parse JSON or return fallback
function safeJson(val, fallback = null) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (_) {
    return fallback;
  }
}

// User row to JavaScript object mapper
function mapUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    studentId: row.student_id || row.id,
    name: row.name,
    email: row.email,
    role: row.role || 'candidate',
    passwordHash: row.password_hash,
    countryCode: row.country_code || '+91',
    phone: row.phone || '',
    phoneVerified: Boolean(row.phone_verified),
    phoneVerificationCode: safeJson(row.phone_verification_code, null),
    emailVerified: Boolean(row.email_verified),
    emailVerificationCode: safeJson(row.email_verification_code, null),
    college: row.college || 'Institute of Technology',
    collegeId: row.college_id || null,
    degree: row.degree || 'B.Tech (Bachelor of Technology)',
    graduationYear: row.graduation_year ? Number(row.graduation_year) : 2026,
    academicYear: row.academic_year || '3rd Year',
    semester: row.semester || '6th Semester',
    gender: row.gender || 'Prefer not to say',
    targetRole: row.target_role || defaultCareerRoleTitle,
    targetRoleId: row.target_role_id || defaultCareerRoleId,
    primaryDomain: row.primary_domain || defaultPrimaryDomain,
    domainId: row.domain_id || defaultPrimaryDomainId,
    secondaryDomains: safeJson(row.secondary_domains, []),
    professionalHeadline: row.professional_headline || '',
    location: row.location || 'India',
    softSkills: safeJson(row.soft_skills, ['Problem Solving', 'Team Collaboration', 'Technical Communication']),
    careerPreferences: safeJson(row.career_preferences, { preferredType: 'Internship', workMode: 'Hybrid' }),
    careerReadiness: row.career_readiness !== null ? Number(row.career_readiness) : 0,
    verifiedSkills: safeJson(row.verified_skills, []),
    skills: safeJson(row.skills, safeJson(row.verified_skills, [])),
    projects: safeJson(row.projects, []),
    certifications: safeJson(row.certifications, []),
    experience: safeJson(row.experience, []),
    achievements: safeJson(row.achievements, []),
    roadmapProgress: safeJson(row.roadmap_progress, {}),
    skillGaps: safeJson(row.skill_gaps, []),
    recommendedRoles: safeJson(row.recommended_roles, []),
    notifications: safeJson(row.notifications, []),
    resume: safeJson(row.resume_meta, null),
    resumeAnalysis: safeJson(row.resume_analysis, null),
    oauthProviders: safeJson(row.oauth_providers, {}),
    resetPasswordToken: row.reset_password_token || null,
    resetPasswordExpires: row.reset_password_expires ? Number(row.reset_password_expires) : null,
    isDeactivated: Boolean(row.is_deactivated),
    deactivatedAt: row.deactivated_at ? new Date(row.deactivated_at).toISOString() : null,
    deactivatedBy: row.deactivated_by || null,
    passportHash: row.passport_hash || null,
    avatarUrl: row.avatar_url || null,
    photoFilePath: row.photo_file_path || null,
    photoMimeType: row.photo_mime_type || null,
    bio: row.bio || '',
    github: row.github || '',
    linkedin: row.linkedin || '',
    needsProfileCompletion: Boolean(row.needs_profile_completion),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
  };
}

class Database {
  constructor() {
    this.usePostgres = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
    this.pool = null;

    if (this.usePostgres) {
      console.log('[SkillProof Database] Mode: Persistent PostgreSQL (Neon Pooler)');
      this.pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL.trim(),
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
        max: 10
      });

      this.pool.on('error', (err) => {
        console.error('[SkillProof Database] Unexpected idle client error on PostgreSQL pool:', err.message);
      });
    } else {
      console.warn('[SkillProof Database] Mode: Local JSON File fallback (db.json)');
      this.initLocalJson();
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  // --- Anti-Split-Brain Query Runner ---
  async query(text, params) {
    if (!this.usePostgres) {
      throw new Error('[Database Error] Attempted PostgreSQL query in local JSON fallback mode.');
    }
    try {
      return await this.pool.query(text, params);
    } catch (err) {
      console.error('[PostgreSQL Query Error]', err.message);
      // STRICT ANTI-SPLIT-BRAIN: Never silently fall back to db.json when DATABASE_URL is configured!
      throw err;
    }
  }

  // --- Dynamic calculations (Pure Math - Unchanged) ---
  calculateSkillGapsForRole(targetRoleOrId, verifiedSkills = []) {
    const track = getCareerRoleByTitle(targetRoleOrId) || roleTracks[0];

    return track.requiredSkills.map((req) => {
      const verified = (verifiedSkills || []).find(
        (v) =>
          (v.skillId && v.skillId.toLowerCase() === req.id.toLowerCase()) ||
          (v.name && v.name.toLowerCase() === req.name.toLowerCase())
      );
      const currentScore = verified ? verified.score : 0;
      const gap = Math.max(0, req.minScore - currentScore);

      return {
        skill: req.name,
        skillId: req.id,
        currentScore,
        requiredScore: req.minScore,
        gap,
        status: gap === 0 ? "Verified" : gap <= 15 ? "Moderate Gap" : "Critical Gap",
        action: gap === 0 ? "Skill Verified" : `Prove ${req.name} Skill`
      };
    });
  }

  calculateRoleMatches(verifiedSkills = [], readiness = 0) {
    return roleTracks.map((track) => {
      let matchedCount = 0;
      const totalReq = track.requiredSkills.length;
      (track.requiredSkills || []).forEach((req) => {
        const found = (verifiedSkills || []).find(
          (v) =>
            (v.skillId && v.skillId.toLowerCase() === req.id.toLowerCase()) ||
            (v.name && v.name.toLowerCase() === req.name.toLowerCase())
        );
        if (found && found.score >= req.minScore) {
          matchedCount++;
        }
      });
      const matchPct = totalReq > 0
        ? Math.min(98, Math.round((matchedCount / totalReq) * 85 + (readiness * 0.15)))
        : 0;

      return {
        role: track.title,
        match: matchPct,
        demand: track.demand,
        topMissing: track.requiredSkills
          .filter((req) => !verifiedSkills.some((v) => v.name.toLowerCase() === req.name.toLowerCase() && v.score >= req.minScore))
          .map((req) => req.name)
      };
    });
  }

  generateUserId(role = 'candidate') {
    const cleanRole = (role || '').toLowerCase();
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    if (cleanRole === 'industry' || cleanRole === 'recruiter') {
      return `SP-IND-${token}`;
    }
    if (cleanRole === 'faculty' || cleanRole === 'college') {
      return `SP-FAC-${token}`;
    }
    if (cleanRole === 'admin' || cleanRole === 'host') {
      return `SP-ADM-${token}`;
    }
    return `SP-STU-${token}`;
  }

  // =========================================================================
  // USER OPERATIONS
  // =========================================================================
  async getUsers(filters = {}) {
    if (!this.usePostgres) return this.localGetUsers(filters);

    let sql = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (filters.role && filters.role !== 'all') {
      const r = filters.role.toLowerCase();
      if (r === 'candidate' || r === 'student') {
        sql += ` AND (role = 'candidate' OR role = 'student')`;
      } else if (r === 'faculty' || r === 'college') {
        sql += ` AND (role = 'faculty' OR role = 'college')`;
      } else {
        params.push(r);
        sql += ` AND role = $${params.length}`;
      }
    }

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active') {
        sql += ` AND (is_deactivated IS FALSE OR is_deactivated IS NULL)`;
      } else if (filters.status === 'deactivated') {
        sql += ` AND is_deactivated IS TRUE`;
      }
    }

    if (filters.search) {
      params.push(`%${String(filters.search).trim().toLowerCase()}%`);
      const p = `$${params.length}`;
      sql += ` AND (
        LOWER(id) LIKE ${p} OR
        LOWER(student_id) LIKE ${p} OR
        LOWER(name) LIKE ${p} OR
        LOWER(email) LIKE ${p} OR
        LOWER(college) LIKE ${p} OR
        LOWER(target_role) LIKE ${p} OR
        LOWER(primary_domain) LIKE ${p}
      )`;
    }

    sql += ' ORDER BY created_at ASC';
    const res = await this.query(sql, params);
    return res.rows.map(mapUserRow);
  }

  async getUserById(id) {
    if (!id) return null;
    if (!this.usePostgres) return this.localGetUserById(id);

    const res = await this.query(
      'SELECT * FROM users WHERE id = $1 OR student_id = $1 LIMIT 1',
      [id]
    );
    return res.rows.length > 0 ? mapUserRow(res.rows[0]) : null;
  }

  async getUserByStudentId(studentId) {
    if (!studentId) return null;
    if (!this.usePostgres) return this.localGetUserByStudentId(studentId);

    const clean = String(studentId).trim();
    const res = await this.query(
      'SELECT * FROM users WHERE id = $1 OR student_id = $1 OR passport_hash = $1 LIMIT 1',
      [clean]
    );
    return res.rows.length > 0 ? mapUserRow(res.rows[0]) : null;
  }

  async getUserByEmail(email) {
    if (!email) return null;
    if (!this.usePostgres) return this.localGetUserByEmail(email);

    const clean = String(email).toLowerCase().trim();
    const res = await this.query(
      'SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1',
      [clean]
    );
    return res.rows.length > 0 ? mapUserRow(res.rows[0]) : null;
  }

  async getUserByPhone(countryCode, phone) {
    if (!phone) return null;
    if (!this.usePostgres) return this.localGetUserByPhone(countryCode, phone);

    const clean = String(phone).trim().replace(/[\s\-()]/g, '');
    let sql = 'SELECT * FROM users WHERE phone = $1';
    const params = [clean];
    if (countryCode) {
      params.push(countryCode);
      sql += ' AND country_code = $2';
    }
    sql += ' LIMIT 1';
    const res = await this.query(sql, params);
    return res.rows.length > 0 ? mapUserRow(res.rows[0]) : null;
  }

  async getUserByResetToken(token) {
    if (!token) return null;
    if (!this.usePostgres) return this.localGetUserByResetToken(token);

    const res = await this.query(
      'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2 LIMIT 1',
      [token, Date.now()]
    );
    return res.rows.length > 0 ? mapUserRow(res.rows[0]) : null;
  }

  async getUserByOAuth(provider, providerId) {
    if (!provider || !providerId) return null;
    if (!this.usePostgres) return this.localGetUserByOAuth(provider, providerId);

    const res = await this.query(
      `SELECT * FROM users WHERE oauth_providers->>$1 = $2 LIMIT 1`,
      [provider, providerId]
    );
    return res.rows.length > 0 ? mapUserRow(res.rows[0]) : null;
  }

  async createUser(userData) {
    if (!this.usePostgres) return this.localCreateUser(userData);

    const resolvedRole = getCareerRoleByTitle(userData.targetRoleId || userData.targetRole);
    const targetRoleId = resolvedRole ? resolvedRole.id : defaultCareerRoleId;
    const targetRole = resolvedRole ? resolvedRole.title : (userData.targetRole || defaultCareerRoleTitle);

    const resolvedDomain = getDomainByIdOrName(userData.domainId || userData.primaryDomain);
    const domainId = resolvedDomain ? resolvedDomain.id : defaultPrimaryDomainId;
    const primaryDomain = resolvedDomain ? resolvedDomain.name : (userData.primaryDomain || defaultPrimaryDomain);

    const initialGaps = this.calculateSkillGapsForRole(targetRoleId, []);
    const initialRoles = this.calculateRoleMatches([], 0);

    let userRole = (userData.role || 'candidate').toLowerCase();
    if (userRole === 'college') userRole = 'faculty';
    const userId = userData.id || this.generateUserId(userRole);
    const studentId = userData.studentId || userId;

    const initialNotifs = [
      {
        id: `notif_${Date.now()}_welcome`,
        type: 'WELCOME',
        title: 'Welcome to SkillProof!',
        message: 'Your candidate profile is ready. Select a skill to take the qualifying quiz and unlock coding challenges.',
        channel: 'IN_APP',
        createdAt: new Date().toISOString(),
        read: false
      }
    ];

    const query = `
      INSERT INTO users (
        id, student_id, name, email, role, password_hash, country_code, phone,
        phone_verified, phone_verification_code, email_verified, email_verification_code,
        college, college_id, degree, graduation_year, academic_year, semester, gender,
        target_role, target_role_id, primary_domain, domain_id, secondary_domains,
        professional_headline, location, soft_skills, career_preferences, career_readiness,
        verified_skills, skills, projects, certifications, experience, achievements,
        roadmap_progress, skill_gaps, recommended_roles, notifications, resume_meta,
        resume_analysis, oauth_providers, reset_password_token, reset_password_expires,
        is_deactivated, passport_hash, avatar_url, photo_file_path, photo_mime_type,
        bio, github, linkedin, needs_profile_completion, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32,
        $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47,
        $48, $49, $50, $51, $52, $53, NOW(), NOW()
      )
      RETURNING *;
    `;

    const res = await this.query(query, [
      userId,
      studentId,
      userData.name,
      userData.email.toLowerCase().trim(),
      userRole,
      userData.passwordHash,
      userData.countryCode || '+91',
      userData.phone ? userData.phone.trim() : '',
      Boolean(userData.phoneVerified),
      userData.phoneVerificationCode ? (typeof userData.phoneVerificationCode === 'string' ? userData.phoneVerificationCode : JSON.stringify(userData.phoneVerificationCode)) : null,
      Boolean(userData.emailVerified),
      userData.emailVerificationCode ? (typeof userData.emailVerificationCode === 'string' ? userData.emailVerificationCode : JSON.stringify(userData.emailVerificationCode)) : null,
      userData.college || 'Institute of Technology',
      userData.collegeId || null,
      userData.degree || 'B.Tech (Bachelor of Technology)',
      Number(userData.graduationYear) || 2026,
      userData.academicYear || '3rd Year',
      userData.semester || '6th Semester',
      userData.gender || 'Prefer not to say',
      targetRole,
      targetRoleId,
      primaryDomain,
      domainId,
      JSON.stringify(userData.secondaryDomains || []),
      userData.professionalHeadline || '',
      userData.location || 'India',
      JSON.stringify(userData.softSkills || ["Problem Solving", "Team Collaboration", "Technical Communication"]),
      JSON.stringify(userData.careerPreferences || { preferredType: 'Internship', workMode: 'Hybrid' }),
      userData.careerReadiness || 0,
      JSON.stringify(userData.verifiedSkills || []),
      JSON.stringify(userData.skills || userData.verifiedSkills || []),
      JSON.stringify(userData.projects || []),
      JSON.stringify(userData.certifications || []),
      JSON.stringify(userData.experience || []),
      JSON.stringify(userData.achievements || []),
      JSON.stringify(userData.roadmapProgress || {}),
      JSON.stringify(initialGaps),
      JSON.stringify(initialRoles),
      JSON.stringify(initialNotifs),
      userData.resume ? JSON.stringify(userData.resume) : null,
      userData.resumeAnalysis ? JSON.stringify(userData.resumeAnalysis) : null,
      JSON.stringify(userData.oauthProviders || {}),
      null,
      null,
      false,
      userData.passportHash || `SKP-2026-${userId.replace(/[^A-Za-z0-9]/g, '').substring(0, 10).toUpperCase()}`,
      userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      null,
      null,
      userData.bio || '',
      userData.github || '',
      userData.linkedin || '',
      userData.needsProfileCompletion !== undefined ? Boolean(userData.needsProfileCompletion) : false
    ]);

    return mapUserRow(res.rows[0]);
  }

  async updateUser(id, updates) {
    if (!this.usePostgres) return this.localUpdateUser(id, updates);

    const current = await this.getUserById(id);
    if (!current) return null;

    const targetRoleInput = updates.targetRoleId || updates.targetRole || current.targetRoleId || current.targetRole;
    const resolvedRole = getCareerRoleByTitle(targetRoleInput);
    const targetRole = resolvedRole ? resolvedRole.title : (updates.targetRole || current.targetRole || defaultCareerRoleTitle);
    const targetRoleId = resolvedRole ? resolvedRole.id : (updates.targetRoleId || current.targetRoleId || defaultCareerRoleId);

    const domainInput = updates.domainId || updates.primaryDomain || current.domainId || current.primaryDomain;
    const resolvedDomain = getDomainByIdOrName(domainInput);
    const primaryDomain = resolvedDomain ? resolvedDomain.name : (updates.primaryDomain || current.primaryDomain || defaultPrimaryDomain);
    const domainId = resolvedDomain ? resolvedDomain.id : (updates.domainId || current.domainId || defaultPrimaryDomainId);

    const verifiedSkills = updates.verifiedSkills !== undefined ? updates.verifiedSkills : current.verifiedSkills;

    let careerReadiness = updates.careerReadiness !== undefined ? updates.careerReadiness : current.careerReadiness;
    if (verifiedSkills.length > 0 && updates.careerReadiness === undefined) {
      const sum = verifiedSkills.reduce((acc, s) => acc + s.score, 0);
      careerReadiness = Math.round(sum / verifiedSkills.length);
    }

    const skillGaps = this.calculateSkillGapsForRole(targetRoleId, verifiedSkills);
    const recommendedRoles = this.calculateRoleMatches(verifiedSkills, careerReadiness);

    const merged = {
      ...current,
      ...updates,
      primaryDomain,
      domainId,
      targetRole,
      targetRoleId,
      verifiedSkills,
      careerReadiness,
      skillGaps,
      recommendedRoles
    };

    const query = `
      UPDATE users SET
        name = $1,
        email = $2,
        role = $3,
        password_hash = $4,
        country_code = $5,
        phone = $6,
        phone_verified = $7,
        phone_verification_code = $8,
        email_verified = $9,
        email_verification_code = $10,
        college = $11,
        college_id = $12,
        degree = $13,
        graduation_year = $14,
        academic_year = $15,
        semester = $16,
        gender = $17,
        target_role = $18,
        target_role_id = $19,
        primary_domain = $20,
        domain_id = $21,
        secondary_domains = $22,
        professional_headline = $23,
        location = $24,
        soft_skills = $25,
        career_preferences = $26,
        career_readiness = $27,
        verified_skills = $28,
        skills = $29,
        projects = $30,
        certifications = $31,
        experience = $32,
        achievements = $33,
        roadmap_progress = $34,
        skill_gaps = $35,
        recommended_roles = $36,
        notifications = $37,
        resume_meta = $38,
        resume_analysis = $39,
        oauth_providers = $40,
        reset_password_token = $41,
        reset_password_expires = $42,
        is_deactivated = $43,
        deactivated_at = $44,
        deactivated_by = $45,
        passport_hash = $46,
        avatar_url = $47,
        photo_file_path = $48,
        photo_mime_type = $49,
        bio = $50,
        github = $51,
        linkedin = $52,
        needs_profile_completion = $53,
        updated_at = NOW()
      WHERE id = $54 OR student_id = $54
      RETURNING *;
    `;

    const res = await this.query(query, [
      merged.name,
      merged.email.toLowerCase().trim(),
      merged.role,
      merged.passwordHash,
      merged.countryCode,
      merged.phone,
      merged.phoneVerified,
      merged.phoneVerificationCode ? (typeof merged.phoneVerificationCode === 'string' ? merged.phoneVerificationCode : JSON.stringify(merged.phoneVerificationCode)) : null,
      merged.emailVerified,
      merged.emailVerificationCode ? (typeof merged.emailVerificationCode === 'string' ? merged.emailVerificationCode : JSON.stringify(merged.emailVerificationCode)) : null,
      merged.college,
      merged.collegeId,
      merged.degree,
      merged.graduationYear,
      merged.academicYear,
      merged.semester,
      merged.gender,
      targetRole,
      targetRoleId,
      primaryDomain,
      domainId,
      JSON.stringify(merged.secondaryDomains || []),
      merged.professionalHeadline,
      merged.location,
      JSON.stringify(merged.softSkills || []),
      JSON.stringify(merged.careerPreferences || {}),
      careerReadiness,
      JSON.stringify(verifiedSkills),
      JSON.stringify(merged.skills || verifiedSkills),
      JSON.stringify(merged.projects || []),
      JSON.stringify(merged.certifications || []),
      JSON.stringify(merged.experience || []),
      JSON.stringify(merged.achievements || []),
      JSON.stringify(merged.roadmapProgress || {}),
      JSON.stringify(skillGaps),
      JSON.stringify(recommendedRoles),
      JSON.stringify(merged.notifications || []),
      merged.resume ? JSON.stringify(merged.resume) : null,
      merged.resumeAnalysis ? JSON.stringify(merged.resumeAnalysis) : null,
      JSON.stringify(merged.oauthProviders || {}),
      merged.resetPasswordToken,
      merged.resetPasswordExpires,
      merged.isDeactivated,
      merged.deactivatedAt,
      merged.deactivatedBy,
      merged.passportHash,
      merged.avatarUrl,
      merged.photoFilePath,
      merged.photoMimeType,
      merged.bio,
      merged.github,
      merged.linkedin,
      merged.needsProfileCompletion,
      current.id
    ]);

    return mapUserRow(res.rows[0]);
  }

  async deactivateUser(id, adminId = 'SP-ADM-ROOT01') {
    return this.updateUser(id, {
      isDeactivated: true,
      deactivatedAt: new Date().toISOString(),
      deactivatedBy: adminId
    });
  }

  async reactivateUser(id) {
    return this.updateUser(id, {
      isDeactivated: false,
      deactivatedAt: null,
      deactivatedBy: null
    });
  }

  async purgeUser(id) {
    if (!this.usePostgres) return this.localPurgeUser(id);

    const user = await this.getUserById(id);
    if (!user) return false;

    await this.query('DELETE FROM users WHERE id = $1 OR student_id = $1', [user.id]);
    return true;
  }

  // =========================================================================
  // STORED FILES (Resumes & Profile Photos in PostgreSQL BYTEA)
  // =========================================================================
  async saveStoredFile(userId, fileType, originalFilename, mimeType, buffer) {
    if (!this.usePostgres) return null;

    const fileId = `file_${fileType}_${userId}`;
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    const query = `
      INSERT INTO stored_files (
        id, user_id, file_type, original_filename, mime_type, file_size, sha256, file_data, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        original_filename = EXCLUDED.original_filename,
        mime_type = EXCLUDED.mime_type,
        file_size = EXCLUDED.file_size,
        sha256 = EXCLUDED.sha256,
        file_data = EXCLUDED.file_data,
        updated_at = NOW()
      RETURNING id, user_id, file_type, original_filename, mime_type, file_size, sha256, created_at, updated_at;
    `;

    const res = await this.query(query, [
      fileId,
      userId,
      fileType,
      originalFilename,
      mimeType,
      buffer.length,
      hash,
      buffer
    ]);

    return res.rows[0];
  }

  async getStoredFile(userId, fileType) {
    if (!this.usePostgres) return null;

    const query = `
      SELECT id, user_id, file_type, original_filename, mime_type, file_size, sha256, file_data, created_at, updated_at
      FROM stored_files
      WHERE user_id = $1 AND file_type = $2
      ORDER BY updated_at DESC
      LIMIT 1;
    `;

    const res = await this.query(query, [userId, fileType]);
    return res.rows.length > 0 ? res.rows[0] : null;
  }

  async deleteStoredFile(userId, fileType) {
    if (!this.usePostgres) return false;
    const res = await this.query('DELETE FROM stored_files WHERE user_id = $1 AND file_type = $2', [userId, fileType]);
    return res.rowCount > 0;
  }

  // =========================================================================
  // TEST ATTEMPTS
  // =========================================================================
  async saveTestAttempt(attempt) {
    if (!this.usePostgres) return this.localSaveTestAttempt(attempt);

    const query = `
      INSERT INTO test_attempts (
        id, user_id, skill_id, skill_name, status, score, started_at, completed_at,
        question_mappings, answers, compiler_results, total_questions, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;

    const res = await this.query(query, [
      attempt.id,
      attempt.userId,
      attempt.skillId || 'unknown',
      attempt.skillName || attempt.skillId || 'Skill',
      attempt.status || 'in_progress',
      attempt.score || 0,
      attempt.startedAt || new Date().toISOString(),
      attempt.completedAt || null,
      JSON.stringify(attempt.questionMappings || null),
      JSON.stringify(attempt.answers || null),
      JSON.stringify(attempt.compilerResults || null),
      attempt.totalQuestions || null,
      attempt.createdAt || new Date().toISOString()
    ]);

    return this.mapAttemptRow(res.rows[0]);
  }

  async getTestAttemptsByUser(userId) {
    if (!this.usePostgres) return this.localGetTestAttemptsByUser(userId);

    const res = await this.query(
      'SELECT * FROM test_attempts WHERE user_id = $1 ORDER BY started_at DESC',
      [userId]
    );
    return res.rows.map(r => this.mapAttemptRow(r));
  }

  async getTestAttempts() {
    if (!this.usePostgres) return this.localGetTestAttempts();

    const res = await this.query(
      'SELECT * FROM test_attempts ORDER BY started_at DESC'
    );
    return res.rows.map(r => this.mapAttemptRow(r));
  }

  async getTestAttemptById(attemptId) {
    if (!attemptId) return null;
    if (!this.usePostgres) return this.localGetTestAttemptById(attemptId);

    const res = await this.query(
      'SELECT * FROM test_attempts WHERE id = $1 LIMIT 1',
      [attemptId]
    );
    return res.rows.length > 0 ? this.mapAttemptRow(res.rows[0]) : null;
  }

  async updateTestAttempt(attemptId, updates) {
    if (!this.usePostgres) return this.localUpdateTestAttempt(attemptId, updates);

    const current = await this.getTestAttemptById(attemptId);
    if (!current) return null;

    const merged = { ...current, ...updates };
    const query = `
      UPDATE test_attempts SET
        status = $1,
        score = $2,
        completed_at = $3,
        question_mappings = $4,
        answers = $5,
        compiler_results = $6,
        total_questions = $7
      WHERE id = $8
      RETURNING *;
    `;

    const res = await this.query(query, [
      merged.status,
      merged.score,
      merged.completedAt,
      JSON.stringify(merged.questionMappings || null),
      JSON.stringify(merged.answers || null),
      JSON.stringify(merged.compilerResults || null),
      merged.totalQuestions,
      attemptId
    ]);

    return this.mapAttemptRow(res.rows[0]);
  }

  mapAttemptRow(r) {
    if (!r) return null;
    return {
      id: r.id,
      userId: r.user_id,
      skillId: r.skill_id,
      skillName: r.skill_name,
      status: r.status,
      score: r.score,
      startedAt: r.started_at ? new Date(r.started_at).toISOString() : null,
      completedAt: r.completed_at ? new Date(r.completed_at).toISOString() : null,
      questionMappings: safeJson(r.question_mappings, null),
      answers: safeJson(r.answers, null),
      compilerResults: safeJson(r.compiler_results, null),
      totalQuestions: r.total_questions,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : null
    };
  }

  // =========================================================================
  // OPPORTUNITIES & APPLICATIONS
  // =========================================================================
  async getOpportunities() {
    if (!this.usePostgres) return this.localGetOpportunities();

    const res = await this.query('SELECT * FROM opportunities ORDER BY created_at ASC');
    if (res.rows.length === 0) return defaultOpportunities;
    return res.rows.map(r => ({
      id: r.id,
      title: r.title,
      company: r.company,
      location: r.location,
      workMode: r.work_mode,
      stipend: r.stipend,
      type: r.type,
      duration: r.duration,
      targetRole: r.target_role,
      eligibility: r.eligibility,
      requiredSkills: safeJson(r.required_skills, []),
      description: r.description,
      openings: r.openings,
      postedDate: r.posted_date,
      source: r.source,
      officialUrl: r.official_url,
      applicationType: r.application_type,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : null
    }));
  }

  async getOpportunityById(id) {
    const opps = await this.getOpportunities();
    return opps.find(o => o.id === id) || null;
  }

  async addOpportunity(opp) {
    if (!this.usePostgres) return this.localAddOpportunity(opp);

    const id = opp.id || `opp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const query = `
      INSERT INTO opportunities (
        id, title, company, location, work_mode, stipend, type, duration,
        target_role, eligibility, required_skills, description, openings,
        posted_date, source, official_url, application_type, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
      RETURNING *;
    `;

    const res = await this.query(query, [
      id,
      opp.title,
      opp.company,
      opp.location || 'Remote',
      opp.workMode || 'Remote',
      opp.stipend || 'Competitive',
      opp.type || 'Internship',
      opp.duration || '3 Months',
      opp.targetRole || opp.title || 'Full Stack Developer',
      opp.eligibility || 'B.Tech / MCA',
      JSON.stringify(opp.requiredSkills || []),
      opp.description || '',
      opp.openings || 1,
      opp.postedDate || 'Just now',
      opp.source || 'SkillProof Platform',
      opp.officialUrl || null,
      opp.applicationType || 'direct'
    ]);

    const r = res.rows[0];
    return {
      id: r.id,
      ...opp,
      requiredSkills: safeJson(r.required_skills, []),
      postedDate: r.posted_date,
      createdAt: new Date(r.created_at).toISOString()
    };
  }

  async getApplicationsByUser(userId) {
    if (!this.usePostgres) return this.localGetApplicationsByUser(userId);

    const res = await this.query(
      'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return res.rows.map(this.mapAppRow);
  }

  async getApplications() {
    if (!this.usePostgres) return this.localGetApplications();

    const res = await this.query(
      'SELECT * FROM applications ORDER BY created_at DESC'
    );
    return res.rows.map(this.mapAppRow);
  }

  async getApplicationById(id) {
    if (!id) return null;
    if (!this.usePostgres) return this.localGetApplicationById(id);

    const res = await this.query('SELECT * FROM applications WHERE id = $1 LIMIT 1', [id]);
    return res.rows.length > 0 ? this.mapAppRow(res.rows[0]) : null;
  }

  async createApplication(app) {
    if (!this.usePostgres) return this.localCreateApplication(app);

    const id = `app_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const statusHistory = [
      {
        status: app.status || 'Applied',
        timestamp: new Date().toISOString(),
        note: app.notes || 'Application submitted'
      }
    ];

    const query = `
      INSERT INTO applications (
        id, opportunity_id, user_id, student_id, student_name, student_email,
        company, role, status, status_history, fit_score, verified_skills_count,
        notes, created_at, last_updated
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *;
    `;

    const res = await this.query(query, [
      id,
      app.opportunityId,
      app.userId,
      app.studentId || app.userId,
      app.studentName || 'Student',
      app.studentEmail || '',
      app.company || '',
      app.role || '',
      app.status || 'Applied',
      JSON.stringify(statusHistory),
      app.fitScore || 0,
      app.verifiedSkillsCount || 0,
      app.notes || ''
    ]);

    return this.mapAppRow(res.rows[0]);
  }

  async updateApplication(id, updates) {
    if (!this.usePostgres) return this.localUpdateApplication(id, updates);

    const current = await this.getApplicationById(id);
    if (!current) return null;

    const newStatus = updates.status || current.status;
    const history = current.statusHistory || [
      { status: current.status, timestamp: current.createdAt, note: 'Initial application' }
    ];

    if (updates.status && updates.status !== current.status) {
      history.push({
        status: updates.status,
        timestamp: new Date().toISOString(),
        note: updates.statusChangeNote || `Status changed to ${updates.status}`
      });
    }

    const query = `
      UPDATE applications SET
        status = $1,
        status_history = $2,
        notes = COALESCE($3, notes),
        last_updated = NOW()
      WHERE id = $4
      RETURNING *;
    `;

    const res = await this.query(query, [
      newStatus,
      JSON.stringify(history),
      updates.notes !== undefined ? updates.notes : null,
      id
    ]);

    return this.mapAppRow(res.rows[0]);
  }

  async deleteApplication(id, userId) {
    if (!this.usePostgres) return this.localDeleteApplication(id, userId);

    let sql = 'DELETE FROM applications WHERE id = $1';
    const params = [id];
    if (userId) {
      params.push(userId);
      sql += ' AND user_id = $2';
    }
    const res = await this.query(sql, params);
    return res.rowCount > 0;
  }

  mapAppRow(r) {
    if (!r) return null;
    return {
      id: r.id,
      opportunityId: r.opportunity_id,
      userId: r.user_id,
      studentId: r.student_id,
      studentName: r.student_name,
      studentEmail: r.student_email,
      company: r.company,
      role: r.role,
      status: r.status,
      statusHistory: safeJson(r.status_history, []),
      fitScore: r.fit_score,
      verifiedSkillsCount: r.verified_skills_count,
      notes: r.notes,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : null,
      lastUpdated: r.last_updated ? new Date(r.last_updated).toISOString() : null
    };
  }

  // =========================================================================
  // INDUSTRY MODULE OPERATIONS
  // =========================================================================
  async getCompanyProfile(userId) {
    if (!this.usePostgres) return this.localGetCompanyProfile(userId);

    const res = await this.query('SELECT * FROM company_profiles WHERE user_id = $1 LIMIT 1', [userId]);
    if (res.rows.length > 0) {
      const r = res.rows[0];
      return {
        id: r.id,
        userId: r.user_id,
        companyName: r.company_name,
        industry: r.industry,
        website: r.website,
        location: r.location,
        contactEmail: r.contact_email,
        description: r.description,
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : null
      };
    }
    return {
      companyName: "TechScale Innovations",
      industry: "Enterprise Software & Cloud Services",
      website: "https://techscale.io",
      location: "Bangalore, India (Hybrid)",
      contactEmail: "talent@techscale.io",
      description: "Fast-growing engineering organization building scalable microservices and data platforms."
    };
  }

  async saveCompanyProfile(userId, profileData) {
    if (!this.usePostgres) return this.localSaveCompanyProfile(userId, profileData);

    const query = `
      INSERT INTO company_profiles (
        id, user_id, company_name, industry, website, location, contact_email, description, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        industry = EXCLUDED.industry,
        website = EXCLUDED.website,
        location = EXCLUDED.location,
        contact_email = EXCLUDED.contact_email,
        description = EXCLUDED.description,
        updated_at = NOW()
      RETURNING *;
    `;

    const id = profileData.id || `comp_${Date.now()}`;
    const res = await this.query(query, [
      id,
      userId,
      profileData.companyName || 'TechScale Innovations',
      profileData.industry || 'Software',
      profileData.website || '',
      profileData.location || '',
      profileData.contactEmail || '',
      profileData.description || ''
    ]);

    const r = res.rows[0];
    return {
      id: r.id,
      userId: r.user_id,
      companyName: r.company_name,
      industry: r.industry,
      website: r.website,
      location: r.location,
      contactEmail: r.contact_email,
      description: r.description,
      updatedAt: new Date(r.updated_at).toISOString()
    };
  }

  async getShortlistedCandidates(companyId) {
    if (!this.usePostgres) return this.localGetShortlistedCandidates(companyId);

    const res = await this.query(
      'SELECT * FROM shortlisted_candidates WHERE company_id = $1 ORDER BY shortlisted_at DESC',
      [companyId]
    );
    return res.rows.map(r => ({
      id: r.id,
      companyId: r.company_id,
      studentId: r.student_id,
      studentName: r.student_name,
      roleTitle: r.role_title,
      shortlistedAt: r.shortlisted_at ? new Date(r.shortlisted_at).toISOString() : null
    }));
  }

  async toggleShortlistCandidate(companyId, studentId, studentName, roleTitle) {
    if (!this.usePostgres) return this.localToggleShortlistCandidate(companyId, studentId, studentName, roleTitle);

    const check = await this.query(
      'SELECT id FROM shortlisted_candidates WHERE company_id = $1 AND student_id = $2',
      [companyId, studentId]
    );

    if (check.rows.length > 0) {
      await this.query('DELETE FROM shortlisted_candidates WHERE company_id = $1 AND student_id = $2', [companyId, studentId]);
      return { shortlisted: false };
    } else {
      const entryId = `short_${Date.now()}`;
      await this.query(`
        INSERT INTO shortlisted_candidates (id, company_id, student_id, student_name, role_title, shortlisted_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `, [entryId, companyId, studentId, studentName, roleTitle]);

      return {
        shortlisted: true,
        entry: {
          id: entryId,
          companyId,
          studentId,
          studentName,
          roleTitle,
          shortlistedAt: new Date().toISOString()
        }
      };
    }
  }

  // =========================================================================
  // COLLEGE & ACADEMIA MODULE
  // =========================================================================
  async getCollegeAnalytics() {
    if (!this.usePostgres) return this.localGetCollegeAnalytics();

    const candidateUsers = await this.getUsers({ role: 'candidate', status: 'active' });
    const totalStudents = candidateUsers.length;
    let verifiedSkillsCount = 0;
    let totalScoreSum = 0;
    let totalScoreCount = 0;

    const skillAverages = {
      'Python': { sum: 0, count: 0 },
      'SQL': { sum: 0, count: 0 },
      'DSA': { sum: 0, count: 0 },
      'JavaScript': { sum: 0, count: 0 },
      'Frontend': { sum: 0, count: 0 },
      'Backend': { sum: 0, count: 0 },
      'Communication': { sum: 0, count: 0 },
      'Cloud': { sum: 0, count: 0 }
    };

    candidateUsers.forEach((u) => {
      (u.verifiedSkills || []).forEach((vs) => {
        verifiedSkillsCount++;
        totalScoreSum += vs.score;
        totalScoreCount++;
        const name = vs.name || '';
        for (const k of Object.keys(skillAverages)) {
          if (name.toLowerCase().includes(k.toLowerCase())) {
            skillAverages[k].sum += vs.score;
            skillAverages[k].count++;
          }
        }
      });
    });

    const averageScore = totalScoreCount > 0 ? Math.round(totalScoreSum / totalScoreCount) : 0;

    const domainGaps = Object.entries(skillAverages).map(([domain, stat]) => {
      const avg = stat.count > 0 ? Math.round(stat.sum / stat.count) : 0;
      const rating = avg >= 80 ? 'Strong' : avg >= 70 ? 'Medium' : avg > 0 ? 'Weak' : 'Not Assessed';
      const needingImp = avg >= 80 ? 15 : avg >= 70 ? 35 : avg > 0 ? 48 : 0;
      return {
        domain,
        rating,
        avgScore: avg,
        studentsAssessed: stat.count,
        percentageNeedingImprovement: needingImp,
        impactedStudents: Math.round(totalStudents * (needingImp / 100))
      };
    });

    const appRes = await this.query('SELECT status FROM applications');
    const apps = appRes.rows || [];
    const placed = apps.filter((a) => a.status === 'Selected' || a.status === 'Offer').length;
    const interviewing = apps.filter((a) => a.status === 'Interview' || a.status === 'Shortlisted').length;
    const assessedStudentsCount = candidateUsers.filter((u) => (u.verifiedSkills || []).length > 0).length;

    return {
      institutionName: "ABC Institute of Technology & Engineering",
      totalStudents,
      studentsAssessed: assessedStudentsCount,
      verifiedSkillsCount,
      placementReadiness: averageScore,
      domainGaps,
      internshipParticipation: apps.length,
      placedCount: placed,
      interviewingCount: interviewing
    };
  }

  async getStudentGroups() {
    if (!this.usePostgres) return this.localGetStudentGroups();

    const res = await this.query('SELECT * FROM student_groups ORDER BY created_at ASC');
    if (res.rows.length > 0) {
      return res.rows.map(r => ({
        id: r.id,
        name: r.name,
        department: r.department,
        studentsCount: r.students_count,
        activeAssessments: r.active_assessments,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : null
      }));
    }
    return [
      { id: 'grp-1', name: '3rd Year CS - Batch A', department: 'Computer Science', studentsCount: 65, activeAssessments: 2 },
      { id: 'grp-2', name: '4th Year CS - Accelerated DSA', department: 'Information Science', studentsCount: 48, activeAssessments: 3 },
      { id: 'grp-3', name: 'Pre-Final Year Cloud & DevOps Cohort', department: 'Computer Science', studentsCount: 52, activeAssessments: 1 }
    ];
  }

  async createStudentGroup(group) {
    if (!this.usePostgres) return this.localCreateStudentGroup(group);

    const id = `grp_${Date.now()}`;
    const query = `
      INSERT INTO student_groups (id, name, department, students_count, active_assessments, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;

    const res = await this.query(query, [
      id,
      group.name,
      group.department,
      Number(group.studentsCount) || 30,
      0
    ]);

    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      department: r.department,
      studentsCount: r.students_count,
      activeAssessments: r.active_assessments,
      createdAt: new Date(r.created_at).toISOString()
    };
  }

  async getAssignedAssessments() {
    if (!this.usePostgres) return this.localGetAssignedAssessments();

    const res = await this.query('SELECT * FROM assigned_assessments ORDER BY assigned_at DESC');
    if (res.rows.length > 0) {
      return res.rows.map(r => ({
        id: r.id,
        title: r.title,
        groupName: r.group_name,
        skill: r.skill,
        deadline: r.deadline,
        status: r.status,
        assignedAt: r.assigned_at ? new Date(r.assigned_at).toISOString() : null
      }));
    }
    return [
      { id: 'asgn-1', title: 'Python Production Reliability Benchmark', groupName: 'Batch 2026 - CS Alpha', skill: 'Python', deadline: '2026-09-25', status: 'Active' },
      { id: 'asgn-2', title: 'Relational Schema Optimization Challenge', groupName: 'AI & Data Engineering Cohort', skill: 'SQL', deadline: '2026-09-30', status: 'Active' },
    ];
  }

  async assignAssessment(assignment) {
    if (!this.usePostgres) return this.localAssignAssessment(assignment);

    const id = `assign_${Date.now()}`;
    const query = `
      INSERT INTO assigned_assessments (id, title, group_name, skill, deadline, status, assigned_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;

    const res = await this.query(query, [
      id,
      assignment.title,
      assignment.groupName,
      assignment.skill,
      assignment.deadline,
      assignment.status || 'Active'
    ]);

    const r = res.rows[0];
    return {
      id: r.id,
      title: r.title,
      groupName: r.group_name,
      skill: r.skill,
      deadline: r.deadline,
      status: r.status,
      assignedAt: new Date(r.assigned_at).toISOString()
    };
  }

  async getFacultyData() {
    if (!this.usePostgres) return this.localGetFacultyData();

    const res = await this.query("SELECT data FROM faculty_data WHERE id = 'primary' LIMIT 1");
    if (res.rows.length > 0) {
      return safeJson(res.rows[0].data, null);
    }
    return {
      facultyName: "Dr. Ananya Sharma",
      department: "Computer Science & Engineering",
      designation: "Associate Professor & Placement Faculty Lead",
      email: "ananya.sharma@college.edu.in",
      mentoredStudents: 34,
      activities: [
        { id: 'act-1', type: 'Workshop', title: 'Defensive Code Mutation & Production Sandboxes', partner: 'TCS & SkillProof', date: '2026-09-02', participants: 120 },
        { id: 'act-2', type: 'Guest Lecture', title: 'Zero-Downtime Microservices Architecture', partner: 'Amazon AWS Lead', date: '2026-08-20', participants: 180 },
        { id: 'act-3', type: 'FDP', title: 'Faculty Cloud Infrastructure & SRE Fellowship', partner: 'Google Cloud Training', date: '2026-07-15', participants: 45 },
        { id: 'act-4', type: 'Mentorship', title: 'Hackathon Mentoring - SIH 2026 Innovation Sprint', partner: 'Smart India Hackathon', date: '2026-08-28', participants: 25 }
      ]
    };
  }

  async addFacultyActivity(activity) {
    if (!this.usePostgres) return this.localAddFacultyActivity(activity);

    const current = await this.getFacultyData();
    const newAct = {
      id: `act_${Date.now()}`,
      ...activity,
      createdAt: new Date().toISOString()
    };
    current.activities.unshift(newAct);

    await this.query(`
      INSERT INTO faculty_data (id, data)
      VALUES ('primary', $1)
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;
    `, [JSON.stringify(current)]);

    return newAct;
  }

  // =========================================================================
  // NOTIFICATIONS
  // =========================================================================
  async addNotification(userId, notif) {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const notifs = user.notifications || [];
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      ...notif,
      createdAt: new Date().toISOString(),
      read: false
    };
    notifs.unshift(newNotif);

    await this.updateUser(userId, { notifications: notifs });
    return newNotif;
  }

  async getNotificationsByUser(userId) {
    const user = await this.getUserById(userId);
    return user?.notifications || [];
  }

  // =========================================================================
  // LOCAL JSON ENGINE (OFFLINE FALLBACK - ONLY WHEN DATABASE_URL IS ABSENT)
  // =========================================================================
  initLocalJson() {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = {
        users: [],
        testAttempts: [],
        opportunities: defaultOpportunities,
        applications: [],
        companyProfiles: [],
        shortlistedCandidates: [],
        studentGroups: [],
        assignedAssessments: [],
        facultyData: null
      };
      this.writeSyncLocal(initialData);
    }
  }

  readLocal() {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (err) {
      console.error('Error reading db.json, returning empty structure:', err);
      return { users: [], testAttempts: [], opportunities: defaultOpportunities, applications: [], companyProfiles: [], shortlistedCandidates: [], studentGroups: [], assignedAssessments: [] };
    }
  }

  writeSyncLocal(data) {
    const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  localGetUsers(filters = {}) {
    let list = this.readLocal().users || [];
    if (filters.role && filters.role !== 'all') {
      const r = filters.role.toLowerCase();
      if (r === 'candidate' || r === 'student') {
        list = list.filter((u) => !u.role || u.role === 'candidate' || u.role === 'student');
      } else if (r === 'faculty' || r === 'college') {
        list = list.filter((u) => u.role && (u.role.toLowerCase() === 'faculty' || u.role.toLowerCase() === 'college'));
      } else {
        list = list.filter((u) => u.role && u.role.toLowerCase() === r);
      }
    }
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active') {
        list = list.filter((u) => !u.isDeactivated);
      } else if (filters.status === 'deactivated') {
        list = list.filter((u) => Boolean(u.isDeactivated));
      }
    }
    if (filters.search) {
      const q = String(filters.search).trim().toLowerCase();
      list = list.filter((u) =>
        (u.id && u.id.toLowerCase().includes(q)) ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
      );
    }
    return list;
  }

  localGetUserById(id) {
    return this.readLocal().users.find((u) => u.id === id || u.studentId === id) || null;
  }

  localGetUserByStudentId(studentId) {
    const clean = String(studentId).trim().toLowerCase();
    return this.readLocal().users.find((u) =>
      (u.id && u.id.toLowerCase() === clean) ||
      (u.studentId && u.studentId.toLowerCase() === clean) ||
      (u.passportHash && u.passportHash.toLowerCase() === clean)
    ) || null;
  }

  localGetUserByEmail(email) {
    return this.readLocal().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  localGetUserByPhone(countryCode, phone) {
    const cleanPhone = phone.trim().replace(/[\s\-()]/g, '');
    return this.readLocal().users.find((u) => u.phone === cleanPhone && (countryCode ? u.countryCode === countryCode : true)) || null;
  }

  localGetUserByResetToken(token) {
    return this.readLocal().users.find((u) => u.resetPasswordToken === token && u.resetPasswordExpires > Date.now()) || null;
  }

  localGetUserByOAuth(provider, providerId) {
    return this.readLocal().users.find((u) => u.oauthProviders && u.oauthProviders[provider] === providerId) || null;
  }

  localCreateUser(userData) {
    const data = this.readLocal();
    const resolvedRole = getCareerRoleByTitle(userData.targetRoleId || userData.targetRole);
    const targetRoleId = resolvedRole ? resolvedRole.id : defaultCareerRoleId;
    const targetRole = resolvedRole ? resolvedRole.title : (userData.targetRole || defaultCareerRoleTitle);

    const resolvedDomain = getDomainByIdOrName(userData.domainId || userData.primaryDomain);
    const domainId = resolvedDomain ? resolvedDomain.id : defaultPrimaryDomainId;
    const primaryDomain = resolvedDomain ? resolvedDomain.name : (userData.primaryDomain || defaultPrimaryDomain);

    let userRole = (userData.role || 'candidate').toLowerCase();
    if (userRole === 'college') userRole = 'faculty';
    const userId = userData.id || this.generateUserId(userRole);
    const studentId = userData.studentId || userId;

    const newUser = {
      id: userId,
      studentId,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      role: userRole,
      passwordHash: userData.passwordHash,
      countryCode: userData.countryCode || '+91',
      phone: userData.phone ? userData.phone.trim() : '',
      phoneVerified: Boolean(userData.phoneVerified),
      emailVerified: Boolean(userData.emailVerified),
      college: userData.college || 'Institute of Technology',
      targetRole,
      targetRoleId,
      primaryDomain,
      domainId,
      verifiedSkills: userData.verifiedSkills || [],
      skills: userData.skills || userData.verifiedSkills || [],
      projects: userData.projects || [],
      careerReadiness: userData.careerReadiness || 0,
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    this.writeSyncLocal(data);
    return newUser;
  }

  localUpdateUser(id, updates) {
    const data = this.readLocal();
    const idx = data.users.findIndex((u) => u.id === id || u.studentId === id);
    if (idx === -1) return null;
    data.users[idx] = { ...data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.writeSyncLocal(data);
    return data.users[idx];
  }

  localPurgeUser(id) {
    const data = this.readLocal();
    data.users = data.users.filter((u) => u.id !== id && u.studentId !== id);
    this.writeSyncLocal(data);
    return true;
  }

  localSaveTestAttempt(attempt) {
    const data = this.readLocal();
    data.testAttempts.push(attempt);
    this.writeSyncLocal(data);
    return attempt;
  }

  localGetTestAttemptsByUser(userId) {
    return this.readLocal().testAttempts.filter((t) => t.userId === userId);
  }

  localGetTestAttempts() {
    return this.readLocal().testAttempts || [];
  }

  localGetTestAttemptById(attemptId) {
    return this.readLocal().testAttempts.find((t) => t.id === attemptId) || null;
  }

  localUpdateTestAttempt(attemptId, updates) {
    const data = this.readLocal();
    const idx = data.testAttempts.findIndex((t) => t.id === attemptId);
    if (idx === -1) return null;
    data.testAttempts[idx] = { ...data.testAttempts[idx], ...updates };
    this.writeSyncLocal(data);
    return data.testAttempts[idx];
  }

  localGetOpportunities() {
    return this.readLocal().opportunities || defaultOpportunities;
  }

  localAddOpportunity(opp) {
    const data = this.readLocal();
    if (!data.opportunities) data.opportunities = defaultOpportunities;
    const newOpp = {
      id: opp.id || `opp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...opp,
      postedDate: 'Just now',
      createdAt: new Date().toISOString()
    };
    data.opportunities.unshift(newOpp);
    this.writeSyncLocal(data);
    return newOpp;
  }

  localGetApplicationsByUser(userId) {
    return (this.readLocal().applications || []).filter((a) => a.userId === userId);
  }

  localGetApplications() {
    return this.readLocal().applications || [];
  }

  read() {
    if (!this.usePostgres) return this.readLocal();
    console.warn('[SkillProof DB] Warning: Legacy synchronous db.read() invoked in PostgreSQL mode.');
    return {
      users: [],
      testAttempts: [],
      opportunities: defaultOpportunities,
      applications: [],
      companyProfiles: [],
      shortlistedCandidates: [],
      studentGroups: [],
      assignedAssessments: []
    };
  }

  localGetApplicationById(id) {
    return (this.readLocal().applications || []).find((a) => a.id === id) || null;
  }

  localCreateApplication(app) {
    const data = this.readLocal();
    if (!data.applications) data.applications = [];
    const newApp = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      status: 'Applied',
      statusHistory: [{ status: app.status || 'Applied', timestamp: new Date().toISOString(), note: app.notes || 'Application submitted' }],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      ...app
    };
    data.applications.unshift(newApp);
    this.writeSyncLocal(data);
    return newApp;
  }

  localUpdateApplication(id, updates) {
    const data = this.readLocal();
    if (!data.applications) data.applications = [];
    const idx = data.applications.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    data.applications[idx] = { ...data.applications[idx], ...updates, lastUpdated: new Date().toISOString() };
    this.writeSyncLocal(data);
    return data.applications[idx];
  }

  localDeleteApplication(id, userId) {
    const data = this.readLocal();
    if (!data.applications) return false;
    const idx = data.applications.findIndex((a) => a.id === id && (userId ? a.userId === userId : true));
    if (idx === -1) return false;
    data.applications.splice(idx, 1);
    this.writeSyncLocal(data);
    return true;
  }

  localGetCompanyProfile(userId) {
    return (this.readLocal().companyProfiles || []).find((p) => p.userId === userId) || {
      companyName: "TechScale Innovations",
      industry: "Enterprise Software & Cloud Services",
      website: "https://techscale.io",
      location: "Bangalore, India (Hybrid)",
      contactEmail: "talent@techscale.io",
      description: "Fast-growing engineering organization building scalable microservices and data platforms."
    };
  }

  localSaveCompanyProfile(userId, profileData) {
    const data = this.readLocal();
    if (!data.companyProfiles) data.companyProfiles = [];
    const idx = data.companyProfiles.findIndex((p) => p.userId === userId);
    const updated = { id: idx !== -1 ? data.companyProfiles[idx].id : `comp_${Date.now()}`, userId, ...profileData, updatedAt: new Date().toISOString() };
    if (idx !== -1) data.companyProfiles[idx] = updated;
    else data.companyProfiles.push(updated);
    this.writeSyncLocal(data);
    return updated;
  }

  localGetShortlistedCandidates(companyId) {
    return (this.readLocal().shortlistedCandidates || []).filter((s) => s.companyId === companyId);
  }

  localToggleShortlistCandidate(companyId, studentId, studentName, roleTitle) {
    const data = this.readLocal();
    if (!data.shortlistedCandidates) data.shortlistedCandidates = [];
    const idx = data.shortlistedCandidates.findIndex((s) => s.companyId === companyId && s.studentId === studentId);
    if (idx !== -1) {
      data.shortlistedCandidates.splice(idx, 1);
      this.writeSyncLocal(data);
      return { shortlisted: false };
    } else {
      const entry = { id: `short_${Date.now()}`, companyId, studentId, studentName, roleTitle, shortlistedAt: new Date().toISOString() };
      data.shortlistedCandidates.push(entry);
      this.writeSyncLocal(data);
      return { shortlisted: true, entry };
    }
  }

  localGetCollegeAnalytics() {
    const data = this.readLocal();
    const candidateUsers = (data.users || []).filter((u) => (!u.role || u.role === 'candidate' || u.role === 'student') && !u.isDeactivated);
    return {
      institutionName: "ABC Institute of Technology & Engineering",
      totalStudents: candidateUsers.length,
      studentsAssessed: candidateUsers.filter((u) => (u.verifiedSkills || []).length > 0).length,
      verifiedSkillsCount: 0,
      placementReadiness: 0,
      domainGaps: [],
      internshipParticipation: 0,
      placedCount: 0,
      interviewingCount: 0
    };
  }

  localGetStudentGroups() {
    const data = this.readLocal();
    return data.studentGroups && data.studentGroups.length > 0 ? data.studentGroups : [];
  }

  localCreateStudentGroup(group) {
    const data = this.readLocal();
    if (!data.studentGroups) data.studentGroups = [];
    const newGroup = { id: `grp_${Date.now()}`, ...group, createdAt: new Date().toISOString() };
    data.studentGroups.push(newGroup);
    this.writeSyncLocal(data);
    return newGroup;
  }

  localGetAssignedAssessments() {
    return this.readLocal().assignedAssessments || [];
  }

  localAssignAssessment(assignment) {
    const data = this.readLocal();
    if (!data.assignedAssessments) data.assignedAssessments = [];
    const newAssign = { id: `assign_${Date.now()}`, ...assignment, assignedAt: new Date().toISOString() };
    data.assignedAssessments.unshift(newAssign);
    this.writeSyncLocal(data);
    return newAssign;
  }

  localGetFacultyData() {
    return this.readLocal().facultyData || { facultyName: "Dr. Ananya Sharma", activities: [] };
  }

  localAddFacultyActivity(activity) {
    const data = this.readLocal();
    if (!data.facultyData) data.facultyData = this.localGetFacultyData();
    const newAct = { id: `act_${Date.now()}`, ...activity, createdAt: new Date().toISOString() };
    data.facultyData.activities.unshift(newAct);
    this.writeSyncLocal(data);
    return newAct;
  }
}

export const db = new Database();
