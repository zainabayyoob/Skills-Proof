import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * Middleware: Require Host/Admin privileges
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'host'].includes(String(req.user.role || '').toLowerCase())) {
    return res.status(403).json({
      error: 'Access denied: Host or Administrator privilege required to access this console.'
    });
  }
  next();
};

// All admin routes require authentication and admin/host role
router.use(requireAuth, requireAdmin);

/**
 * Sanitizer for admin views
 */
const sanitizeAdminUser = (u) => {
  if (!u) return null;
  const {
    passwordHash,
    emailVerificationCode,
    phoneVerificationCode,
    resetPasswordToken,
    resetPasswordExpires,
    ...sanitized
  } = u;

  return {
    ...sanitized,
    id: u.id,
    studentId: u.studentId || u.id,
    hasResume: Boolean(u.resume && u.resume.filePath),
    resumeFileName: u.resume ? u.resume.fileName : null,
    resumeFileSize: u.resume ? u.resume.fileSizeFormatted : null,
    resumeUploadedAt: u.resume ? u.resume.uploadedAt : null,
    verifiedSkillsCount: (u.verifiedSkills || []).length,
    isDeactivated: Boolean(u.isDeactivated),
    deactivatedAt: u.deactivatedAt || null,
    deactivatedBy: u.deactivatedBy || null
  };
};

/**
 * GET /api/admin/stats - High-level system telemetry
 */
router.get('/stats', async (req, res) => {
  try {
    const users = await db.getUsers();
    const attempts = await db.getTestAttempts();
    const applications = await db.getApplications();

    const candidates = users.filter((u) => !u.role || u.role === 'candidate' || u.role === 'student');
    const activeCandidates = candidates.filter((u) => !u.isDeactivated);
    const industry = users.filter((u) => u.role === 'industry' || u.role === 'recruiter');
    const faculty = users.filter((u) => u.role === 'faculty' || u.role === 'college');
    const admins = users.filter((u) => u.role === 'admin' || u.role === 'host');
    const deactivated = users.filter((u) => Boolean(u.isDeactivated));

    return res.json({
      totalUsers: users.length,
      candidatesCount: candidates.length,
      activeCandidatesCount: activeCandidates.length,
      industryCount: industry.length,
      facultyCount: faculty.length,
      adminCount: admins.length,
      deactivatedCount: deactivated.length,
      totalTestAttempts: attempts.length,
      totalApplications: applications.length
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ error: 'Failed to retrieve administrative statistics' });
  }
});

/**
 * GET /api/admin/users - Search and list all registered users
 * Query: ?search=&role=&status=
 */
router.get('/users', async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const users = await db.getUsers({ search, role, status });
    const sanitized = users.map(sanitizeAdminUser);

    return res.json({
      users: sanitized,
      total: sanitized.length
    });
  } catch (err) {
    console.error('Admin get users error:', err);
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

/**
 * GET /api/admin/users/:userId - Full inspection of user record, attempts, and applications
 */
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = (await db.getUserById(userId)) || (await db.getUserByStudentId(userId));

    if (!user) {
      return res.status(404).json({ error: `User not found for identifier: ${userId}` });
    }

    const testAttempts = await db.getTestAttemptsByUser(user.id);
    const applications = await db.getApplicationsByUser(user.id);

    return res.json({
      user: sanitizeAdminUser(user),
      testAttempts,
      applications
    });
  } catch (err) {
    console.error('Admin get user detail error:', err);
    return res.status(500).json({ error: 'Failed to retrieve user details' });
  }
});

/**
 * POST /api/admin/users/:userId/deactivate - Safe deactivation of a user
 */
router.post('/users/:userId/deactivate', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = (await db.getUserById(userId)) || (await db.getUserByStudentId(userId));

    if (!user) {
      return res.status(404).json({ error: `User not found for identifier: ${userId}` });
    }

    // Protection: Root administrator cannot deactivate own account
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Safety restriction: You cannot deactivate your own administrative account.' });
    }

    const updated = await db.deactivateUser(user.id, req.user.id);
    return res.json({
      message: `User account '${user.name}' (${user.id}) has been safely deactivated. They are now excluded from candidate queries and login.`,
      user: sanitizeAdminUser(updated)
    });
  } catch (err) {
    console.error('Admin deactivate user error:', err);
    return res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

/**
 * POST /api/admin/users/:userId/reactivate - Re-activate a deactivated user
 */
router.post('/users/:userId/reactivate', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = (await db.getUserById(userId)) || (await db.getUserByStudentId(userId));

    if (!user) {
      return res.status(404).json({ error: `User not found for identifier: ${userId}` });
    }

    const updated = await db.reactivateUser(user.id);
    return res.json({
      message: `User account '${user.name}' (${user.id}) has been successfully reactivated.`,
      user: sanitizeAdminUser(updated)
    });
  } catch (err) {
    console.error('Admin reactivate user error:', err);
    return res.status(500).json({ error: 'Failed to reactivate user' });
  }
});

/**
 * DELETE /api/admin/users/:userId - Permanent removal of user with cascading cleanup
 */
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = (await db.getUserById(userId)) || (await db.getUserByStudentId(userId));

    if (!user) {
      return res.status(404).json({ error: `User not found for identifier: ${userId}` });
    }

    // Protection: Root administrator cannot purge own account
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Safety restriction: You cannot permanently delete your own administrative account.' });
    }

    const success = await db.purgeUser(user.id);
    if (!success) {
      return res.status(500).json({ error: 'Failed to remove user records.' });
    }

    return res.json({
      message: `User account '${user.name}' (${user.id}) and all associated test attempts, applications, and storage files have been permanently removed.`,
      deletedUserId: user.id
    });
  } catch (err) {
    console.error('Admin purge user error:', err);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
