import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Sparkles,
  ShieldCheck,
  CodeXml,
  Cpu,
  Loader2,
  BarChart2,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { skillsCatalogue } from '../data/assessmentsData';

export const SkillQuizRunner = ({ onAssessmentCompleted }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal, refreshUser } = useAuth();

  const skillParam = searchParams.get('skill') || 'python';
  const catalogItem = skillsCatalogue.find((s) => s.id === skillParam) || skillsCatalogue[0];

  // Test state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Submission & Result state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const startNewTest = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);

    try {
      const data = await api.tests.startTest(skillParam);
      setTestData(data);
    } catch (err) {
      if (err.status === 401) {
        setError('Please sign in to begin a verified skill test.');
        openAuthModal('login');
      } else {
        setError(err.message || 'Failed to initialize test.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startNewTest();
  }, [skillParam]);

  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitTest = async () => {
    if (!testData) return;

    // Check if all questions are answered
    const unansweredCount = testData.questions.filter((q) => !selectedAnswers[q.id]).length;
    if (unansweredCount > 0) {
      if (!window.confirm(`You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await api.tests.submitTest(testData.attemptId, selectedAnswers);
      setResult(res);

      if (res.score >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      await refreshUser();
      if (onAssessmentCompleted) {
        onAssessmentCompleted(res.user);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit test.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-300">
          Randomizing question order & shuffling option positions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 my-12">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Assessment Notice</h3>
        <p className="text-sm text-slate-300">{error}</p>
        <div className="pt-2 flex items-center justify-center gap-3">
          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('login')}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30"
            >
              Sign In to Take Test
            </button>
          ) : (
            <button
              onClick={startNewTest}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Try Again
            </button>
          )}
          <Link
            to="/assessment"
            className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
          >
            Back to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  // ========================================================
  // RESULT & REVIEW SCREEN
  // ========================================================
  if (result) {
    const isPassed = result.score >= 70;

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
        {/* Result Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
              OFFICIAL ATTEMPT #{result.attemptNumber}
            </span>
            <span className="text-xs text-slate-400">
              Skill: <strong className="text-white">{catalogItem.name}</strong>
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {isPassed ? 'Skill Verified Successfully! 🎉' : 'Assessment Completed'}
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              {isPassed
                ? 'Your performance meets the verified threshold. This score has been minted to your database profile and passport.'
                : 'Review the explanations below, study the gap areas, and retake the test with a fresh randomized question set.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 py-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/90 text-center min-w-[120px]">
              <span className="text-xs text-slate-400 uppercase font-bold">Your Score</span>
              <p className={`text-4xl font-black ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {result.score}%
              </p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/90 text-center min-w-[120px]">
              <span className="text-xs text-slate-400 uppercase font-bold">Accuracy</span>
              <p className="text-4xl font-black text-brand-300">
                {result.correctCount}/{result.totalCount}
              </p>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/90 text-center min-w-[120px]">
              <span className="text-xs text-slate-400 uppercase font-bold">Verified Level</span>
              <p className="text-xl font-black text-white mt-2">
                {result.level}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startNewTest}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Test (New Questions & Randomized Options)</span>
            </button>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              View Updated Dashboard
            </Link>
            <Link
              to="/profile"
              className="px-6 py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              View Profile & History
            </Link>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" />
              Detailed Answer Explanations ({result.review.length})
            </h2>
            <span className="text-xs text-slate-400">
              Evaluated securely by backend engine
            </span>
          </div>

          <div className="space-y-4">
            {result.review.map((item, idx) => (
              <div
                key={item.questionId}
                className={`p-6 rounded-2xl border transition-all ${
                  item.isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-white">{item.question}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
                      item.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {item.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </>
                    )}
                  </span>
                </div>

                {item.codeSnippet && (
                  <pre className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-brand-300 overflow-x-auto">
                    <code>{item.codeSnippet}</code>
                  </pre>
                )}

                {/* Options Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs">
                  {item.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isSelected = item.selectedOptionId === opt.id;
                    const isRealCorrect = item.correctOptionId === opt.id;

                    let badgeColor = 'bg-slate-950/80 border-slate-800 text-slate-300';
                    if (isRealCorrect) {
                      badgeColor = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isRealCorrect) {
                      badgeColor = 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${badgeColor}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                            {letter}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isRealCorrect && (
                          <span className="text-[10px] font-bold uppercase text-emerald-400">
                            ✓ Correct Answer
                          </span>
                        )}
                        {isSelected && !isRealCorrect && (
                          <span className="text-[10px] font-bold uppercase text-rose-400">
                            ✕ Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-brand-400 uppercase tracking-wider text-[10px]">
                    Technical Rationale:
                  </span>
                  <p className="leading-relaxed">{item.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // ACTIVE TEST IN PROGRESS
  // ========================================================
  const currentQ = testData.questions[currentQuestionIndex];
  const totalQuestions = testData.questions.length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Status Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">
              {testData.skillName} Technical Assessment
            </h1>
            <p className="text-xs text-slate-400">
              Dynamic question bank • Randomized option layout
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-brand-300">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-brand-600 to-indigo-500 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">
            Concept Question #{currentQuestionIndex + 1}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        {currentQ.codeSnippet && (
          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-brand-300 overflow-x-auto shadow-inner">
            <code>{currentQ.codeSnippet}</code>
          </pre>
        )}

        {/* Randomized Options (A, B, C, D) */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedAnswers[currentQ.id] === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, option.id)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-950/60 border-brand-500 ring-2 ring-brand-500/30 text-white shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-sm font-medium leading-normal">
                    {option.text}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-600 text-white'
                      : 'border-slate-700'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-600/30 transition-all cursor-pointer"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitTest}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit for Backend Verification</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
