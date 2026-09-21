import { comprehensiveCareerRoles } from './careerRolesData.js';

// Target Career Tracks & Required Skills Battery (Canonical Directory)
export const roleTracks = comprehensiveCareerRoles;

// Real Famous Coders Courses & YouTube Links Mapped to Every Skill
export const famousMentorsCourses = {
  python: [
    {
      channel: "Corey Schafer",
      title: "Python Programming Tutorials & OOP Masterclass",
      platform: "YouTube",
      url: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU",
      duration: "Comprehensive Playlist",
      level: "Beginner to Advanced",
      tag: "Best for OOP & Backend Python",
      thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "Chai aur Code (Hitesh Choudhary)",
      title: "Python Full Course with Projects (Hindi)",
      platform: "YouTube",
      url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBsMugTFALhdLlZ5OQcG7Wc",
      duration: "Complete Course",
      level: "Beginner to Pro",
      tag: "Top Rated in Hindi",
      thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "CS50 (Prof. David J. Malan)",
      title: "CS50P: Harvard Introduction to Programming with Python",
      platform: "Harvard / YouTube",
      url: "https://www.youtube.com/watch?v=nLRL_NcnK-4",
      duration: "16 Hours",
      level: "Academic Excellence",
      tag: "Harvard University",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80"
    }
  ],
  sql: [
    {
      channel: "Alex The Analyst",
      title: "SQL Beginner to Advanced Full Course (Portfolio Ready)",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
      duration: "4 Hours",
      level: "Beginner to Advanced",
      tag: "Industry Portfolio Favorite",
      thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "Luke Barousse",
      title: "SQL for Data Analytics Crash Course",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=rGXvK_3P6aQ",
      duration: "3 Hours",
      level: "Intermediate",
      tag: "Analytics & Window Functions",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "freeCodeCamp.org",
      title: "Relational Database Design & Full SQL Course",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
      duration: "4 Hours",
      level: "Beginner",
      tag: "Free Certification",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80"
    }
  ],
  c: [
    {
      channel: "CS50 by Prof. David J. Malan",
      title: "Harvard CS50: C Language, Pointers & Memory Management",
      platform: "Harvard / YouTube",
      url: "https://www.youtube.com/watch?v=8mAITcNt710",
      duration: "Full Lecture Series",
      level: "Foundations to Deep Dive",
      tag: "World #1 CS Course",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "Abdul Bari",
      title: "Data Structures & Pointer Allocation in C",
      platform: "YouTube",
      url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O",
      duration: "Algorithm Series",
      level: "Intermediate",
      tag: "Legendary Algorithm Teacher",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "CodeWithHarry",
      title: "C Language Full Course for Beginners (One Video)",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=ZSPZob_1TOk",
      duration: "10.5 Hours",
      level: "Beginner",
      tag: "Comprehensive Hindi Tutorial",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80"
    }
  ],
  cpp: [
    {
      channel: "Take U Forward (Striver)",
      title: "Striver's A2Z DSA Course in C++ (Sheet & Video Explanations)",
      platform: "takeuforward.org",
      url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
      duration: "Self-Paced Roadmap",
      level: "Beginner to FAANG Level",
      tag: "Top SDE Interview Prep",
      thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "The Cherno",
      title: "C++ Master Series: Memory, STL, Pointers & Modern C++",
      platform: "YouTube",
      url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4G4b",
      duration: "100+ Videos",
      level: "Intermediate to Senior",
      tag: "Industry Systems Expert",
      thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "CodeWithHarry",
      title: "C++ Full Course for Beginners with STL",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=yGB9jhsEsr8",
      duration: "12 Hours",
      level: "Beginner",
      tag: "Complete Hindi Guide",
      thumbnail: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=300&auto=format&fit=crop&q=80"
    }
  ],
  java: [
    {
      channel: "Telusko (Navin Reddy)",
      title: "Java Full Course for Beginners (Core to Advanced)",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=BGTx91t8q50",
      duration: "12 Hours",
      level: "Beginner to Intermediate",
      tag: "Most Popular Java Educator",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "Kunal Kushwaha",
      title: "Java + DSA + Interview Bootcamp (Zero to Hero)",
      platform: "YouTube",
      url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7mUQTWyXL3ZzvDT",
      duration: "Complete Bootcamp",
      level: "Beginner to Advanced",
      tag: "Open Source Advocate",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "freeCodeCamp.org",
      title: "Java Programming Full Course for Beginners",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=A74TOX803D0",
      duration: "9.5 Hours",
      level: "Beginner",
      tag: "Zero-Cost Certification",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80"
    }
  ],
  javascript: [
    {
      channel: "Chai aur Code (Hitesh Choudhary)",
      title: "JavaScript Full Course with Projects & Deep Dive",
      platform: "YouTube",
      url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37",
      duration: "Complete Series",
      level: "Beginner to Advanced",
      tag: "Top Rated JS Series",
      thumbnail: "https://images.unsplash.com/photo-1579468118864-ddab32a514d7?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "Akshay Saini",
      title: "Namaste JavaScript: Execution Context, Closures & Event Loop",
      platform: "YouTube",
      url: "https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP",
      duration: "Season 1 & 2",
      level: "Intermediate to Advanced",
      tag: "Best for Core JS Internals",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "Traversy Media",
      title: "Modern JavaScript from the Beginning",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=BI1o2nd8_DU",
      duration: "Crash Course",
      level: "Beginner",
      tag: "Hands-on Practical JS",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&auto=format&fit=crop&q=80"
    }
  ],
  htmlcss: [
    {
      channel: "Kevin Powell",
      title: "CSS Masterclass: Flexbox, Grid & Responsive Layouts",
      platform: "YouTube",
      url: "https://www.youtube.com/kepowob",
      duration: "Ongoing Series",
      level: "All Levels",
      tag: "World's Leading CSS Guru",
      thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "SuperSimpleDev",
      title: "HTML & CSS Full Course - Beginner to Pro [6 Hours]",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=G3e-cpL7ofc",
      duration: "6.5 Hours",
      level: "Beginner",
      tag: "Best Interactive Visuals",
      thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "freeCodeCamp.org",
      title: "Responsive Web Design Certification Curriculum",
      platform: "freeCodeCamp",
      url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
      duration: "300 Hours",
      level: "Beginner",
      tag: "Official Certification",
      thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=300&auto=format&fit=crop&q=80"
    }
  ],
  frontend: [
    {
      channel: "Chai aur Code (Hitesh Choudhary)",
      title: "React JS Full Course with Redux Toolkit & Hooks",
      platform: "YouTube",
      url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige",
      duration: "Full Series",
      level: "Beginner to Pro",
      tag: "Industry Standard React",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "Maximilian Schwarzmüller (Academind)",
      title: "React - The Complete Guide (with Hooks & Next.js)",
      platform: "YouTube / Udemy",
      url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
      duration: "40+ Hours",
      level: "All Levels",
      tag: "Global Bestseller",
      thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=300&auto=format&fit=crop&q=80"
    }
  ],
  backend: [
    {
      channel: "Hussein Nasser",
      title: "Backend Engineering Principles & Resilient Architecture",
      platform: "YouTube",
      url: "https://www.youtube.com/c/HusseinNasser-software-engineering",
      duration: "Deep Dive Series",
      level: "Intermediate to Senior",
      tag: "Protocols, Proxies & DBs",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "freeCodeCamp.org",
      title: "Node.js and Express.js - Full Course for Beginners",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
      duration: "8 Hours",
      level: "Beginner to Intermediate",
      tag: "REST APIs & Middleware",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80"
    }
  ],
  dataanalytics: [
    {
      channel: "Alex The Analyst",
      title: "Data Analyst Full Portfolio Project & Guided Learning Path",
      platform: "YouTube",
      url: "https://www.youtube.com/playlist?list=PLUaB-1hjhk8GZ4m4U0A7J_2KkG5A5r7q_",
      duration: "Complete Series",
      level: "Beginner to Job-Ready",
      tag: "Portfolio Projects & Resume",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "Luke Barousse",
      title: "Data Analytics Career Roadmap & Hands-On Projects",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=x7KchZ6Gvqo",
      duration: "Crash Course",
      level: "Career Switchers",
      tag: "Practical Industry Advice",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80"
    },
    {
      channel: "freeCodeCamp.org",
      title: "Data Analysis with Python Full Course (Pandas, NumPy)",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=r-uOLxNrNk8",
      duration: "4.5 Hours",
      level: "Beginner to Intermediate",
      tag: "Certification & Code",
      thumbnail: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300&auto=format&fit=crop&q=80"
    }
  ]
};

export const unverifiedStudentData = {
  id: "STU-2026-NEW",
  name: "New Candidate",
  email: "candidate@university.edu",
  phone: "+91 98765 43210",
  college: "National Institute of Technology",
  degree: "B.Tech Computer Science & Engineering",
  graduationYear: 2026,
  semester: "6th Semester (3rd Year)",
  bio: "Passionate engineer eager to prove technical capability through hands-on practical assessments.",
  github: "https://github.com/candidate",
  linkedin: "https://linkedin.com/in/candidate",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  careerReadiness: 0,
  passportHash: null,
  isProfileCreated: false,
  targetRole: "Full Stack Web Developer",
  verifiedSkills: [],
  applications: [],
  
  skillGaps: [
    { skill: "HTML / CSS", currentScore: 0, requiredScore: 75, gap: 75, status: "Critical Gap", action: "Prove HTML / CSS", skillId: "htmlcss" },
    { skill: "JavaScript", currentScore: 0, requiredScore: 80, gap: 80, status: "Critical Gap", action: "Prove JavaScript", skillId: "javascript" },
    { skill: "Frontend", currentScore: 0, requiredScore: 78, gap: 78, status: "Critical Gap", action: "Prove Frontend", skillId: "frontend" },
    { skill: "Backend", currentScore: 0, requiredScore: 80, gap: 80, status: "Critical Gap", action: "Prove Backend", skillId: "backend" },
    { skill: "SQL", currentScore: 0, requiredScore: 75, gap: 75, status: "Critical Gap", action: "Prove SQL", skillId: "sql" },
  ],

  projects: [],
  certifications: [],
  assessmentEvidence: {
    problemSolving: "Pending",
    debugging: "Pending",
    adaptability: "Pending"
  }
};

export const initialStudentData = {
  id: "STU-2026-001",
  name: "Aarav Sharma",
  email: "aarav.sharma@abctech.edu",
  phone: "+91 98765 43210",
  college: "ABC Institute of Technology",
  degree: "B.Tech Computer Science & Engineering",
  graduationYear: 2026,
  semester: "7th Semester (4th Year)",
  bio: "Full Stack and Systems enthusiast with 4 verified production badges in Python, SQL, JS, and Frontend architecture.",
  github: "https://github.com/aaravsharma",
  linkedin: "https://linkedin.com/in/aaravsharma",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  careerReadiness: 84,
  passportHash: "SKP-2026-AARAV-842F",
  isProfileCreated: true,
  targetRole: "Full Stack Web Developer",
  
  verifiedSkills: [
    { name: "Python", score: 88, level: "Advanced", verifiedAt: "2026-08-20", badge: "Gold", skillId: "python" },
    { name: "SQL", score: 84, level: "Proficient", verifiedAt: "2026-08-22", badge: "Silver", skillId: "sql" },
    { name: "JavaScript", score: 82, level: "Proficient", verifiedAt: "2026-08-25", badge: "Silver", skillId: "javascript" },
    { name: "Frontend", score: 80, level: "Proficient", verifiedAt: "2026-08-30", badge: "Silver", skillId: "frontend" },
  ],

  applications: [
    {
      id: "APP-SEED-1",
      oppId: "opp-1",
      title: "Full Stack Engineering Intern",
      company: "Apex Data Systems",
      appliedAt: "2026-09-01",
      status: "Shortlisted for Interview",
      stipend: "₹45,000 / month"
    }
  ],

  skillGaps: [
    { skill: "Backend", currentScore: 0, requiredScore: 80, gap: 80, status: "Critical Gap", action: "Prove Backend Skill", skillId: "backend" },
    { skill: "HTML / CSS", currentScore: 0, requiredScore: 75, gap: 75, status: "Critical Gap", action: "Prove HTML / CSS", skillId: "htmlcss" }
  ],

  projects: [
    { title: "Resilient E-Commerce Pipeline", tech: ["Python", "Pandas"], desc: "High-throughput sales aggregator handling missing data mutations." },
    { title: "Cohort Retention Visualizer", tech: ["React", "SQL"], desc: "Interactive telemetry dashboard with race condition abort controllers." },
  ],

  certifications: [
    { name: "SkillProof Python Certified Specialist", issuer: "SkillProof Protocol", date: "Aug 2026" },
    { name: "SQL Analytical Mastery", issuer: "SkillProof Protocol", date: "Aug 2026" },
  ],

  assessmentEvidence: {
    problemSolving: "Proficient (88%)",
    debugging: "92% Recovery",
    adaptability: "85% Dynamic"
  }
};

export const roadmapsData = [
  {
    id: "roadmap-1",
    skill: "SQL",
    skillId: "sql",
    levelTransition: "Beginner → Intermediate",
    duration: "7 days",
    status: "In Progress",
    progress: 40,
    modules: [
      { step: "Learn", title: "Window Functions & PARTITION BY (Alex The Analyst)", completed: true, resource: "Alex The Analyst SQL Bootcamp Video" },
      { step: "Practice", title: "Defensive NULLIF & Zero-Division Queries", completed: false, resource: "SkillProof Practice Sandbox" },
      { step: "Reassess", title: "SkillProof SQL Mutation Assessment", completed: false, resource: "15-min Break-Adapt Test" },
    ]
  },
  {
    id: "roadmap-2",
    skill: "JavaScript",
    skillId: "javascript",
    levelTransition: "Intermediate → Advanced",
    duration: "10 days",
    status: "Recommended",
    progress: 20,
    modules: [
      { step: "Learn", title: "Event Loop, Closures & Promises (Chai aur Code)", completed: true, resource: "Chai aur Code JS Series" },
      { step: "Practice", title: "Async Batch Processor with Race Condition Guards", completed: false, resource: "Hands-on Code Challenge" },
      { step: "Reassess", title: "Prove JavaScript Skill", completed: false, resource: "Rate Limiter Mutation Test" },
    ]
  },
  {
    id: "roadmap-3",
    skill: "C++",
    skillId: "cpp",
    levelTransition: "Intermediate → Advanced",
    duration: "14 days",
    status: "Upcoming",
    progress: 0,
    modules: [
      { step: "Learn", title: "Striver's A2Z DSA Sheet (Take U Forward)", completed: false, resource: "takeuforward.org A2Z Sheet" },
      { step: "Practice", title: "STL Vector Normalization & Outlier Defense", completed: false, resource: "5 Algorithmic Challenges" },
      { step: "Reassess", title: "Prove C++ Systems Capability", completed: false, resource: "Constraint Mutation Sandbox" },
    ]
  }
];

export const skillGraphData = {
  studentSkills: [
    { name: "Python", verified: true, score: 88 },
    { name: "SQL", verified: true, score: 84 },
    { name: "JavaScript", verified: true, score: 82 },
    { name: "Frontend", verified: true, score: 80 },
    { name: "Backend", verified: false, score: 0, status: "missing" },
    { name: "HTML / CSS", verified: false, score: 0, status: "missing" },
  ],
  targetRole: "Full Stack Web Developer",
  requiredSkills: ["HTML / CSS", "JavaScript", "Frontend", "Backend", "SQL"],
  missingSkills: ["Backend", "HTML / CSS"],
  learningActions: [
    "Complete Express Backend Architecture (freeCodeCamp)",
    "Master Responsive Card Grid Layouts (Kevin Powell)"
  ],
  matchedOpportunities: [
    { title: "Full Stack Engineering Intern", company: "Apex Data Systems", match: 92 }
  ]
};
