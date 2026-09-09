// Centralized API Client for SkillProof Full-Stack Architecture

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('skillproof_jwt_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data?.error || `Request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // Auth API
  auth: {
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },

    login: async (credentials) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return handleResponse(res);
    },

    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    loadDemoPreset: async () => {
      const res = await fetch(`${API_BASE}/auth/demo-preset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return handleResponse(res);
    },
  },

  // Dynamic Assessment Tests API
  tests: {
    startTest: async (skillId) => {
      const res = await fetch(`${API_BASE}/tests/start`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ skillId }),
      });
      return handleResponse(res);
    },

    submitTest: async (attemptId, answers) => {
      const res = await fetch(`${API_BASE}/tests/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ attemptId, answers }),
      });
      return handleResponse(res);
    },

    verifyCode: async (codeSubmission) => {
      const res = await fetch(`${API_BASE}/tests/verify-code`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(codeSubmission),
      });
      return handleResponse(res);
    },

    getHistory: async () => {
      const res = await fetch(`${API_BASE}/tests/history`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    checkEligibility: async (skillId) => {
      const res = await fetch(`${API_BASE}/tests/eligibility/${skillId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Real Compiler API
  compiler: {
    run: async (payload) => {
      const res = await fetch(`${API_BASE}/compiler/run`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    submit: async (payload) => {
      const res = await fetch(`${API_BASE}/compiler/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
  },

  // Profile API
  profile: {
    get: async () => {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    update: async (profileData) => {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(res);
    },
  },

  // Opportunities & Applications API
  opportunities: {
    list: async () => {
      const res = await fetch(`${API_BASE}/opportunities`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    apply: async (opportunityId, candidateNote = '') => {
      const res = await fetch(`${API_BASE}/opportunities/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ opportunityId, candidateNote }),
      });
      return handleResponse(res);
    },

    getApplications: async () => {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Full-Featured Application Tracker API
  applications: {
    list: async () => {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    create: async (appData) => {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(appData),
      });
      return handleResponse(res);
    },

    update: async (id, updates) => {
      const res = await fetch(`${API_BASE}/applications/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE}/applications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Industry Recruiter API
  industry: {
    getProfile: async () => {
      const res = await fetch(`${API_BASE}/industry/profile`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    updateProfile: async (profileData) => {
      const res = await fetch(`${API_BASE}/industry/profile`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(res);
    },

    getOpportunities: async () => {
      const res = await fetch(`${API_BASE}/industry/opportunities`);
      return handleResponse(res);
    },

    postOpportunity: async (oppData) => {
      const res = await fetch(`${API_BASE}/industry/opportunities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(oppData),
      });
      return handleResponse(res);
    },

    getCandidates: async (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/industry/candidates?${params}`);
      return handleResponse(res);
    },

    shortlistCandidate: async (studentId, studentName, roleTitle) => {
      const res = await fetch(`${API_BASE}/industry/shortlist`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ studentId, studentName, roleTitle }),
      });
      return handleResponse(res);
    },

    getApplications: async () => {
      const res = await fetch(`${API_BASE}/industry/applications`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    updateApplicationStatus: async (id, status, note = '') => {
      const res = await fetch(`${API_BASE}/industry/applications/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, note }),
      });
      return handleResponse(res);
    },
  },

  // College & Academia API
  college: {
    getAnalytics: async () => {
      const res = await fetch(`${API_BASE}/college/analytics`);
      return handleResponse(res);
    },

    getGroups: async () => {
      const res = await fetch(`${API_BASE}/college/groups`);
      return handleResponse(res);
    },

    createGroup: async (groupData) => {
      const res = await fetch(`${API_BASE}/college/groups`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(groupData),
      });
      return handleResponse(res);
    },

    assignAssessment: async (assignmentData) => {
      const res = await fetch(`${API_BASE}/college/assign`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(assignmentData),
      });
      return handleResponse(res);
    },

    getFaculty: async () => {
      const res = await fetch(`${API_BASE}/college/faculty`);
      return handleResponse(res);
    },

    addFacultyActivity: async (activityData) => {
      const res = await fetch(`${API_BASE}/college/faculty/activity`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(activityData),
      });
      return handleResponse(res);
    },
  },
};
