import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { JWT_SECRET, requireAuth } from '../middleware/auth.js';

const router = express.Router();

const sanitizeUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...sanitized } = user;
  return sanitized;
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, college, degree, graduationYear, semester, targetRole } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    // Phone validation
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Mobile phone number is required' });
    }
    const cleanPhone = phone.trim().replace(/[\s\-()]/g, '');
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ error: 'Please enter a valid phone number (10 to 15 digits, e.g. +91 9876543210)' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check duplicate
    const existing = db.getUserByEmail(email.trim());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please sign in.' });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = db.createUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      passwordHash,
      college: college ? college.trim() : 'Institute of Technology',
      degree: degree ? degree.trim() : 'Computer Science & Engineering',
      graduationYear: Number(graduationYear) || 2026,
      semester: semester ? semester.trim() : '6th Semester (3rd Year)',
      targetRole: targetRole ? targetRole.trim() : 'Full Stack Web Developer'
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email.trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Login successful',
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  return res.json({
    user: sanitizeUser(req.user)
  });
});

// POST /api/auth/demo-preset
// Quickly loads or creates the pre-verified Aarav Sharma demo candidate for evaluators
router.post('/demo-preset', async (req, res) => {
  try {
    const demoEmail = 'aarav.sharma@abctech.edu';
    let demoUser = db.getUserByEmail(demoEmail);

    if (!demoUser) {
      const passwordHash = await bcrypt.hash('DemoPass2026!', 10);
      demoUser = db.createUser({
        name: 'Aarav Sharma',
        email: demoEmail,
        passwordHash,
        college: 'ABC Institute of Technology',
        degree: 'B.Tech in Computer Science & Engineering',
        graduationYear: 2026,
        semester: '6th Semester (3rd Year)',
        targetRole: 'Full Stack Web Developer'
      });

      // Give Aarav verified skills
      const verifiedSkills = [
        { name: "Python", skillId: "python", score: 86, level: "Advanced", verifiedAt: "2026-09-02", badge: "Gold" },
        { name: "SQL", skillId: "sql", score: 82, level: "Proficient", verifiedAt: "2026-09-03", badge: "Silver" },
        { name: "Frontend (React)", skillId: "react", score: 88, level: "Advanced", verifiedAt: "2026-09-04", badge: "Gold" },
        { name: "JavaScript", skillId: "javascript", score: 80, level: "Proficient", verifiedAt: "2026-09-04", badge: "Silver" }
      ];

      demoUser = db.updateUser(demoUser.id, {
        verifiedSkills,
        passportHash: 'SKP-2026-PYT-DEMO-84AARAV'
      });
    }

    const token = jwt.sign({ id: demoUser.id, email: demoUser.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      message: 'Demo preset loaded',
      token,
      user: sanitizeUser(demoUser)
    });
  } catch (err) {
    console.error('Demo preset error:', err);
    return res.status(500).json({ error: 'Failed to initialize demo preset' });
  }
});

export default router;
