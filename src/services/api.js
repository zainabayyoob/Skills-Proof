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

    verifyEmail: async (payload) => {
      const res = await fetch(`${API_BASE}/auth/verify-email`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    resendEmailVerification: async (payload = {}) => {
      const res = await fetch(`${API_BASE}/auth/resend-email-verification`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    sendPhoneOtp: async (payload = {}) => {
      const res = await fetch(`${API_BASE}/auth/send-phone-otp`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    verifyPhone: async (payload) => {
      const res = await fetch(`${API_BASE}/auth/verify-phone`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    forgotPassword: async (email) => {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return handleResponse(res);
    },

    resetPassword: async (payload) => {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    changePassword: async (payload) => {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    getOAuthUrl: async (provider, params = {}) => {
      const searchParams = new URLSearchParams(params);
      const query = searchParams.toString();
      const res = await fetch(`${API_BASE}/auth/oauth/${provider}${query ? `?${query}` : ''}`);
      return handleResponse(res);
    },

    isAuthenticated: () => {
      return Boolean(localStorage.getItem('skillproof_jwt_token'));
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

    uploadPhoto: async (payload) => {
      const res = await fetch(`${API_BASE}/profile/photo`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    uploadResume: async (payload) => {
      const res = await fetch(`${API_BASE}/profile/resume`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    deleteResume: async () => {
      const res = await fetch(`${API_BASE}/profile/resume`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    downloadResumeBlob: async () => {
      const res = await fetch(`${API_BASE}/profile/resume/download`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to download resume');
      }
      return res.blob();
    },

    getPortfolio: async () => {
      const res = await fetch(`${API_BASE}/profile/portfolio`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    updatePortfolio: async (portfolioData) => {
      const res = await fetch(`${API_BASE}/profile/portfolio`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(portfolioData),
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

    downloadCandidateResumeBlob: async (candidateId) => {
      const res = await fetch(`${API_BASE}/industry/candidates/${candidateId}/resume`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to download candidate resume');
      }
      return res.blob();
    },

    getCandidateById: async (candidateId) => {
      const res = await fetch(`${API_BASE}/industry/candidates/${candidateId}`, {
        headers: getAuthHeaders(),
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

    getStudents: async (filters = {}) => {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/college/students?${params}`);
      return handleResponse(res);
    },

    getStudentById: async (studentId) => {
      const res = await fetch(`${API_BASE}/college/students/${studentId}`);
      return handleResponse(res);
    },

    downloadStudentResumeBlob: async (studentId) => {
      const res = await fetch(`${API_BASE}/college/students/${studentId}/resume`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to download student resume');
      }
      return res.blob();
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

    getAssignments: async () => {
      const res = await fetch(`${API_BASE}/college/assignments`);
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

  // Host / Admin API
  admin: {
    getStats: async () => {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getUsers: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.role) query.append('role', params.role);
      if (params.status) query.append('status', params.status);
      const qStr = query.toString();
      const res = await fetch(`${API_BASE}/admin/users${qStr ? '?' + qStr : ''}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    getUserById: async (userId) => {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    deactivateUser: async (userId) => {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/deactivate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    reactivateUser: async (userId) => {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/reactivate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },

    deleteUser: async (userId) => {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};

api.faculty = api.college;
