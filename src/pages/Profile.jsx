import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  RotateCcw,
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
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { roleTracks } from '../data/mockData';
import { CandidateProfileModal } from '../components/CandidateProfileModal';

export const Profile = ({ student, onResetData, onProfileUpdated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable form state
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    college: student?.college || '',
    degree: student?.degree || '',
    graduationYear: student?.graduationYear || 2026,
    semester: student?.semester || '6th Semester (3rd Year)',
    bio: student?.bio || '',
    github: student?.github || '',
    linkedin: student?.linkedin || '',
    targetRole: student?.targetRole || roleTracks[0].title,
  });

  // Keep form data in sync with student prop
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        college: student.college || '',
        degree: student.degree || '',
        graduationYear: student.graduationYear || 2026,
        semester: student.semester || '6th Semester (3rd Year)',
        bio: student.bio || '',
        github: student.github || '',
        linkedin: student.linkedin || '',
        targetRole: student.targetRole || roleTracks[0].title,
      });
    }
  }, [student]);

  const isVerified = student?.verifiedSkills && student.verifiedSkills.length > 0;
  const currentTrack = roleTracks.find((r) => r.title === (student?.targetRole || formData.targetRole)) || roleTracks[0];

  const handleSaveInline = (e) => {
    e.preventDefault();
    const updated = storageService.updateStudentProfile({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      college: formData.college.trim(),
      degree: formData.degree.trim(),
      graduationYear: Number(formData.graduationYear) || 2026,
      semester: formData.semester.trim(),
      bio: formData.bio.trim(),
      github: formData.github.trim(),
      linkedin: formData.linkedin.trim(),
      targetRole: formData.targetRole.trim(),
    });

    if (onProfileUpdated) {
      onProfileUpdated(updated);
    }
    setIsEditingInline(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleTrackChange = (newTrackTitle) => {
    setFormData((prev) => ({ ...prev, targetRole: newTrackTitle }));
    const updated = storageService.updateStudentProfile({
      targetRole: newTrackTitle,
    });
    if (onProfileUpdated) {
      onProfileUpdated(updated);
    }
  };

  const handleLoadAaravPreset = () => {
    storageService.loadDemoPreset();
    if (onProfileUpdated) onProfileUpdated(storageService.getStudentData());
  };

  const handleResetToNew = () => {
    storageService.resetToNewStudent();
    if (onProfileUpdated) onProfileUpdated(storageService.getStudentData());
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <CandidateProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentStudent={student}
        onProfileSaved={(updated) => {
          if (onProfileUpdated) onProfileUpdated(updated);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3500);
        }}
      />

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between gap-3 text-xs text-emerald-300 shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile and Career Role Targets successfully saved and updated!</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">SIH Telemetry Synced ✓</span>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-2xl relative overflow-hidden">
        <div className="relative group shrink-0">
          <img
            src={student?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={student?.name || 'Candidate'}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-brand-500/30 object-cover shadow-xl"
          />
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-brand-400">
            <User className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{student?.name || 'Candidate Name'}</h1>
                <button
                  type="button"
                  onClick={() => setIsEditingInline(!isEditingInline)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit3 className="w-3.5 h-3.5 text-brand-400" />
                  <span className="text-[11px] font-bold">{isEditingInline ? 'Close Form' : 'Edit Profile'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 font-medium mt-1">{student?.degree || 'Computer Science & Engineering'}</p>
              <p className="text-xs text-brand-400 font-semibold">{student?.college || 'Institute of Technology'}</p>
            </div>

            <div className="bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800 text-center shrink-0">
              <span className={`text-2xl sm:text-3xl font-black ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isVerified ? `${student?.careerReadiness}%` : '0%'}
              </span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                {isVerified ? 'Career Readiness' : 'Unverified (0%)'}
              </p>
            </div>
          </div>

          {/* Quick Contact & Links Badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{student?.email || 'candidate@university.edu'}</span>
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-400" />
              <span>Target: <strong className="text-white">{student?.targetRole || 'Full Stack Developer'}</strong></span>
            </span>

            {student?.github && (
              <a
                href={student.github}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-slate-400" />
                <span>GitHub</span>
              </a>
            )}

            {student?.linkedin && (
              <a
                href={student.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* =======================================================
          INLINE PROFILE EDIT FORM (Toggled by "Edit Profile")
      ======================================================= */}
      {isEditingInline && (
        <form
          onSubmit={handleSaveInline}
          className="bg-slate-900/95 border-2 border-brand-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Edit Candidate Profile & Career Track</h3>
                <p className="text-xs text-slate-400">Updates will sync across dashboard, skill gaps, and applications.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingInline(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <User className="w-3 h-3 text-brand-400" /> Full Name:
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Mail className="w-3 h-3 text-brand-400" /> Email Address:
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Phone className="w-3 h-3 text-brand-400" /> Phone Number:
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <School className="w-3 h-3 text-brand-400" /> College / University:
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-brand-400" /> Graduation Year:
              </label>
              <input
                type="number"
                min="2024"
                max="2030"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-brand-400" /> Degree & Branch:
              </label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-brand-400" /> Academic Semester:
              </label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Compass className="w-3 h-3 text-brand-400" /> Target Career Track / Job Role:
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {roleTracks.map((track) => (
                  <option key={track.id} value={track.title}>
                    {track.title} ({track.demand} Demand • Avg {track.avgStipend})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                Professional Bio / Objective:
              </label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief summary of your technical interests and career aspirations..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-1 lg:col-span-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Github className="w-3 h-3 text-slate-400" /> GitHub URL:
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/your-handle"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-1 lg:col-span-2">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-cyan-400" /> LinkedIn URL:
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/your-handle"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditingInline(false)}
              className="px-5 py-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* =======================================================
          TARGET CAREER TRACK & REQUIRED SKILL BATTERY
      ======================================================= */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
                TARGET CAREER TRACK
              </span>
              <span className="text-xs text-slate-400">{currentTrack.category}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">{currentTrack.title}</h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed mt-1">{currentTrack.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="role-select" className="text-xs text-slate-400 font-medium">Switch Role:</label>
            <select
              id="role-select"
              value={student?.targetRole || currentTrack.title}
              onChange={(e) => handleTrackChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold focus:ring-1 focus:ring-brand-500 focus:outline-none cursor-pointer"
            >
              {roleTracks.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Required Skills Battery Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Required Skills Battery ({currentTrack.requiredSkills.length} Skills to Prove):
            </h3>
            <span className="text-slate-400 text-[11px]">
              Industry Benchmark: Qualifying min score required per skill
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentTrack.requiredSkills.map((req) => {
              const verified = student?.verifiedSkills?.find(
                (v) =>
                  v.name.toLowerCase() === req.name.toLowerCase() ||
                  (v.skillId && v.skillId.toLowerCase() === req.id.toLowerCase())
              );
              const hasPassed = verified && verified.score >= req.minScore;

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    hasPassed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : verified
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{req.name}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        hasPassed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : verified
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {hasPassed ? 'Passed ✓' : verified ? 'Moderate Gap' : 'Not Attempted'}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Candidate Score:</span>
                      <strong className={hasPassed ? 'text-emerald-400' : verified ? 'text-amber-400' : 'text-slate-500'}>
                        {verified ? `${verified.score}%` : '0% (Unverified)'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Required Target:</span>
                      <strong className="text-brand-300">&ge;{req.minScore}%</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    {hasPassed ? (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified for this Role
                      </span>
                    ) : (
                      <Link
                        to={`/build-break-adapt?skill=${req.id}`}
                        className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs text-center block shadow-md shadow-brand-600/20 transition-all cursor-pointer"
                      >
                        {verified ? 'Retake to Improve Score →' : 'Take Skill Assessment →'}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =======================================================
          VERIFIED ASSESSMENT HISTORY & CREDENTIAL PASSPORT
      ======================================================= */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              Official Assessment History ({student?.verifiedSkills?.length || 0})
            </h3>
          </div>
          <Link to="/assessment" className="text-xs text-brand-400 font-bold hover:underline">
            + Take New Assessment
          </Link>
        </div>

        {isVerified ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {student.verifiedSkills.map((s) => (
              <div
                key={s.name}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800/90 flex items-center justify-between shadow-md"
              >
                <div>
                  <p className="font-bold text-white text-sm">{s.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Verified on {s.verifiedAt} • Level: <span className="text-brand-300 font-bold">{s.level}</span>
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {s.badge || 'Verified'} Badge
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">{s.score}%</span>
                  <p className="text-[10px] font-mono text-slate-400">Verified</p>
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
              Your profile score stays at 0% until you successfully complete a practical assessment. Choose any language to write code, survive the break mutation, and earn your verified passport badge!
            </p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all"
            >
              <Cpu className="w-4 h-4" />
              <span>Choose Language Assessment</span>
            </Link>
          </div>
        )}
      </div>

      {/* =======================================================
          DEMO PRESET CONTROLS FOR EVALUATION
      ======================================================= */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
        <h4 className="font-bold text-white text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" /> SIH Demonstration & Evaluation Controls
        </h4>
        <p className="text-slate-400 leading-relaxed">
          Switch between a fresh unverified student profile (0% score) to test the candidate onboarding flow, or load the pre-verified Aarav Sharma profile for rapid evaluation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleResetToNew}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all space-y-1 cursor-pointer"
          >
            <span className="text-amber-400 font-bold flex items-center gap-1 text-xs">
              <User className="w-3.5 h-3.5" /> Fresh Student Profile (0% Unverified)
            </span>
            <p className="text-[11px] text-slate-400">
              Starts with 0% score. Candidate creates profile, chooses language, takes test, and qualifies to unlock score.
            </p>
          </button>

          <button
            type="button"
            onClick={handleLoadAaravPreset}
            className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-brand-500/40 text-left transition-all space-y-1 cursor-pointer"
          >
            <span className="text-brand-300 font-bold flex items-center gap-1 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Aarav Sharma Demo Preset (84% Verified)
            </span>
            <p className="text-[11px] text-slate-400">
              Loads 4 verified skills, active passport hash, and pre-calculated internship matches for rapid evaluation.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
