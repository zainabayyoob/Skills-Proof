import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  AlertCircle,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Sparkles,
  BookOpen,
  User,
  Edit3,
  CodeXml,
  Database,
  Layers,
  Lock,
  Code2,
  Coffee,
  FileCode,
  Layout,
  Server,
  BarChart2,
  Compass,
  FileCode2,
} from 'lucide-react';
import { SkillCard } from '../components/SkillCard';
import { CandidateProfileModal } from '../components/CandidateProfileModal';
import { skillsCatalogue } from '../data/assessmentsData';
import { comprehensiveCareerRoles, getCareerRoleByTitle } from '../data/careerRolesData';
import { storageService } from '../services/storageService';

export const Dashboard = ({ student: propStudent, opportunities = [], applications = [], onProfileUpdated }) => {
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const student = propStudent || storageService.getStudentData();
  const verifiedSkills = student?.verifiedSkills || [];
  const isVerified = verifiedSkills.length > 0;
  const targetRoleTitle = student?.targetRole || "Full Stack Web Developer";
  const currentTrack = getCareerRoleByTitle(targetRoleTitle);

  const skillGaps = (student?.skillGaps && student.skillGaps.length > 0)
    ? student.skillGaps
    : storageService.calculateSkillGapsForRole(targetRoleTitle, verifiedSkills);

  const defaultRecommendedLearning = [
    {
      id: "rec-1",
      title: "Master Defensive SQL & NULL Handling (Alex The Analyst)",
      timeEst: "3 hours",
      difficulty: "Intermediate",
      description: "Learn zero-division guards and window partition functions from Alex The Analyst's industry bootcamp."
    },
    {
      id: "rec-2",
      title: "Asynchronous JavaScript & Event Loop (Chai aur Code)",
      timeEst: "4 hours",
      difficulty: "Intermediate",
      description: "Deep-dive into Promise.allSettled, async race conditions, and event loop microtask queues with Hitesh Choudhary."
    },
    {
      id: "rec-3",
      title: "Responsive Grid Architecture & Layouts (Kevin Powell)",
      timeEst: "2.5 hours",
      difficulty: "Foundational",
      description: "Eliminate layout breakage using CSS Grid auto-fit minmax and mobile-first responsive clamps."
    }
  ];

  const defaultRecommendedRoles = comprehensiveCareerRoles.slice(0, 3).map((track) => ({
    role: track.title,
    match: student?.careerReadiness ? Math.round(student.careerReadiness * 0.9) : 0,
    demand: track.demand,
    topMissing: track.requiredSkills.slice(0, 2).map((s) => `${s.name} (${s.minScore}%)`)
  }));

  const recommendedLearning = (student?.recommendedLearning && student.recommendedLearning.length > 0)
    ? student.recommendedLearning
    : defaultRecommendedLearning;

  const recommendedRoles = (student?.recommendedRoles && student.recommendedRoles.length > 0)
    ? student.recommendedRoles
    : defaultRecommendedRoles;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentStudent={student}
        onProfileSaved={(updated) => {
          if (onProfileUpdated) onProfileUpdated(updated);
        }}
      />

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  isVerified
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {isVerified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> SIH 2026 Verified Profile
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" /> Step 1 Complete: Assessment Pending
                  </>
                )}
              </span>
              <span className="text-xs text-slate-400">{student?.college || 'Institute of Technology'}</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {isVerified ? `Welcome back, ${student?.name || 'Candidate'}` : `Welcome, ${student?.name || 'Candidate'}`}
              </h1>
              <button
                onClick={() => setProfileModalOpen(true)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                title="Edit Name, College & Track"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-400" />
                <span className="hidden sm:inline text-[11px]">Edit Profile</span>
              </button>
            </div>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Don't Just Claim a Skill. <strong className="text-brand-300">Prove It.</strong>{' '}
              {isVerified
                ? 'Your verified capabilities are connected directly to industry opportunities.'
                : 'Start by choosing your programming language below. Pass the test to unlock your verified score and job matching!'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/build-break-adapt?skill=python"
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
              >
                <Cpu className="w-4 h-4" />
                <span>{isVerified ? 'Assess Another Skill' : 'Step 2: Start Python Assessment'}</span>
              </Link>
              <Link
                to={isVerified ? '/passport' : '/assessment'}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>{isVerified ? 'View SkillProof Passport' : 'Explore All Skills'}</span>
              </Link>
            </div>
          </div>

          {/* Career Readiness Score Card */}
          <div className="bg-slate-950/90 border border-brand-500/40 rounded-2xl p-6 shadow-2xl flex items-center gap-6 shrink-0">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isVerified ? 'text-emerald-400' : 'text-slate-700'}
                  strokeDasharray={`${student?.careerReadiness || 0}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white">
                  {isVerified ? `${student?.careerReadiness || 0}%` : '0%'}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">
                  {isVerified ? 'Readiness' : 'Unverified'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Career Readiness Score
              </p>
              <p className={`text-base font-extrabold mt-0.5 ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isVerified ? 'Verified Industry Tier' : 'Assessment Pending'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
                {isVerified
                  ? `Calculated across ${verifiedSkills.length} verified production assessments.`
                  : 'Score awarded only after qualifying a Build → Break → Adapt assessment.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* If Unverified: 4-Step Interactive Roadmap & Language Picker */}
      {!isVerified && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
                  SIH 2026 CANDIDATE ONBOARDING FLOW
                </span>
                <h2 className="text-xl font-black text-white mt-2">
                  Follow the 4 Steps to Unlock Placement & Internships:
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 hidden sm:block">Step 1 Complete ✓</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">STEP 1</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-white text-sm">Create Profile</h4>
                <p className="text-[11px] text-slate-400">
                  Candidate profile created for <strong>{student?.name || 'Candidate'}</strong>.
                </p>
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="text-[11px] text-brand-400 hover:underline font-semibold"
                >
                  Edit Profile →
                </button>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border-2 border-brand-500/60 shadow-lg shadow-brand-500/10 space-y-2 animate-pulse">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-400">STEP 2 (CURRENT)</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="font-bold text-white text-sm">Choose Skill or Language</h4>
                <p className="text-[11px] text-slate-300">
                  Select a programming language, stack, or domain assessment below.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">STEP 3</span>
                  <Cpu className="w-4 h-4 text-slate-500" />
                </div>
                <h4 className="font-bold text-slate-300 text-sm">Qualify Assessment</h4>
                <p className="text-[11px] text-slate-500">
                  Write solution, survive break mutation, and get analyzed.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 opacity-60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">STEP 4</span>
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <h4 className="font-bold text-slate-300 text-sm">Unlock Internships</h4>
                <p className="text-[11px] text-slate-500">
                  Receive verified score, passport hash, and 1-click apply!
                </p>
              </div>
            </div>
          </div>

          {/* Target Role Technical Skill Battery Checklist */}
          {(() => {
            const trackForBattery = getCareerRoleByTitle(targetRoleTitle);
            const verifiedCount = trackForBattery.requiredSkills.filter((req) =>
              verifiedSkills.some(
                (v) => v.name.toLowerCase() === req.name.toLowerCase() || (v.skillId && v.skillId.toLowerCase() === req.id.toLowerCase())
              )
            ).length;
            const totalCount = trackForBattery.requiredSkills.length;
            const progressPct = Math.round((verifiedCount / totalCount) * 100);

            return (
              <div className="bg-slate-900/90 border border-brand-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[11px] font-bold border border-brand-500/30 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-brand-400" />
                        Target Career Battery
                      </span>
                      <span className="text-xs text-slate-400">
                        Target Role: <strong className="text-white">{trackForBattery.title}</strong>
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white">
                      Technical Skills Required to Qualify for {trackForBattery.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {verifiedCount} / {totalCount} Verified
                      </span>
                      <div className="w-32 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 mt-1">
                        <div
                          className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill Battery Checklist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {trackForBattery.requiredSkills.map((req) => {
                    const verifiedSkill = verifiedSkills.find(
                      (v) => v.name.toLowerCase() === req.name.toLowerCase() || (v.skillId && v.skillId.toLowerCase() === req.id.toLowerCase())
                    );

                    return (
                      <div
                        key={req.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                          verifiedSkill
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{req.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              (Min {req.minScore}%)
                            </span>
                          </div>
                          <p className="text-[11px] mt-0.5 font-mono">
                            {verifiedSkill ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verified: {verifiedSkill.score}%
                              </span>
                            ) : (
                              <span className="text-amber-400">Unverified (Required)</span>
                            )}
                          </p>
                        </div>

                        {verifiedSkill ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                            Passed ✓
                          </span>
                        ) : (
                          <Link
                            to={`/build-break-adapt?skill=${req.id}`}
                            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all shrink-0 flex items-center gap-1"
                          >
                            <span>Take Test</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* All 10 Languages & Domains Assessment Catalogue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-brand-400" />
                  All Available Technical Assessments & Programming Languages ({skillsCatalogue.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Select any technical assessment or programming language below to prove your problem solving under production breaking mutations:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
              {skillsCatalogue.map((cat) => {
                const isSkillPassed = verifiedSkills.some(
                  (v) => v.name.toLowerCase() === cat.name.toLowerCase() || (v.skillId && v.skillId.toLowerCase() === cat.id.toLowerCase())
                );

                return (
                  <Link
                    key={cat.id}
                    to={`/build-break-adapt?skill=${cat.id}`}
                    className={`group p-4 bg-slate-900/80 hover:bg-slate-900 border rounded-2xl transition-all shadow-lg flex flex-col justify-between space-y-3 ${
                      isSkillPassed ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800 hover:border-brand-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-400">
                          {cat.category}
                        </span>
                        {isSkillPassed ? (
                          <span className="text-emerald-400 text-xs font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px] font-mono">15 mins</span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-white group-hover:text-brand-300 transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {cat.taskTitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-brand-400 group-hover:text-brand-300">
                      <span>{isSkillPassed ? 'Retake Test' : `Start ${cat.name} Test`}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Verified Skills Grid (Visible when student has verified skills) */}
      {isVerified && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-400" />
                Verified Skills ({verifiedSkills.length})
              </h2>
              <p className="text-xs text-slate-400">
                Evaluated under live breaking changes and mutation stress tests.
              </p>
            </div>
            <Link
              to="/assessment"
              className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>Assess More Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {verifiedSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      )}

      {/* Two Column: Skill Gaps & Recommended Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gaps Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Identified Skill Gaps
            </h3>
            <Link to="/skill-gap" className="text-xs font-bold text-brand-400 hover:underline">
              Deep Gap Analysis →
            </Link>
          </div>

          <div className="space-y-3">
            {skillGaps.map((gap) => (
              <div
                key={gap.skill}
                className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{gap.skill}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        gap.gap > 20
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {gap.gap}% Gap
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Current: <strong className="text-slate-200">{gap.currentScore}%</strong> / Target:{' '}
                    <strong>{gap.requiredScore}%</strong>
                  </p>
                </div>

                <Link
                  to="/roadmap"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors shrink-0"
                >
                  {gap.action}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Learning Roadmap */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Recommended Learning Actions
            </h3>
            <Link to="/roadmap" className="text-xs font-bold text-brand-400 hover:underline">
              View Complete Roadmaps →
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedLearning.map((rec) => (
              <div
                key={rec.id}
                className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-100">{rec.title}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40">
                    Est: {rec.timeEst}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">
                    Difficulty: {rec.difficulty}
                  </span>
                  <Link to="/roadmap" className="text-brand-400 hover:underline font-semibold">
                    Start Learning →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Career Roles & Top Matched Opportunity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Roles */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" />
              Recommended Career Roles
            </h3>
            <Link to="/skill-graph" className="text-xs font-bold text-brand-400 hover:underline">
              View Skill Graph →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendedRoles.map((role) => (
              <div
                key={role.role}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/40">
                    {role.match}% Match
                  </span>
                  <h4 className="font-bold text-sm text-white mt-2">{role.role}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Industry Demand: <strong className="text-slate-200">{role.demand}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  <span>To reach 100%: </span>
                  <span className="text-amber-300 font-medium">{(role.topMissing || []).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Matched Opportunity Snippet */}
        <div className="bg-gradient-to-br from-brand-950/40 via-slate-900 to-slate-950 border border-brand-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              Top Internship Match
            </span>
            <h3 className="text-lg font-bold text-white mt-2">
              Software Development Intern
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Apex Data Systems • ₹45,000 / month</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">91%</span>
              <span className="text-xs text-slate-400">Skill Verified Match</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Matching Python, SQL & React. Zero keyword guessing.
            </p>
          </div>

          <Link
            to="/opportunities"
            className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs text-center shadow-lg shadow-brand-600/30 transition-all"
          >
            Explore Matched Internships
          </Link>
        </div>
      </div>
    </div>
  );
};
