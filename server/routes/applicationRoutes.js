import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/applications - List current user's tracked applications
router.get('/', requireAuth, async (req, res) => {
  try {
    const apps = await db.getApplicationsByUser(req.user.id);
    return res.json({ applications: apps });
  } catch (err) {
    console.error('Fetch applications error:', err);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// POST /api/applications - Track new application (manual add or external application)
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      company,
      role,
      opportunityType = 'Internship',
      source = 'Direct',
      applicationUrl = '',
      status = 'Applied',
      notes = '',
      interviewDate = null,
      followUpDate = null,
      opportunityId = null,
      location = '',
      stipend = ''
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({ error: 'Company and Role are required' });
    }

    const newApp = await db.createApplication({
      userId: req.user.id,
      candidateName: req.user.name,
      candidateEmail: req.user.email,
      opportunityId,
      company: company.trim(),
      role: role.trim(),
      opportunityTitle: role.trim(),
      opportunityType,
      source,
      applicationUrl: applicationUrl ? applicationUrl.trim() : '',
      location: location || 'Remote / Hybrid',
      stipend: stipend || 'Disclosed upon interview',
      status,
      appliedDate: new Date().toISOString().split('T')[0],
      notes: notes || (source.includes('External') || source.includes('Careers') ? 'Application submitted on external platform.' : ''),
      interviewDate: interviewDate || null,
      followUpDate: followUpDate || null,
      isExternal: source.toLowerCase().includes('external') || source.toLowerCase().includes('career') || source.toLowerCase().includes('portal') || source.toLowerCase().includes('internshala')
    });

    return res.status(201).json({
      message: 'Application tracked successfully',
      application: newApp
    });
  } catch (err) {
    console.error('Create application error:', err);
    return res.status(500).json({ error: 'Failed to create application' });
  }
});

// PUT /api/applications/:id - Update application status, notes, interview date, follow-up
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.getApplicationById(id);

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this application' });
    }

    const updated = await db.updateApplication(id, req.body);
    return res.json({
      message: 'Application updated successfully',
      application: updated
    });
  } catch (err) {
    console.error('Update application error:', err);
    return res.status(500).json({ error: 'Failed to update application' });
  }
});

// DELETE /api/applications/:id - Remove application from tracking
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.getApplicationById(id);

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this application' });
    }

    const success = await db.deleteApplication(id, req.user.id);
    if (!success) {
      return res.status(500).json({ error: 'Failed to delete application' });
    }

    return res.json({ message: 'Application removed from tracker', id });
  } catch (err) {
    console.error('Delete application error:', err);
    return res.status(500).json({ error: 'Failed to delete application' });
  }
});

export default router;
