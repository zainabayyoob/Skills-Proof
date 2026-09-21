import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target,
  Route,
  Youtube,
  ExternalLink,
  Sparkles,
  BookOpen,
  Award,
  Video,
} from 'lucide-react';
import { famousMentorsCourses } from '../data/mockData';
import { getCareerRoleByTitle } from '../data/careerRolesData';
import { storageService } from '../services/storageService';
import { getSkillById } from '../data/skillsRegistry';

export const SkillGap = ({ student }) => {
  const targetRoleTitle = student?.targetRole || "Full Stack Web Developer";
  const currentTrack = getCareerRoleByTitle(targetRoleTitle);

  // Dynamically calculate gaps based on target role and verified skills
  const gapsAnalysis = storageService.calculateSkillGapsForRole(targetRoleTitle, student?.verifiedSkills || []);

  const totalRequired = gapsAnalysis.length;
  const verifiedCount = gapsAnalysis.filter((g) => g.gap === 0).length;
  const criticalGapsCount = gapsAnalysis.filter((g) => g.gap > 15).length;
  const avgVerifiedScore = student?.careerReadiness || 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
            TELEMETRY & GAP ANALYSIS
          </span>
          <span className="text-xs text-slate-400">
            Mapped to Target Role: <strong className="text-white">{currentTrack.title}</strong>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Real-Time Skill Gap Analysis & Renowned Mentor Curation
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          SkillProof continuously maps your verified performance against industry hiring thresholds for{' '}
          <strong className="text-emerald-400">{currentTrack.title}</strong>. For any identified deficiency, learn directly from famous educators and platforms, practice under simulated chaos, and prove your capabilities!
        </p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">Average Verified Level</span>
          <p className="text-3xl font-black text-emerald-400">{avgVerifiedScore}%</p>
          <p className="text-[11px] text-slate-400">
            {verifiedCount} of {totalRequired} skills officially verified
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">Target Role Benchmark</span>
          <p className="text-3xl font-black text-brand-300">80.0%</p>
          <p className="text-[11px] text-slate-400">{currentTrack.demand} hiring market demand</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">Gaps Requiring Action</span>
          <p className={`text-3xl font-black ${criticalGapsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {totalRequired - verifiedCount} Skills
          </p>
          <p className="text-[11px] text-slate-400">
            {criticalGapsCount > 0 ? `${criticalGapsCount} critical priority` : 'All benchmarks reached!'}
          </p>
        </div>
      </div>

      {/* Main Analysis Cards with Mentor Videos */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-brand-400" />
              Role Technical Competency Battery & Famous Coder Recommendations
            </h2>
            <p className="text-xs text-slate-400">
              Watch curated video courses from renowned coders to master concepts, then click "Take Practical Assessment".
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {gapsAnalysis.map((item) => {
            const hasNoGap = item.gap === 0;
            const mentorCourses = famousMentorsCourses[item.skillId] || [];
            const skillMeta = getSkillById(item.skillId);
            const isAssessmentAvailable = skillMeta ? skillMeta.hasAssessment : true;

            return (
              <div
                key={item.skill}
                className={`p-6 rounded-2xl border transition-all space-y-5 shadow-xl ${
                  hasNoGap
                    ? 'bg-slate-900/80 border-emerald-500/40'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{item.skill}</h3>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        hasNoGap
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.gap > 20
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {hasNoGap ? 'Verified ✓' : `${item.gap}% Gap (${item.status})`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="text-slate-400">
                        Current: <strong className="text-white">{item.currentScore}%</strong> / Target:{' '}
                        <strong className="text-brand-300">{item.requiredScore}%</strong>
                      </span>
                    </div>

                    {hasNoGap ? (
                      <Link
                        to={`/build-break-adapt?skill=${item.skillId}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30"
                      >
                        <span>Retake Test</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : !isAssessmentAvailable ? (
                      <Link
                        to={`/assessment?skill=${item.skillId}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/70 hover:border-brand-500/40"
                        title="Coding assessment for this skill is in development"
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span>In Dev • View Skill</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        to={`/build-break-adapt?skill=${item.skillId}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30"
                      >
                        <span>Prove {item.skill}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Progress Bar with Target Benchmark Marker */}
                <div className="space-y-1.5">
                  <div className="relative pt-1">
                    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          hasNoGap
                            ? 'bg-gradient-to-r from-brand-500 to-emerald-400'
                            : 'bg-gradient-to-r from-amber-500 to-brand-500'
                        }`}
                        style={{ width: `${item.currentScore}%` }}
                      />
                    </div>

                    {/* Benchmark Marker Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-400 flex flex-col items-center"
                      style={{ left: `${item.requiredScore}%` }}
                      title={`Required: ${item.requiredScore}%`}
                    >
                      <span className="text-[9px] font-bold text-rose-300 bg-slate-950 px-1 rounded -translate-y-4 shadow-sm border border-rose-900/40">
                        Target {item.requiredScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Famous Coders Video Tutorials & Courses */}
                {mentorCourses.length > 0 && (
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-rose-400" />
                        Curated Courses from Renowned Coders for {item.skill}:
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Free Quality Video Guides</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {mentorCourses.map((course, cIdx) => (
                        <a
                          key={cIdx}
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-3 rounded-xl bg-slate-950/90 hover:bg-slate-950 border border-slate-800/80 hover:border-brand-500 transition-all flex flex-col justify-between space-y-2.5 shadow-md"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-rose-400 flex items-center gap-1">
                                <Youtube className="w-3.5 h-3.5" />
                                {course.channel}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">{course.duration}</span>
                            </div>
                            <h5 className="font-bold text-xs text-white group-hover:text-brand-300 transition-colors leading-snug">
                              {course.title}
                            </h5>
                            <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                              {course.tag}
                            </span>
                          </div>

                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] font-bold text-brand-400 group-hover:text-brand-300">
                            <span>Watch on {course.platform}</span>
                            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
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

      {/* Bottom CTA to Roadmap */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-brand-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="font-bold text-white text-base">Mastered the concepts with our mentors?</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Take the Build → Break → Adapt practical assessments to earn verifiable proof on your SkillProof Passport.
          </p>
        </div>
        <Link
          to="/opportunities"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
        >
          <span>View Matched Internships</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
