import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import {
  User,
  School,
  GraduationCap,
  Compass,
  ArrowRight,
  Mail,
  Calendar,
  Shield,
  Sparkles,
  Phone,
  Search,
  Check,
  FileText,
  Upload,
  Loader2,
  Trash2,
  Download,
  Layers,
  Tag,
  MapPin
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { comprehensiveCareerRoles, getCareerRoleById, getCareerRoleByTitle } from '../data/careerRolesData';
import { standardDegrees, academicYears, genders, getSemestersForDegree } from '../data/degreesData';
import { countryCodes, defaultCountryCode, validatePhoneNumber } from '../data/countryCodesData';
import { collegesDirectory, searchColleges } from '../data/collegesData';
import { technologyDomains, defaultPrimaryDomain, getDomainByIdOrName, getSuggestedRolesForDomain, getSecondaryInterestsForDomain } from '../data/domainsData';
import { api } from '../services/api';

export const CandidateProfileModal = ({ isOpen, onClose, onProfileSaved, currentStudent }) => {
  const [name, setName] = useState(currentStudent?.name || '');
  const [email, setEmail] = useState(currentStudent?.email || '');
  const [countryCode, setCountryCode] = useState(currentStudent?.countryCode || defaultCountryCode.dialCode);
  const [phone, setPhone] = useState(currentStudent?.phone || '');
  const [college, setCollege] = useState(currentStudent?.college || '');
  const [collegeId, setCollegeId] = useState(currentStudent?.collegeId || '');
  const [degree, setDegree] = useState(currentStudent?.degree || standardDegrees[0].name);
  const [academicYear, setAcademicYear] = useState(currentStudent?.academicYear || '3rd Year');
  const [semester, setSemester] = useState(currentStudent?.semester || '6th Semester');
  const [graduationYear, setGraduationYear] = useState(currentStudent?.graduationYear || 2026);
  const [gender, setGender] = useState(currentStudent?.gender || 'Prefer not to say');
  const [primaryDomain, setPrimaryDomain] = useState(() => {
    return getDomainByIdOrName(currentStudent?.domainId || currentStudent?.primaryDomain).name;
  });
  const [secondaryDomains, setSecondaryDomains] = useState(currentStudent?.secondaryDomains || []);
  const [professionalHeadline, setProfessionalHeadline] = useState(currentStudent?.professionalHeadline || '');
  const [location, setLocation] = useState(currentStudent?.location || 'India');
  const [targetRole, setTargetRole] = useState(() => {
    return getCareerRoleByTitle(currentStudent?.targetRoleId || currentStudent?.targetRole).title;
  });
  const [bio, setBio] = useState(currentStudent?.bio || '');
  const [github, setGithub] = useState(currentStudent?.github || '');
  const [linkedin, setLinkedin] = useState(currentStudent?.linkedin || '');

  // College dropdown
  const [collegeQuery, setCollegeQuery] = useState(currentStudent?.college || '');
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const collegeRef = useRef(null);

  // Resume state
  const [resume, setResume] = useState(currentStudent?.resume || null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const fileInputRef = useRef(null);

  // Status & error states
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever modal opens or currentStudent changes
  useEffect(() => {
    if (isOpen && currentStudent) {
      setName(currentStudent.name || '');
      setEmail(currentStudent.email || '');
      setCountryCode(currentStudent.countryCode || defaultCountryCode.dialCode);
      setPhone(currentStudent.phone || '');
      setCollege(currentStudent.college || '');
      setCollegeId(currentStudent.collegeId || '');
      setCollegeQuery(currentStudent.college || '');
      setDegree(currentStudent.degree || standardDegrees[0].name);
      setAcademicYear(currentStudent.academicYear || '3rd Year');
      setSemester(currentStudent.semester || '6th Semester');
      setGraduationYear(currentStudent.graduationYear || 2026);
      setGender(currentStudent.gender || 'Prefer not to say');
      const initDom = getDomainByIdOrName(currentStudent.domainId || currentStudent.primaryDomain);
      const initRole = getCareerRoleByTitle(currentStudent.targetRoleId || currentStudent.targetRole);
      setPrimaryDomain(initDom.name);
      setSecondaryDomains(Array.isArray(currentStudent.secondaryDomains) ? currentStudent.secondaryDomains : []);
      setProfessionalHeadline(currentStudent.professionalHeadline || '');
      setLocation(currentStudent.location || 'India');
      setTargetRole(initRole.title);
      setBio(currentStudent.bio || '');
      setGithub(currentStudent.github || '');
      setLinkedin(currentStudent.linkedin || '');
      setResume(currentStudent.resume || null);
      setErrorMsg('');
      setResumeError('');
    }
  }, [isOpen, currentStudent]);

  // Handle outside click for college suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (collegeRef.current && !collegeRef.current.contains(e.target)) {
        setCollegeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTrack =
    comprehensiveCareerRoles.find((r) => r.title === targetRole) || comprehensiveCareerRoles[0];

  const filteredColleges = searchColleges(collegeQuery);

  const handleSelectCollege = (col) => {
    if (col.id === 'other') {
      setCollegeId('other');
      setCollege(collegeQuery);
    } else {
      setCollegeId(col.id);
      setCollege(col.name);
      setCollegeQuery(col.name);
    }
    setCollegeDropdownOpen(false);
  };

  const handleResumeFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File size exceeds 5MB limit.');
      return;
    }

    // Check file extension
    const allowed = ['.pdf', '.doc', '.docx'];
    const lowerName = file.name.toLowerCase();
    if (!allowed.some((ext) => lowerName.endsWith(ext))) {
      setResumeError('Only PDF, DOC, and DOCX files are allowed.');
      return;
    }

    setResumeError('');
    setUploadingResume(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        try {
          const res = await api.profile.uploadResume({
            fileName: file.name,
            fileType: file.type,
            fileDataBase64: base64
          });
          if (res && res.resume) {
            setResume(res.resume);
          }
        } catch (apiErr) {
          setResumeError(apiErr.message || 'Failed to upload resume to server.');
        } finally {
          setUploadingResume(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setResumeError('Failed to read file data.');
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      await api.profile.deleteResume();
      setResume(null);
    } catch (err) {
      console.warn('Failed to delete resume:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Strict Phone Validation
    if (phone.trim()) {
      if (countryCode === '+91' && phone.replace(/\D/g, '').length !== 10) {
        setErrorMsg('Mobile number for India (+91) must be exactly 10 digits.');
        return;
      }
      const phoneValidation = validatePhoneNumber(countryCode, phone);
      if (!phoneValidation.valid) {
        setErrorMsg(phoneValidation.error);
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      name: name.trim(),
      email: email.trim() || 'candidate@university.edu',
      countryCode,
      phone: phone.trim().replace(/[\s\-()]/g, ''),
      college: collegeQuery.trim() || college.trim() || 'ABC Institute of Technology',
      collegeId: collegeId || null,
      degree: degree.trim(),
      academicYear: academicYear.trim(),
      semester: semester.trim(),
      graduationYear: Number(graduationYear) || 2026,
      gender: gender.trim(),
      domainId: getDomainByIdOrName(primaryDomain).id,
      primaryDomain: getDomainByIdOrName(primaryDomain).name,
      secondaryDomains,
      professionalHeadline: professionalHeadline.trim(),
      location: location.trim(),
      targetRoleId: getCareerRoleByTitle(targetRole).id,
      targetRole: getCareerRoleByTitle(targetRole).title,
      bio: bio.trim(),
      github: github.trim(),
      linkedin: linkedin.trim(),
      resume
    };

    let updated = storageService.updateStudentProfile(payload);

    if (api.auth.isAuthenticated()) {
      try {
        const res = await api.profile.update(payload);
        if (res && (res.user || res.profile)) {
          updated = res.user || res.profile;
        }
      } catch (err) {
        console.warn('API profile update error:', err);
        setErrorMsg(err.message || 'Failed to sync updates to backend server.');
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    if (onProfileSaved) {
      onProfileSaved(updated);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Profile & Target Role Settings"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-300">
          <p className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            SkillProof Permanent Candidate System
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Your standardized academic details, target career track, and resume are tied to your unique user ID and discoverable by authorized recruiters.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-400" /> Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Zainab Ayoob"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-400" /> Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. candidate@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
            />
          </div>
        </div>

        {/* Phone & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-400" /> Mobile Phone Number *
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-28 px-2 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.dialCode}>
                    {c.flag} {c.dialCode}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                maxLength={countryCode === '+91' ? 10 : 15}
                placeholder={countryCode === '+91' ? '10 digits' : 'Phone'}
                value={phone}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (countryCode === '+91') {
                    setPhone(raw.replace(/\D/g, '').slice(0, 10));
                  } else {
                    setPhone(raw.replace(/[^\d\s\-+]/g, '').slice(0, 15));
                  }
                }}
                className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* College Search Autocomplete */}
        <div className="space-y-1.5 relative" ref={collegeRef}>
          <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-brand-400" /> College / Institution *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Search college name (e.g. IIT, NIT, DTU...)"
              value={collegeQuery}
              onFocus={() => setCollegeDropdownOpen(true)}
              onChange={(e) => {
                setCollegeQuery(e.target.value);
                setCollege(e.target.value);
                setCollegeDropdownOpen(true);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs pr-8"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
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
                    <p className="text-[10px] text-slate-400">{c.city}, {c.state} • {c.tier}</p>
                  </div>
                  {collegeId === c.id && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Academic Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-slate-400" /> Degree
            </label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
            >
              {standardDegrees.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Academic Year
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
            >
              {academicYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Current Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
            >
              {getSemestersForDegree(degree).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Domain & Headline */}
        <div className="p-3.5 bg-slate-950 border border-brand-500/30 rounded-xl space-y-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-400" /> Primary Career Domain *
            </label>
            <select
              value={primaryDomain}
              onChange={(e) => {
                const dom = e.target.value;
                setPrimaryDomain(dom);
                const suggested = getSuggestedRolesForDomain(dom);
                if (suggested && suggested.length > 0) {
                  const resolved = getCareerRoleById(suggested[0]) || getCareerRoleByTitle(suggested[0]);
                  setTargetRole(resolved.title);
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none"
            >
              {technologyDomains.map((d) => (
                <option key={d.id} value={d.name}>{d.name} ({d.category})</option>
              ))}
            </select>
          </div>

          {/* Secondary Areas of Interest */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-400" /> Secondary Areas of Interest:
              </span>
              <span className="text-slate-400 font-mono">{secondaryDomains.length} selected</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {getSecondaryInterestsForDomain(primaryDomain).map((interest) => {
                const isSelected = secondaryDomains.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => {
                      setSecondaryDomains((prev) =>
                        prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
                      );
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-500/20 border-brand-500/50 text-brand-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {isSelected ? '✓ ' : ''}{interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Professional Headline & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Professional Headline</label>
            <input
              type="text"
              value={professionalHeadline}
              onChange={(e) => setProfessionalHeadline(e.target.value)}
              placeholder="e.g. Distributed Systems Engineer"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" /> Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bangalore, India"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Target Career Track */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand-400" /> Target Career Track (Auto-Suggested based on Domain):
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold"
          >
            {comprehensiveCareerRoles.map((track) => (
              <option key={track.id} value={track.title}>
                {track.title} ({track.category} • {track.demand} Demand)
              </option>
            ))}
          </select>
        </div>

        {/* Resume Management Card */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
              <FileText className="w-4 h-4 text-brand-400" /> Resume / CV (PDF / DOC / DOCX, $\le$ 5MB)
            </span>
            {resume && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {resume ? (
            <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="font-bold text-white text-xs">{resume.fileName}</p>
                  <p className="text-[10px] text-slate-400">{resume.fileSizeFormatted} • Verified</p>
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
                      setResumeError('Could not download resume.');
                    }
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-xl text-center cursor-pointer transition-colors bg-slate-900/40"
            >
              <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-300">Click to upload your resume</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Supports PDF, DOC, DOCX up to 5MB</p>
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
              <span>Validating and uploading resume to secure storage...</span>
            </div>
          )}

          {resumeError && (
            <p className="text-xs text-rose-400 font-medium">{resumeError}</p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Save Profile & Update Targets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
