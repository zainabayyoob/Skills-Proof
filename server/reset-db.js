import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialOpportunities } from '../src/data/opportunitiesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'db.json');

const cleanData = {
  users: [
    {
      id: 'SP-ADM-ROOT01',
      studentId: 'SP-ADM-ROOT01',
      name: 'SkillProof Administrator',
      email: 'admin@skillproof.org',
      role: 'admin',
      countryCode: '+91',
      phone: '9999999999',
      phoneVerified: true,
      emailVerified: true,
      passwordHash: '$2b$10$83lCcDJEVf7d8EsCAurdAeVvaWYPeW2lkKYNpKn0ZhmbJhddilW8u',
      college: 'SkillProof Headquarters',
      degree: 'System Administration',
      graduationYear: 2026,
      academicYear: 'Staff',
      semester: 'All',
      gender: 'Prefer not to say',
      targetRole: 'Platform Host / Administrator',
      careerReadiness: 100,
      verifiedSkills: [],
      skills: [],
      projects: [],
      certifications: [],
      experience: [],
      achievements: [],
      roadmapProgress: {},
      isDeactivated: false,
      createdAt: '2026-09-19T00:00:00.000Z'
    }
  ],
  testAttempts: [],
  opportunities: initialOpportunities,
  applications: [],
  companyProfiles: [],
  shortlistedCandidates: [],
  studentGroups: [],
  assignedAssessments: [],
  facultyData: null
};

fs.writeFileSync(dbPath, JSON.stringify(cleanData, null, 2), 'utf-8');
console.log('Reset db.json successfully. Users count:', cleanData.users.length);
