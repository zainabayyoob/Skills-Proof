import express from 'express';
import { db } from '../db.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/college/analytics - Aggregate institutional telemetry computed from student database
router.get('/analytics', (req, res) => {
  try {
    const analytics = db.getCollegeAnalytics();
    return res.json({ analytics });
  } catch (err) {
    console.error('College analytics error:', err);
    return res.status(500).json({ error: 'Failed to compute college analytics' });
  }
});

// GET /api/college/groups - List managed student cohorts
router.get('/groups', (req, res) => {
  try {
    const groups = db.getStudentGroups();
    return res.json({ groups });
  } catch (err) {
    console.error('Fetch student groups error:', err);
    return res.status(500).json({ error: 'Failed to fetch student groups' });
  }
});

// POST /api/college/groups - Create a new student cohort
router.post('/groups', optionalAuth, (req, res) => {
  try {
    const { name, department = 'Computer Science', studentsCount = 30 } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const created = db.createStudentGroup({ name, department, studentsCount });
    return res.status(201).json({ message: 'Cohort created successfully', group: created });
  } catch (err) {
    console.error('Create student group error:', err);
    return res.status(500).json({ error: 'Failed to create student group' });
  }
});

// POST /api/college/assign - Assign an assessment challenge to a group
router.post('/assign', optionalAuth, (req, res) => {
  try {
    const { groupId, groupName, skillId, skillName, title, deadline } = req.body;
    if (!skillId || !deadline) {
      return res.status(400).json({ error: 'Skill and deadline are required' });
    }

    const assignment = db.assignAssessment({
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

// GET /api/college/faculty - Faculty profile and industry interaction activities
router.get('/faculty', (req, res) => {
  try {
    const faculty = db.getFacultyData();
    return res.json({ faculty });
  } catch (err) {
    console.error('Fetch faculty error:', err);
    return res.status(500).json({ error: 'Failed to fetch faculty data' });
  }
});

// POST /api/college/faculty/activity - Log new faculty activity (Workshop, Guest Lecture, FDP, Mentoring)
router.post('/faculty/activity', optionalAuth, (req, res) => {
  try {
    const { type, title, partner, date, participants } = req.body;
    if (!title || !type) {
      return res.status(400).json({ error: 'Activity title and type are required' });
    }

    const activity = db.addFacultyActivity({
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
