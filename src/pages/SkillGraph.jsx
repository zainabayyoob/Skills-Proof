import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowDown,
  ArrowRight,
  Sparkles,
  Award,
  Briefcase,
  BookOpen,
  Youtube,
  ExternalLink,
  Target
} from 'lucide-react';
import { famousMentorsCourses } from '../data/mockData';
import { getCareerRoleByTitle } from '../data/careerRolesData';
import { storageService } from '../services/storageService';

export const SkillGraph = ({ student: propStudent }) => {
  const student = propStudent || storageService.getStudentData();
  const targetRoleTitle = student?.targetRole || "Full Stack Web Developer";
  const currentTrack = getCareerRoleByTitle(targetRoleTitle);

  const gapsAnalysis = storageService.calculateSkillGapsForRole(targetRoleTitle, student?.verifiedSkills || []);
  const verifiedList = student?.verifiedSkills || [];
  const opportunities = storageService.getOpportunities();

  // Matched opportunities for this role
  const matchedOpps = opportunities.filter((o) => {
    const oppTrack = (o.category || '').toLowerCase();
    const roleCat = (currentTrack.category || '').toLowerCase();
    return oppTrack.includes(roleCat) || roleCat.includes(oppTrack) || (o.title || '').toLowerCase().includes(currentTrack.title.toLowerCase().split(' ')[0]);
  });
  const primaryOpp = matchedOpps[0] || opportunities[0];

  const missingSkills = gapsAnalysis.filter(g => g.gap > 0);
  const verifiedSkills = gapsAnalysis.filter(g => g.gap === 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
            COMPETENCY PIPELINE MAP
          </span>
          <span className="text-xs text-slate-400">SIH 2026 Core Graph Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Visual Skill Graph: Real-Time Competency Pipeline
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          See how your verified skills directly link to your chosen career role (
          <strong className="text-brand-300">{currentTrack.title}</strong>), expose critical missing competencies,
          trigger curated learning roadmaps from famous coders, and unlock matched industry opportunities.
        </p>
      </div>

      {/* Visual Flow Container */}
      <div className="space-y-6">
        {/* Node 1: Student Verified Skills */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-400"></span>
              Level 1: Candidate Technical Battery ({currentTrack.title})
            </span>
            <span className="text-[11px] text-slate-400">{student?.name || 'Student Candidate'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {currentTrack.requiredSkills.map((req) => {
              const verified = verifiedList.find(v => v.skillId === req.id || v.name.toLowerCase() === req.name.toLowerCase());
              const isVerified = verified && verified.score >= req.minScore;
              return (
                <div
                  key={req.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                    isVerified
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : verified
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                      : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{req.name}</span>
                    {isVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : verified ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono">
                    {isVerified
                      ? `${verified.score}% (Verified)`
                      : verified
                      ? `${verified.score}% (Need ${req.minScore}%)`
                      : 'Unverified ✕'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connector Line */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-brand-400">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Node 2: Target Career Role */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              Level 2: Target Industry Career Role
            </span>
            <span className="text-xs text-emerald-400 font-bold">
              {student?.careerReadiness || 0}% Career Readiness Match
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-brand-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">{currentTrack.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Benchmark Battery: {currentTrack.requiredSkills.map(s => `${s.name} (≥${s.minScore}%)`).join(', ')}
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 self-start sm:self-center">
              Active Focus Target
            </span>
          </div>
        </div>

        {/* Connector Line */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-rose-400">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Node 3: Skill Gaps Identified */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Level 3: Delta Gap Analysis (Missing for this role)
            </span>
            <span className="text-[11px] text-slate-400">
              {missingSkills.length} Action Items Required
            </span>
          </div>

          {missingSkills.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>All technical benchmarks for {currentTrack.title} are fulfilled! Ready for tier-1 placement.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {missingSkills.map((m) => (
                <div
                  key={m.skillId}
                  className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-rose-200">{m.skill}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Current: {m.currentScore}% • Benchmark: {m.requiredScore}% (Gap: {m.gap} pts)
                    </p>
                  </div>
                  <Link
                    to={`/build-break-adapt?skill=${m.skillId}`}
                    className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold border border-rose-500/30 transition-colors"
                  >
                    Prove Skill →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connector Line */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Node 4: Recommended Learning Track with Famous Mentors */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Level 4: Remedial Learning with Famous Coders
            </span>
            <Link to="/roadmap" className="text-xs font-bold text-brand-400 hover:underline">
              Open Full Roadmaps →
            </Link>
          </div>

          <div className="space-y-2.5">
            {missingSkills.slice(0, 3).map((gap) => {
              const courses = famousMentorsCourses[gap.skillId] || [];
              const topCourse = courses[0];
              if (!topCourse) return null;
              return (
                <div
                  key={gap.skillId}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Youtube className="w-4 h-4 text-red-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">{gap.skill}: {topCourse.title}</span>
                      <span className="text-slate-400 text-[11px] block sm:inline sm:ml-2">({topCourse.channel})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={topCourse.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                    >
                      <span>Watch</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-slate-600">•</span>
                    <Link to={`/build-break-adapt?skill=${gap.skillId}`} className="text-brand-400 hover:underline font-semibold">
                      Assess →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connector Line */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Node 5: Matched Opportunities */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Level 5: Matched Industry Opportunities
            </span>
            <Link to="/opportunities" className="text-xs font-bold text-brand-400 hover:underline">
              View All Listings →
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{primaryOpp.title}</h4>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  {primaryOpp.matchScore || Math.max(65, student?.careerReadiness || 0)}% Match
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {primaryOpp.company} • {primaryOpp.location} • {primaryOpp.stipend}
              </p>
            </div>

            <Link
              to="/opportunities"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 shrink-0 transition-all"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Apply with SkillProof</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
