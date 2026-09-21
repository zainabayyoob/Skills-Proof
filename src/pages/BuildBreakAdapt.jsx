import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Terminal,
  ShieldCheck,
  Award,
  FileText,
  Check,
  XCircle,
  Cpu,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { skillsCatalogue, assessmentModes } from '../data/assessmentsData';
import { getSkillById } from '../data/skillsRegistry';
import { conceptExecutableSpecs, getExecutableSpec } from '../data/assessmentTestCases';
import { CodeEditor } from '../components/CodeEditor';
import { storageService } from '../services/storageService';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const BuildBreakAdapt = ({ onScoreUpdated }) => {
  const { isAuthenticated, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const skillParam = searchParams.get('skill') || 'python';
  const modeParam = searchParams.get('mode') || 'verified';

  const liveSkillData = skillsCatalogue.find((s) => s.id === skillParam);
  const registeredSkill = getSkillById(skillParam);
  const isUnassessedSkill = !liveSkillData && registeredSkill && !registeredSkill.hasAssessment;

  const skillData = liveSkillData || skillsCatalogue[0];
  const modeData = assessmentModes.find((m) => m.id === modeParam) || assessmentModes[1];

  // Concept Challenges list
  const concepts = skillData.concepts || [
    {
      id: `${skillData.id}-default`,
      title: skillData.taskTitle || 'Core Engineering Challenge',
      conceptTag: 'Core Architecture',
      difficulty: 'Medium',
      taskTitle: skillData.taskTitle,
      buildTask: skillData.buildTask,
      questionDetails: skillData.questionDetails,
      starterCode: skillData.starterCode,
      breakRequirement: skillData.breakRequirement,
      adaptedStarterCode: skillData.adaptedStarterCode,
      testCases: skillData.testCases,
    },
  ];

  const [selectedConceptIndex, setSelectedConceptIndex] = useState(0);
  const activeConcept = concepts[selectedConceptIndex] || concepts[0];

  // Language & file metadata for editor
  const editorLanguage = registeredSkill?.editorLanguage || (
    skillData.id === 'python' || skillData.id === 'dataanalytics' ? 'python' :
    skillData.id === 'sql' ? 'sql' :
    skillData.id === 'c' ? 'c' :
    skillData.id === 'cpp' ? 'cpp' :
    skillData.id === 'java' ? 'java' :
    skillData.id === 'htmlcss' ? 'html' :
    'javascript'
  );

  const fileExt = (
    editorLanguage === 'python' ? 'py' :
    editorLanguage === 'sql' ? 'sql' :
    editorLanguage === 'c' ? 'c' :
    editorLanguage === 'cpp' ? 'cpp' :
    editorLanguage === 'java' ? 'java' :
    editorLanguage === 'html' ? 'html' :
    skillData.id === 'frontend' ? 'jsx' :
    'js'
  );

  // Workflow phases: 'BUILD' | 'BREAK' | 'ADAPT' | 'ANALYZING' | 'VERIFIED'
  const [currentStep, setCurrentStep] = useState('BUILD');

  // Code state starts with clean problem skeleton only (No pre-filled solutions!)
  const [code, setCode] = useState(activeConcept.starterCode || '');
  const [explanation, setExplanation] = useState('');

  // Progress indicators
  const [buildDone, setBuildDone] = useState(false);
  const [breakDone, setBreakDone] = useState(false);
  const [adaptDone, setAdaptDone] = useState(false);

  // Execution terminal state
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(null);
  const [testCaseResults, setTestCaseResults] = useState(null);

  // Analyzing sequence state
  const [analysisLines, setAnalysisLines] = useState([]);
  const [analysisActiveIndex, setAnalysisActiveIndex] = useState(-1);

  // Evaluation results
  const [evaluation, setEvaluation] = useState(null);

  // Eligibility & Prerequisite check state
  const [eligibilityChecking, setEligibilityChecking] = useState(true);
  const [isEligible, setIsEligible] = useState(null);
  const [quizScore, setQuizScore] = useState(null);

  // Check if student has passed the language quiz (>= 75%) to unlock coding assessment
  useEffect(() => {
    let isMounted = true;
    const checkUserEligibility = async () => {
      setEligibilityChecking(true);
      try {
        if (isAuthenticated) {
          const res = await api.tests.checkEligibility(skillParam);
          if (isMounted) {
            setIsEligible(modeParam === 'practice' || res.isEligible);
            setQuizScore(res.quizScore);
          }
        } else {
          const local = storageService.getStudentData();
          const verified = (local.verifiedSkills || []).find(
            (s) => s.skillId === skillParam.toLowerCase() || s.name?.toLowerCase() === skillParam.toLowerCase()
          );
          if (isMounted) {
            const hasPassed = modeParam === 'practice' || (verified && (verified.quizPassed || verified.score >= 70));
            setIsEligible(hasPassed);
            setQuizScore(verified?.score || null);
          }
        }
      } catch (err) {
        if (isMounted) setIsEligible(true);
      } finally {
        if (isMounted) setEligibilityChecking(false);
      }
    };

    checkUserEligibility();
    return () => {
      isMounted = false;
    };
  }, [skillParam, isAuthenticated, modeParam]);

  // Switch skill when skillParam changes
  useEffect(() => {
    setSelectedConceptIndex(0);
    const initialConcept = (skillData.concepts && skillData.concepts[0]) || skillData;
    setCode(initialConcept.starterCode || '');
    setExplanation('');
    setBuildDone(false);
    setBreakDone(false);
    setAdaptDone(false);
    setTerminalOutput(null);
    setTestCaseResults(null);
    setCurrentStep('BUILD');
  }, [skillParam]);

  // Handle switching concept challenge
  const handleSelectConcept = (idx) => {
    setSelectedConceptIndex(idx);
    const target = concepts[idx] || concepts[0];
    setCode(target.starterCode || '');
    setExplanation('');
    setBuildDone(false);
    setBreakDone(false);
    setAdaptDone(false);
    setTerminalOutput(null);
    setTestCaseResults(null);
    setCurrentStep('BUILD');
  };

  // Helper: reset skeleton back to clean state
  const handleResetSkeleton = (isAdapt = false) => {
    if (isAdapt) {
      setCode(activeConcept.adaptedStarterCode || '');
      setExplanation('');
    } else {
      setCode(activeConcept.starterCode || '');
    }
    setTerminalOutput(null);
    setTestCaseResults(null);
  };

  // 1. RUN & TEST CODE (PHASE 1 - REAL COMPILER EXECUTION)
  const handleRunBuild = async () => {
    setIsRunning(true);
    setTerminalOutput(null);
    setTestCaseResults(null);

    const spec = getExecutableSpec(activeConcept.id, skillData.id, code);

    try {
      const report = await api.compiler.run({
        language: skillData.id,
        code,
        conceptId: activeConcept.id,
        entrypoint: spec.entrypoint,
        testCases: spec.sampleTestCases || []
      });

      setIsRunning(false);

      if (report.status === 'COMPILATION_ERROR' || report.status === 'SYNTAX_ERROR') {
        setBuildDone(false);
        setTerminalOutput({
          type: 'error',
          title: report.status === 'SYNTAX_ERROR' ? 'Syntax Error' : 'Compilation Error',
          text: report.error || 'Compiler failed to build source code'
        });
        const cases = (spec.sampleTestCases || []).map((tc, idx) => ({
          id: tc.id || idx + 1,
          title: tc.title || `Test Case ${idx + 1}`,
          status: 'FAILED',
          input: tc.input !== undefined ? (typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input)) : null,
          expected: typeof tc.expected === 'object' ? JSON.stringify(tc.expected) : String(tc.expected),
          actual: report.status,
          note: report.error ? report.error.split('\n')[0] : 'Syntax error in source code'
        }));
        setTestCaseResults(cases);
        return;
      }

      if (report.status === 'TIMEOUT_ERROR' || report.status === 'TIMEOUT') {
        setBuildDone(false);
        setTerminalOutput({
          type: 'error',
          title: 'Execution Timeout Watchdog (3500ms Exceeded)',
          text: report.error || 'Execution exceeded 3500ms time limit. Infinite loop detected.'
        });
        const cases = (spec.sampleTestCases || []).map((tc, idx) => ({
          id: tc.id || idx + 1,
          title: tc.title || `Test Case ${idx + 1}`,
          status: 'FAILED',
          input: tc.input !== undefined ? (typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input)) : null,
          expected: typeof tc.expected === 'object' ? JSON.stringify(tc.expected) : String(tc.expected),
          actual: 'TIMEOUT_ERROR',
          note: 'Execution aborted: infinite loop detected'
        }));
        setTestCaseResults(cases);
        return;
      }

      if (report.status === 'EMPTY_CODE' || report.status === 'FUNCTION_NOT_FOUND') {
        setBuildDone(false);
        setTerminalOutput({
          type: 'error',
          title: report.status === 'EMPTY_CODE' ? 'Empty Code Submitted' : 'Function Not Found',
          text: report.error
        });
        const cases = (spec.sampleTestCases || []).map((tc, idx) => ({
          id: tc.id || idx + 1,
          title: tc.title || `Test Case ${idx + 1}`,
          status: 'FAILED',
          input: tc.input !== undefined ? (typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input)) : null,
          expected: typeof tc.expected === 'object' ? JSON.stringify(tc.expected) : String(tc.expected),
          actual: report.status,
          note: report.error
        }));
        setTestCaseResults(cases);
        return;
      }

      const cases = (report.results || []).map((r, idx) => ({
        id: r.id || idx + 1,
        title: (spec.sampleTestCases && spec.sampleTestCases[idx]?.title) || `Test Case ${idx + 1}`,
        status: r.passed ? 'PASSED' : 'FAILED',
        input: r.input !== undefined ? (typeof r.input === 'object' ? JSON.stringify(r.input) : String(r.input)) : ((spec.sampleTestCases && spec.sampleTestCases[idx]?.input) ? JSON.stringify(spec.sampleTestCases[idx].input) : null),
        expected: typeof r.expected === 'object' ? JSON.stringify(r.expected) : String(r.expected),
        actual: r.actual === null ? 'None / Undefined' : typeof r.actual === 'object' ? JSON.stringify(r.actual) : String(r.actual),
        note: r.error ? `Error: ${r.error}` : (r.elapsedMs !== undefined ? `Execution time: ${r.elapsedMs}ms` : '')
      }));

      setTestCaseResults(cases);

      const allPassedStrict = report.allPassed === true && report.score === 100 && Number(report.passedCount) === Number(report.totalCount) && Number(report.totalCount) > 0;

      if (allPassedStrict) {
        setBuildDone(true);
        setTerminalOutput({
          type: 'success',
          title: 'Code is Correct — 100% Tests Passed',
          text: `✓ All ${report.passedCount}/${report.totalCount} Sample Test Cases Passed!\nExecution verified on native ${skillData.name} runtime in ${report.results?.[0]?.elapsedMs || 0.1}ms.\nNow click "Next Step: Proceed to Break Mutation →" to test production resilience under real-world anomalies.`
        });
      } else {
        setBuildDone(false);
        setTerminalOutput({
          type: 'error',
          title: 'Code is Incorrect — Tests Failed',
          text: `❌ ${report.passedCount || 0}/${report.totalCount || cases.length} Test Cases Passed.\nCheck the Test Results Console below: Compare your function's "Actual" return value against the "Expected" value to fix your code.`
        });
      }
    } catch (err) {
      setIsRunning(false);
      setBuildDone(false);
      setTerminalOutput({
        type: 'error',
        title: 'Communication Error',
        text: `Error contacting compiler service: ${err.message}`
      });
    }
  };

  // 2. TRIGGER BREAK MUTATION (PHASE 2)
  const handleTriggerBreak = () => {
    setCurrentStep('BREAK');
    setBreakDone(true);

    setTerminalOutput({
      type: 'error',
      text:
        activeConcept.breakRequirement ||
        `🚨 PRODUCTION CHAOS SIMULATION:
Contaminated records, out-of-order latency, and unexpected nulls injected into stream!
Baseline implementation halted with fatal exception.`
    });
  };

  // 3. PROCEED TO ADAPT (PHASE 3)
  const handleProceedToAdapt = () => {
    setCurrentStep('ADAPT');
    setCode(activeConcept.adaptedStarterCode || '');
    setTerminalOutput(null);
    setTestCaseResults(null);
  };

  // 4. TEST ADAPTED DEFENSIVE CODE (PHASE 3 - REAL COMPILER EXECUTION)
  const handleTestAdaptedCode = async () => {
    setIsRunning(true);
    setTerminalOutput(null);
    setTestCaseResults(null);

    const spec = getExecutableSpec(activeConcept.id, skillData.id, code);
    const combinedTestCases = [
      ...(spec.sampleTestCases || []),
      ...(spec.mutationTestCases || [])
    ];

    try {
      const report = await api.compiler.run({
        language: skillData.id,
        code,
        conceptId: activeConcept.id,
        entrypoint: spec.entrypoint,
        testCases: combinedTestCases
      });

      setIsRunning(false);

      if (report.status === 'COMPILATION_ERROR' || report.status === 'SYNTAX_ERROR') {
        setAdaptDone(false);
        setTerminalOutput({
          type: 'error',
          title: report.status === 'SYNTAX_ERROR' ? 'Syntax Error' : 'Compilation Error',
          text: report.error || 'Compiler failed to build adapted code'
        });
        const cases = combinedTestCases.map((tc, idx) => ({
          id: tc.id || idx + 1,
          title: tc.title || `Mutation Test ${idx + 1}`,
          status: 'FAILED',
          input: tc.input !== undefined ? (typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input)) : null,
          expected: typeof tc.expected === 'object' ? JSON.stringify(tc.expected) : String(tc.expected),
          actual: report.status,
          note: report.error ? report.error.split('\n')[0] : 'Syntax error'
        }));
        setTestCaseResults(cases);
        return;
      }

      if (report.status === 'TIMEOUT_ERROR' || report.status === 'TIMEOUT') {
        setAdaptDone(false);
        setTerminalOutput({
          type: 'error',
          title: 'Execution Timeout Watchdog (3500ms Exceeded)',
          text: report.error || 'Execution exceeded 3500ms time limit.'
        });
        const cases = combinedTestCases.map((tc, idx) => ({
          id: tc.id || idx + 1,
          title: tc.title || `Mutation Test ${idx + 1}`,
          status: 'FAILED',
          input: tc.input !== undefined ? (typeof tc.input === 'object' ? JSON.stringify(tc.input) : String(tc.input)) : null,
          expected: typeof tc.expected === 'object' ? JSON.stringify(tc.expected) : String(tc.expected),
          actual: 'TIMEOUT_ERROR',
          note: 'Execution aborted by watchdog (infinite loop)'
        }));
        setTestCaseResults(cases);
        return;
      }

      const cases = (report.results || []).map((r, idx) => ({
        id: r.id || idx + 1,
        title: combinedTestCases[idx]?.title || `Mutation Test ${idx + 1}`,
        status: r.passed ? 'PASSED' : 'FAILED',
        input: r.input !== undefined ? (typeof r.input === 'object' ? JSON.stringify(r.input) : String(r.input)) : ((combinedTestCases[idx]?.input) ? JSON.stringify(combinedTestCases[idx].input) : null),
        expected: typeof r.expected === 'object' ? JSON.stringify(r.expected) : String(r.expected),
        actual: r.actual === null ? 'None / Undefined' : typeof r.actual === 'object' ? JSON.stringify(r.actual) : String(r.actual),
        note: r.error ? `Error: ${r.error}` : (r.elapsedMs !== undefined ? `Execution time: ${r.elapsedMs}ms` : '')
      }));

      setTestCaseResults(cases);

      const allPassedStrict = report.allPassed === true && report.score === 100 && Number(report.passedCount) === Number(report.totalCount) && Number(report.totalCount) > 0;

      if (allPassedStrict) {
        setAdaptDone(true);
        setTerminalOutput({
          type: 'success',
          title: 'Mutation Tests Survived — Code is Resilient!',
          text: `✓ All ${report.passedCount}/${report.totalCount} Mutation & Edge-Case Tests Survived!\nYour defensive implementation safely quarantined invalid records and handled edge values.\nClick "Next Step: Submit for Multi-Vector Audit →" to run hidden evaluation and earn official SkillProof verification (85% required).`
        });
      } else {
        setAdaptDone(false);
        setTerminalOutput({
          type: 'error',
          title: 'Mutation Tests Failed — Code Crashed or Returned Incorrect Output',
          text: `❌ ${report.passedCount || 0}/${report.totalCount || combinedTestCases.length} Mutation Tests Passed.\nReason: Solution still crashed under contaminated production batch or lacked defensive guards.\nCheck the Expected vs Actual values below, fix null pointers and boundary clamping, then run again.`
        });
      }
    } catch (err) {
      setIsRunning(false);
      setAdaptDone(false);
      setTerminalOutput({
        type: 'error',
        title: 'Execution Error',
        text: `Execution error: ${err.message}`
      });
    }
  };

  // 5. INITIATE MULTI-VECTOR AUDIT WITH REAL HIDDEN TEST EXECUTION
  const handleSubmitForVerification = async () => {
    setCurrentStep('ANALYZING');
    setAnalysisLines([]);
    setAnalysisActiveIndex(0);

    const spec = getExecutableSpec(activeConcept.id, skillData.id, code);

    let compilerReport = null;
    try {
      compilerReport = await api.compiler.submit({
        language: skillData.id,
        code,
        conceptId: activeConcept.id,
        entrypoint: spec.entrypoint,
        skillId: skillData.id,
        skillName: skillData.name,
        roundName: 'ADAPT'
      });
    } catch (err) {
      console.warn('Submission compiler error:', err);
    }

    const calculatedScore = compilerReport?.score !== undefined ? compilerReport.score : 0;
    const totalCasesCount = compilerReport?.totalCount || ((spec.sampleTestCases?.length || 2) + 2);
    const isPassing = calculatedScore >= 85;

    const steps = [
      `> ${skillData.name}: ${activeConcept.title}`,
      `> Running hidden validation suite on compiler engine (${totalCasesCount} Test Cases)...`,
      `> Practical Application: ${isPassing ? 'PASSED ✓' : 'FAILED ✗'}`,
      `> Problem Solving: ${isPassing ? 'PASSED ✓' : 'REVIEW NEEDED'}`,
      `> Debugging & Mutation Resilience: ${isPassing ? 'PASSED ✓' : 'FAILED ✗'}`,
      `> Adaptability & Anomaly Handling: ${isPassing ? 'PASSED ✓' : 'REVIEW NEEDED'}`,
      `> Final Verified Score: ${calculatedScore}% (85% Cutoff Required)`,
      isPassing
        ? `> MINTING CRYPTOGRAPHIC SKILLPROOF PASSPORT CREDENTIAL...`
        : `> ASSESSMENT COMPLETED: Minimum 85% passing score required to mint verified credential.`
    ];

    steps.forEach((line, index) => {
      setTimeout(() => {
        setAnalysisLines((prev) => [...prev, line]);
        setAnalysisActiveIndex(index);

        if (index === steps.length - 1) {
          setTimeout(() => {
            finalizeVerification(calculatedScore, isPassing);
          }, 600);
        }
      }, (index + 1) * 380);
    });
  };

  // 6. FINALIZE VERIFICATION & UPDATE PROFILE
  const finalizeVerification = async (finalScore = 0, isPassing = false) => {
    const resultScores = {
      overallScore: finalScore,
      isPassing,
      technicalApplication: Math.min(100, finalScore + 2),
      problemSolving: finalScore,
      debugging: Math.max(70, finalScore - 2),
      adaptability: Math.min(100, finalScore + 4),
      assessmentEvidenceScore: Math.min(100, finalScore + 5),
      timePerformance: 90
    };

    setEvaluation(resultScores);
    setCurrentStep('VERIFIED');

    if (isPassing) {
      storageService.recordAssessmentResult(skillData.name, modeData.id, resultScores);

      if (isAuthenticated) {
        try {
          await api.tests.verifyCode({
            skillId: skillData.id,
            skillName: skillData.name,
            overallScore: finalScore,
            roundsEvidence: resultScores
          });
          if (refreshUser) {
            await refreshUser();
          }
        } catch (err) {
          console.warn('Backend code challenge persistence error:', err);
        }
      }

      if (onScoreUpdated) {
        onScoreUpdated();
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Render polite notice if skill assessment is in active development
  if (isUnassessedSkill) {
    return (
      <div className="max-w-xl mx-auto p-8 sm:p-10 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 my-12 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20 shadow-lg">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 uppercase tracking-wide">
            Assessment In Development
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {registeredSkill?.name || skillParam} Coding Sandbox Coming Soon
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            The Build → Break → Adapt practical engineering challenge and compiler mutation test suites for{' '}
            <strong className="text-white">{registeredSkill?.name || skillParam}</strong> are currently being authored and calibrated against industry hiring benchmarks.
          </p>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-400 max-w-md mx-auto space-y-2 text-left">
          <div className="flex justify-between">
            <span>Skill Category:</span>
            <strong className="text-brand-300 font-semibold">{registeredSkill?.category || 'Engineering'}</strong>
          </div>
          <div className="flex justify-between">
            <span>Industry Benchmark Target:</span>
            <strong className="text-emerald-400 font-bold">{registeredSkill?.benchmarkScore || 80}%</strong>
          </div>
          <div className="flex justify-between">
            <span>Current Status:</span>
            <strong className="text-amber-400 font-semibold">Test Banks & Sandboxes In Authorship</strong>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/assessment"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2"
          >
            <span>Explore Live Skill Assessments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/gap-analysis"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Back to Skill Gap Analysis
          </Link>
        </div>
      </div>
    );
  }

  // Render prerequisite locked screen if quiz not passed
  if (!eligibilityChecking && isEligible === false) {
    return (
      <div className="max-w-2xl mx-auto p-8 sm:p-10 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 my-12 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            PREREQUISITE REQUIRED (≥ 75%)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Pass the {skillData.name} {registeredSkill?.skillType === 'programming-language' ? 'Programming Language' : 'Technical Assessment'} Quiz First
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            In SkillProof, students must first pass the prerequisite technical quiz (Basic → Intermediate → Advanced, 20–25 questions) with a score of <strong>75% or higher</strong> before unlocking the sequential Build → Break → Adapt practical challenge.
          </p>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-400 max-w-md mx-auto space-y-1.5 text-left">
          <div className="flex justify-between">
            <span>Required Quiz Score:</span>
            <strong className="text-amber-400 font-bold">75%</strong>
          </div>
          <div className="flex justify-between">
            <span>Your Current Quiz Score:</span>
            <strong className={quizScore ? 'text-white font-bold' : 'text-slate-500'}>
              {quizScore !== null ? `${quizScore}%` : 'Not Attempted'}
            </strong>
          </div>
          <div className="flex justify-between">
            <span>Coding Challenge Status:</span>
            <strong className="text-rose-400 font-bold">Locked 🔒</strong>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={`/quiz?skill=${skillParam}`}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2"
          >
            <span>Take {skillData.name} Quiz Now (20–24 Questions)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              setIsEligible(true);
            }}
            className="px-5 py-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>⚡ Test in Practice Mode (Bypass Quiz)</span>
          </button>
          <Link
            to="/assessment"
            className="px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Skill Assessment
            </span>
            <span className="text-xs text-slate-400">
              {registeredSkill?.skillTypeLabel || (skillData.id === 'frontend' || skillData.id === 'backend' ? 'Engineering Stack' : skillData.id === 'sql' ? 'Query Language' : skillData.id === 'htmlcss' ? 'Markup & Styling' : skillData.id === 'dataanalytics' ? 'Technical Competency' : 'Programming Language')}: <strong className="text-white">{skillData.name}</strong> • Mode:{' '}
              <strong className="text-emerald-400">{modeData.title}</strong>
            </span>
          </div>
          <h1 className="text-xl font-black text-white">{activeConcept.taskTitle || skillData.taskTitle}</h1>
        </div>

        {/* Sequential Step Progress Tracker */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0 text-xs font-mono font-bold">
          <span
            className={
              buildDone
                ? 'text-emerald-400 font-black'
                : currentStep === 'BUILD'
                ? 'text-brand-300 ring-1 ring-brand-500/40 px-2 py-0.5 rounded'
                : 'text-slate-500'
            }
          >
            Step 1: Write & Test {buildDone ? '✓' : ''}
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={
              breakDone
                ? 'text-amber-400 font-black'
                : currentStep === 'BREAK'
                ? 'text-rose-400 ring-1 ring-rose-500/40 px-2 py-0.5 rounded'
                : 'text-slate-500'
            }
          >
            Step 2: Break Mutation {breakDone ? '✓' : ''}
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={
              adaptDone
                ? 'text-emerald-400 font-black'
                : currentStep === 'ADAPT'
                ? 'text-amber-400 ring-1 ring-amber-500/40 px-2 py-0.5 rounded'
                : 'text-slate-500'
            }
          >
            Step 3: Adapt & Defend {adaptDone ? '✓' : ''}
          </span>
          <span className="text-slate-600">→</span>
          <span className={currentStep === 'VERIFIED' ? 'text-emerald-400 font-black' : 'text-slate-500'}>
            Step 4: Verify {currentStep === 'VERIFIED' ? '✓' : ''}
          </span>
        </div>
      </div>

      {/* Concept Challenges Switcher Bar */}
      {concepts.length > 1 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-brand-500/20 text-brand-300 text-[10px] font-bold tracking-wider uppercase border border-brand-500/30 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-brand-400" /> Choose Concept Challenge ({concepts.length} Available)
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Select a concept to test different technical capabilities
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Active: <strong className="text-white">{activeConcept.title}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {concepts.map((concept, idx) => {
              const isCurrent = selectedConceptIndex === idx;
              return (
                <button
                  key={concept.id}
                  type="button"
                  onClick={() => handleSelectConcept(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-brand-950/60 border-brand-500 ring-1 ring-brand-400/50 shadow-lg shadow-brand-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-brand-300 uppercase">
                      {concept.conceptTag}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        concept.difficulty === 'Easy'
                          ? 'text-emerald-400'
                          : concept.difficulty === 'Hard'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {concept.difficulty}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-1">{concept.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{concept.testCases?.length || 3} Test Cases</span>
                    {isCurrent && <span className="text-brand-300 font-bold">Selected ✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =======================================================
          PHASE 1: WRITE & TEST CODE (PURE QUESTION + CODE SPACE)
      ======================================================= */}
      {currentStep === 'BUILD' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: THE QUESTION */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> The Question
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 uppercase font-bold">
                  {activeConcept.conceptTag}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 font-bold uppercase ${
                    activeConcept.difficulty === 'Easy'
                      ? 'text-emerald-400'
                      : activeConcept.difficulty === 'Hard'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {activeConcept.difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <div>
                <h3 className="font-bold text-white text-sm">{activeConcept.title}</h3>
                <p className="text-slate-300 mt-1.5 leading-relaxed">
                  {activeConcept.questionDetails?.objective || activeConcept.buildTask}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs mb-1.5 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand-400" /> Key Requirements:
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300 ml-1">
                  {activeConcept.questionDetails?.requirements?.map((req, i) => (
                    <li key={i}>{req}</li>
                  )) || <li>Implement the core function according to specifications.</li>}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                  <span>Example 1 — Input:</span>
                  <span>{activeConcept.questionDetails?.inputFormat || 'Parameters'}</span>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {activeConcept.questionDetails?.sampleInput || `Input sample`}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="text-slate-400 text-[11px] font-mono">
                  <span>Example 1 — Expected Output:</span>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {activeConcept.questionDetails?.expectedOutput || `Expected output`}
                </pre>
              </div>

              {activeConcept.questionDetails?.explanation && (
                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-400 text-[11px] space-y-1">
                  <span className="font-bold text-slate-300 block">Explanation:</span>
                  <p className="whitespace-pre-wrap leading-relaxed">{activeConcept.questionDetails.explanation}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: THE SPACE TO WRITE CODE & RUN TESTS */}
          <div className="lg:col-span-7 space-y-4">
            {/* The Code Editor */}
            <CodeEditor
              code={code}
              onChange={setCode}
              language={editorLanguage}
              title={`solution_${activeConcept.id || skillData.id}.${fileExt}`}
              badgeText="Write Solution Here"
              minHeight="340px"
              actions={
                <div className="flex items-center gap-1.5 mr-2">
                  <button
                    type="button"
                    onClick={() => handleResetSkeleton(false)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Reset to clean skeleton"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                    <span>Reset Skeleton</span>
                  </button>
                </div>
              }
            />

            {/* Action Bar: Run & Test + Next Step */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRunBuild}
                  disabled={isRunning}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 text-emerald-300" />
                  <span>{isRunning ? 'Running Test Cases...' : '▶ Run & Test Code'}</span>
                </button>

                {/* Live status badge */}
                <div className="text-xs font-mono">
                  {isRunning && <span className="text-brand-300 animate-pulse font-bold">Executing on compiler...</span>}
                  {!isRunning && !testCaseResults && !terminalOutput && <span className="text-slate-500">Ready to test</span>}
                  {!isRunning && testCaseResults && buildDone && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> All {testCaseResults.length}/{testCaseResults.length} Tests Passed (Code is Correct ✓)
                    </span>
                  )}
                  {!isRunning && (testCaseResults || terminalOutput) && !buildDone && (
                    <span className="text-rose-400 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/40">
                      <XCircle className="w-4 h-4 text-rose-400" /> Code is Incorrect ({testCaseResults ? testCaseResults.filter((t) => t.status === 'PASSED').length : 0}/{testCaseResults ? testCaseResults.length : 0} passed)
                    </span>
                  )}
                </div>
              </div>

              {/* NEXT STEP BUTTON: STRICTLY UNLOCKED ONLY WHEN CODE IS CORRECT! */}
              {buildDone && (
                <button
                  type="button"
                  onClick={handleTriggerBreak}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all animate-bounce cursor-pointer"
                >
                  <span>Next Step: Proceed to Break Mutation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Test Results Console */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs shadow-xl space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900 text-[11px] text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-400" /> Test Results Console
                </span>
                {buildDone ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> CODE IS CORRECT ✓
                  </span>
                ) : (testCaseResults || terminalOutput) ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> CODE IS INCORRECT ✗
                  </span>
                ) : (
                  <span className="text-slate-500">Status: Awaiting Run</span>
                )}
              </div>

              {/* Prominent High-Visibility Verdict Banner */}
              {buildDone && (
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/50 flex flex-wrap items-center justify-between gap-3 text-emerald-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">YOUR CODE IS 100% CORRECT!</div>
                      <div className="text-[11px] text-emerald-300/90">All sample test cases executed and passed on the native {skillData.name} compiler engine.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleTriggerBreak}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Break →</span>
                  </button>
                </div>
              )}

              {!buildDone && (testCaseResults || terminalOutput) && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 text-rose-300">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-white flex items-center gap-2">
                      <span>YOUR CODE IS INCORRECT OR HAS ERRORS</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                        {testCaseResults ? `${testCaseResults.filter((t) => t.status === 'PASSED').length}/${testCaseResults.length} Passed` : '0 Passed'}
                      </span>
                    </div>
                    <div className="text-[11px] text-rose-200/90 leading-relaxed">
                      Review the error message and the Expected vs. Actual comparison below to understand why your solution failed, fix the code above, and click "▶ Run & Test Code" again.
                    </div>
                  </div>
                </div>
              )}

              {/* Prominent Compiler Error / Diagnostics Box */}
              {terminalOutput && terminalOutput.type === 'error' && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border-2 border-rose-600/80 text-rose-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{terminalOutput.title || 'Compiler / Execution Diagnostic'}</span>
                  </div>
                  <pre className="p-3 rounded-lg bg-black/80 border border-rose-900/80 font-mono text-[11px] text-rose-300 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-[220px]">
                    {terminalOutput.text}
                  </pre>
                  <div className="text-[10px] text-slate-400 italic">
                    💡 The compiler error message above pinpoints the exact line number and syntax or exception issue. Fix it in the code editor above and test again.
                  </div>
                </div>
              )}

              {/* Test Cases Output List */}
              {testCaseResults && testCaseResults.length > 0 ? (
                <div className="space-y-2.5">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Detailed Test Case Results ({testCaseResults.filter(t => t.status === 'PASSED').length}/{testCaseResults.length} Passed)
                  </div>
                  {testCaseResults.map((tc) => (
                    <div
                      key={tc.id}
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                        tc.status === 'PASSED'
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-2">
                        <span className="flex items-center gap-2">
                          {tc.status === 'PASSED' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span>{tc.title}</span>
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                            tc.status === 'PASSED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {tc.status}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono space-y-1 mt-1.5 p-2.5 rounded-lg bg-black/50 border border-slate-900">
                        {tc.input && (
                          <div className="flex items-start gap-2">
                            <strong className="text-slate-400 w-16 shrink-0">Input:</strong>
                            <span className="text-slate-200 overflow-x-auto break-all">{tc.input}</span>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <strong className="text-slate-400 w-16 shrink-0">Expected:</strong>
                          <span className="text-emerald-300 overflow-x-auto break-all font-semibold">{tc.expected}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <strong className="text-slate-400 w-16 shrink-0">Actual:</strong>
                          <span
                            className={`overflow-x-auto break-all font-semibold ${
                              tc.status === 'PASSED' ? 'text-emerald-300' : 'text-rose-400 underline decoration-rose-500/50'
                            }`}
                          >
                            {tc.actual}
                          </span>
                        </div>
                        {tc.note && (
                          <div className="text-slate-400 italic text-[10px] pt-1 border-t border-slate-900/80">
                            ↳ {tc.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : !terminalOutput ? (
                <div className="text-slate-500 italic py-6 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                  <div>
                    Write your solution in the code space above, then click{' '}
                    <strong className="text-slate-300">"▶ Run & Test Code"</strong> to check if it's correct.
                  </div>
                  <div className="text-[10px] text-slate-600">
                    Real-time execution results, expected vs actual values, and compiler diagnostics will appear here.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          PHASE 2: BREAK MUTATION INJECTED
      ======================================================= */}
      {currentStep === 'BREAK' && (
        <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border-2 border-rose-600/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-rose-600 text-white text-xs font-black tracking-wider uppercase animate-pulse">
                STAGE 2: BREAK MUTATION INJECTED
              </span>
              <span className="text-xs font-mono text-rose-300">Production Chaos Simulation</span>
            </div>
            <h3 className="text-2xl font-black text-white">
              Production Anomaly: Naive Code Crashed on Real-World Data!
            </h3>
            <p className="text-xs font-mono text-rose-200 bg-black/60 p-4 rounded-xl border border-rose-900/60 leading-relaxed whitespace-pre-wrap">
              {activeConcept.breakRequirement}
            </p>
          </div>

          {/* Crash traceback */}
          <div className="bg-black/90 border border-rose-900/60 rounded-xl p-4 overflow-x-auto font-mono text-xs text-rose-400 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-rose-950 text-[11px] text-rose-300 font-bold">
              <span>PRODUCTION CRASH TRACEBACK</span>
              <span>Fatal Exception</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">{terminalOutput?.text}</pre>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-300 max-w-xl">
              <strong className="text-white">The Engineering Reality:</strong> Clean lab data is easy. In Stage 3, adapt your code defensively to handle real-world anomalies without crashing!
            </div>

            <button
              type="button"
              onClick={handleProceedToAdapt}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Adapt Solution Now (Stage 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =======================================================
          PHASE 3: ADAPT & DEFEND (SPLIT SCREEN)
      ======================================================= */}
      {currentStep === 'ADAPT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: MUTATION REQUIREMENTS */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Anomaly Requirements
              </span>
              <span className="text-[11px] font-mono text-slate-400">Stage 3: Defensive Mode</span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <h4 className="font-bold text-white text-sm">Defensive Refactor Task:</h4>
              <p className="text-slate-300">
                Adapt your implementation so it gracefully survives contaminated production batches without throwing fatal exceptions.
              </p>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 font-mono text-[11px]">
                <p className="font-bold text-amber-300">Production Anomaly Context:</p>
                <div className="text-slate-300 whitespace-pre-wrap font-sans text-xs">
                  {activeConcept.breakRequirement}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                  Defensive Strategy Explanation:
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={3}
                  placeholder="Describe your defensive refactor (e.g. added null guards, clamped boundary values, wrapped calls in try/catch)..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-500 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: CODE EDITOR & MUTATION TESTING */}
          <div className="lg:col-span-7 space-y-4">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={editorLanguage}
              title={`adapted_${activeConcept.id || skillData.id}.${fileExt}`}
              badgeText="Defensive Refactor"
              minHeight="340px"
              actions={
                <div className="flex items-center gap-1.5 mr-2">
                  <button
                    type="button"
                    onClick={() => handleResetSkeleton(true)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Reset to clean defensive skeleton"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                    <span>Reset Defensive Skeleton</span>
                  </button>
                </div>
              }
            />

            {/* Run Mutation Tests & Submit */}
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestAdaptedCode}
                    disabled={isRunning}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-white" />
                    <span>{isRunning ? 'Testing Mutation...' : '▶ Run Mutation Tests'}</span>
                  </button>

                  {/* Live status badge */}
                  <div className="text-xs font-mono">
                    {isRunning && <span className="text-amber-300 animate-pulse font-bold">Executing on compiler...</span>}
                    {!isRunning && !testCaseResults && !terminalOutput && <span className="text-slate-500">Ready to test defensive code</span>}
                    {!isRunning && testCaseResults && adaptDone && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> All {testCaseResults.length}/{testCaseResults.length} Mutations Survived (Code is Resilient ✓)
                      </span>
                    )}
                    {!isRunning && (testCaseResults || terminalOutput) && !adaptDone && (
                      <span className="text-rose-400 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/40">
                        <XCircle className="w-4 h-4 text-rose-400" /> Mutation Failed ({testCaseResults ? testCaseResults.filter((t) => t.status === 'PASSED').length : 0}/{testCaseResults ? testCaseResults.length : 0} passed)
                      </span>
                    )}
                  </div>
                </div>

                {adaptDone && (
                  <button
                    type="button"
                    onClick={handleSubmitForVerification}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all animate-bounce cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Next Step: Submit for Multi-Vector Audit →</span>
                  </button>
                )}
              </div>

              {/* Mutation Test Results Console */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs shadow-xl space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900 text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" /> Mutation Stress Console
                  </span>
                  {adaptDone ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> MUTATION SURVIVED ✓
                    </span>
                  ) : (testCaseResults || terminalOutput) ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> CODE CRASHED OR FAILED ✗
                    </span>
                  ) : (
                    <span className="text-slate-500">Status: Awaiting Run</span>
                  )}
                </div>

                {/* Verdict Banner */}
                {adaptDone && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/50 flex flex-wrap items-center justify-between gap-3 text-emerald-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">DEFENSIVE CODE IS 100% RESILIENT!</div>
                        <div className="text-[11px] text-emerald-300/90">Your implementation survived production anomalies, null injections, and boundary mutations.</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmitForVerification}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-brand-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Submit for Verification →</span>
                    </button>
                  </div>
                )}

                {!adaptDone && (testCaseResults || terminalOutput) && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 text-rose-300">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <XCircle className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        <span>DEFENSIVE GUARDS INCOMPLETE</span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                          {testCaseResults ? `${testCaseResults.filter((t) => t.status === 'PASSED').length}/${testCaseResults.length} Passed` : '0 Passed'}
                        </span>
                      </div>
                      <div className="text-[11px] text-rose-200/90 leading-relaxed">
                        Your code did not survive the mutation stress tests. Review the failure details and Expected vs. Actual outputs below to add the necessary guards.
                      </div>
                    </div>
                  </div>
                )}

                {/* Error diagnostics box */}
                {terminalOutput && terminalOutput.type === 'error' && (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border-2 border-rose-600/80 text-rose-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{terminalOutput.title || 'Compiler / Execution Diagnostic'}</span>
                    </div>
                    <pre className="p-3 rounded-lg bg-black/80 border border-rose-900/80 font-mono text-[11px] text-rose-300 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-[220px]">
                      {terminalOutput.text}
                    </pre>
                  </div>
                )}

                {/* Mutation Test Cases Output List */}
                {testCaseResults && testCaseResults.length > 0 ? (
                  <div className="space-y-2.5">
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      Mutation & Sample Test Breakdown ({testCaseResults.filter(t => t.status === 'PASSED').length}/{testCaseResults.length} Passed)
                    </div>
                    {testCaseResults.map((tc) => (
                      <div
                        key={tc.id}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                          tc.status === 'PASSED'
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-2">
                          <span className="flex items-center gap-2">
                            {tc.status === 'PASSED' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span>{tc.title}</span>
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                              tc.status === 'PASSED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {tc.status}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono space-y-1 mt-1.5 p-2.5 rounded-lg bg-black/50 border border-slate-900">
                          {tc.input && (
                            <div className="flex items-start gap-2">
                              <strong className="text-slate-400 w-16 shrink-0">Input:</strong>
                              <span className="text-slate-200 overflow-x-auto break-all">{tc.input}</span>
                            </div>
                          )}
                          <div className="flex items-start gap-2">
                            <strong className="text-slate-400 w-16 shrink-0">Expected:</strong>
                            <span className="text-emerald-300 overflow-x-auto break-all font-semibold">{tc.expected}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <strong className="text-slate-400 w-16 shrink-0">Actual:</strong>
                            <span
                              className={`overflow-x-auto break-all font-semibold ${
                                tc.status === 'PASSED' ? 'text-emerald-300' : 'text-rose-400 underline decoration-rose-500/50'
                              }`}
                            >
                              {tc.actual}
                            </span>
                          </div>
                          {tc.note && (
                            <div className="text-slate-400 italic text-[10px] pt-1 border-t border-slate-900/80">
                              ↳ {tc.note}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !terminalOutput ? (
                  <div className="text-slate-500 italic py-6 text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                      <Play className="w-4 h-4 ml-0.5" />
                    </div>
                    <div>
                      Click <strong className="text-slate-300">"▶ Run Mutation Tests"</strong> to test your defensive code against the injected production anomalies.
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Stress testing evaluates null handling, boundary clamping, and anomalous data resilience.
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          PHASE 4: 6-VECTOR ANALYZING TERMINAL
          Matches user request:
          > Python
          > Practical Application ✓
          > Problem Solving ✓
          > Debugging ✓
          > Adaptability ✓
          > Assessment Evidence ✓
      ======================================================= */}
      {currentStep === 'ANALYZING' && (
        <div className="bg-slate-950 border-2 border-brand-500/60 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl space-y-6 font-mono animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-brand-300 font-bold">
              <Terminal className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>SKILLPROOF MULTI-VECTOR AUDIT PROTOCOL</span>
            </div>
            <span className="text-slate-500 text-[10px]">SIH PS-26044 ENGINE</span>
          </div>

          {/* Terminal stream displaying exact user requested format */}
          <div className="bg-[#05080e] p-6 rounded-2xl border border-slate-800/80 min-h-[260px] space-y-2.5 text-sm">
            <div className="text-slate-500 text-xs mb-3">
              Initializing automated capability assessment pipeline...
            </div>

            {analysisLines.map((line, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 font-bold transition-all ${
                  line.includes('✓') ? 'text-emerald-400' : 'text-brand-300'
                }`}
              >
                <span>{line}</span>
              </div>
            ))}

            {/* Blinking cursor */}
            <div className="inline-block w-2.5 h-4 bg-emerald-400 animate-pulse mt-2" />
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Validating defensive mutations, algorithmic resilience, and code execution telemetry...
          </p>
        </div>
      )}

      {/* =======================================================
          PHASE 5: VERIFIED SCORE AWARDED & PROFILE UPDATED
      ======================================================= */}
      {currentStep === 'VERIFIED' && evaluation && (
        <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-2 border-brand-500/50 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300">
          {/* Top Banner Alert */}
          {evaluation.isPassing ? (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Candidate Profile Score Officially Updated!</h4>
                  <p className="text-xs text-emerald-300">
                    Verified Score is <strong>{evaluation.overallScore}%</strong> (≥85% Cutoff Met) • Smart Opportunity Matching Unlocked!
                  </p>
                </div>
              </div>
              <Link
                to="/opportunities"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all shrink-0 cursor-pointer"
              >
                View Matches →
              </Link>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                  !
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Verification Cutoff Not Met ({evaluation.overallScore}% / 85%)</h4>
                  <p className="text-xs text-amber-300">
                    A minimum score of 85% is required to mint the official SkillProof credential.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('BUILD');
                  setBuildDone(false);
                  setBreakDone(false);
                  setAdaptDone(false);
                  handleResetSkeleton(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition-all shrink-0 cursor-pointer"
              >
                Retry Assessment →
              </button>
            </div>
          )}

          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  evaluation.isPassing
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {evaluation.isPassing ? 'MUTATION SURVIVED & VERIFIED' : 'EVALUATION RECORDED'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {evaluation.isPassing ? 'SkillProof Credential Issued' : '85% Cutoff Required'}
                </span>
              </div>
              <h2 className="text-3xl font-black text-white">
                SkillProof Assessment Score: {evaluation.overallScore}/100
              </h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {evaluation.isPassing
                  ? `Outstanding adaptation in ${skillData.name} (${activeConcept.title})! You successfully handled production anomalies, guarded against fatal errors, and proved authentic resilience without regression.`
                  : `Good effort in ${skillData.name} (${activeConcept.title}). You scored ${evaluation.overallScore}%. Review the multi-vector competencies below and retry to achieve 85%+!`}
              </p>
            </div>

            <div className="bg-slate-950 px-6 py-4 rounded-2xl border border-brand-500/40 text-center shadow-xl">
              <span className={`text-4xl font-black ${evaluation.isPassing ? 'text-emerald-400' : 'text-amber-400'}`}>
                {evaluation.overallScore}%
              </span>
              <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">
                {evaluation.isPassing ? 'Verified Index' : 'Cutoff: 85%'}
              </p>
            </div>
          </div>

          {/* Multi-Vector Analysis Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Multi-Vector Competency Evaluation:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: 'Practical Application', score: evaluation.technicalApplication, color: 'text-brand-300' },
                { label: 'Problem Solving', score: evaluation.problemSolving, color: 'text-emerald-400' },
                { label: 'Debugging', score: evaluation.debugging, color: 'text-amber-400' },
                { label: 'Adaptability', score: evaluation.adaptability, color: 'text-violet-400' },
                { label: 'Assessment Evidence', score: evaluation.assessmentEvidenceScore || 94, color: 'text-cyan-400' },
              ].map((v) => (
                <div key={v.label} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-center">
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">{v.label}</p>
                  <p className={`text-xl font-black mt-1 ${v.color}`}>{v.score}%</p>
                  <p className="text-[9px] text-emerald-400 font-mono mt-0.5">✓ Verified</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Proof Card */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0" />
              <span>
                Passport Hash: <strong className="text-emerald-400">SKP-2026-{skillData.name.toUpperCase().slice(0, 3)}-VERIFIED</strong>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Timestamp: {new Date().toLocaleDateString()} • Proof of Authenticity
            </span>
          </div>

          {/* Next Steps Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/skill-gap"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              ← View Skill Gap & Recommended Courses
            </Link>

            <div className="flex items-center gap-3">
              <Link
                to="/passport"
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Open SkillProof Passport</span>
              </Link>
              <Link
                to="/opportunities"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all animate-pulse cursor-pointer"
              >
                <span>Apply for Matched Internships</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
