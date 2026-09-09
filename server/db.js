import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialOpportunities } from '../src/data/opportunitiesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const roleTracks = [
  {
    id: "track-fullstack",
    title: "Full Stack Web Developer",
    category: "Web & Enterprise Software",
    demand: "Very High",
    avgStipend: "₹40,000/mo",
    requiredSkills: [
      { id: "react", name: "Frontend", minScore: 75, importance: "Primary" },
      { id: "node", name: "Backend", minScore: 75, importance: "Primary" },
      { id: "sql", name: "SQL", minScore: 70, importance: "Core" },
      { id: "javascript", name: "JavaScript", minScore: 80, importance: "Core" },
      { id: "htmlcss", name: "HTML / CSS", minScore: 70, importance: "Secondary" }
    ]
  },
  {
    id: "track-backend",
    title: "Backend Systems Engineer",
    category: "Distributed & Cloud Systems",
    demand: "Critical",
    avgStipend: "₹45,000/mo",
    requiredSkills: [
      { id: "python", name: "Python", minScore: 80, importance: "Primary" },
      { id: "sql", name: "SQL", minScore: 80, importance: "Primary" },
      { id: "node", name: "Backend", minScore: 75, importance: "Core" },
      { id: "java", name: "Java", minScore: 75, importance: "Core" },
      { id: "cpp", name: "C++", minScore: 70, importance: "Secondary" }
    ]
  },
  {
    id: "track-data",
    title: "Data & AI Engineer",
    category: "Data Science & Machine Learning",
    demand: "High",
    avgStipend: "₹42,000/mo",
    requiredSkills: [
      { id: "python", name: "Python", minScore: 85, importance: "Primary" },
      { id: "sql", name: "SQL", minScore: 80, importance: "Primary" },
      { id: "dataanalytics", name: "Data Analytics", minScore: 80, importance: "Core" }
    ]
  },
  {
    id: "track-frontend",
    title: "Frontend Specialist",
    category: "Client-Side Engineering",
    demand: "High",
    avgStipend: "₹38,000/mo",
    requiredSkills: [
      { id: "react", name: "Frontend", minScore: 85, importance: "Primary" },
      { id: "javascript", name: "JavaScript", minScore: 85, importance: "Primary" },
      { id: "htmlcss", name: "HTML / CSS", minScore: 80, importance: "Core" }
    ]
  }
];

export const defaultOpportunities = initialOpportunities;

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = {
        users: [],
        testAttempts: [],
        opportunities: defaultOpportunities,
        applications: [],
        companyProfiles: [],
        shortlistedCandidates: [],
        studentGroups: [],
        assignedAssessments: [],
        facultyData: null
      };
      this.writeSync(initialData);
    } else {
      // Ensure existing database has opportunities synced
      const data = this.read();
      let changed = false;
      if (!data.opportunities || data.opportunities.length === 0 || data.opportunities[0].company === "Apex Data Systems") {
        data.opportunities = defaultOpportunities;
        changed = true;
      }
      if (!data.companyProfiles) { data.companyProfiles = []; changed = true; }
      if (!data.shortlistedCandidates) { data.shortlistedCandidates = []; changed = true; }
      if (!data.studentGroups) { data.studentGroups = []; changed = true; }
      if (!data.assignedAssessments) { data.assignedAssessments = []; changed = true; }
      if (changed) this.writeSync(data);
    }
  }

  read() {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading db.json, returning empty structure:', err);
      return {
        users: [],
        testAttempts: [],
        opportunities: defaultOpportunities,
        applications: [],
        companyProfiles: [],
        shortlistedCandidates: [],
        studentGroups: [],
        assignedAssessments: []
      };
    }
  }

  writeSync(data) {
    const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  // --- Dynamic calculations ---
  calculateSkillGapsForRole(targetRoleTitle, verifiedSkills = []) {
    const track = roleTracks.find(
      (r) => r.title.toLowerCase() === (targetRoleTitle || '').toLowerCase()
    ) || roleTracks[0];

    return track.requiredSkills.map((req) => {
      const verified = verifiedSkills.find(
        (v) =>
          v.name.toLowerCase() === req.name.toLowerCase() ||
          (v.skillId && v.skillId.toLowerCase() === req.id.toLowerCase())
      );
      const currentScore = verified ? verified.score : 0;
      const gap = Math.max(0, req.minScore - currentScore);

      return {
        skill: req.name,
        skillId: req.id,
        currentScore,
        requiredScore: req.minScore,
        gap,
        status: gap === 0 ? "Verified" : gap <= 15 ? "Moderate Gap" : "Critical Gap",
        action: gap === 0 ? "Skill Verified" : `Prove ${req.name} Skill`
      };
    });
  }

  calculateRoleMatches(verifiedSkills = [], readiness = 0) {
    return roleTracks.map((track) => {
      let matchedCount = 0;
      const totalReq = track.requiredSkills.length;
      track.requiredSkills.forEach((req) => {
        const found = verifiedSkills.find(
          (v) => v.name.toLowerCase() === req.name.toLowerCase() || v.skillId === req.id
        );
        if (found && found.score >= req.minScore) {
          matchedCount++;
        }
      });
      const matchPct = totalReq > 0
        ? Math.min(98, Math.round((matchedCount / totalReq) * 85 + (readiness * 0.15)))
        : 0;

      return {
        role: track.title,
        match: matchPct,
        demand: track.demand,
        topMissing: track.requiredSkills
          .filter((req) => !verifiedSkills.some((v) => v.name.toLowerCase() === req.name.toLowerCase() && v.score >= req.minScore))
          .map((req) => req.name)
      };
    });
  }

  // --- User Operations ---
  getUsers() {
    return this.read().users;
  }

  getUserById(id) {
    return this.read().users.find((u) => u.id === id) || null;
  }

  getUserByEmail(email) {
    if (!email) return null;
    return this.read().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  createUser(userData) {
    const data = this.read();
    const targetRole = userData.targetRole || "Full Stack Web Developer";
    const initialGaps = this.calculateSkillGapsForRole(targetRole, []);
    const initialRoles = this.calculateRoleMatches([], 0);

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone ? userData.phone.trim() : "",
      passwordHash: userData.passwordHash,
      college: userData.college || "Institute of Technology",
      degree: userData.degree || "Computer Science & Engineering",
      graduationYear: Number(userData.graduationYear) || 2026,
      semester: userData.semester || "6th Semester (3rd Year)",
      bio: userData.bio || "",
      github: userData.github || "",
      linkedin: userData.linkedin || "",
      targetRole,
      careerReadiness: 0,
      verifiedSkills: [],
      skillGaps: initialGaps,
      recommendedRoles: initialRoles,
      notifications: [
        {
          id: `notif_${Date.now()}_welcome`,
          type: 'WELCOME',
          title: 'Welcome to SkillProof!',
          message: 'Your candidate profile is ready. Select a skill to take the qualifying quiz and unlock coding challenges.',
          channel: 'IN_APP',
          createdAt: new Date().toISOString(),
          read: false
        }
      ],
      passportHash: null,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    this.writeSync(data);
    return newUser;
  }

  updateUser(id, updates) {
    const data = this.read();
    const index = data.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const current = data.users[index];
    const targetRole = updates.targetRole || current.targetRole;
    const verifiedSkills = updates.verifiedSkills || current.verifiedSkills || [];
    
    let careerReadiness = 0;
    if (verifiedSkills.length > 0) {
      const sum = verifiedSkills.reduce((acc, s) => acc + s.score, 0);
      careerReadiness = Math.round(sum / verifiedSkills.length);
    }

    const skillGaps = this.calculateSkillGapsForRole(targetRole, verifiedSkills);
    const recommendedRoles = this.calculateRoleMatches(verifiedSkills, careerReadiness);

    const updated = {
      ...current,
      ...updates,
      targetRole,
      careerReadiness,
      verifiedSkills,
      skillGaps,
      recommendedRoles,
      updatedAt: new Date().toISOString()
    };

    data.users[index] = updated;
    this.writeSync(data);
    return updated;
  }

  // --- Test Attempts ---
  saveTestAttempt(attempt) {
    const data = this.read();
    data.testAttempts.push(attempt);
    this.writeSync(data);
    return attempt;
  }

  getTestAttemptsByUser(userId) {
    return this.read().testAttempts.filter((t) => t.userId === userId);
  }

  getTestAttemptById(attemptId) {
    return this.read().testAttempts.find((t) => t.id === attemptId) || null;
  }

  updateTestAttempt(attemptId, updates) {
    const data = this.read();
    const idx = data.testAttempts.findIndex((t) => t.id === attemptId);
    if (idx === -1) return null;
    data.testAttempts[idx] = { ...data.testAttempts[idx], ...updates };
    this.writeSync(data);
    return data.testAttempts[idx];
  }

  // --- Opportunities & Applications ---
  getOpportunities() {
    return this.read().opportunities || defaultOpportunities;
  }

  addOpportunity(opp) {
    const data = this.read();
    if (!data.opportunities) data.opportunities = defaultOpportunities;
    const newOpp = {
      id: opp.id || `opp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...opp,
      postedDate: 'Just now',
      createdAt: new Date().toISOString()
    };
    data.opportunities.unshift(newOpp);
    this.writeSync(data);
    return newOpp;
  }

  getApplicationsByUser(userId) {
    return (this.read().applications || []).filter((a) => a.userId === userId);
  }

  getApplicationById(id) {
    return (this.read().applications || []).find((a) => a.id === id) || null;
  }

  createApplication(app) {
    const data = this.read();
    if (!data.applications) data.applications = [];
    const newApp = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      status: 'Applied',
      statusHistory: [
        {
          status: app.status || 'Applied',
          timestamp: new Date().toISOString(),
          note: app.notes || 'Application submitted'
        }
      ],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      ...app
    };
    data.applications.unshift(newApp);
    this.writeSync(data);
    return newApp;
  }

  updateApplication(id, updates) {
    const data = this.read();
    if (!data.applications) data.applications = [];
    const idx = data.applications.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const current = data.applications[idx];
    const newStatus = updates.status || current.status;
    const history = current.statusHistory || [
      { status: current.status, timestamp: current.createdAt, note: 'Initial application' }
    ];

    if (updates.status && updates.status !== current.status) {
      history.push({
        status: updates.status,
        timestamp: new Date().toISOString(),
        note: updates.statusChangeNote || `Status changed to ${updates.status}`
      });
    }

    const updated = {
      ...current,
      ...updates,
      status: newStatus,
      statusHistory: history,
      lastUpdated: new Date().toISOString()
    };

    data.applications[idx] = updated;
    this.writeSync(data);
    return updated;
  }

  deleteApplication(id, userId) {
    const data = this.read();
    if (!data.applications) return false;
    const idx = data.applications.findIndex((a) => a.id === id && (userId ? a.userId === userId : true));
    if (idx === -1) return false;
    data.applications.splice(idx, 1);
    this.writeSync(data);
    return true;
  }

  // --- Industry Module Operations ---
  getCompanyProfile(userId) {
    const data = this.read();
    return (data.companyProfiles || []).find((p) => p.userId === userId) || {
      companyName: "TechScale Innovations",
      industry: "Enterprise Software & Cloud Services",
      website: "https://techscale.io",
      location: "Bangalore, India (Hybrid)",
      contactEmail: "talent@techscale.io",
      description: "Fast-growing engineering organization building scalable microservices and data platforms."
    };
  }

  saveCompanyProfile(userId, profileData) {
    const data = this.read();
    if (!data.companyProfiles) data.companyProfiles = [];
    const idx = data.companyProfiles.findIndex((p) => p.userId === userId);
    const updated = {
      id: idx !== -1 ? data.companyProfiles[idx].id : `comp_${Date.now()}`,
      userId,
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    if (idx !== -1) {
      data.companyProfiles[idx] = updated;
    } else {
      data.companyProfiles.push(updated);
    }
    this.writeSync(data);
    return updated;
  }

  getShortlistedCandidates(companyId) {
    const data = this.read();
    return (data.shortlistedCandidates || []).filter((s) => s.companyId === companyId);
  }

  toggleShortlistCandidate(companyId, studentId, studentName, roleTitle) {
    const data = this.read();
    if (!data.shortlistedCandidates) data.shortlistedCandidates = [];
    const idx = data.shortlistedCandidates.findIndex((s) => s.companyId === companyId && s.studentId === studentId);
    if (idx !== -1) {
      data.shortlistedCandidates.splice(idx, 1);
      this.writeSync(data);
      return { shortlisted: false };
    } else {
      const entry = {
        id: `short_${Date.now()}`,
        companyId,
        studentId,
        studentName,
        roleTitle,
        shortlistedAt: new Date().toISOString()
      };
      data.shortlistedCandidates.push(entry);
      this.writeSync(data);
      return { shortlisted: true, entry };
    }
  }

  // --- College & Academia Module ---
  getCollegeAnalytics() {
    const data = this.read();
    const users = data.users || [];
    const totalStudents = users.length;
    let verifiedSkillsCount = 0;
    let totalScoreSum = 0;
    let totalScoreCount = 0;

    const skillAverages = {
      'Python': { sum: 0, count: 0 },
      'SQL': { sum: 0, count: 0 },
      'DSA': { sum: 0, count: 0 },
      'JavaScript': { sum: 0, count: 0 },
      'Frontend': { sum: 0, count: 0 },
      'Backend': { sum: 0, count: 0 },
      'Communication': { sum: 0, count: 0 },
      'Cloud': { sum: 0, count: 0 }
    };

    users.forEach((u) => {
      (u.verifiedSkills || []).forEach((vs) => {
        verifiedSkillsCount++;
        totalScoreSum += vs.score;
        totalScoreCount++;
        const name = vs.name || '';
        for (const k of Object.keys(skillAverages)) {
          if (name.toLowerCase().includes(k.toLowerCase())) {
            skillAverages[k].sum += vs.score;
            skillAverages[k].count++;
          }
        }
      });
    });

    const averageScore = totalScoreCount > 0 ? Math.round(totalScoreSum / totalScoreCount) : 78;

    const domainGaps = Object.entries(skillAverages).map(([domain, stat]) => {
      const avg = stat.count > 0 ? Math.round(stat.sum / stat.count) : (domain === 'DSA' || domain === 'Communication' ? 62 : 76);
      const rating = avg >= 80 ? 'Strong' : avg >= 70 ? 'Medium' : 'Weak';
      const needingImp = avg >= 80 ? 15 : avg >= 70 ? 35 : 48;
      return {
        domain,
        rating,
        avgScore: avg,
        studentsAssessed: stat.count,
        percentageNeedingImprovement: needingImp,
        impactedStudents: Math.round((totalStudents || 1200) * (needingImp / 100))
      };
    });

    const applications = data.applications || [];
    const placed = applications.filter((a) => a.status === 'Selected' || a.status === 'Offer').length;
    const interviewing = applications.filter((a) => a.status === 'Interview' || a.status === 'Shortlisted').length;

    return {
      institutionName: "ABC Institute of Technology & Engineering",
      totalStudents: Math.max(totalStudents, 1250),
      studentsAssessed: users.filter(u => (u.verifiedSkills || []).length > 0).length || 480,
      verifiedSkillsCount: verifiedSkillsCount || 3420,
      placementReadiness: averageScore,
      domainGaps,
      internshipParticipation: applications.length || 185,
      placedCount: placed || 120,
      interviewingCount: interviewing || 94
    };
  }

  getStudentGroups() {
    const data = this.read();
    return data.studentGroups && data.studentGroups.length > 0 ? data.studentGroups : [
      { id: 'grp-1', name: '3rd Year CS - Batch A', department: 'Computer Science', studentsCount: 65, activeAssessments: 2 },
      { id: 'grp-2', name: '4th Year CS - Accelerated DSA', department: 'Information Science', studentsCount: 48, activeAssessments: 3 },
      { id: 'grp-3', name: 'Pre-Final Year Cloud & DevOps Cohort', department: 'Computer Science', studentsCount: 52, activeAssessments: 1 }
    ];
  }

  createStudentGroup(group) {
    const data = this.read();
    if (!data.studentGroups) data.studentGroups = [];
    const newGroup = {
      id: `grp_${Date.now()}`,
      ...group,
      studentsCount: Number(group.studentsCount) || 30,
      activeAssessments: 0,
      createdAt: new Date().toISOString()
    };
    data.studentGroups.push(newGroup);
    this.writeSync(data);
    return newGroup;
  }

  assignAssessment(assignment) {
    const data = this.read();
    if (!data.assignedAssessments) data.assignedAssessments = [];
    const newAssign = {
      id: `assign_${Date.now()}`,
      ...assignment,
      assignedAt: new Date().toISOString()
    };
    data.assignedAssessments.push(newAssign);
    this.writeSync(data);
    return newAssign;
  }

  getFacultyData() {
    const data = this.read();
    return data.facultyData || {
      facultyName: "Dr. Ananya Sharma",
      department: "Computer Science & Engineering",
      designation: "Associate Professor & Placement Faculty Lead",
      email: "ananya.sharma@college.edu.in",
      mentoredStudents: 34,
      activities: [
        { id: 'act-1', type: 'Workshop', title: 'Defensive Code Mutation & Production Sandboxes', partner: 'TCS & SkillProof', date: '2026-09-02', participants: 120 },
        { id: 'act-2', type: 'Guest Lecture', title: 'Zero-Downtime Microservices Architecture', partner: 'Amazon AWS Lead', date: '2026-08-20', participants: 180 },
        { id: 'act-3', type: 'FDP', title: 'Faculty Cloud Infrastructure & SRE Fellowship', partner: 'Google Cloud Training', date: '2026-07-15', participants: 45 },
        { id: 'act-4', type: 'Mentorship', title: 'Hackathon Mentoring - SIH 2026 Innovation Sprint', partner: 'Smart India Hackathon', date: '2026-08-28', participants: 25 }
      ]
    };
  }

  addFacultyActivity(activity) {
    const data = this.read();
    if (!data.facultyData) {
      data.facultyData = this.getFacultyData();
    }
    const newAct = {
      id: `act_${Date.now()}`,
      ...activity,
      createdAt: new Date().toISOString()
    };
    data.facultyData.activities.unshift(newAct);
    this.writeSync(data);
    return newAct;
  }

  // --- Notifications Architecture ---
  addNotification(userId, notif) {
    const data = this.read();
    const user = data.users.find((u) => u.id === userId);
    if (!user) return null;
    if (!user.notifications) user.notifications = [];
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      ...notif,
      createdAt: new Date().toISOString(),
      read: false
    };
    user.notifications.unshift(newNotif);
    this.writeSync(data);
    return newNotif;
  }

  getNotificationsByUser(userId) {
    const user = this.getUserById(userId);
    return user?.notifications || [];
  }
}

export const db = new Database();
