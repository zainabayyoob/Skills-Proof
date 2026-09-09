import express from 'express';
import { db } from '../db.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/industry/profile - Get current recruiter company profile
router.get('/profile', optionalAuth, (req, res) => {
  try {
    const userId = req.user?.id || 'demo_recruiter';
    const profile = db.getCompanyProfile(userId);
    return res.json({ profile });
  } catch (err) {
    console.error('Fetch company profile error:', err);
    return res.status(500).json({ error: 'Failed to fetch company profile' });
  }
});

// POST /api/industry/profile - Update company profile
router.post('/profile', optionalAuth, (req, res) => {
  try {
    const userId = req.user?.id || 'demo_recruiter';
    const updated = db.saveCompanyProfile(userId, req.body);
    return res.json({ message: 'Company profile updated', profile: updated });
  } catch (err) {
    console.error('Update company profile error:', err);
    return res.status(500).json({ error: 'Failed to update company profile' });
  }
});

// GET /api/industry/opportunities - Opportunities posted by industry
router.get('/opportunities', (req, res) => {
  try {
    const all = db.getOpportunities();
    return res.json({ opportunities: all });
  } catch (err) {
    console.error('Fetch industry opportunities error:', err);
    return res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// POST /api/industry/opportunities - Post new job/internship/project
router.post('/opportunities', optionalAuth, (req, res) => {
  try {
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

    const created = db.addOpportunity({
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

// GET /api/industry/candidates - Real registered students from db.json with skill filter
router.get('/candidates', (req, res) => {
  try {
    const { skill, minScore = 0, targetRole } = req.query;
    const users = db.getUsers();

    let candidates = users.map((u) => {
      const verified = u.verifiedSkills || [];
      const totalScore = verified.reduce((acc, s) => acc + s.score, 0);
      const avgScore = verified.length > 0 ? Math.round(totalScore / verified.length) : (u.careerReadiness || 0);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        college: u.college || 'Institute of Technology',
        degree: u.degree || 'Computer Science & Engineering',
        graduationYear: u.graduationYear || 2026,
        targetRole: u.targetRole || 'Full Stack Web Developer',
        careerReadiness: u.careerReadiness || avgScore,
        verifiedSkills: verified,
        passportHash: u.passportHash || `SKP-2026-${u.id.substring(0, 8).toUpperCase()}`,
        github: u.github || '',
        linkedin: u.linkedin || ''
      };
    });

    if (skill) {
      candidates = candidates.filter((c) =>
        c.verifiedSkills.some((vs) =>
          (vs.name.toLowerCase().includes(skill.toLowerCase()) || vs.skillId === skill.toLowerCase()) &&
          vs.score >= Number(minScore)
        )
      );
    }

    if (targetRole) {
      candidates = candidates.filter((c) =>
        c.targetRole.toLowerCase().includes(targetRole.toLowerCase())
      );
    }

    return res.json({ candidates });
  } catch (err) {
    console.error('Fetch candidates error:', err);
    return res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// POST /api/industry/shortlist - Shortlist or unshortlist candidate
router.post('/shortlist', optionalAuth, (req, res) => {
  try {
    const companyId = req.user?.id || 'demo_recruiter';
    const { studentId, studentName, roleTitle } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required' });
    }

    const result = db.toggleShortlistCandidate(companyId, studentId, studentName, roleTitle);
    return res.json(result);
  } catch (err) {
    console.error('Shortlist candidate error:', err);
    return res.status(500).json({ error: 'Failed to shortlist candidate' });
  }
});

// GET /api/industry/applications - View applications submitted for company roles
router.get('/applications', optionalAuth, (req, res) => {
  try {
    const allApps = db.read().applications || [];
    return res.json({ applications: allApps });
  } catch (err) {
    console.error('Fetch industry applications error:', err);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// PUT /api/industry/applications/:id/status - Recruiter updates application status
router.put('/applications/:id/status', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const updated = db.updateApplication(id, {
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
