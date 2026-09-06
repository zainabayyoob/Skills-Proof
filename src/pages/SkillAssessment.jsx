import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { assessmentModes, skillsCatalogue } from '../data/assessmentsData';
import { useAuth } from '../context/AuthContext';

export const SkillAssessment = ({ student: propStudent }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentStudent = user || propStudent;

  const [selectedSkill, setSelectedSkill] = useState(skillsCatalogue[0]);
  const [selectedMode, setSelectedMode] = useState(assessmentModes[1]);

  const handleLaunchCodeChallenge = () => {
    navigate(`/build-break-adapt?skill=${selectedSkill.id}&mode=${selectedMode.id}`);
  };

  const handleLaunchDynamicQuiz = () => {
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
        return <Layout className="w-5 h-5 text-rose-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-teal-400" />;
      case 'BarChart2':
        return <BarChart2 className="w-5 h-5 text-purple-400" />;
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
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          1. Choose Skill to Prove ({skillsCatalogue.length} Available):
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {skillsCatalogue.map((skill) => {
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
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
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
                  <p className="text-xs text-slate-400 mt-0.5">{skill.category}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 text-[10px] font-mono font-bold border border-brand-500/30">
                      {skill.concepts?.length || 3} Concepts
                    </span>
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
          <h4 className="text-base font-bold text-white">
            Ready to test: <span className="text-brand-400">{selectedSkill.name}</span> in{' '}
            <span className="text-emerald-400">{selectedMode.title}</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose between randomized technical knowledge assessment or the live interactive code challenge:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleLaunchDynamicQuiz}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Start Dynamic Knowledge Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleLaunchCodeChallenge}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-brand-400" />
            <span>Code Challenge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
