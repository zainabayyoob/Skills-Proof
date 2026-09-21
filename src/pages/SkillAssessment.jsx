import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Cpu,
  BookOpen,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  CodeXml,
  Database,
  Layers,
  Code2,
  Coffee,
  FileCode,
  Layout,
  Server,
  BarChart2,
  HelpCircle,
  Terminal,
  Award,
  RotateCcw,
  Compass,
  Clock,
} from 'lucide-react';
import { assessmentModes } from '../data/assessmentsData';
import { masterSkillsCatalogue, getRecommendedSkillsForStudent, getSkillById, SKILL_CATEGORIES, getSkillTypeLabel } from '../data/skillsRegistry';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';

export const SkillAssessment = ({ student: propStudent }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const skillParam = searchParams.get('skill');
  const { user } = useAuth();
  const currentStudent = user || propStudent || storageService.getStudentData();

  const studentDomainId = currentStudent?.domainId;
  const studentPrimaryDomain = currentStudent?.primaryDomain || 'Computer Science / Software Development';
  const studentSecondaryDomains = currentStudent?.secondaryDomains || [];
  const studentTargetRoleId = currentStudent?.targetRoleId;
  const studentTargetRole = currentStudent?.targetRole || 'Full Stack Developer';

  // Dynamic recommendation based on student's Domain & Career Track
  const recommendedSkills = useMemo(() => {
    return getRecommendedSkillsForStudent({
      domainId: studentDomainId,
      primaryDomain: studentPrimaryDomain,
      secondaryDomains: studentSecondaryDomains,
      targetRoleId: studentTargetRoleId,
      targetRole: studentTargetRole
    });
  }, [studentDomainId, studentPrimaryDomain, studentSecondaryDomains, studentTargetRoleId, studentTargetRole]);

  // Tab: 'recommended' (default) vs 'all'
  const [activeTab, setActiveTab] = useState(() => {
    if (skillParam) {
      const inRecommended = recommendedSkills.some((s) => s.id.toLowerCase() === skillParam.toLowerCase());
      if (!inRecommended && getSkillById(skillParam)) return 'all';
    }
    return 'recommended';
  });

  // Category filter state: 'all' | 'programming-languages' | 'frameworks-stacks' | 'query-data' | 'cloud-infrastructure' | 'security-systems'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const displayedSkills = useMemo(() => {
    // When viewing 'all' category, honor Recommended vs All view tabs
    if (selectedCategory === 'all') {
      return activeTab === 'recommended' ? recommendedSkills : masterSkillsCatalogue;
    }
    // When selecting a specific category filter, search across all 38 skills so user can explore every category
    return masterSkillsCatalogue.filter((s) => {
      if (selectedCategory === 'programming-languages') {
        return s.skillType === 'programming-language' || s.skillTypeLabel === 'Programming Language';
      }
      if (selectedCategory === 'frameworks-stacks') {
        return s.skillType === 'framework-stack' || s.skillType === 'markup-styling' || s.categoryGroup === 'frameworks-stacks';
      }
      if (selectedCategory === 'query-data') {
        return s.skillType === 'query-language' || s.categoryGroup === 'query-data';
      }
      if (selectedCategory === 'cloud-infrastructure') {
        return s.categoryGroup === 'cloud-infrastructure' || s.skillType === 'infrastructure-tools';
      }
      if (selectedCategory === 'security-systems') {
        return s.categoryGroup === 'security-systems' || s.skillTypeLabel === 'Security & Systems';
      }
      return s.categoryGroup === selectedCategory;
    });
  }, [activeTab, recommendedSkills, selectedCategory]);

  // Selected skill & mode state
  const [selectedSkill, setSelectedSkill] = useState(() => {
    if (skillParam) {
      const match = getSkillById(skillParam);
      if (match) return match;
    }
    return recommendedSkills[0] || masterSkillsCatalogue[0];
  });
  const [selectedMode, setSelectedMode] = useState(assessmentModes[1]);

  // Re-synchronize selected skill when student profile or recommendation changes
  useEffect(() => {
    if (skillParam) {
      const match = getSkillById(skillParam);
      if (match) {
        setSelectedSkill(match);
        return;
      }
    }
    if (!displayedSkills.some((s) => s.id === selectedSkill?.id)) {
      if (displayedSkills.length > 0) {
        setSelectedSkill(displayedSkills[0]);
      }
    }
  }, [displayedSkills, selectedSkill, skillParam]);

  const handleLaunchCodeChallenge = () => {
    if (!selectedSkill?.hasAssessment) return;
    navigate(`/build-break-adapt?skill=${selectedSkill.id}&mode=${selectedMode.id}`);
  };

  const handleLaunchDynamicQuiz = () => {
    if (!selectedSkill?.hasAssessment) return;
    navigate(`/quiz?skill=${selectedSkill.id}`);
  };

  const getSkillIcon = (iconName) => {
    switch (iconName) {
      case 'FileCode2':
        return <CodeXml className="w-5 h-5 text-brand-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-indigo-400" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'FileCode':
        return <FileCode className="w-5 h-5 text-yellow-400" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-pink-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-teal-400" />;
      case 'BarChart2':
        return <BarChart2 className="w-5 h-5 text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'CodeXml':
        return <CodeXml className="w-5 h-5 text-blue-400" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'RotateCcw':
        return <RotateCcw className="w-5 h-5 text-indigo-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Cpu className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
            PROVE A SKILL
          </span>
          <span className="text-xs text-slate-400">Step 1: Select Skill & Evaluation Mode</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Demonstrate Real Technical Capability
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Standard multiple-choice quizzes are easily cheated or memorized. SkillProof subjects your code
          to sudden production breaking changes to verify authentic adaptability.
        </p>
      </div>

      {/* 1. Skill Selection */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              1. Choose Skill to Prove ({displayedSkills.length} {activeTab === 'recommended' ? 'Relevant Skills for Your Career Track' : 'Total Available'}):
            </h2>
            <p className="text-xs text-brand-300 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>Career Track: <strong className="text-white">{studentTargetRole}</strong></span>
              <span>•</span>
              <span>Primary Domain: <strong className="text-white">{studentPrimaryDomain}</strong></span>
            </p>
          </div>

          {/* View Filter Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto shadow-inner">
            <button
              onClick={() => {
                setActiveTab('recommended');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'recommended' && selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Recommended for You ({recommendedSkills.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'all' && selectedCategory === 'all'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Skills ({masterSkillsCatalogue.length})
            </button>
          </div>
        </div>

        {/* Minimal Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {SKILL_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            const count = cat.id === 'all'
              ? (activeTab === 'recommended' ? recommendedSkills.length : masterSkillsCatalogue.length)
              : masterSkillsCatalogue.filter((s) => {
                  if (cat.id === 'programming-languages') return s.skillType === 'programming-language' || s.skillTypeLabel === 'Programming Language';
                  if (cat.id === 'frameworks-stacks') return s.skillType === 'framework-stack' || s.skillType === 'markup-styling' || s.categoryGroup === 'frameworks-stacks';
                  if (cat.id === 'query-data') return s.skillType === 'query-language' || s.categoryGroup === 'query-data';
                  if (cat.id === 'cloud-infrastructure') return s.categoryGroup === 'cloud-infrastructure' || s.skillType === 'infrastructure-tools';
                  if (cat.id === 'security-systems') return s.categoryGroup === 'security-systems' || s.skillTypeLabel === 'Security & Systems';
                  return s.categoryGroup === cat.id;
                }).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isCatActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-1 ring-brand-400'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {displayedSkills.map((skill) => {
            const isSelected = selectedSkill.id === skill.id;
            const userSkill = currentStudent?.verifiedSkills?.find(
              (v) => (v.skillId && v.skillId.toLowerCase() === skill.id.toLowerCase()) ||
                     v.name.toLowerCase() === skill.name.toLowerCase()
            );
            const userScore = userSkill ? userSkill.score : 0;
            return (
              <button
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-brand-950/50 border-brand-500 shadow-xl shadow-brand-500/15'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                      {getSkillIcon(skill.icon)}
                    </div>
                    <span className={`text-xs font-mono font-bold ${userSkill ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {userSkill ? `Verified: ${userScore}%` : 'Unverified (0%)'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white">{skill.name}</h3>
                  <div className="mt-1 mb-1.5 flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                      (skill.skillTypeLabel === 'Programming Language' || skill.skillType === 'programming-language')
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : (skill.skillTypeLabel === 'Engineering Stack' || skill.skillType === 'framework-stack')
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : (skill.skillTypeLabel === 'Query Language' || skill.skillType === 'query-language')
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : (skill.skillTypeLabel === 'Markup & Styling' || skill.skillType === 'markup-styling')
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : (skill.skillTypeLabel === 'Infrastructure & Tools' || skill.skillType === 'infrastructure-tools')
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : (skill.skillTypeLabel === 'Security & Systems')
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    }`}>
                      [{skill.skillTypeLabel || getSkillTypeLabel(skill)}]
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{skill.category}</p>
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 text-[10px] font-mono font-bold border border-brand-500/30">
                      {skill.concepts?.length || 3} Concepts
                    </span>
                    {!skill.hasAssessment && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[9px] font-mono font-medium border border-slate-700/60">
                        In Dev
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Benchmark: {skill.benchmarkScore}%</span>
                  {isSelected && (
                    <span className="text-brand-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" /> Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Assessment Modes (Visually Distinct) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          2. Select Evaluation Mode:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mode A: Practice Mode */}
          <div
            onClick={() => setSelectedMode(assessmentModes[0])}
            className={`cursor-pointer rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
              selectedMode.id === 'practice'
                ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 uppercase">
                  Mode A
                </span>
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Practice Mode</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                External tools and AI assistants are explicitly allowed. Ideal for learning, experimenting,
                and testing without risk.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-blue-300 font-medium">
              ✓ AI & Docs Allowed • Non-Ranked
            </div>
          </div>

          {/* Mode B: SkillProof Verified (Recommended) */}
          <div
            onClick={() => setSelectedMode(assessmentModes[1])}
            className={`cursor-pointer rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
              selectedMode.id === 'verified'
                ? 'bg-indigo-950/60 border-brand-400 ring-2 ring-brand-500/40 shadow-2xl shadow-brand-500/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="absolute top-0 right-0 bg-brand-600 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
              Recommended
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-brand-500/20 text-brand-300 text-[10px] font-bold border border-brand-500/30 uppercase">
                  Mode B
                </span>
                <ShieldCheck className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="text-lg font-extrabold text-white">SkillProof Verified</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Controlled practical assessment. Undergoes automated production breaking mutations.
                Results are added to your digital **SkillProof Passport**.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Official Verification & Passport Stamp</span>
            </div>
          </div>

          {/* Mode C: AI-Assisted Mode */}
          <div
            onClick={() => setSelectedMode(assessmentModes[2])}
            className={`cursor-pointer rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
              selectedMode.id === 'ai_assisted'
                ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30 shadow-xl'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 uppercase">
                  Mode C
                </span>
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-extrabold text-white">AI-Assisted Mode</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                AI generation is explicitly encouraged! However, you must critically inspect, debug,
                and adapt the code when production mutations strike.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-purple-300 font-medium">
              ✓ Evaluates Code Audit & Fix Rationale
            </div>
          </div>
        </div>
      </div>

      {/* Launch Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
            <span>Ready to test: <span className="text-brand-400">{selectedSkill.name}</span> <span className="text-xs text-slate-400 font-normal">({selectedSkill.skillTypeLabel || getSkillTypeLabel(selectedSkill)})</span> in{' '}
            <span className="text-emerald-400">{selectedMode.title}</span></span>
            {!selectedSkill.hasAssessment && (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                Curriculum Under Development
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            {selectedSkill.hasAssessment
              ? "Choose between randomized technical knowledge assessment or the live interactive code challenge:"
              : "Official assessment modules & question banks for this specialized skill are currently in curriculum development. You can assess live core skills (Python, SQL, JavaScript, Frontend, Backend, etc.)."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {selectedSkill.hasAssessment ? (
            <>
              <button
                onClick={handleLaunchDynamicQuiz}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Start {selectedSkill.skillType === 'programming-language' ? 'Language' : 'Technical'} Knowledge Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleLaunchCodeChallenge}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-brand-400" />
                <span>Code Challenge</span>
              </button>
            </>
          ) : (
            <button
              disabled
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-400 font-semibold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-2 shadow-inner"
              title="Assessment in active development for this skill"
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Assessment Coming Soon</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
