import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile
router.get('/', requireAuth, (req, res) => {
  try {
    const user = db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash, ...sanitized } = user;
    return res.json({ profile: sanitized });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// PUT /api/profile
router.put('/', requireAuth, (req, res) => {
  try {
    const {
      name,
      college,
      degree,
      graduationYear,
      semester,
      bio,
      github,
      linkedin,
      targetRole,
      avatarUrl
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (college !== undefined) updates.college = college.trim();
    if (degree !== undefined) updates.degree = degree.trim();
    if (graduationYear !== undefined) updates.graduationYear = Number(graduationYear);
    if (semester !== undefined) updates.semester = semester.trim();
    if (bio !== undefined) updates.bio = bio.trim();
    if (github !== undefined) updates.github = github.trim();
    if (linkedin !== undefined) updates.linkedin = linkedin.trim();
    if (targetRole !== undefined) updates.targetRole = targetRole.trim();
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl.trim();

    const updatedUser = db.updateUser(req.user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash, ...sanitized } = updatedUser;
    return res.json({
      message: 'Profile updated successfully',
      profile: sanitized
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
