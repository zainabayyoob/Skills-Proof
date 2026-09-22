import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'skillproof_jwt_secret_sih2026_super_secure_key';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Authentication token is missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User record no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired authentication token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await db.getUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

export const requireRole = (allowedRoles) => {
  const roles = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map((r) => r.toLowerCase());
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    const userRole = (req.user.role || '').toLowerCase();

    // Check match including backward compatible pairs and admin / host override
    const isAllowed =
      roles.includes(userRole) ||
      (roles.includes('faculty') && userRole === 'college') ||
      (roles.includes('college') && userRole === 'faculty') ||
      (roles.includes('candidate') && userRole === 'student') ||
      (roles.includes('student') && userRole === 'candidate') ||
      (roles.includes('industry') && userRole === 'recruiter') ||
      (roles.includes('recruiter') && userRole === 'industry') ||
      userRole === 'admin' ||
      userRole === 'host';

    if (!isAllowed) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role privileges for this operation' });
    }
    next();
  };
};

export const requireFaculty = [requireAuth, requireRole(['faculty', 'college'])];
export const requireStudent = [requireAuth, requireRole(['candidate', 'student'])];
export const requireIndustry = [requireAuth, requireRole(['industry', 'recruiter'])];
export const requireAdmin = [requireAuth, requireRole(['admin', 'host'])];

