import express from 'express';
import path from 'path';
import fs from 'fs';
import { db } from '../db.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/industry/profile - Get current recruiter company profile
router.get('/profile', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id || 'demo_recruiter';
    const profile = await db.getCompanyProfile(userId);
    return res.json({ profile });
  } catch (err) {
    console.error('Fetch company profile error:', err);
    return res.status(500).json({ error: 'Failed to fetch company profile' });
  }
});

// POST /api/industry/profile - Update company profile
router.post('/profile', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id || 'demo_recruiter';
    const updated = await db.saveCompanyProfile(userId, req.body);
    return res.json({ message: 'Company profile updated', profile: updated });
  } catch (err) {
    console.error('Update company profile error:', err);
    return res.status(500).json({ error: 'Failed to update company profile' });
  }
});

// GET /api/industry/opportunities - Opportunities posted by industry
router.get('/opportunities', async (req, res) => {
  try {
    const all = await db.getOpportunities();
    return res.json({ opportunities: all });
  } catch (err) {
    console.error('Fetch industry opportunities error:', err);
    return res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// POST /api/industry/opportunities - Post new job/internship/project
router.post('/opportunities', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      const role = (req.user.role || '').toLowerCase();
      if (!['industry', 'recruiter', 'admin', 'host'].includes(role)) {
        return res.status(403).json({ error: 'Access denied: Only industry recruiters can post opportunities' });
      }
    }
    const {
      title,
      company = 'TechScale Innovations',
      type = 'Internship',
      location = 'Bangalore (Hybrid)',
      workMode = 'Hybrid',
      stipend = '₹40,000 / month',
      description = '',
      eligibility = 'Final or pre-final year students with verified skills',
      requiredSkills = [],
      experience = '0-1 years (Fresher eligible)',
      duration = '6 months',
      openings = 3
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const created = await db.addOpportunity({
      title,
      company,
      type,
      location,
      workMode,
      stipend,
      description,
      eligibility,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      experience,
      duration,
      openings: Number(openings) || 3,
      source: 'SkillProof Direct Partner',
      applicationType: 'SkillProof Direct Partner',
      officialUrl: 'https://skills-proof.onrender.com/opportunities'
    });

    return res.status(201).json({
      message: 'Opportunity posted successfully to SkillProof network',
      opportunity: created
    });
  } catch (err) {
    console.error('Post opportunity error:', err);
    return res.status(500).json({ error: 'Failed to post opportunity' });
  }
});

// Helper: Candidate sanitizer for industry views
const sanitizeCandidate = (u) => {
  if (!u) return null;
  const verified = u.verifiedSkills || [];
  const totalScore = verified.reduce((acc, s) => acc + s.score, 0);
  const avgScore = verified.length > 0 ? Math.round(totalScore / verified.length) : (u.careerReadiness || 0);

  return {
    id: u.id,
    studentId: u.studentId || u.id,
    name: u.name,
    email: u.email,
    emailVerified: Boolean(u.emailVerified),
    phoneVerified: Boolean(u.phoneVerified),
    college: u.college || 'ABC Institute of Technology',
    collegeId: u.collegeId || null,
    degree: u.degree || 'B.Tech (Bachelor of Technology)',
    academicYear: u.academicYear || '3rd Year',
    semester: u.semester || '6th Semester',
    graduationYear: u.graduationYear || 2026,
    gender: u.gender || 'Prefer not to say',
    targetRole: u.targetRole || 'Full Stack Web Developer',
    primaryDomain: u.primaryDomain || 'Computer Science / Software Development',
    secondaryDomains: Array.isArray(u.secondaryDomains) ? u.secondaryDomains : [],
    professionalHeadline: u.professionalHeadline || '',
    location: u.location || 'India',
    softSkills: Array.isArray(u.softSkills) ? u.softSkills : ['Problem Solving', 'Team Collaboration', 'Technical Communication'],
    careerPreferences: u.careerPreferences || { preferredType: 'Internship', workMode: 'Hybrid' },
    careerReadiness: u.careerReadiness || avgScore,
    verifiedSkills: verified,
    skills: u.skills || verified,
    projects: u.projects || [],
    certifications: u.certifications || [],
    experience: u.experience || [],
    achievements: u.achievements || [],
    passportHash: u.passportHash || `SKP-2026-${u.id.substring(0, 8).toUpperCase()}`,
    hasResume: Boolean(u.resume && u.resume.filePath),
    resumeFileName: u.resume ? u.resume.fileName : null,
    resumeFileSize: u.resume ? u.resume.fileSizeFormatted : null,
    resumeUploadedAt: u.resume ? u.resume.uploadedAt : null,
    resume: u.resume ? {
      fileName: u.resume.fileName,
      fileSizeBytes: u.resume.fileSizeBytes,
      fileSizeFormatted: u.resume.fileSizeFormatted,
      uploadedAt: u.resume.uploadedAt
    } : null,
    resumeAnalysis: u.resumeAnalysis ? {
      roleFitScore: u.resumeAnalysis.roleFitScore,
      matchScore: u.resumeAnalysis.matchScore || u.resumeAnalysis.roleFitScore,
      detectedSkills: u.resumeAnalysis.detectedSkills,
      skillsDetected: u.resumeAnalysis.skillsDetected || u.resumeAnalysis.detectedSkills,
      skillsCount: (u.resumeAnalysis.detectedSkills || []).length,
      targetRole: u.resumeAnalysis.targetRole
    } : null,
    github: u.github || '',
    linkedin: u.linkedin || '',
    bio: u.bio || ''
  };
};

// GET /api/industry/candidates - Real registered students from database with filters
router.get('/candidates', async (req, res) => {
  try {
    const { skill, minScore = 0, targetRole, degree, graduationYear, search, studentId } = req.query;
    const users = await db.getUsers();

    // Only include active candidate student users
    const studentUsers = users.filter((u) => (!u.role || u.role === 'candidate' || u.role === 'student') && !u.isDeactivated);
    let candidates = studentUsers.map(sanitizeCandidate);

    // Search by studentId
    if (studentId) {
      const cleanId = String(studentId).trim().toLowerCase();
      candidates = candidates.filter((c) =>
        (c.id && c.id.toLowerCase() === cleanId) ||
        (c.studentId && c.studentId.toLowerCase() === cleanId) ||
        (c.passportHash && c.passportHash.toLowerCase() === cleanId)
      );
    }

    // Free text search (ID, name, email, tag, or skill)
    if (search) {
      const q = String(search).trim().toLowerCase();
      candidates = candidates.filter((c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.studentId && c.studentId.toLowerCase().includes(q)) ||
        (c.passportHash && c.passportHash.toLowerCase().includes(q)) ||
        (c.targetRole && c.targetRole.toLowerCase().includes(q)) ||
        (c.college && c.college.toLowerCase().includes(q)) ||
        (c.verifiedSkills && c.verifiedSkills.some((vs) => vs.name && vs.name.toLowerCase().includes(q)))
      );
    }

    if (skill) {
      candidates = candidates.filter((c) =>
        c.verifiedSkills.some((vs) =>
          (vs.name.toLowerCase().includes(skill.toLowerCase()) || (vs.skillId && vs.skillId.toLowerCase() === skill.toLowerCase())) &&
          vs.score >= Number(minScore)
        )
      );
    }

    if (targetRole) {
      candidates = candidates.filter((c) =>
        c.targetRole.toLowerCase().includes(targetRole.toLowerCase())
      );
    }

    if (degree) {
      candidates = candidates.filter((c) =>
        c.degree.toLowerCase().includes(degree.toLowerCase())
      );
    }

    if (graduationYear) {
      candidates = candidates.filter((c) =>
        Number(c.graduationYear) === Number(graduationYear)
      );
    }

    return res.json({ candidates });
  } catch (err) {
    console.error('Fetch candidates error:', err);
    return res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// GET /api/industry/candidates/:candidateId - Detailed candidate profile & verified portfolio
router.get('/candidates/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const user = (await db.getUserByStudentId(candidateId)) || (await db.getUserById(candidateId));

    if (!user || user.isDeactivated) {
      return res.status(404).json({ error: `Candidate not found or inactive for identifier: ${candidateId}` });
    }

    return res.json({ candidate: sanitizeCandidate(user) });
  } catch (err) {
    console.error('Fetch candidate detail error:', err);
    return res.status(500).json({ error: 'Failed to fetch candidate details' });
  }
});

// GET /api/industry/candidates/:candidateId/resume - Download candidate resume (Recruiter / Industry / Faculty only)
router.get('/candidates/:candidateId/resume', requireAuth, async (req, res) => {
  try {
    const { candidateId } = req.params;
    const requestor = await db.getUserById(req.user.id);
    const isAuthorizedRole = requestor && ['industry', 'recruiter', 'admin', 'company', 'faculty', 'college'].includes(requestor.role);
    const isSelf = requestor && (requestor.id === candidateId || requestor.studentId === candidateId);

    if (!isAuthorizedRole && !isSelf) {
      return res.status(403).json({ error: 'Access denied: Recruiter or institutional authorization required to view candidate resumes' });
    }

    const user = (await db.getUserByStudentId(candidateId)) || (await db.getUserById(candidateId));

    if (!user || user.isDeactivated) {
      return res.status(404).json({ error: 'Candidate not found or is inactive' });
    }

    // 1. Check persistent PostgreSQL stored_files
    const stored = await db.getStoredFile(user.id, 'resume');
    if (stored && stored.file_data) {
      const mimeType = stored.mime_type || 'application/pdf';
      const downloadName = stored.original_filename || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`;
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
      return res.send(stored.file_data);
    }

    // 2. Check local disk fallback if exists
    if (!user.resume || !user.resume.filePath || !fs.existsSync(user.resume.filePath)) {
      return res.status(404).json({ error: 'Candidate has not uploaded a resume' });
    }

    const mimeType = user.resume.fileType || 'application/pdf';
    const downloadName = user.resume.fileName || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`;

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    return res.sendFile(path.resolve(user.resume.filePath));
  } catch (err) {
    console.error('Fetch candidate resume error:', err);
    return res.status(500).json({ error: 'Failed to retrieve candidate resume' });
  }
});

// POST /api/industry/shortlist - Shortlist or unshortlist candidate
router.post('/shortlist', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      const role = (req.user.role || '').toLowerCase();
      if (!['industry', 'recruiter', 'admin', 'host'].includes(role)) {
        return res.status(403).json({ error: 'Access denied: Only industry recruiters can shortlist candidates' });
      }
    }
    const companyId = req.user?.id || 'demo_recruiter';
    const { studentId, studentName, roleTitle } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    const result = await db.toggleShortlistCandidate(companyId, studentId, studentName, roleTitle);
    return res.json(result);
  } catch (err) {
    console.error('Shortlist candidate error:', err);
    return res.status(500).json({ error: 'Failed to shortlist candidate' });
  }
});

// GET /api/industry/applications - View applications submitted for company roles
router.get('/applications', optionalAuth, async (req, res) => {
  try {
    const allApps = await db.getApplications();
    return res.json({ applications: allApps });
  } catch (err) {
    console.error('Fetch industry applications error:', err);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// PUT /api/industry/applications/:id/status - Recruiter updates application status
router.put('/applications/:id/status', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      const role = (req.user.role || '').toLowerCase();
      if (!['industry', 'recruiter', 'admin', 'host'].includes(role)) {
        return res.status(403).json({ error: 'Access denied: Only industry recruiters can update candidate application stages' });
      }
    }
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const updated = await db.updateApplication(id, {
      status,
      statusChangeNote: note || `Recruiter updated candidate stage to ${status}`
    });

    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.json({ message: 'Candidate status updated', application: updated });
  } catch (err) {
    console.error('Update candidate status error:', err);
    return res.status(500).json({ error: 'Failed to update candidate status' });
  }
});

export default router;
