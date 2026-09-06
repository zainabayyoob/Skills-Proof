import express from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/opportunities
// Returns opportunities with computed match scores for authenticated user
router.get('/', optionalAuth, (req, res) => {
  try {
    const opps = db.getOpportunities();
    const user = req.user || null;
    const verifiedSkills = user?.verifiedSkills || [];

    const calculated = opps.map((opp) => {
      let matchedCount = 0;
      const totalReq = (opp.requiredSkills || []).length;
      const matchingSkills = [];
      const missingSkills = [];

      (opp.requiredSkills || []).forEach((reqSkill) => {
        const found = verifiedSkills.find(
          (v) => v.name.toLowerCase() === reqSkill.name.toLowerCase()
        );
        if (found && found.score >= reqSkill.minScore) {
          matchedCount++;
          matchingSkills.push(`${reqSkill.name} (${found.score}%)`);
        } else if (found) {
          missingSkills.push(`${reqSkill.name} (Has ${found.score}%, need ${reqSkill.minScore}%)`);
        } else {
          missingSkills.push(`${reqSkill.name} (Unverified)`);
        }
      });

      const matchScore = totalReq > 0
        ? Math.min(98, Math.round((matchedCount / totalReq) * 85 + ((user?.careerReadiness || 0) * 0.15)))
        : (user?.careerReadiness || 60);

      return {
        ...opp,
        matchScore: Math.max(matchScore, user?.careerReadiness ? Math.round(user.careerReadiness * 0.9) : 55),
        matchingSkills,
        missingSkills
      };
    });

    return res.json({ opportunities: calculated });
  } catch (err) {
    console.error('Opportunities fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// POST /api/opportunities/apply
router.post('/apply', requireAuth, (req, res) => {
  try {
    const { opportunityId, candidateNote } = req.body;
    if (!opportunityId) {
      return res.status(400).json({ error: 'opportunityId is required' });
    }

    const opp = db.getOpportunities().find((o) => o.id === opportunityId);
    if (!opp) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const userApps = db.getApplicationsByUser(req.user.id);
    const alreadyApplied = userApps.find((a) => a.opportunityId === opportunityId);
    if (alreadyApplied) {
      return res.status(409).json({ error: 'You have already submitted an application for this role' });
    }

    const matching = [];
    const missing = [];
    (opp.requiredSkills || []).forEach((reqSkill) => {
      const found = (req.user.verifiedSkills || []).find(
        (v) => v.name.toLowerCase() === reqSkill.name.toLowerCase()
      );
      if (found && found.score >= reqSkill.minScore) {
        matching.push(`${reqSkill.name} (${found.score}%)`);
      } else if (found) {
        missing.push(`${reqSkill.name} (Needs ${reqSkill.minScore}%)`);
      } else {
        missing.push(`${reqSkill.name} (Unverified)`);
      }
    });

    const application = db.createApplication({
      userId: req.user.id,
      candidateName: req.user.name,
      candidateEmail: req.user.email,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      company: opp.company,
      location: opp.location,
      stipend: opp.stipend,
      matchScore: Math.max(65, req.user.careerReadiness),
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      matchingSkills: matching,
      missingSkills: missing,
      passportHash: req.user.passportHash || null,
      notes: candidateNote ? candidateNote.trim() : `Applied with verified SkillProof Passport (Readiness: ${req.user.careerReadiness}%)`
    });

    return res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (err) {
    console.error('Apply error:', err);
    return res.status(500).json({ error: 'Failed to submit application' });
  }
});

// GET /api/applications
router.get('/applications', requireAuth, (req, res) => {
  try {
    const apps = db.getApplicationsByUser(req.user.id);
    return res.json({ applications: apps });
  } catch (err) {
    console.error('Applications error:', err);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

export default router;
