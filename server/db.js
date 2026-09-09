import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
      { id: "react", name: "Frontend (React)", minScore: 75, importance: "Primary" },
      { id: "node", name: "Backend (Node.js)", minScore: 75, importance: "Primary" },
      { id: "sql", name: "SQL", minScore: 70, importance: "Core" },
      { id: "javascript", name: "JavaScript", minScore: 80, importance: "Core" },
      { id: "htmlcss", name: "HTML & CSS", minScore: 70, importance: "Secondary" }
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
      { id: "node", name: "Backend (Node.js)", minScore: 75, importance: "Core" },
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
      { id: "react", name: "Frontend (React)", minScore: 85, importance: "Primary" },
      { id: "javascript", name: "JavaScript", minScore: 85, importance: "Primary" },
      { id: "htmlcss", name: "HTML & CSS", minScore: 80, importance: "Core" }
    ]
  }
];

export const defaultOpportunities = [
  {
    id: "opp-1",
    title: "Full Stack Engineer Intern",
    company: "Apex Data Systems",
    location: "Bangalore, India (Hybrid)",
    stipend: "₹35,000 - ₹45,000 / month",
    type: "Internship (6 Months) with PPO",
    postedDate: "2 days ago",
    openings: 3,
    description: "Build robust REST APIs and responsive dashboards under high event volume.",
    requiredSkills: [
      { name: "Frontend (React)", weight: 0.35, minScore: 75 },
      { name: "Backend (Node.js)", weight: 0.35, minScore: 75 },
      { name: "SQL", weight: 0.3, minScore: 70 }
    ]
  },
  {
    id: "opp-2",
    title: "Python Data Systems Engineer",
    company: "CloudScale Infrastructure",
    location: "Remote (India)",
    stipend: "₹14,00,000 - ₹18,00,000 / annum",
    type: "Job",
    postedDate: "3 days ago",
    openings: 2,
    description: "Architect high-throughput data pipelines, telemetry aggregators, and defensive API endpoints.",
    requiredSkills: [
      { name: "Python", weight: 0.4, minScore: 80 },
      { name: "SQL", weight: 0.35, minScore: 75 },
      { name: "Data Analytics", weight: 0.25, minScore: 70 }
    ]
  },
  {
    id: "opp-3",
    title: "Frontend UI/UX Engineer",
    company: "Nexus Design Systems",
    location: "Pune, India (Hybrid)",
    stipend: "₹30,000 - ₹40,000 / month",
    type: "Internship",
    postedDate: "1 day ago",
    openings: 4,
    description: "Implement accessible, high-performance web applications using React and Tailwind CSS.",
    requiredSkills: [
      { name: "Frontend (React)", weight: 0.4, minScore: 80 },
      { name: "JavaScript", weight: 0.35, minScore: 80 },
      { name: "HTML & CSS", weight: 0.25, minScore: 75 }
    ]
  },
  {
    id: "opp-4",
    title: "Core Java Systems Developer",
    company: "FinTech Quantum Labs",
    location: "Hyderabad, India (Hybrid)",
    stipend: "₹16,00,000 / annum",
    type: "Job",
    postedDate: "5 days ago",
    openings: 2,
    description: "Develop low-latency transactional microservices and resilient message queuing workers.",
    requiredSkills: [
      { name: "Java", weight: 0.5, minScore: 80 },
      { name: "SQL", weight: 0.5, minScore: 75 }
    ]
  },
  {
    id: "opp-5",
    title: "Founding Backend Engineer",
    company: "Krypton Health (YC S25)",
    location: "Bangalore, India (Hybrid)",
    stipend: "₹18,00,000 / annum + 0.5% Equity",
    type: "Startup",
    postedDate: "Just now",
    openings: 2,
    description: "Build HIPAA-compliant health data pipelines under rapid release cycles with high autonomy.",
    requiredSkills: [
      { name: "Python", weight: 0.4, minScore: 85 },
      { name: "SQL", weight: 0.35, minScore: 80 },
      { name: "Backend (Node.js)", weight: 0.25, minScore: 75 }
    ]
  },
  {
    id: "opp-6",
    title: "Python Automation Specialist",
    company: "MarketPulse Labs",
    location: "Remote",
    stipend: "₹25,000 / month (20 hrs/wk)",
    type: "Part-time",
    postedDate: "1 day ago",
    openings: 3,
    description: "Flexible part-time student role: construct resilient scrapers and data validation scripts.",
    requiredSkills: [
      { name: "Python", weight: 0.5, minScore: 75 },
      { name: "Data Analytics", weight: 0.3, minScore: 70 },
      { name: "SQL", weight: 0.2, minScore: 70 }
    ]
  },
  {
    id: "opp-7",
    title: "Open Source Graph Query Optimization",
    company: "SkillProof Foundation",
    location: "Remote (Global Bounty)",
    stipend: "₹75,000 Fixed Milestone Bounty",
    type: "Project",
    postedDate: "Just now",
    openings: 2,
    description: "Paid open-source bounty to optimize graph database traversal and resolve memory leaks.",
    requiredSkills: [
      { name: "C++", weight: 0.4, minScore: 80 },
      { name: "Python", weight: 0.35, minScore: 80 },
      { name: "SQL", weight: 0.25, minScore: 75 }
    ]
  }
];

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
        applications: []
      };
      this.writeSync(initialData);
    }
  }

  read() {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading db.json, returning empty structure:', err);
      return { users: [], testAttempts: [], opportunities: defaultOpportunities, applications: [] };
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
    
    // Recalculate Career Readiness
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
    return this.read().opportunities;
  }

  getApplicationsByUser(userId) {
    return this.read().applications.filter((a) => a.userId === userId);
  }

  createApplication(app) {
    const data = this.read();
    const newApp = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...app,
      createdAt: new Date().toISOString()
    };
    data.applications.unshift(newApp);
    this.writeSync(data);
    return newApp;
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
