import express from 'express';
import path from 'path';
import fs from 'fs';
import { db } from '../db.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

const sanitizeStudentForFaculty = (u) => {
  if (!u) return null;
  const verified = u.verifiedSkills || [];
  const totalScore = verified.reduce((acc, s) => acc + s.score, 0);
  const avgScore = verified.length > 0 ? Math.round(totalScore / verified.length) : (u.careerReadiness || 0);

  return {
    id: u.id,
    studentId: u.studentId || u.id,
    name: u.name,
    email: u.email,
    college: u.college || 'ABC Institute of Technology',
    collegeId: u.collegeId || null,
    degree: u.degree || 'B.Tech (Bachelor of Technology)',
    academicYear: u.academicYear || '3rd Year',
    semester: u.semester || '6th Semester',
    graduationYear: u.graduationYear || 2026,
    targetRole: u.targetRole || 'Full Stack Web Developer',
    primaryDomain: u.primaryDomain || 'Computer Science / Software Development',
    secondaryDomains: Array.isArray(u.secondaryDomains) ? u.secondaryDomains : [],
    professionalHeadline: u.professionalHeadline || '',
    location: u.location || 'India',
    softSkills: Array.isArray(u.softSkills) ? u.softSkills : ['Problem Solving', 'Team Collaboration', 'Technical Communication'],
    careerPreferences: u.careerPreferences || { preferredType: 'Internship', workMode: 'Hybrid' },
    careerReadiness: u.careerReadiness || avgScore,
    verifiedSkills: verified,
    passportHash: u.passportHash || `SKP-2026-${u.id.substring(0, 8).toUpperCase()}`,
    hasResume: Boolean(u.resume && u.resume.filePath),
    resume: u.resume ? {
      fileName: u.resume.fileName,
      fileSizeFormatted: u.resume.fileSizeFormatted,
      uploadedAt: u.resume.uploadedAt
    } : null,
    projects: u.projects || [],
    certifications: u.certifications || [],
    experience: u.experience || [],
    achievements: u.achievements || [],
    github: u.github || '',
    linkedin: u.linkedin || ''
  };
};

// GET /api/college/analytics - Aggregate institutional telemetry computed from student database
router.get('/analytics', async (req, res) => {
  try {
    const analytics = await db.getCollegeAnalytics();
    return res.json({ analytics });
  } catch (err) {
    console.error('College analytics error:', err);
    return res.status(500).json({ error: 'Failed to compute college analytics' });
  }
});

// GET /api/college/students - Real registered students for faculty cohort review
router.get('/students', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      const role = (req.user.role || '').toLowerCase();
      if (['student', 'candidate'].includes(role)) {
        return res.status(403).json({ error: 'Access denied: Students cannot access institutional cohort rosters' });
      }
    }
    const { search, degree, graduationYear, skill } = req.query;
    const users = await db.getUsers();
    const candidateUsers = users.filter((u) => (!u.role || u.role === 'candidate' || u.role === 'student') && !u.isDeactivated);
    let students = candidateUsers.map(sanitizeStudentForFaculty);

    if (search) {
      const q = String(search).trim().toLowerCase();
      students = students.filter((s) =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.studentId && s.studentId.toLowerCase().includes(q)) ||
        (s.id && s.id.toLowerCase().includes(q)) ||
        (s.passportHash && s.passportHash.toLowerCase().includes(q))
      );
    }

    if (degree) {
      students = students.filter((s) => s.degree.toLowerCase().includes(degree.toLowerCase()));
    }

    if (graduationYear) {
      students = students.filter((s) => Number(s.graduationYear) === Number(graduationYear));
    }

    if (skill) {
      students = students.filter((s) =>
        s.verifiedSkills.some((vs) => vs.name && vs.name.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    return res.json({ students, total: students.length });
  } catch (err) {
    console.error('Fetch college students error:', err);
    return res.status(500).json({ error: 'Failed to fetch college students' });
  }
});

// GET /api/college/students/:studentId - Individual student progress, assessments, and applications
router.get('/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = (await db.getUserByStudentId(studentId)) || (await db.getUserById(studentId));

    if (!user || user.isDeactivated) {
      return res.status(404).json({ error: `Student not found or inactive for identifier: ${studentId}` });
    }

    const testAttempts = await db.getTestAttemptsByUser(user.id);
    const applications = await db.getApplicationsByUser(user.id);

    return res.json({
      student: sanitizeStudentForFaculty(user),
      testAttempts,
      applications
    });
  } catch (err) {
    console.error('Fetch student progress error:', err);
    return res.status(500).json({ error: 'Failed to fetch student progress' });
  }
});

// GET /api/college/students/:studentId/resume - Review student resume by faculty
router.get('/students/:studentId/resume', requireAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const requestor = await db.getUserById(req.user.id);
    const isAuthorized = requestor && ['faculty', 'college', 'admin', 'industry', 'recruiter'].includes(requestor.role);
    const isSelf = requestor && (requestor.id === studentId || requestor.studentId === studentId);

    if (!isAuthorized && !isSelf) {
      return res.status(403).json({ error: 'Access denied: Faculty or institutional authorization required' });
    }

    const user = (await db.getUserByStudentId(studentId)) || (await db.getUserById(studentId));

    if (!user || user.isDeactivated) {
      return res.status(404).json({ error: 'Student not found or is inactive' });
    }

    // 1. Check persistent PostgreSQL stored_files
    const stored = await db.getStoredFile(user.id, 'resume');
    if (stored && stored.file_data) {
      const mimeType = stored.mime_type || 'application/pdf';
      const downloadName = stored.original_filename || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`;
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${downloadName}"`);
      return res.send(stored.file_data);
    }

    // 2. Check local disk fallback if exists
    if (!user.resume || !user.resume.filePath || !fs.existsSync(user.resume.filePath)) {
      return res.status(404).json({ error: 'Student has not uploaded a resume' });
    }

    const mimeType = user.resume.fileType || 'application/pdf';
    const downloadName = user.resume.fileName || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`;

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${downloadName}"`);
    return res.sendFile(path.resolve(user.resume.filePath));
  } catch (err) {
    console.error('Fetch student resume error:', err);
    return res.status(500).json({ error: 'Failed to retrieve student resume' });
  }
});

// GET /api/college/groups - List managed student cohorts
router.get('/groups', async (req, res) => {
  try {
    const groups = await db.getStudentGroups();
    return res.json({ groups });
  } catch (err) {
    console.error('Fetch student groups error:', err);
    return res.status(500).json({ error: 'Failed to fetch student groups' });
  }
});

// POST /api/college/groups - Create a new student cohort
router.post('/groups', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      const role = (req.user.role || '').toLowerCase();
      if (!['faculty', 'college', 'admin', 'host'].includes(role)) {
        return res.status(403).json({ error: 'Access denied: Only faculty members can create student cohorts' });
      }
    }
    const { name, department = 'Computer Science', studentsCount = 30 } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const created = await db.createStudentGroup({ name, department, studentsCount });
    return res.status(201).json({ message: 'Cohort created successfully', group: created });
  } catch (err) {
    console.error('Create student group error:', err);
    return res.status(500).json({ error: 'Failed to create student group' });
  }
});

// POST /api/college/assign - Assign an assessment challenge to a group
router.post('/assign', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      const role = (req.user.role || '').toLowerCase();
      if (!['faculty', 'college', 'admin', 'host'].includes(role)) {
        return res.status(403).json({ error: 'Access denied: Only faculty members can assign assessment challenges' });
      }
    }
    const { groupId, groupName, skillId, skillName, title, deadline } = req.body;
    if (!skillId || !deadline) {
      return res.status(400).json({ error: 'Skill and deadline are required' });
    }

    const assignment = await db.assignAssessment({
      groupId: groupId || 'all_students',
      groupName: groupName || 'All Registered CS Students',
      skillId,
      skillName: skillName || skillId,
      title: title || `SkillProof ${skillName || skillId} Benchmark Challenge`,
      deadline
    });

    return res.status(201).json({ message: 'Assessment assigned to cohort', assignment });
  } catch (err) {
    console.error('Assign assessment error:', err);
    return res.status(500).json({ error: 'Failed to assign assessment' });
  }
});

// GET /api/college/assignments - List assigned assessment challenges
router.get('/assignments', async (req, res) => {
  try {
    const assignments = await db.getAssignedAssessments();
    return res.json({ assignments });
  } catch (err) {
    console.error('Fetch assignments error:', err);
    return res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// GET /api/college/faculty - Faculty profile and industry interaction activities
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await db.getFacultyData();
    return res.json({ faculty });
  } catch (err) {
    console.error('Fetch faculty error:', err);
    return res.status(500).json({ error: 'Failed to fetch faculty data' });
  }
});

// POST /api/college/faculty/activity - Log new faculty activity (Workshop, Guest Lecture, FDP, Mentoring)
router.post('/faculty/activity', optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      const role = (req.user.role || '').toLowerCase();
      if (!['faculty', 'college', 'admin', 'host'].includes(role)) {
        return res.status(403).json({ error: 'Access denied: Only faculty members can log faculty development activities' });
      }
    }
    const { type, title, partner, date, participants } = req.body;
    if (!title || !type) {
      return res.status(400).json({ error: 'Activity title and type are required' });
    }

    const activity = await db.addFacultyActivity({
      type,
      title,
      partner: partner || 'Industry Partner',
      date: date || new Date().toISOString().split('T')[0],
      participants: Number(participants) || 40
    });

    return res.status(201).json({ message: 'Faculty activity logged', activity });
  } catch (err) {
    console.error('Add faculty activity error:', err);
    return res.status(500).json({ error: 'Failed to log faculty activity' });
  }
});

export default router;
