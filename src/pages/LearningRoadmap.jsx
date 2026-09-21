import React, { useState, useEffect, useMemo } from 'react';
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
  Filter,
  Shield,
  Terminal,
  Cloud,
  GitBranch,
  Brain,
  Lock,
  Box,
  Network,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { famousMentorsCourses } from '../data/mockData';
import { getCareerRoleByTitle, comprehensiveCareerRoles } from '../data/careerRolesData';
import { storageService } from '../services/storageService';
import {
  masterSkillsCatalogue,
  getSkillById,
  SKILL_CATEGORIES
} from '../data/skillsRegistry';
import { api } from '../services/api';

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
  dataanalytics: BarChart2,
  'machine-learning': Brain,
  'deep-learning': Cpu,
  numpy: FileCode2,
  pandas: BarChart2,
  statistics: BarChart2,
  'model-evaluation': Award,
  'data-visualization': BarChart2,
  'cybersecurity-fundamentals': Shield,
  'network-security': Network,
  'web-security': Lock,
  'auth-iam': Lock,
  cryptography: Shield,
  'vulnerability-assessment': Shield,
  'cloud-fundamentals': Cloud,
  'docker-containers': Box,
  kubernetes: Layers,
  'cicd-automation': RotateCcw,
  'linux-systems': Terminal,
  'git-version-control': GitBranch,
  'rest-apis': Server,
  typescript: FileCode2,
  'etl-pipelines': Database,
  'data-warehousing': Database,
  'qa-testing-fundamentals': CheckCircle2,
  'automation-testing': Terminal,
  'ui-design-systems': Layout,
  'smart-contracts': Code2,
  'embedded-rtos': Cpu
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

const getRolesRequiringSkill = (skillId) => {
  if (!skillId) return [];
  const cleanId = String(skillId).toLowerCase().trim();
  return comprehensiveCareerRoles.filter((role) =>
    role.requiredSkills?.some((req) => req.id.toLowerCase() === cleanId)
  );
};

export const LearningRoadmap = ({ student: propStudent }) => {
  const [student, setStudent] = useState(propStudent || storageService.getStudentData());
  const [selectedFilter, setSelectedFilter] = useState('role'); // 'role' | 'all'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | categoryGroup
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
      const localObj = saved ? JSON.parse(saved) : {};
      if (propStudent?.roadmapProgress && typeof propStudent.roadmapProgress === 'object') {
        return { ...localObj, ...propStudent.roadmapProgress };
      }
      return localObj;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (propStudent) {
      setStudent(propStudent);
      if (propStudent.roadmapProgress && typeof propStudent.roadmapProgress === 'object') {
        setCompletedSteps((prev) => ({ ...prev, ...propStudent.roadmapProgress }));
      }
    }
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
    if (api.auth.isAuthenticated()) {
      api.profile.update({ roadmapProgress: updated }).catch(() => {});
    }
  };

  const targetRoleIdentifier = student?.targetRoleId || student?.targetRole || "track-fullstack";
  const currentTrack = getCareerRoleByTitle(targetRoleIdentifier);

  // Dynamic skill gaps for current role
  const roleGaps = storageService.calculateSkillGapsForRole(targetRoleIdentifier, student?.verifiedSkills || []);

  const enrichedRoleGaps = useMemo(() => {
    return roleGaps.map((rg) => {
      const meta = getSkillById(rg.skillId);
      return {
        ...rg,
        hasAssessment: meta ? meta.hasAssessment : false,
        skillType: meta ? meta.skillType : 'domain-competency',
        skillTypeLabel: meta ? meta.skillTypeLabel : 'Technical Competency',
        categoryGroup: meta ? meta.categoryGroup : 'all',
        category: meta ? meta.category : 'General',
        concepts: meta?.concepts || [],
        requiredByRoles: getRolesRequiringSkill(rg.skillId)
      };
    });
  }, [roleGaps]);

  // All 38 canonical skills from registry
  const allCanonicalSkills = useMemo(() => {
    return masterSkillsCatalogue.map((s) => {
      const verified = (student?.verifiedSkills || []).find(
        (v) =>
          (v.skillId && v.skillId.toLowerCase() === s.id.toLowerCase()) ||
          (v.name && v.name.toLowerCase() === s.name.toLowerCase())
      );
      const currentScore = verified ? verified.score : 0;
      const requiredScore = s.benchmarkScore || 80;
      const gap = Math.max(0, requiredScore - currentScore);
      return {
        skill: s.name,
        skillId: s.id,
        currentScore,
        requiredScore,
        gap,
        status: gap === 0 ? "Verified" : gap <= 15 ? "Moderate Gap" : "Critical Gap",
        hasAssessment: s.hasAssessment,
        skillType: s.skillType,
        skillTypeLabel: s.skillTypeLabel,
        categoryGroup: s.categoryGroup,
        category: s.category,
        concepts: s.concepts || [],
        requiredByRoles: getRolesRequiringSkill(s.id)
      };
    });
  }, [student?.verifiedSkills]);

  const categoryFilterFn = (item, catId = selectedCategory) => {
    if (!catId || catId === 'all') return true;
    if (catId === 'programming-languages') {
      return item.skillType === 'programming-language' || item.skillTypeLabel === 'Programming Language';
    }
    if (catId === 'frameworks-stacks') {
      return item.skillType === 'framework-stack' || item.skillType === 'markup-styling' || item.categoryGroup === 'frameworks-stacks';
    }
    if (catId === 'query-data') {
      return item.skillType === 'query-language' || item.categoryGroup === 'query-data';
    }
    if (catId === 'cloud-infrastructure') {
      return item.categoryGroup === 'cloud-infrastructure' || item.skillType === 'infrastructure-tools';
    }
    if (catId === 'security-systems') {
      return item.categoryGroup === 'security-systems' || item.skillTypeLabel === 'Security & Systems';
    }
    return item.categoryGroup === catId;
  };

  const sourceList = selectedFilter === 'role' ? enrichedRoleGaps : allCanonicalSkills;
  const tracksToDisplay = useMemo(() => {
    return sourceList.filter((item) => categoryFilterFn(item, selectedCategory));
  }, [sourceList, selectedCategory]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
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
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedFilter === 'role'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Role Curriculum ({enrichedRoleGaps.length})
            </button>
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All 38 Skills Catalog ({allCanonicalSkills.length})
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
            <strong className="text-indigo-300"> 3. Reassess</strong> under live production break mutations in Build-Break-Adapt.
          </p>
        </div>

        {/* Category Filters */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-semibold text-xs flex items-center gap-1 pl-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-brand-400" /> Category:
          </span>
          {SKILL_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            const count = sourceList.filter((item) => categoryFilterFn(item, cat.id)).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer text-xs ${
                  isCatActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Zero State if filtered out */}
      {tracksToDisplay.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Skills Found in this Category</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            No skills in &quot;{SKILL_CATEGORIES.find(c => c.id === selectedCategory)?.label}&quot; are required for your selected view.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all cursor-pointer"
          >
            View All Categories
          </button>
        </div>
      )}

      {/* Roadmaps List */}
      <div className="space-y-6">
        {tracksToDisplay.map((item) => {
          const Icon = ICON_MAP[item.skillId] || Code2;
          const courses = famousMentorsCourses[item.skillId] || [];
          const hasDedicatedResources = courses.length > 0;
          const topCourse = courses[0] || null;

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
                      {item.skillTypeLabel && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-800/80 text-slate-300 border-slate-700/60">
                          {item.skillTypeLabel}
                        </span>
                      )}
                      {isVerified ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified ({item.currentScore}%)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                          Gap: {item.gap} pts (Current: {item.currentScore}% / Target: {item.requiredScore}%)
                        </span>
                      )}
                      {!hasDedicatedResources && (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Curated Path In Preparation
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Target Role Benchmark: <span className="text-slate-200 font-semibold">{item.requiredScore}%</span> • Level: <span className="text-brand-300 font-medium">Production Resilience</span>
                    </p>
                  </div>
                </div>

                {/* Progress / Status Header Column */}
                {hasDedicatedResources ? (
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
                ) : (
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Roadmap Status</span>
                    <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-800/40 inline-block mt-0.5">
                      Curriculum In Preparation
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body: Live 3-Stage Loop vs Preparation State */}
              {hasDedicatedResources ? (
                <>
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
                            className="p-1 hover:text-white transition-colors cursor-pointer"
                          >
                            {isStep1Done ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                            )}
                          </button>
                        </div>

                        {topCourse && (
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
                        )}
                      </div>

                      {topCourse && (
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <a
                            href={topCourse.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm group"
                          >
                            <Play className="w-3 h-3 text-red-400 group-hover:scale-110 transition-transform fill-current" />
                            <span>Watch Video Course</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-200" />
                          </a>
                          <button
                            onClick={() => toggleStep(item.skillId, 0)}
                            className="text-[11px] text-slate-400 hover:text-white font-medium cursor-pointer"
                          >
                            {isStep1Done ? 'Done ✓' : 'Mark Done'}
                          </button>
                        </div>
                      )}
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
                            className="p-1 hover:text-white transition-colors cursor-pointer"
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
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
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
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Step 3: Reassess
                          </span>
                          {isStep3Done ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-600" />
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
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
                </>
              ) : (
                /* Honest Preparation State for Skills Without Existing Resources */
                <div className="space-y-5">
                  {/* Status Banner */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-bold text-white">
                          Curated Learning Modules & Defensive Sandbox In Preparation
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                        Our technical team is actively vetting renowned instructors, architectural guides, and defensive break mutations for <strong className="text-slate-200">{item.skill}</strong>.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-semibold text-slate-300 shrink-0">
                      Benchmark: {item.requiredScore}% Passing Score
                    </span>
                  </div>

                  {/* Core Knowledge & Architecture Concepts from Registry */}
                  {item.concepts && item.concepts.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-brand-400" />
                        Core Architectural Competencies for {item.skill}:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {item.concepts.map((concept, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-brand-400 uppercase">
                                Focus 0{cIdx + 1}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">Core Topic</span>
                            </div>
                            <p className="text-xs font-semibold text-white leading-snug">
                              {concept.title || concept}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Target Career Tracks Requiring This Skill */}
                  {item.requiredByRoles && item.requiredByRoles.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-slate-400 font-semibold text-xs flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-slate-400" /> Required by Career Tracks:
                        </span>
                        {item.requiredByRoles.map((role) => (
                          <span
                            key={role.id}
                            className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700 text-[11px] font-medium"
                          >
                            {role.title}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/assessment?skill=${item.skillId}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 hover:border-brand-500/40 w-fit"
                      >
                        <span>Explore Assessment Specs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
