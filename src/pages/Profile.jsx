import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  ExternalLink,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Sparkles,
  Mail,
  Phone,
  School,
  GraduationCap,
  Globe,
  Github,
  Linkedin,
  Compass,
  ArrowRight,
  Briefcase,
  Check,
  Save,
  X,
  FileText,
  Upload,
  Download,
  Trash2,
  Loader2,
  KeyRound,
  Camera,
  Search,
  Eye,
  Layers,
  Tag,
  MapPin,
  Plus,
  Target,
  FileCheck,
  AlertTriangle,
  FolderGit2
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { comprehensiveCareerRoles, getCareerRoleById, getCareerRoleByTitle } from '../data/careerRolesData';
import { standardDegrees, academicYears, genders, getSemestersForDegree } from '../data/degreesData';
import { countryCodes, defaultCountryCode, validatePhoneNumber } from '../data/countryCodesData';
import { collegesDirectory, searchColleges } from '../data/collegesData';
import { technologyDomains, defaultPrimaryDomain, getDomainByIdOrName, getSuggestedRolesForDomain, getSecondaryInterestsForDomain } from '../data/domainsData';
import { checkPasswordRequirements, validateStrongPassword } from '../utils/passwordPolicy';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Profile = ({ student, onResetData, onProfileUpdated }) => {
  const { isAuthenticated, setUser, user } = useAuth();

  // Active view mode: 'view' (read-only candidate card) vs 'edit' (form editor)
  const [activeTab, setActiveTab] = useState('view');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Photo upload state
  const photoInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Resume state
  const [resume, setResume] = useState(student?.resume || user?.resume || null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const fileInputRef = useRef(null);

  // Verification Dialog state
  const [verifyModalType, setVerifyModalType] = useState(null); // 'email' | 'phone' | null
  const [verifyCodeInput, setVerifyCodeInput] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');

  // Effective candidate object merging props & auth user
  const effectiveStudent = useMemo(() => {
    return {
      ...(user || {}),
      ...(student || {})
    };
  }, [student, user]);

  // Editable form state
  const [formData, setFormData] = useState({
    name: effectiveStudent?.name || '',
    email: effectiveStudent?.email || '',
    countryCode: effectiveStudent?.countryCode || defaultCountryCode.dialCode,
    phone: effectiveStudent?.phone || '',
    college: effectiveStudent?.college || '',
    collegeId: effectiveStudent?.collegeId || '',
    degree: effectiveStudent?.degree || standardDegrees[0].name,
    academicYear: effectiveStudent?.academicYear || '3rd Year',
    semester: effectiveStudent?.semester || '6th Semester',
    graduationYear: effectiveStudent?.graduationYear || 2026,
    gender: effectiveStudent?.gender || 'Prefer not to say',
    bio: effectiveStudent?.bio || '',
    professionalHeadline: effectiveStudent?.professionalHeadline || '',
    location: effectiveStudent?.location || 'India',
    github: effectiveStudent?.github || '',
    linkedin: effectiveStudent?.linkedin || '',
    primaryDomain: effectiveStudent?.primaryDomain || defaultPrimaryDomain,
    secondaryDomains: Array.isArray(effectiveStudent?.secondaryDomains) ? effectiveStudent.secondaryDomains : [],
    targetRole: effectiveStudent?.targetRole || comprehensiveCareerRoles[0].title,
    softSkills: Array.isArray(effectiveStudent?.softSkills) ? effectiveStudent.softSkills : ['Problem Solving', 'Team Collaboration', 'Technical Communication'],
    careerPreferences: effectiveStudent?.careerPreferences || { preferredType: 'Internship', workMode: 'Hybrid' },
    projects: Array.isArray(effectiveStudent?.projects) ? effectiveStudent.projects : [],
    certifications: Array.isArray(effectiveStudent?.certifications) ? effectiveStudent.certifications : [],
    experience: Array.isArray(effectiveStudent?.experience) ? effectiveStudent.experience : []
  });

  // Dynamic project draft state
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '', githubUrl: '', demoUrl: '' });
  const [showAddProject, setShowAddProject] = useState(false);

  // Dynamic certification draft state
  const [newCert, setNewCert] = useState({ name: '', issuer: '', issueYear: '2026', credentialUrl: '' });
  const [showAddCert, setShowAddCert] = useState(false);

  // Dynamic experience draft state
  const [newExp, setNewExp] = useState({ role: '', company: '', duration: '', description: '' });
  const [showAddExp, setShowAddExp] = useState(false);

  // College autocomplete state
  const [collegeQuery, setCollegeQuery] = useState(effectiveStudent?.college || '');
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const collegeRef = useRef(null);

  // Keep form data synchronized
  useEffect(() => {
    if (effectiveStudent) {
      setFormData({
        name: effectiveStudent.name || '',
        email: effectiveStudent.email || '',
        countryCode: effectiveStudent.countryCode || defaultCountryCode.dialCode,
        phone: effectiveStudent.phone || '',
        college: effectiveStudent.college || '',
        collegeId: effectiveStudent.collegeId || '',
        degree: effectiveStudent.degree || standardDegrees[0].name,
        academicYear: effectiveStudent.academicYear || '3rd Year',
        semester: effectiveStudent.semester || '6th Semester',
        graduationYear: effectiveStudent.graduationYear || 2026,
        gender: effectiveStudent.gender || 'Prefer not to say',
        bio: effectiveStudent.bio || '',
        professionalHeadline: effectiveStudent.professionalHeadline || '',
        location: effectiveStudent.location || 'India',
        github: effectiveStudent.github || '',
        linkedin: effectiveStudent.linkedin || '',
        primaryDomain: effectiveStudent.primaryDomain || defaultPrimaryDomain,
        secondaryDomains: Array.isArray(effectiveStudent.secondaryDomains) ? effectiveStudent.secondaryDomains : [],
        targetRole: effectiveStudent.targetRole || comprehensiveCareerRoles[0].title,
        softSkills: Array.isArray(effectiveStudent.softSkills) ? effectiveStudent.softSkills : ['Problem Solving', 'Team Collaboration', 'Technical Communication'],
        careerPreferences: effectiveStudent.careerPreferences || { preferredType: 'Internship', workMode: 'Hybrid' },
        projects: Array.isArray(effectiveStudent.projects) ? effectiveStudent.projects : [],
        certifications: Array.isArray(effectiveStudent.certifications) ? effectiveStudent.certifications : [],
        experience: Array.isArray(effectiveStudent.experience) ? effectiveStudent.experience : []
      });
      setCollegeQuery(effectiveStudent.college || '');
      setResume(effectiveStudent.resume || null);
    }
  }, [effectiveStudent]);

  // Handle outside click for college search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (collegeRef.current && !collegeRef.current.contains(e.target)) {
        setCollegeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch chronological assessment history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      if (isAuthenticated) {
        setLoadingHistory(true);
        try {
          const res = await api.tests.getHistory();
          if (res && res.history) {
            setTestHistory(res.history);
          }
        } catch (err) {
          console.warn('Could not fetch assessment history:', err);
        } finally {
          setLoadingHistory(false);
        }
      }
    };
    fetchHistory();
  }, [isAuthenticated]);

  // College selection handler
  const filteredColleges = searchColleges(collegeQuery);
  const handleSelectCollege = (col) => {
    if (col.id === 'other') {
      setFormData((prev) => ({ ...prev, collegeId: 'other', college: collegeQuery }));
    } else {
      setCollegeQuery(col.name);
      setFormData((prev) => ({ ...prev, collegeId: col.id, college: col.name }));
    }
    setCollegeDropdownOpen(false);
  };

  // Primary Domain change handler (links to target career track)
  const handlePrimaryDomainChange = (domainIdentifier) => {
    const canonicalDomain = getDomainByIdOrName(domainIdentifier);
    const suggestedRoles = getSuggestedRolesForDomain(canonicalDomain.name);
    const topRole = suggestedRoles && suggestedRoles.length > 0 ? suggestedRoles[0] : comprehensiveCareerRoles[0].id;
    const canonicalRole = getCareerRoleById(topRole) || getCareerRoleByTitle(topRole);
    setFormData((prev) => ({
      ...prev,
      domainId: canonicalDomain.id,
      primaryDomain: canonicalDomain.name,
      targetRoleId: canonicalRole.id,
      targetRole: canonicalRole.title
    }));
  };

  // Toggle secondary domain pill
  const handleToggleSecondaryDomain = (interest) => {
    setFormData((prev) => {
      const exists = prev.secondaryDomains.includes(interest);
      const updated = exists
        ? prev.secondaryDomains.filter((i) => i !== interest)
        : [...prev.secondaryDomains, interest];
      return { ...prev, secondaryDomains: updated };
    });
  };

  // Profile Completeness Calculation (10 Concrete Criteria - 10% each)
  const completeness = useMemo(() => {
    const checks = [
      { id: 'name', label: 'Full Name', met: Boolean(formData.name?.trim()) },
      { id: 'email', label: 'Email Address', met: Boolean(formData.email?.trim()) },
      { id: 'phone', label: 'Mobile Number', met: Boolean(formData.phone?.trim()) },
      { id: 'college', label: 'College / University', met: Boolean(formData.college?.trim()) },
      { id: 'degree', label: 'Degree & Academic Status', met: Boolean(formData.degree?.trim()) },
      { id: 'domain', label: 'Primary Career Domain', met: Boolean(formData.primaryDomain?.trim()) },
      { id: 'targetRole', label: 'Target Career Track', met: Boolean(formData.targetRole?.trim()) },
      { id: 'headline', label: 'Professional Headline or Bio', met: Boolean(formData.professionalHeadline?.trim() || formData.bio?.trim()) },
      { id: 'resume', label: 'Uploaded Resume / CV', met: Boolean(resume && resume.fileName) },
      {
        id: 'skills',
        label: 'Skill Proof / Assessments',
        met: Boolean(
          (effectiveStudent?.verifiedSkills && effectiveStudent.verifiedSkills.length > 0) ||
          (formData.projects && formData.projects.length > 0)
        )
      }
    ];

    const completedCount = checks.filter((c) => c.met).length;
    const percentage = Math.round((completedCount / checks.length) * 100);
    const missing = checks.filter((c) => !c.met);

    return { percentage, completedCount, total: checks.length, missing };
  }, [formData, resume, effectiveStudent]);

  // Current Target Role Track
  const currentTrack = getCareerRoleByTitle(formData.targetRole || effectiveStudent?.targetRole);
  const isVerified = Boolean(effectiveStudent?.verifiedSkills && effectiveStudent.verifiedSkills.length > 0);
  const isEmailVerified = Boolean(effectiveStudent?.emailVerified);
  const isPhoneVerified = Boolean(effectiveStudent?.phoneVerified);

  // Save Full Profile Handler
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();

    if (formData.phone) {
      const phoneValidation = validatePhoneNumber(formData.countryCode, formData.phone);
      if (!phoneValidation.valid) {
        alert(phoneValidation.error);
        return;
      }
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      countryCode: formData.countryCode,
      phone: formData.phone.trim().replace(/[\s\-()]/g, ''),
      college: collegeQuery.trim() || formData.college.trim(),
      collegeId: formData.collegeId || null,
      degree: formData.degree.trim(),
      academicYear: formData.academicYear.trim(),
      semester: formData.semester.trim(),
      graduationYear: Number(formData.graduationYear) || 2026,
      gender: formData.gender.trim(),
      bio: formData.bio.trim(),
      professionalHeadline: formData.professionalHeadline.trim(),
      location: formData.location.trim(),
      github: formData.github.trim(),
      linkedin: formData.linkedin.trim(),
      domainId: getDomainByIdOrName(formData.domainId || formData.primaryDomain).id,
      primaryDomain: getDomainByIdOrName(formData.domainId || formData.primaryDomain).name,
      secondaryDomains: formData.secondaryDomains,
      targetRoleId: getCareerRoleByTitle(formData.targetRoleId || formData.targetRole).id,
      targetRole: getCareerRoleByTitle(formData.targetRoleId || formData.targetRole).title,
      softSkills: formData.softSkills,
      careerPreferences: formData.careerPreferences,
      projects: formData.projects,
      certifications: formData.certifications,
      experience: formData.experience
    };

    const updatedLocal = storageService.updateStudentProfile(payload);

    if (isAuthenticated) {
      try {
        const updatedApi = await api.profile.update(payload);
        if (updatedApi?.user && setUser) {
          setUser(updatedApi.user);
        }
      } catch (err) {
        console.warn('Backend profile update error:', err);
      }
    }

    if (onProfileUpdated) {
      onProfileUpdated(updatedLocal);
    }

    setActiveTab('view');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Add Project helper
  const handleAddProject = () => {
    if (!newProject.title.trim()) return;
    const projectItem = {
      id: `proj_${Date.now()}`,
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      techStack: newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      githubUrl: newProject.githubUrl.trim(),
      demoUrl: newProject.demoUrl.trim()
    };
    setFormData((prev) => ({ ...prev, projects: [...prev.projects, projectItem] }));
    setNewProject({ title: '', description: '', techStack: '', githubUrl: '', demoUrl: '' });
    setShowAddProject(false);
  };

  const handleRemoveProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Add Certification helper
  const handleAddCert = () => {
    if (!newCert.name.trim()) return;
    const certItem = {
      id: `cert_${Date.now()}`,
      name: newCert.name.trim(),
      issuer: newCert.issuer.trim() || 'Accredited Authority',
      issueYear: newCert.issueYear || '2026',
      credentialUrl: newCert.credentialUrl.trim()
    };
    setFormData((prev) => ({ ...prev, certifications: [...prev.certifications, certItem] }));
    setNewCert({ name: '', issuer: '', issueYear: '2026', credentialUrl: '' });
    setShowAddCert(false);
  };

  const handleRemoveCert = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // Add Experience helper
  const handleAddExp = () => {
    if (!newExp.role.trim() || !newExp.company.trim()) return;
    const expItem = {
      id: `exp_${Date.now()}`,
      role: newExp.role.trim(),
      company: newExp.company.trim(),
      duration: newExp.duration.trim() || '3 Months',
      description: newExp.description.trim()
    };
    setFormData((prev) => ({ ...prev, experience: [...prev.experience, expItem] }));
    setNewExp({ role: '', company: '', duration: '', description: '' });
    setShowAddExp(false);
  };

  const handleRemoveExp = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Photo upload handler
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Photo size exceeds 5MB limit.');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setPhotoError('Only JPEG, PNG, WebP, and GIF images are permitted.');
      return;
    }

    setPhotoError('');
    setUploadingPhoto(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await api.profile.uploadPhoto({
            fileDataBase64: reader.result,
            fileName: file.name,
            fileType: file.type
          });
          if (res && res.avatarUrl) {
            const updated = { ...effectiveStudent, avatarUrl: `${res.avatarUrl}?t=${Date.now()}` };
            if (setUser) setUser(updated);
            if (onProfileUpdated) onProfileUpdated(updated);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          }
        } catch (apiErr) {
          setPhotoError(apiErr.message || 'Failed to upload photo.');
        } finally {
          setUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setPhotoError('Failed to process image file.');
      setUploadingPhoto(false);
    }
  };

  // Resume upload handler
  const handleResumeFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setResumeError('Resume file size exceeds the 5MB limit.');
      return;
    }

    const allowed = ['.pdf', '.doc', '.docx'];
    const lowerName = file.name.toLowerCase();
    if (!allowed.some((ext) => lowerName.endsWith(ext))) {
      setResumeError('Only PDF, DOC, and DOCX files are permitted.');
      return;
    }

    setResumeError('');
    setUploadingResume(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await api.profile.uploadResume({
            fileName: file.name,
            fileType: file.type,
            fileDataBase64: reader.result
          });
          if (res && res.resume) {
            setResume(res.resume);
            if (res.user && setUser) setUser(res.user);
            if (onProfileUpdated) onProfileUpdated(res.user);
          }
        } catch (apiErr) {
          setResumeError(apiErr.message || 'Failed to upload resume.');
        } finally {
          setUploadingResume(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setResumeError('Error reading file data.');
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      await api.profile.deleteResume();
      setResume(null);
      if (setUser && user) {
        setUser({ ...user, resume: null });
      }
    } catch (err) {
      console.warn('Failed to delete resume:', err);
    }
  };

  // Verification dialog submit
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!verifyCodeInput.trim()) return;

    setIsVerifyingCode(true);
    setVerifyError('');
    setVerifySuccess('');

    try {
      if (verifyModalType === 'email') {
        const res = await api.auth.verifyEmail({ code: verifyCodeInput.trim() });
        setVerifySuccess('Email verified successfully!');
        if (res.user && setUser) setUser(res.user);
        if (onProfileUpdated && res.user) onProfileUpdated(res.user);
        setTimeout(() => setVerifyModalType(null), 1500);
      } else if (verifyModalType === 'phone') {
        const res = await api.auth.verifyPhone({ code: verifyCodeInput.trim() });
        setVerifySuccess('Mobile phone verified successfully!');
        if (res.user && setUser) setUser(res.user);
        if (onProfileUpdated && res.user) onProfileUpdated(res.user);
        setTimeout(() => setVerifyModalType(null), 1500);
      }
    } catch (err) {
      setVerifyError(err.message || 'Verification failed. Please check your code.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleResendCode = async () => {
    setVerifyError('');
    setVerifySuccess('');
    try {
      if (verifyModalType === 'email') {
        await api.auth.resendEmailVerification();
        setVerifySuccess('Verification code resent! Check email or terminal logs.');
      } else if (verifyModalType === 'phone') {
        await api.auth.sendPhoneOtp();
        setVerifySuccess('OTP code resent! Check SMS or terminal logs.');
      }
    } catch (err) {
      setVerifyError(err.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Verification Modal */}
      {verifyModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-brand-400" />
                {verifyModalType === 'email' ? 'Verify Email Address' : 'Verify Mobile Phone'}
              </h3>
              <button
                onClick={() => setVerifyModalType(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {verifyModalType === 'email'
                ? `Enter the 6-digit verification code dispatched to ${effectiveStudent?.email}. Check backend logs in local mode.`
                : `Enter the 6-digit OTP dispatched to ${effectiveStudent?.countryCode || '+91'} ${effectiveStudent?.phone}. Check backend logs in local mode.`}
            </p>

            {verifyError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {verifyError}
              </div>
            )}
            {verifySuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                {verifySuccess}
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <input
                type="text"
                required
                maxLength="6"
                value={verifyCodeInput}
                onChange={(e) => setVerifyCodeInput(e.target.value)}
                placeholder="6-digit code"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-xs text-brand-400 hover:underline font-semibold cursor-pointer"
                >
                  Resend Code
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingCode || verifyCodeInput.length < 6}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2 cursor-pointer"
                >
                  {isVerifyingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between gap-3 text-xs text-emerald-300 shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile and Career Domain targets successfully persisted to database!</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">ID: {effectiveStudent?.id} ✓</span>
        </div>
      )}

      {/* Top Header: View / Edit Segment Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span>Candidate Profile & Identity</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-normal">
              {effectiveStudent?.id || 'SP-STU-XXXXXXXX'}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verified candidate passport synced with SkillProof industry discovery and institutional telemetry.
          </p>
        </div>

        {/* View Profile vs Edit Profile Toggle */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-2xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'view'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* =======================================================
          TOP IDENTITY CARD
      ======================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Photo with Upload Overlay */}
          <div className="relative group shrink-0">
            <img
              src={effectiveStudent?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={formData.name || 'Candidate'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-brand-500/30 object-cover shadow-xl"
            />
            {uploadingPhoto ? (
              <div className="absolute inset-0 bg-black/70 rounded-2xl flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
                <span className="text-[10px] text-white mt-1">Uploading...</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center text-white text-[11px] font-bold transition-all cursor-pointer backdrop-blur-[2px]"
                title="Change Photo"
              >
                <Camera className="w-5 h-5 text-brand-400 mb-0.5" />
                <span>Upload</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-brand-400 hover:text-white hover:bg-slate-800 transition-colors shadow cursor-pointer"
              title="Upload New Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoChange}
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
            />
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center sm:text-left space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {formData.name || 'Registered Candidate'}
                </h2>
                {formData.professionalHeadline ? (
                  <p className="text-sm text-brand-300 font-semibold mt-0.5">
                    {formData.professionalHeadline}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic mt-0.5">
                    No professional headline added yet.
                  </p>
                )}
              </div>

              {/* Career Readiness Gauge */}
              <div className="bg-slate-950/90 px-5 py-3 rounded-2xl border border-slate-800 text-center shrink-0">
                <span className={`text-2xl sm:text-3xl font-black ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isVerified ? `${effectiveStudent?.careerReadiness || 0}%` : '0%'}
                </span>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                  {isVerified ? 'Verified Readiness' : 'Assessment Pending (0%)'}
                </p>
              </div>
            </div>

            {/* Academic & Location Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-300">
              <span className="font-medium flex items-center gap-1 text-white">
                <School className="w-3.5 h-3.5 text-slate-400" />
                {formData.college || 'Institution Not Listed'}
              </span>
              <span className="text-slate-600">•</span>
              <span>{formData.degree || 'Degree'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{formData.semester} ({formData.academicYear})</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {formData.location || 'India'}
              </span>
            </div>

            {/* Badges Row: Primary Domain, Target Role, Verifications, ID */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
              {/* Primary Domain Badge */}
              <div className="px-3 py-1 rounded-xl bg-brand-500/20 border border-brand-500/40 text-brand-300 font-bold flex items-center gap-1.5 shadow-sm">
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                <span>{formData.primaryDomain || defaultPrimaryDomain}</span>
              </div>

              {/* Target Role Badge */}
              <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Target: <strong className="text-white">{formData.targetRole}</strong></span>
              </div>

              {/* Permanent User ID */}
              <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[11px]">
                ID: {effectiveStudent?.id || 'SP-STU-XXXXXXXX'}
              </div>

              {/* Email Verification Pill */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>{formData.email}</span>
                {isEmailVerified ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5 ml-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setVerifyModalType('email');
                      setVerifyCodeInput('');
                      setVerifyError('');
                    }}
                    className="text-amber-400 hover:underline font-semibold ml-1 cursor-pointer"
                  >
                    Verify
                  </button>
                )}
              </div>

              {/* Phone Verification Pill */}
              {formData.phone && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{formData.countryCode} {formData.phone}</span>
                  {isPhoneVerified ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5 ml-1">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyModalType('phone');
                        setVerifyCodeInput('');
                        setVerifyError('');
                      }}
                      className="text-amber-400 hover:underline font-semibold ml-1 cursor-pointer"
                    >
                      Verify
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completeness Card (Accurate Mathematical Formula) */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Profile Completeness Score
              </span>
              <span className="font-mono text-slate-400">
                ({completeness.completedCount}/{completeness.total} criteria fulfilled)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-black font-mono text-sm ${completeness.percentage === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {completeness.percentage}%
              </span>
              {completeness.percentage === 100 ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Fully Verified Profile ✓
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Complete missing items to boost recruiter ranking</span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                completeness.percentage === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : completeness.percentage >= 60
                  ? 'bg-gradient-to-r from-brand-500 to-emerald-400'
                  : 'bg-gradient-to-r from-amber-500 to-brand-500'
              }`}
              style={{ width: `${completeness.percentage}%` }}
            />
          </div>

          {/* Missing Checklist Items */}
          {completeness.missing.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Action Items:</span>
              {completeness.missing.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 'resume') {
                      fileInputRef.current?.click();
                    } else if (item.id === 'skills') {
                      window.location.href = '/assessment';
                    } else {
                      setActiveTab('edit');
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>+ {item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =======================================================
          VIEW PROFILE PRESENTATION MODE
      ======================================================= */}
      {activeTab === 'view' ? (
        <div className="space-y-8">
          {/* Section A: About & Career Domains */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-brand-400" />
                <div>
                  <h3 className="text-base font-bold text-white">About Candidate</h3>
                  <p className="text-xs text-slate-400">Professional summary, career focus, and specialized areas of interest.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className="text-xs text-brand-400 hover:underline font-bold cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* Bio */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Candidate Bio & Objective:
              </p>
              {formData.bio ? (
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
                  {formData.bio}
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50">
                  Not added yet. Click "Edit Profile" to share your background and goals.
                </p>
              )}
            </div>

            {/* Domains Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Primary Domain Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-brand-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-brand-400 flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Primary Career Domain
                  </span>
                  <span className="text-[10px] font-mono text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded">
                    Focus
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{formData.primaryDomain}</h4>
                {(() => {
                  const dom = technologyDomains.find((d) => d.name === formData.primaryDomain);
                  return (
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {dom?.description || 'Core technology focus area.'}
                    </p>
                  );
                })()}
              </div>

              {/* Secondary Areas of Interest */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-indigo-400" /> Secondary Areas of Interest
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {formData.secondaryDomains.length} tags
                  </span>
                </div>
                {formData.secondaryDomains.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {formData.secondaryDomains.map((sec, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
                      >
                        #{sec}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Not added yet. Select areas of interest to enhance recruiter search matching.
                  </p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {formData.github ? (
                <a
                  href={formData.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              ) : (
                <span className="text-xs text-slate-500">GitHub: Not added yet</span>
              )}

              {formData.linkedin ? (
                <a
                  href={formData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              ) : (
                <span className="text-xs text-slate-500">LinkedIn: Not added yet</span>
              )}
            </div>
          </div>

          {/* Section B: Education */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-brand-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Education & Institutional Affiliation</h3>
                  <p className="text-xs text-slate-400">Degree details, graduation timeline, and university enrollment.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className="text-xs text-brand-400 hover:underline font-bold cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {formData.college || 'Institution Not Listed'}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {formData.degree}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-brand-300 font-mono text-xs font-bold self-start sm:self-auto">
                  Graduation Year: {formData.graduationYear}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-900">
                <span>Academic Year: <strong className="text-white">{formData.academicYear}</strong></span>
                <span>•</span>
                <span>Current Semester: <strong className="text-white">{formData.semester}</strong></span>
                <span>•</span>
                <span>Location: <strong className="text-white">{formData.location || 'India'}</strong></span>
              </div>
            </div>
          </div>

          {/* Section C: Skills & Verified SkillProof Passport */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Verified Technical Skills Passport</h3>
                  <p className="text-xs text-slate-400">Direct proof of code execution, mutation survival, and assessment scores.</p>
                </div>
              </div>
              <Link to="/assessment" className="text-xs text-brand-400 font-bold hover:underline">
                + Take New Assessment
              </Link>
            </div>

            {/* Verified Skills Grid */}
            {effectiveStudent?.verifiedSkills && effectiveStudent.verifiedSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {effectiveStudent.verifiedSkills.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 flex items-center justify-between shadow-md"
                  >
                    <div>
                      <p className="font-bold text-white text-sm">{s.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Verified {s.verifiedAt || 'Recently'} • Level: <span className="text-brand-300 font-bold">{s.level || 'Competent'}</span>
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {s.badge || 'Verified'} Badge ✓
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">{s.score}%</span>
                      <p className="text-[10px] font-mono text-slate-400">Passport Score</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950/80 p-8 rounded-2xl border border-slate-800 text-center space-y-3">
                <p className="text-sm font-semibold text-slate-300">
                  No verified skill assessments completed yet.
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your profile readiness remains at 0% until you complete a verified skill assessment. Choose any language to write code, survive mutation tests, and claim your credential passport!
                </p>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
                >
                  <Cpu className="w-4 h-4" />
                  <span>Take Language Assessment</span>
                </Link>
              </div>
            )}

            {/* Target Role Skill Requirement Checklist */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Required Skills for {currentTrack.title} ({currentTrack.requiredSkills.length} Core Skills):
                </h4>
                <span className="text-slate-400 text-[11px]">Benchmark: Min qualifying score per skill</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentTrack.requiredSkills.map((req) => {
                  const verified = effectiveStudent?.verifiedSkills?.find(
                    (v) =>
                      v.name.toLowerCase() === req.name.toLowerCase() ||
                      (v.skillId && v.skillId.toLowerCase() === req.id.toLowerCase())
                  );
                  const hasPassed = verified && verified.score >= req.minScore;

                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        hasPassed
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                          : verified
                          ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{req.name}</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            hasPassed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : verified
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {hasPassed ? 'Passed ✓' : verified ? 'Gap' : 'Unverified'}
                        </span>
                      </div>

                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Score: <strong className={hasPassed ? 'text-emerald-400' : 'text-slate-400'}>{verified ? `${verified.score}%` : '0%'}</strong></span>
                        <span>Target: <strong className="text-brand-300">&ge;{req.minScore}%</strong></span>
                      </div>

                      {!hasPassed && (
                        <Link
                          to={`/build-break-adapt?skill=${req.id}`}
                          className="w-full py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px] text-center block transition-all"
                        >
                          {verified ? 'Retake Benchmark →' : 'Prove Skill →'}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section D: Projects / Portfolio */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Projects & Technical Portfolio ({formData.projects.length})
                  </h3>
                  <p className="text-xs text-slate-400">Production repositories, architectural code, and live deployed systems.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('edit');
                  setShowAddProject(true);
                }}
                className="text-xs text-brand-400 hover:underline font-bold cursor-pointer"
              >
                + Add Project
              </button>
            </div>

            {formData.projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.projects.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-white text-sm">{proj.title}</h4>
                      {proj.description && (
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {proj.description}
                        </p>
                      )}
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-slate-900 text-xs">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
                <p className="text-xs text-slate-400">No portfolio projects added yet.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('edit');
                    setShowAddProject(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  + Add Your First Project
                </button>
              </div>
            )}
          </div>

          {/* Section E: Certifications / Official Learning */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Certifications & Professional Badges ({formData.certifications.length})
                  </h3>
                  <p className="text-xs text-slate-400">Industry certifications, verified courses, and technical distinctions.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('edit');
                  setShowAddCert(true);
                }}
                className="text-xs text-brand-400 hover:underline font-bold cursor-pointer"
              >
                + Add Certification
              </button>
            </div>

            {formData.certifications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {formData.certifications.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{cert.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {cert.issuer} • {cert.issueYear}
                      </p>
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-brand-400 hover:text-white"
                        title="View Credential"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs text-slate-400">
                No official certifications added yet. Click "Add Certification" to document your achievements.
              </div>
            )}
          </div>

          {/* Section F: Work Experience & Internships */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Work Experience & Internships ({formData.experience.length})
                  </h3>
                  <p className="text-xs text-slate-400">Industry internships, research apprenticeships, and engineering roles.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('edit');
                  setShowAddExp(true);
                }}
                className="text-xs text-brand-400 hover:underline font-bold cursor-pointer"
              >
                + Add Experience
              </button>
            </div>

            {formData.experience.length > 0 ? (
              <div className="space-y-3">
                {formData.experience.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{exp.role}</h4>
                      <span className="text-[11px] font-mono text-slate-400">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-brand-400 font-semibold">{exp.company}</p>
                    {exp.description && (
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs text-slate-400">
                No experience or internships added yet. Click "Add Experience" to document your work background.
              </div>
            )}
          </div>

          {/* Section G: Resume / CV */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Verified Resume / CV Document</h3>
                  <p className="text-xs text-slate-400">
                    PDF/DOC/DOCX $\le$ 5MB discoverable by authorized recruiters.
                  </p>
                </div>
              </div>
              {resume && (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                  Verified Signature ✓
                </span>
              )}
            </div>

            {resume ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{resume.fileName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {resume.fileSizeFormatted} • Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const blob = await api.profile.downloadResumeBlob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = resume.fileName || 'Resume.pdf';
                        a.click();
                        window.URL.revokeObjectURL(url);
                      } catch (e) {
                        alert('Could not download resume.');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Replace
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteResume}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    title="Remove Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-2xl text-center cursor-pointer transition-colors bg-slate-950/60 space-y-1.5"
              >
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-200">Click to upload your resume / CV</p>
                <p className="text-[11px] text-slate-500">Supports PDF, DOC, DOCX up to 5MB (Server signature validated)</p>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleResumeFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />

            {uploadingResume && (
              <div className="flex items-center gap-2 text-xs text-brand-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Validating magic bytes and saving resume...</span>
              </div>
            )}

            {resumeError && <p className="text-xs text-rose-400 font-medium">{resumeError}</p>}
          </div>

          {/* Section H: Chronological Assessment History */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">
                  Chronological Assessment Attempts ({testHistory.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {isAuthenticated ? 'Persistent Database Logs' : 'Local Session'}
              </span>
            </div>

            {testHistory.length > 0 ? (
              <div className="space-y-2.5">
                {testHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          Attempt #{item.attemptNumber}
                        </span>
                        <span className="font-bold text-white text-sm">{item.skillName}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                          {item.type === 'code_challenge' ? 'Code Challenge' : 'Knowledge Quiz'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {item.totalCount ? `${item.correctCount} / ${item.totalCount} correct • ` : ''}
                        Completed: {item.completedAt ? new Date(item.completedAt).toLocaleString() : 'Recently'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`text-xl font-black ${
                          item.score >= 85 ? 'text-emerald-400' : item.score >= 70 ? 'text-blue-400' : 'text-amber-400'
                        }`}
                      >
                        {item.score}%
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                          item.score >= 85
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : item.score >= 70
                            ? 'bg-slate-700 text-slate-200 border border-slate-600'
                            : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        }`}
                      >
                        {item.score >= 85 ? 'Gold' : item.score >= 70 ? 'Silver' : 'Bronze'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80 text-center text-xs text-slate-400">
                No assessment attempts recorded yet.
              </div>
            )}
          </div>

          {/* Section I & J: Soft Skills & Career Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Soft Skills */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Soft Skills & Core Competencies
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.softSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Career Preferences */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Opportunity Preferences
              </h3>
              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Preferred Role Type:</span>
                  <strong className="text-white">{formData.careerPreferences.preferredType || 'Internship'}</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Work Mode:</span>
                  <strong className="text-emerald-400">{formData.careerPreferences.workMode || 'Hybrid'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =======================================================
            EDIT PROFILE MODE (Structured Form Editor)
        ======================================================= */
        <form
          onSubmit={handleSaveProfile}
          className="bg-slate-900/95 border-2 border-brand-500/60 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl animate-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Edit Candidate Profile & Career Domains</h3>
                <p className="text-xs text-slate-400">All updates will persist directly to your permanent account.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('view')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Close Edit Form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Domains & Career Direction */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-brand-500/40 space-y-4">
            <h4 className="text-xs font-bold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-400" /> Career Focus & Technology Domains
            </h4>

            {/* Primary Domain */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                Primary Domain * (Mandatory)
              </label>
              <select
                value={formData.primaryDomain}
                onChange={(e) => handlePrimaryDomainChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {technologyDomains.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Secondary Areas of Interest Multi-Select */}
            <div className="space-y-2 pt-2 border-t border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" /> Secondary Areas of Interest:
                </label>
                <span className="text-slate-400 text-[10px] font-mono">
                  {formData.secondaryDomains.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getSecondaryInterestsForDomain(formData.primaryDomain).map((interest) => {
                  const isSelected = formData.secondaryDomains.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleToggleSecondaryDomain(interest)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-brand-500/20 border-brand-500/50 text-brand-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-brand-400" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Role Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-900">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" /> Target Career Track (Auto-Suggested based on Domain)
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {comprehensiveCareerRoles.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title} ({t.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Basic Info & Headline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-400" /> Personal & Professional Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Mobile Number *</label>
                <div className="flex gap-1.5">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-24 px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.dialCode}>{c.flag} {c.dialCode}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Professional Headline */}
              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Professional Headline</label>
                <input
                  type="text"
                  value={formData.professionalHeadline}
                  onChange={(e) => setFormData({ ...formData, professionalHeadline: e.target.value })}
                  placeholder="e.g. Software Engineer passionate about Distributed Systems & Cloud Platforms"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Bangalore, India"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Detailed Bio / Professional Summary</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your technical background, areas of passion, and what you aim to build..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Academic Data */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <School className="w-4 h-4 text-brand-400" /> Academic & Institutional Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* College Autocomplete */}
              <div className="space-y-1 sm:col-span-2 relative" ref={collegeRef}>
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Institution / University</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={collegeQuery}
                    onFocus={() => setCollegeDropdownOpen(true)}
                    onChange={(e) => {
                      setCollegeQuery(e.target.value);
                      setFormData({ ...formData, college: e.target.value });
                      setCollegeDropdownOpen(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none pr-8"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                </div>

                {collegeDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-1 space-y-0.5">
                    {filteredColleges.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCollege(c)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.city}, {c.state}</p>
                        </div>
                        {formData.collegeId === c.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Graduation Year */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Graduation Year</label>
                <input
                  type="number"
                  min="2024"
                  max="2032"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Degree */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Degree</label>
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {standardDegrees.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Academic Year */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Academic Year</label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {academicYears.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {/* Semester */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {getSemestersForDegree(formData.degree).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Social & Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-brand-400" /> Links & Social Footprint
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Github className="w-3 h-3 text-slate-400" /> GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/yourhandle"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Linkedin className="w-3 h-3 text-cyan-400" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourhandle"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Projects Manager */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-indigo-400" /> Portfolio Projects ({formData.projects.length})
              </h4>
              <button
                type="button"
                onClick={() => setShowAddProject(!showAddProject)}
                className="text-xs text-brand-400 font-bold hover:underline cursor-pointer"
              >
                {showAddProject ? 'Cancel' : '+ Add New Project'}
              </button>
            </div>

            {showAddProject && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-brand-500/40 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Project Title *"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Tech Stack (comma separated: React, Node, SQL)"
                    value={newProject.techStack}
                    onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                  <input
                    type="url"
                    placeholder="GitHub Repo URL"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                  <input
                    type="url"
                    placeholder="Live Demo URL"
                    value={newProject.demoUrl}
                    onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Project description and key technical highlights..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold cursor-pointer"
                >
                  Save Project Item
                </button>
              </div>
            )}

            {formData.projects.length > 0 && (
              <div className="space-y-2">
                {formData.projects.map((proj, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{proj.title}</span>
                      <span className="text-slate-400 ml-2">({proj.techStack?.join(', ') || 'No tags'})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Certifications Manager */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-amber-400" /> Certifications ({formData.certifications.length})
              </h4>
              <button
                type="button"
                onClick={() => setShowAddCert(!showAddCert)}
                className="text-xs text-brand-400 font-bold hover:underline cursor-pointer"
              >
                {showAddCert ? 'Cancel' : '+ Add Certification'}
              </button>
            </div>

            {showAddCert && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Certification Name *"
                    value={newCert.name}
                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Authority (AWS, Google, Coursera)"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Issue Year (e.g. 2026)"
                    value={newCert.issueYear}
                    onChange={(e) => setNewCert({ ...newCert, issueYear: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                  <input
                    type="url"
                    placeholder="Credential Link / Verification URL"
                    value={newCert.credentialUrl}
                    onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer"
                >
                  Save Certification
                </button>
              </div>
            )}

            {formData.certifications.length > 0 && (
              <div className="space-y-2">
                {formData.certifications.map((cert, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{cert.name}</span>
                      <span className="text-slate-400 ml-2">({cert.issuer} • {cert.issueYear})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('view')}
              className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Persist All Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* =======================================================
          AUTHENTICATED PASSWORD MANAGEMENT SECTION
      ======================================================= */}
      {isAuthenticated && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Account Security & Password</h3>
                <p className="text-xs text-slate-400">
                  Update your account password with enterprise security policy enforcement.
                </p>
              </div>
            </div>
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setPasswordError('');
              setPasswordSuccess('');
              if (newPassword !== confirmPassword) {
                setPasswordError('New password and confirmation do not match.');
                return;
              }
              const val = validateStrongPassword(newPassword);
              if (!val.valid) {
                setPasswordError(val.error);
                return;
              }
              setIsSubmittingPassword(true);
              try {
                const res = await api.auth.changePassword({ currentPassword, newPassword, confirmPassword });
                setPasswordSuccess(res.message || 'Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setPasswordSuccess(''), 4000);
              } catch (err) {
                setPasswordError(err.message || 'Failed to change password. Please check your current password.');
              } finally {
                setIsSubmittingPassword(false);
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New strong password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {newPassword.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-[11px]">
                {checkPasswordRequirements(newPassword).map((r) => (
                  <div
                    key={r.id}
                    className={`flex items-center gap-1.5 ${
                      r.met ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {r.met ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
                    <span>{r.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSubmittingPassword || !currentPassword || !newPassword}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-brand-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmittingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
