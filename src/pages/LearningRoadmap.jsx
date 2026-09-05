import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Route as RouteIcon,
  CheckCircle2,
  Circle,
  BookOpen,
  Code2,
  Cpu,
  ArrowRight,
  Clock,
  Sparkles,
  Youtube,
  ExternalLink,
  Play,
  Award,
  Layers,
  Server,
  Database,
  FileCode,
  FileCode2,
  Layout,
  BarChart2,
  Coffee,
  Check,
  Compass,
  Filter
} from 'lucide-react';
import { roleTracks, famousMentorsCourses } from '../data/mockData';
import { storageService } from '../services/storageService';

const ICON_MAP = {
  python: FileCode2,
  sql: Database,
  c: Cpu,
  cpp: Code2,
  java: Coffee,
  javascript: FileCode,
  htmlcss: Layout,
  frontend: Layers,
  backend: Server,
  dataanalytics: BarChart2
};

const PRACTICE_CHALLENGES = {
  python: "Synthesize defensive type guards, sanitize NaN/inf floats, and normalize batch records without memory blowup.",
  sql: "Formulate defensive SQL queries with NULLIF division guards, window partitions, and zero-record handling.",
  c: "Prevent buffer overflow with bounded fgets/snprintf and validate pointer allocations against heap corruption.",
  cpp: "Construct normalized STL vector algorithms with clamp guards, reserve sizing, and empty collection resilience.",
  java: "Defend against NullPointerException using Optional/null-checks and build thread-safe stream reductions.",
  javascript: "Implement an asynchronous batch task runner with Promise.allSettled and race condition timeouts.",
  htmlcss: "Construct an accessible CSS Grid layout with auto-fit minmax responsive clamps and fallback zero-state.",
  frontend: "Implement an optimistic state manager with AbortController cancellation for rapid filter switches.",
  backend: "Build an express rate-limiter middleware with burst window sanitization and structured error handling.",
  dataanalytics: "Filter contaminated telemetry batches, calculate outlier Z-scores, and isolate churn rate trends."
};

const ROADMAP_STORAGE_KEY = 'skillproof_roadmap_progress_v4';

export const LearningRoadmap = ({ student: propStudent }) => {
  const [student, setStudent] = useState(propStudent || storageService.getStudentData());
  const [selectedFilter, setSelectedFilter] = useState('role'); // 'role' | 'all'
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (propStudent) setStudent(propStudent);
  }, [propStudent]);

  const toggleStep = (skillId, stepIndex) => {
    const key = `${skillId}-step-${stepIndex}`;
    const updated = { ...completedSteps, [key]: !completedSteps[key] };
    setCompletedSteps(updated);
    try {
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const targetRoleTitle = student?.targetRole || "Full Stack Web Developer";
  const currentTrack = roleTracks.find((r) => r.title === targetRoleTitle) || roleTracks[0];

  // Dynamic skill gaps for current role
  const roleGaps = storageService.calculateSkillGapsForRole(targetRoleTitle, student?.verifiedSkills || []);

  // All 10 skills list
  const allSkillsList = [
    { skill: "HTML / CSS", skillId: "htmlcss", requiredScore: 75 },
    { skill: "JavaScript", skillId: "javascript", requiredScore: 80 },
    { skill: "Frontend", skillId: "frontend", requiredScore: 80 },
    { skill: "Backend", skillId: "backend", requiredScore: 80 },
    { skill: "SQL", skillId: "sql", requiredScore: 75 },
    { skill: "Python", skillId: "python", requiredScore: 80 },
    { skill: "Data Analytics", skillId: "dataanalytics", requiredScore: 80 },
    { skill: "C", skillId: "c", requiredScore: 82 },
    { skill: "C++", skillId: "cpp", requiredScore: 82 },
    { skill: "Java", skillId: "java", requiredScore: 82 }
  ];

  const tracksToDisplay = selectedFilter === 'role'
    ? roleGaps
    : allSkillsList.map(s => {
        const verified = (student?.verifiedSkills || []).find(
          v => v.skillId === s.skillId || v.name.toLowerCase() === s.skill.toLowerCase()
        );
        const currentScore = verified ? verified.score : 0;
        const gap = Math.max(0, s.requiredScore - currentScore);
        return {
          skill: s.skill,
          skillId: s.skillId,
          currentScore,
          requiredScore: s.requiredScore,
          gap,
          status: gap === 0 ? "Verified" : gap <= 15 ? "Moderate Gap" : "Critical Gap"
        };
      });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              AUTOMATIC ROADMAP ENGINE
            </span>
            <span className="text-xs text-slate-400">
              Role: <strong className="text-white">{currentTrack.title}</strong>
            </span>
          </div>

          {/* Filter toggle */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedFilter('role')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedFilter === 'role'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Role Curriculum ({roleGaps.length})
            </button>
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All 10 Language Tracks
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Personalized 3-Stage Mastery Roadmap
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Every technical gap triggers a rigorous 3-stage loop:
            <strong className="text-brand-300"> 1. Learn</strong> from famous educators & certified lectures →
            <strong className="text-purple-300"> 2. Practice</strong> defensive edge cases →
            <strong className="text-amber-300"> 3. Reassess</strong> under live production break mutations in Build-Break-Adapt.
          </p>
        </div>
      </div>

      {/* Roadmaps List */}
      <div className="space-y-6">
        {tracksToDisplay.map((item, idx) => {
          const Icon = ICON_MAP[item.skillId] || Code2;
          const courses = famousMentorsCourses[item.skillId] || [];
          const topCourse = courses[0] || {
            channel: "Industry Certified Curriculum",
            title: `Defensive Architecture & Best Practices in ${item.skill}`,
            platform: "YouTube",
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill + ' course full')}`,
            duration: "Self-Paced",
            level: "Intermediate",
            tag: "Curated"
          };

          const isStep1Done = !!completedSteps[`${item.skillId}-step-0`];
          const isStep2Done = !!completedSteps[`${item.skillId}-step-1`];
          const isStep3Done = item.gap === 0 || !!completedSteps[`${item.skillId}-step-2`];

          const completedCount = (isStep1Done ? 1 : 0) + (isStep2Done ? 1 : 0) + (isStep3Done ? 1 : 0);
          const progressPercent = Math.round((completedCount / 3) * 100);
          const isVerified = item.gap === 0;

          return (
            <div
              key={item.skillId}
              className={`bg-slate-900/80 border rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl transition-all ${
                isVerified ? 'border-emerald-500/30' : 'border-slate-800'
              }`}
            >
              {/* Track Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl border ${
                    isVerified
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-brand-500/10 border-brand-500/30 text-brand-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black text-white">{item.skill}</h3>
                      {isVerified ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified ({item.currentScore}%)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                          Gap: {item.gap} pts (Current: {item.currentScore}% / Target: {item.requiredScore}%)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Target Role Benchmark: <span className="text-slate-200 font-semibold">{item.requiredScore}%</span> • Level: <span className="text-brand-300 font-medium">Production Resilience</span>
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Stage Progress</span>
                    <span className={`text-sm font-black font-mono ${progressPercent === 100 ? 'text-emerald-400' : 'text-brand-300'}`}>
                      {completedCount}/3 Completed ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-28 bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progressPercent === 100
                          ? 'bg-emerald-400'
                          : 'bg-gradient-to-r from-brand-500 to-emerald-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 3 Steps Grid: Learn -> Practice -> Reassess */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1: Learn */}
                <div
                  className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                    isStep1Done
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Step 1: Learn
                      </span>
                      <button
                        onClick={() => toggleStep(item.skillId, 0)}
                        title={isStep1Done ? "Mark Incomplete" : "Mark Complete"}
                        className="p-1 hover:text-white transition-colors"
                      >
                        {isStep1Done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-brand-300 font-semibold">
                        <Youtube className="w-4 h-4 text-red-400" />
                        <span>{topCourse.channel}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white leading-snug line-clamp-2">
                        {topCourse.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Platform: <strong className="text-slate-300">{topCourse.platform}</strong> • {topCourse.duration}
                      </p>
                      {topCourse.tag && (
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {topCourse.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <a
                      href={topCourse.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm group"
                    >
                      <Play className="w-3 h-3 group-hover:scale-110 transition-transform fill-current" />
                      <span>Watch Video Course</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => toggleStep(item.skillId, 0)}
                      className="text-[11px] text-slate-400 hover:text-white font-medium"
                    >
                      {isStep1Done ? 'Done ✓' : 'Mark Done'}
                    </button>
                  </div>
                </div>

                {/* Step 2: Practice */}
                <div
                  className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                    isStep2Done
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Step 2: Practice
                      </span>
                      <button
                        onClick={() => toggleStep(item.skillId, 1)}
                        title={isStep2Done ? "Mark Incomplete" : "Mark Complete"}
                        className="p-1 hover:text-white transition-colors"
                      >
                        {isStep2Done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-purple-300 font-semibold">
                        <Code2 className="w-4 h-4" />
                        <span>Defensive Edge-Case Sandbox</span>
                      </div>
                      <h4 className="font-bold text-sm text-white leading-snug">
                        Hands-On Implementation & Guards
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {PRACTICE_CHALLENGES[item.skillId] || "Implement resilient input validation, defensive guards, and exception handling before testing under chaos."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Edge-Case Mastery
                    </span>
                    <button
                      onClick={() => toggleStep(item.skillId, 1)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        isStep2Done
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {isStep2Done ? 'Completed ✓' : 'Mark Complete'}
                    </button>
                  </div>
                </div>

                {/* Step 3: Reassess under Build-Break-Adapt */}
                <div
                  className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                    isStep3Done
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Step 3: Reassess
                      </span>
                      {isStep3Done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                        <Sparkles className="w-4 h-4" />
                        <span>Build-Break-Adapt Evaluation</span>
                      </div>
                      <h4 className="font-bold text-sm text-white leading-snug">
                        {isVerified ? `${item.skill} Verified at ${item.currentScore}%` : `Prove ${item.skill} Capability`}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isVerified
                          ? "You have already demonstrated code reliability under production break mutations. You can retake anytime to boost your score."
                          : "Pass the 3-step live code test: baseline pass → inject break mutation → engineer defensive fix → earn verified score."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <Link
                      to={`/build-break-adapt?skill=${item.skillId}`}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                        isVerified
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white'
                      }`}
                    >
                      <span>{isVerified ? 'Retake & Boost' : 'Launch Assessment'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {isVerified && (
                      <span className="text-[11px] font-bold text-emerald-400">
                        Officially Verified ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional courses carousel row if more courses exist */}
              {courses.length > 1 && (
                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-400 mb-2 block">
                    Alternative Famous Coders & Tutorials for {item.skill}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {courses.slice(1).map((altCourse, cIdx) => (
                      <a
                        key={cIdx}
                        href={altCourse.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-colors group"
                      >
                        <div className="space-y-0.5 truncate">
                          <span className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Youtube className="w-3.5 h-3.5 text-red-400" />
                            {altCourse.channel}
                          </span>
                          <p className="font-semibold text-white truncate group-hover:text-brand-300">
                            {altCourse.title}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 font-medium">
                          {altCourse.duration}
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
