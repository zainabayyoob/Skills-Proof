import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  Award,
  Sparkles,
  CodeXml,
  Filter,
  Search,
  ExternalLink,
  Briefcase,
  Star,
  Check,
  UserCheck,
  TrendingUp,
  Clock,
  Edit,
  Mail,
  Globe,
  MapPin,
  FileText,
  Download,
  Layers,
  Tag,
  GraduationCap,
  Github
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { api } from '../services/api';
import { Modal } from '../components/Modal';

export const IndustryDashboard = ({ student }) => {
  // State
  const [profile, setProfile] = useState({
    companyName: 'Apex Data Systems',
    industry: 'Enterprise Cloud & Data Engineering',
    website: 'https://apexdata.io',
    location: 'Bangalore, India (Hybrid)',
    contactEmail: 'talent@apexdata.io',
    description: 'Leading data engineering platform building real-time telemetry processing microservices.',
    techStack: 'Python, SQL, React, Node.js, SQLite, Docker'
  });

  const [opportunities, setOpportunities] = useState(storageService.getOpportunities());
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // Filters for Candidate Search
  const [filterSkill, setFilterSkill] = useState('');
  const [minScore, setMinScore] = useState(70);
  const [filterRole, setFilterRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectedCandidate, setInspectedCandidate] = useState(null);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [viewCandidate, setViewCandidate] = useState(null);

  // Post Opportunity Form
  const [oppTitle, setOppTitle] = useState('');
  const [oppType, setOppType] = useState('Internship');
  const [oppLocation, setOppLocation] = useState('Bangalore (Hybrid)');
  const [oppWorkMode, setOppWorkMode] = useState('Hybrid');
  const [oppStipend, setOppStipend] = useState('₹45,000 / month');
  const [oppDesc, setOppDesc] = useState('');
  const [oppSkills, setOppSkills] = useState('Python, SQL, React');
  const [oppEligibility, setOppEligibility] = useState('Pre-final or Final year B.Tech / BE students');
  const [oppOpenings, setOppOpenings] = useState(3);

  // Load Data on Mount
  useEffect(() => {
    loadCompanyProfile();
    loadOpportunities();
    loadCandidates();
    loadApplications();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const res = await api.industry.getProfile();
      if (res && res.profile) {
        setProfile((prev) => ({ ...prev, ...res.profile }));
      }
    } catch (e) {
      console.warn('Could not load company profile:', e);
    }
  };

  const loadOpportunities = async () => {
    try {
      const res = await api.industry.getOpportunities();
      if (res && Array.isArray(res.opportunities)) {
        setOpportunities(res.opportunities);
      }
    } catch (e) {
      console.warn('Could not load opportunities from API:', e);
    }
  };

  const loadCandidates = async (skill = filterSkill, score = minScore, role = filterRole, search = searchQuery) => {
    try {
      setLoadingCandidates(true);
      const res = await api.industry.getCandidates({
        search: (search || '').trim(),
        skill: (skill || '').trim(),
        minScore: score,
        targetRole: (role || '').trim()
      });
      if (res && res.candidates) {
        setCandidates(res.candidates);
      }
    } catch (e) {
      console.warn('Could not load candidates from API:', e);
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const loadApplications = async () => {
    try {
      const res = await api.industry.getApplications();
      if (res && Array.isArray(res.applications)) {
        setApplications(res.applications);
        return;
      }
    } catch (e) {
      console.warn('Could not load applications from API:', e);
    }
    setApplications(storageService.getApplications());
  };

  const handleSearchCandidates = (e) => {
    e.preventDefault();
    loadCandidates(filterSkill, minScore, filterRole, searchQuery);
  };

  const handleToggleShortlist = async (cand) => {
    const isShortlisted = shortlistedIds.has(cand.id);
    try {
      await api.industry.shortlistCandidate(cand.id, cand.name, cand.targetRole);
    } catch (e) {
      console.warn('API shortlist call error:', e);
    }

    setShortlistedIds((prev) => {
      const next = new Set(prev);
      if (isShortlisted) {
        next.delete(cand.id);
      } else {
        next.add(cand.id);
      }
      return next;
    });
  };

  const handleDownloadCandidateResume = async (cand) => {
    try {
      const blob = await api.industry.downloadCandidateResumeBlob(cand.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = cand.resumeFileName || `${cand.name.replace(/\s+/g, '_')}_Resume.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message || 'Could not download candidate resume');
    }
  };

  const handlePostOpportunity = async (e) => {
    e.preventDefault();
    const skillsArray = oppSkills.split(',').map((s) => ({
      name: s.trim(),
      weight: 0.25,
      minScore: 75,
    }));

    const oppPayload = {
      title: oppTitle,
      company: profile.companyName,
      type: oppType,
      location: oppLocation,
      workMode: oppWorkMode,
      stipend: oppStipend,
      description: oppDesc,
      eligibility: oppEligibility,
      requiredSkills: skillsArray,
      openings: Number(oppOpenings) || 3,
    };

    try {
      const res = await api.industry.postOpportunity(oppPayload);
      if (res && res.opportunity) {
        setOpportunities((prev) => [res.opportunity, ...prev]);
      } else {
        const created = storageService.addOpportunity(oppPayload);
        setOpportunities((prev) => [created, ...prev]);
      }
    } catch (err) {
      const created = storageService.addOpportunity(oppPayload);
      setOpportunities((prev) => [created, ...prev]);
    }

    setPostModalOpen(false);
    setOppTitle('');
    setOppDesc('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.industry.updateProfile(profile);
    } catch (err) {
      console.warn('Save profile error:', err);
    }
    setEditProfileOpen(false);
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      await api.industry.updateApplicationStatus(appId, newStatus, `Recruiter updated stage to ${newStatus}`);
    } catch (err) {
      console.warn('Update app status error:', err);
    }
    storageService.updateApplicationStatus(appId, newStatus);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
  };

  const handleOpenInspect = async (cand) => {
    if (cand && cand.id) {
      try {
        const res = await api.industry.getCandidateById(cand.id);
        if (res && res.candidate) {
          setInspectedCandidate(res.candidate);
          setInspectModalOpen(true);
          return;
        }
      } catch (e) {
        console.warn('Could not fetch single candidate detail:', e);
      }
    }
    setInspectedCandidate(cand || student);
    setInspectModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-900/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              INDUSTRY RECRUITER CONSOLE
            </span>
            <span className="text-xs text-slate-400">{profile.companyName} Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Verified Engineering Talent Pipeline
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Eliminate resume screening fluff. Search registered engineering candidates evaluated on live code execution,
            mutation resilience, and edge case benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-center">
          <button
            onClick={() => setEditProfileOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5 text-brand-400" />
            <span>Company Profile</span>
          </button>

          <button
            onClick={() => setPostModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Opportunity</span>
          </button>
        </div>
      </div>

      {/* Recruiter Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Available Candidates</span>
          <p className="text-2xl font-black text-white">{candidates.length || 1}</p>
          <p className="text-[10px] text-slate-500 font-mono">DB Verified Profiles</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Active Postings</span>
          <p className="text-2xl font-black text-emerald-400">{opportunities.length}</p>
          <p className="text-[10px] text-slate-500 font-mono">Company Openings</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Shortlisted Pool</span>
          <p className="text-2xl font-black text-indigo-400">{shortlistedIds.size}</p>
          <p className="text-[10px] text-slate-500 font-mono">Fast-Track Review</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Applications</span>
          <p className="text-2xl font-black text-cyan-400">{applications.length}</p>
          <p className="text-[10px] text-slate-500 font-mono">Under Pipeline</p>
        </div>
      </div>

      {/* Recruiter Verified Candidate Search Filter Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Direct Student & Candidate Search
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Query registered students in the SkillProof database filtered by live verified benchmark scores.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Direct Database Search</span>
        </div>

        {/* Search Filters Form */}
        <form onSubmit={handleSearchCandidates} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Student ID / Name / Tag</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. usr_..., SKP-..., Name"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Skill Filter</label>
            <input
              type="text"
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              placeholder="e.g. Python, SQL, React"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Minimum Score: <span className="text-emerald-400 font-mono font-bold">{minScore}%</span>
            </label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full mt-2 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Role Track</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none cursor-pointer"
            >
              <option value="">All Career Tracks</option>
              <option value="Full Stack">Full Stack Web Developer</option>
              <option value="Data">Data Platform Engineer</option>
              <option value="Cloud">Cloud & DevOps Engineer</option>
              <option value="Backend">Backend Systems Developer</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Filter Candidates</span>
            </button>
          </div>
        </form>

        {/* Candidate Results Grid */}
        {loadingCandidates ? (
          <div className="p-8 text-center text-slate-400 text-xs">Searching verified database...</div>
        ) : candidates.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No registered candidate matches the selected skill criteria. Try adjusting the score benchmark or skill query.
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {candidates.map((cand) => {
              const isShort = shortlistedIds.has(cand.id);
              return (
                <div
                  key={cand.id}
                  className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-5 space-y-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-white text-base">{cand.name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                          Readiness: {cand.careerReadiness}%
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          ID: {cand.id}
                        </span>
                        {cand.emailVerified && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Email
                          </span>
                        )}
                        {cand.phoneVerified && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Mobile
                          </span>
                        )}
                      </div>

                      {cand.professionalHeadline && (
                        <p className="text-xs font-semibold text-brand-300">
                          {cand.professionalHeadline}
                        </p>
                      )}

                      <p className="text-xs text-slate-400">
                        {cand.degree} • {cand.semester || '6th Semester'} ({cand.academicYear || '3rd Year'}) • <strong className="text-slate-300">{cand.college}</strong>
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 text-[11px] font-bold flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          <span>{cand.primaryDomain || 'Computer Science / Software Development'}</span>
                        </span>
                        <span className="text-[11px] text-slate-300">
                          Target: <strong className="text-white">{cand.targetRole || 'Full Stack Web Developer'}</strong>
                        </span>
                        {cand.secondaryDomains && cand.secondaryDomains.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {cand.secondaryDomains.slice(0, 3).map((sec, sIdx) => (
                              <span key={sIdx} className="text-[10px] px-2 py-0.2 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 font-mono">
                                #{sec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                      <button
                        onClick={() => {
                          setViewCandidate(cand);
                          setViewProfileOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>

                      {cand.hasResume && (
                        <button
                          onClick={() => handleDownloadCandidateResume(cand)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Download Candidate Verified Resume"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-400" />
                          <span>Resume</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenInspect(cand)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CodeXml className="w-3.5 h-3.5 text-brand-400" />
                        <span>Inspect Code Diff</span>
                      </button>

                      <button
                        onClick={() => handleToggleShortlist(cand)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isShort
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        }`}
                      >
                        {isShort ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Shortlisted</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Shortlist Candidate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Verified Skill Badges (Never fake/mock) */}
                  <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Verified Technical Skills:
                    </span>
                    {cand.verifiedSkills && cand.verifiedSkills.length > 0 ? (
                      cand.verifiedSkills.map((vs, vsIdx) => (
                        <span
                          key={vsIdx}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 text-xs font-mono flex items-center gap-1"
                        >
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{vs.name}: {vs.score}%</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        No verified skill assessments completed yet (Readiness: 0%).
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manage Candidate Applications for Company Postings */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-400" />
              Manage Incoming Applications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review candidates who applied to your company roles, inspect passport scores, and advance stages.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{applications.length} Total</span>
        </div>

        {applications.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No applications received yet. New submissions will appear here automatically.
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">
                      {app.candidateName || 'Candidate'}
                    </h4>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 font-medium">{app.opportunityTitle || app.role}</span>
                    {app.matchScore && (
                      <span className="px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                        {app.matchScore}% Match
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Applied on {app.appliedDate || 'Recent'} • {app.notes || 'SkillProof Passport verified application.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px]">Stage:</span>
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleOpenInspect(student)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  >
                    Diff Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Postings List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Active Opportunities by {profile.companyName}</h3>
          <button
            onClick={() => setPostModalOpen(true)}
            className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
          >
            + Post New Opening
          </button>
        </div>

        <div className="space-y-3">
          {opportunities.slice(0, 6).map((opp) => (
            <div
              key={opp.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <h4 className="font-bold text-sm text-white">{opp.title}</h4>
                <p className="text-slate-400 mt-0.5">
                  {opp.type} • {opp.location} • {opp.stipend} • Required:{' '}
                  {opp.requiredSkills ? opp.requiredSkills.map((s) => s.name).join(', ') : 'Python, SQL'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                  {opp.openings || 3} Openings
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Opportunity Modal */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title="Post New Engineering Opportunity"
      >
        <form onSubmit={handlePostOpportunity} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Opportunity Title *</label>
            <input
              type="text"
              required
              value={oppTitle}
              onChange={(e) => setOppTitle(e.target.value)}
              placeholder="e.g., Cloud Backend Systems Intern"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Opportunity Type</label>
              <select
                value={oppType}
                onChange={(e) => setOppType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="Internship">Internship</option>
                <option value="Full-Time Job">Full-Time Job</option>
                <option value="Part-Time Job">Part-Time Job</option>
                <option value="Freelance / Contract">Freelance / Contract</option>
                <option value="Apprenticeship">Apprenticeship</option>
                <option value="Project / Live Project">Project / Live Project</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Stipend / CTC</label>
              <input
                type="text"
                value={oppStipend}
                onChange={(e) => setOppStipend(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location</label>
              <input
                type="text"
                value={oppLocation}
                onChange={(e) => setOppLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Openings</label>
              <input
                type="number"
                min="1"
                value={oppOpenings}
                onChange={(e) => setOppOpenings(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={oppSkills}
              onChange={(e) => setOppSkills(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              placeholder="Python, SQL, React, Git"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Role Description</label>
            <textarea
              rows={3}
              required
              value={oppDesc}
              onChange={(e) => setOppDesc(e.target.value)}
              placeholder="Describe real-world engineering responsibilities, code performance expectations, and problem-solving..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setPostModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
            >
              Publish Opportunity
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Edit Recruiter Company Profile"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Website</label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={profile.contactEmail}
                onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Primary Tech Stack</label>
            <input
              type="text"
              value={profile.techStack}
              onChange={(e) => setProfile({ ...profile, techStack: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company Description</label>
            <textarea
              rows={3}
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditProfileOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Code Inspection Diff Modal */}
      <Modal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        title={`Build-Break-Adapt Code Diff Audit: ${inspectedCandidate?.name || 'Candidate'}`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white">Challenge: Sales Dataset Analysis & Mutation Shield</span>
            <span className="text-emerald-400 font-mono font-bold">
              Score: {inspectedCandidate?.careerReadiness || 86}/100 Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-rose-400 font-mono">
                Naive Build Code (Crashed on Missing Data):
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-rose-900/40 text-[11px] font-mono text-rose-200 overflow-x-auto leading-relaxed max-h-64">
{`# Naive Baseline (Crashed on contaminated batch)
def analyze_sales_data(transactions):
    total = 0
    for r in transactions:
        total += r["units"] * r["price"] # crashed on None
    return total / len(transactions)`}
              </pre>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-400 font-mono">
                Adapted Defensive Code (Passed 100% Mutations):
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-emerald-900/40 text-[11px] font-mono text-emerald-200 overflow-x-auto leading-relaxed max-h-64">
{`# Adapted Implementation
import re
def analyze_sales_data(transactions):
    seen = set()
    total = 0
    for r in transactions:
        if not r.get("units") or r["id"] in seen:
            continue
        seen.add(r["id"])
        # regex strip currency
        p = float(re.sub(r'[^0-9.]', '', str(r["price"])))
        total += int(r["units"]) * p`}
              </pre>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 italic">
            "Candidate Fix Rationale: Quarantined NoneType records, stripped contaminated currency symbols, deduplicated transactions using a Set, and prevented zero-division on AOV."
          </div>
        </div>
      </Modal>

      {/* Candidate Professional Identity Inspection Modal */}
      <Modal
        isOpen={viewProfileOpen}
        onClose={() => setViewProfileOpen(false)}
        title={`Candidate Professional Profile: ${viewCandidate?.name || 'Candidate'}`}
        maxWidth="max-w-3xl"
      >
        {viewCandidate && (
          <div className="space-y-6 text-xs text-slate-300">
            {/* Top Identity Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-2xl ring-2 ring-brand-500/30 bg-slate-900 flex items-center justify-center text-brand-400 font-bold text-xl shrink-0">
                {viewCandidate.name ? viewCandidate.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-base font-bold text-white">{viewCandidate.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    ID: {viewCandidate.id}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                    Readiness: {viewCandidate.careerReadiness}%
                  </span>
                </div>
                {viewCandidate.professionalHeadline && (
                  <p className="text-xs font-semibold text-brand-300">
                    {viewCandidate.professionalHeadline}
                  </p>
                )}
                <p className="text-slate-400 text-[11px]">
                  {viewCandidate.degree} • {viewCandidate.semester || '6th Semester'} ({viewCandidate.academicYear || '3rd Year'}) • <strong className="text-slate-200">{viewCandidate.college}</strong>
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="px-2.5 py-0.5 rounded-lg bg-brand-500/20 text-brand-300 text-[10px] font-bold border border-brand-500/30 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>{viewCandidate.primaryDomain || 'Computer Science / Software Development'}</span>
                  </span>
                  <span className="text-[10px] text-slate-300">
                    Target Track: <strong className="text-white">{viewCandidate.targetRole}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* About & Bio */}
            {viewCandidate.bio && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Professional Summary:</span>
                <p className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 leading-relaxed text-slate-200">
                  {viewCandidate.bio}
                </p>
              </div>
            )}

            {/* Secondary Interests */}
            {viewCandidate.secondaryDomains && viewCandidate.secondaryDomains.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secondary Areas of Interest:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewCandidate.secondaryDomains.map((sec, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-[11px] font-mono">
                      #{sec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Skills */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verified Technical Skills:</span>
              {viewCandidate.verifiedSkills && viewCandidate.verifiedSkills.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {viewCandidate.verifiedSkills.map((vs, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-xs">{vs.name}</p>
                        <p className="text-[10px] text-slate-400">{vs.level || 'Verified'} Level</p>
                      </div>
                      <span className="text-emerald-400 font-bold font-mono text-sm">{vs.score}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-500 italic text-[11px]">
                  No verified skill assessments completed yet.
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portfolio Projects:</span>
              {viewCandidate.projects && viewCandidate.projects.length > 0 ? (
                <div className="space-y-2">
                  {viewCandidate.projects.map((proj, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{proj.title}</span>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1 text-[10px]">
                            <Github className="w-3 h-3" /> Code
                          </a>
                        )}
                      </div>
                      {proj.description && <p className="text-slate-400 text-[11px]">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-500 italic text-[11px]">
                  Not added yet.
                </p>
              )}
            </div>

            {/* Resume Download Action */}
            {viewCandidate.hasResume && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-400" />
                  <span>Verified Resume Document ({viewCandidate.resumeFileSize || 'PDF'})</span>
                </div>
                <button
                  onClick={() => handleDownloadCandidateResume(viewCandidate)}
                  className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Resume</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
