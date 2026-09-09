import { initialStudentData, unverifiedStudentData, roadmapsData, roleTracks } from '../data/mockData';
import { initialOpportunities, initialApplications } from '../data/opportunitiesData';
import { skillsCatalogue } from '../data/assessmentsData';
import { collegeStats } from '../data/collegeData';

const STORAGE_KEYS = {
  STUDENT: 'skillproof_student_data_v4',
  APPLICATIONS: 'skillproof_applications_v4',
  OPPORTUNITIES: 'skillproof_opportunities_v4',
  ROADMAPS: 'skillproof_roadmaps_v4',
  ACTIVE_ROLE: 'skillproof_active_role_v4',
};

export const storageService = {
  // Helper: Calculate skill gaps based on chosen career track
  calculateSkillGapsForRole: (targetRoleTitle, verifiedSkills = []) => {
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
  },

  // Student Profile
  getStudentData: () => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT);
    if (!data) {
      const initial = {
        ...unverifiedStudentData,
        skillGaps: storageService.calculateSkillGapsForRole(unverifiedStudentData.targetRole, [])
      };
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  createStudentProfile: (profile) => {
    return storageService.updateStudentProfile(profile);
  },

  updateStudentProfile: (profile) => {
    const current = storageService.getStudentData();
    const targetRole = profile.targetRole || current.targetRole || "Full Stack Web Developer";
    const verifiedSkills = current.verifiedSkills || [];
    const skillGaps = storageService.calculateSkillGapsForRole(targetRole, verifiedSkills);

    // Update role match scores
    const recommendedRoles = roleTracks.map((track) => {
      let matchedCount = 0;
      let totalReq = track.requiredSkills.length;
      track.requiredSkills.forEach((req) => {
        const found = verifiedSkills.find(
          (v) => v.name.toLowerCase() === req.name.toLowerCase() || v.skillId === req.id
        );
        if (found && found.score >= req.minScore) {
          matchedCount++;
        }
      });
      const matchPct = Math.min(98, Math.round((matchedCount / totalReq) * 85 + (current.careerReadiness * 0.15)));
      return {
        role: track.title,
        match: matchPct,
        demand: track.demand,
        topMissing: track.requiredSkills
          .filter((req) => !verifiedSkills.some((v) => v.name.toLowerCase() === req.name.toLowerCase() && v.score >= req.minScore))
          .map((req) => req.name)
      };
    });

    const updated = {
      ...current,
      name: profile.name !== undefined ? profile.name : (current.name || "Candidate"),
      email: profile.email !== undefined ? profile.email : (current.email || "candidate@university.edu"),
      phone: profile.phone !== undefined ? profile.phone : (current.phone || "+91 98765 43210"),
      college: profile.college !== undefined ? profile.college : (current.college || "Institute of Technology"),
      degree: profile.degree !== undefined ? profile.degree : (current.degree || "Computer Science & Engineering"),
      graduationYear: profile.graduationYear !== undefined ? profile.graduationYear : (current.graduationYear || 2026),
      semester: profile.semester !== undefined ? profile.semester : (current.semester || "6th Semester (3rd Year)"),
      bio: profile.bio !== undefined ? profile.bio : (current.bio || ""),
      github: profile.github !== undefined ? profile.github : (current.github || ""),
      linkedin: profile.linkedin !== undefined ? profile.linkedin : (current.linkedin || ""),
      targetRole,
      isProfileCreated: true,
      careerReadiness: verifiedSkills.length > 0 ? current.careerReadiness : 0,
      verifiedSkills,
      skillGaps,
      recommendedRoles
    };
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(updated));
    return updated;
  },

  saveStudentData: (updated) => {
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(updated));
    return updated;
  },

  // Active Role ('STUDENT' | 'INDUSTRY' | 'COLLEGE')
  getActiveRole: () => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) || 'STUDENT';
  },

  setActiveRole: (role) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
    return role;
  },

  // Applications
  getApplications: () => {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(initialApplications));
      return initialApplications;
    }
    return JSON.parse(data);
  },

  applyToOpportunity: (opportunity, student, candidateNote = '') => {
    const apps = storageService.getApplications();
    const existing = apps.find((a) => a.opportunityId === opportunity.id);
    if (existing) return existing;

    const matching = [];
    const missing = [];

    (opportunity.requiredSkills || []).forEach((req) => {
      const found = (student.verifiedSkills || []).find(
        (s) => s.name.toLowerCase() === req.name.toLowerCase()
      );
      if (found && found.score >= req.minScore) {
        matching.push(`${req.name} (${found.score}%)`);
      } else if (found) {
        missing.push(`${req.name} (Has ${found.score}%, need ${req.minScore}%)`);
      } else {
        missing.push(`${req.name} (Unverified)`);
      }
    });

    const newApp = {
      id: `app-${Date.now()}`,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      company: opportunity.company,
      location: opportunity.location,
      stipend: opportunity.stipend,
      matchScore: opportunity.matchScore || Math.max(65, student.careerReadiness),
      status: "Applied",
      appliedDate: new Date().toISOString().split('T')[0],
      matchingSkills: matching,
      missingSkills: missing,
      notes: candidateNote ? candidateNote.trim() : `Applied with verified SkillProof Passport (Readiness: ${student.careerReadiness}%)`
    };

    apps.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

    // Also update student's internal applications list
    const updatedStudent = {
      ...student,
      applications: [newApp, ...(student.applications || [])]
    };
    storageService.saveStudentData(updatedStudent);

    return newApp;
  },

  updateApplicationStatus: (appId, newStatus, note = '') => {
    const apps = storageService.getApplications();
    const updated = apps.map((a) => {
      if (a.id === appId) {
        const history = a.statusHistory || [
          { status: a.status, timestamp: a.appliedDate || new Date().toISOString(), note: 'Initial application' }
        ];
        if (newStatus !== a.status) {
          history.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note || `Status changed to ${newStatus}`
          });
        }
        return { ...a, status: newStatus, statusHistory: history };
      }
      return a;
    });
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    return updated;
  },

  addCustomApplication: (appData) => {
    const apps = storageService.getApplications();
    const newApp = {
      id: `app-custom-${Date.now()}`,
      opportunityTitle: appData.role || appData.opportunityTitle || 'Software Engineer',
      company: appData.company || 'Unknown',
      location: appData.location || 'Remote / Hybrid',
      stipend: appData.stipend || 'Competitive',
      opportunityType: appData.opportunityType || 'Internship',
      matchScore: appData.matchScore || 85,
      status: appData.status || 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      applicationUrl: appData.applicationUrl || '',
      notes: appData.notes || '',
      followUpDate: appData.followUpDate || null,
      interviewDate: appData.interviewDate || null,
      isExternal: Boolean(appData.applicationUrl || appData.isExternal),
      statusHistory: [
        { status: appData.status || 'Applied', timestamp: new Date().toISOString(), note: 'Application added to tracker' }
      ]
    };
    apps.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    return newApp;
  },

  updateApplication: (appId, updates) => {
    const apps = storageService.getApplications();
    const updated = apps.map((a) => {
      if (a.id === appId) {
        const history = a.statusHistory || [
          { status: a.status, timestamp: a.appliedDate || new Date().toISOString(), note: 'Initial application' }
        ];
        if (updates.status && updates.status !== a.status) {
          history.push({
            status: updates.status,
            timestamp: new Date().toISOString(),
            note: updates.statusChangeNote || `Status changed to ${updates.status}`
          });
        }
        return {
          ...a,
          ...updates,
          statusHistory: history
        };
      }
      return a;
    });
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    return updated;
  },

  deleteApplication: (appId) => {
    const apps = storageService.getApplications();
    const filtered = apps.filter((a) => a.id !== appId);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(filtered));
    return filtered;
  },

  // Opportunities
  getOpportunities: () => {
    const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(initialOpportunities));
      return initialOpportunities;
    }
    return JSON.parse(data);
  },

  addOpportunity: (newOpp) => {
    const list = storageService.getOpportunities();
    const created = {
      ...newOpp,
      id: `opp-${Date.now()}`,
      openings: Number(newOpp.openings || 1),
    };
    list.unshift(created);
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(list));
    return created;
  },

  // Roadmaps
  getRoadmaps: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ROADMAPS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmapsData));
      return roadmapsData;
    }
    return JSON.parse(data);
  },

  toggleRoadmapModule: (roadmapId, moduleIndex) => {
    const roadmaps = storageService.getRoadmaps();
    const updated = roadmaps.map((r) => {
      if (r.id === roadmapId) {
        const modules = [...r.modules];
        modules[moduleIndex] = { ...modules[moduleIndex], completed: !modules[moduleIndex].completed };
        const completedCount = modules.filter((m) => m.completed).length;
        const progress = Math.round((completedCount / modules.length) * 100);
        return { ...r, modules, progress };
      }
      return r;
    });
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(updated));
    return updated;
  },

  // Record Assessment Submission & Update Scores across all 10 languages
  recordAssessmentResult: (skillName, modeId, scoreResult) => {
    const student = storageService.getStudentData();
    const skillNameNormalized = skillName.trim();
    const catalogItem = skillsCatalogue.find(
      (s) => s.name.toLowerCase() === skillNameNormalized.toLowerCase() || s.id.toLowerCase() === skillNameNormalized.toLowerCase()
    );

    const skillId = catalogItem ? catalogItem.id : skillNameNormalized.toLowerCase().replace(/[^a-z0-9]/g, '');
    const canonicalName = catalogItem ? catalogItem.name : skillNameNormalized;

    // Update verified skill in student profile
    const verifiedList = [...(student.verifiedSkills || [])];
    const existingIndex = verifiedList.findIndex(
      (s) => s.name.toLowerCase() === canonicalName.toLowerCase() || (s.skillId && s.skillId.toLowerCase() === skillId)
    );

    const newSkillRecord = {
      name: canonicalName,
      skillId,
      score: scoreResult.overallScore,
      level: scoreResult.overallScore >= 85 ? "Advanced" : scoreResult.overallScore >= 70 ? "Proficient" : "Intermediate",
      verifiedAt: new Date().toISOString().split('T')[0],
      badge: scoreResult.overallScore >= 85 ? "Gold" : scoreResult.overallScore >= 75 ? "Silver" : "Bronze"
    };

    if (existingIndex >= 0) {
      verifiedList[existingIndex] = newSkillRecord;
    } else {
      verifiedList.push(newSkillRecord);
    }
    student.verifiedSkills = verifiedList;

    // Recalculate Career Readiness Score across all verified skills
    const totalScore = verifiedList.reduce((sum, s) => sum + s.score, 0);
    student.careerReadiness = Math.round(totalScore / verifiedList.length);

    // Update multi-vector telemetry evidence
    student.assessmentEvidence = {
      buildCompleted: true,
      breakCompleted: true,
      adaptCompleted: true,
      problemSolving: scoreResult.problemSolving || 88,
      debugging: scoreResult.debugging || 85,
      adaptability: scoreResult.adaptability || 91,
      technicalApplication: scoreResult.technicalApplication || 90,
      assessmentEvidenceScore: scoreResult.assessmentEvidenceScore || 94,
      timePerformance: 88,
    };

    // Update passport hash
    student.passportHash = `SKP-2026-${skillId.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;

    // Dynamically recalculate skill gaps for candidate's chosen role
    student.skillGaps = storageService.calculateSkillGapsForRole(student.targetRole, student.verifiedSkills);

    // Update role match scores
    student.recommendedRoles = roleTracks.map((track) => {
      let matchedCount = 0;
      let totalReq = track.requiredSkills.length;
      track.requiredSkills.forEach((req) => {
        const found = student.verifiedSkills.find(
          (v) => v.name.toLowerCase() === req.name.toLowerCase() || v.skillId === req.id
        );
        if (found && found.score >= req.minScore) {
          matchedCount++;
        }
      });
      const matchPct = Math.min(98, Math.round((matchedCount / totalReq) * 85 + (student.careerReadiness * 0.15)));
      return {
        role: track.title,
        match: matchPct,
        demand: track.demand,
        topMissing: track.requiredSkills
          .filter((req) => !student.verifiedSkills.some((v) => v.name.toLowerCase() === req.name.toLowerCase() && v.score >= req.minScore))
          .map((req) => req.name)
      };
    });

    student.projects = [
      ...(student.projects || []),
      {
        title: `Resilient ${canonicalName} Telemetry Engine`,
        tech: [canonicalName, "Production Sandbox"],
        desc: `Verified defensive implementation withstanding contaminated production mutations and zero-division.`
      }
    ];

    student.certifications = [
      ...(student.certifications || []).filter((c) => !c.name.includes(canonicalName)),
      {
        name: `SkillProof ${canonicalName} Verified Specialist`,
        issuer: "SkillProof Protocol 2026",
        date: "Sept 2026"
      }
    ];

    storageService.saveStudentData(student);
    return student;
  },

  // Load Aarav Sharma Demo Preset for presentation
  loadDemoPreset: () => {
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(initialStudentData));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(initialApplications));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(initialOpportunities));
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmapsData));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'STUDENT');
    return initialStudentData;
  },

  // Reset to fresh unverified student
  resetToNewStudent: () => {
    const initial = {
      ...unverifiedStudentData,
      skillGaps: storageService.calculateSkillGapsForRole(unverifiedStudentData.targetRole, [])
    };
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(initial));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(initialOpportunities));
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmapsData));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'STUDENT');
    return initial;
  },

  resetDemoData: () => {
    return storageService.resetToNewStudent();
  }
};
