import React, { useState } from 'react';
import {
  School,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  Handshake,
} from 'lucide-react';
import { collegeStats } from '../data/collegeData';

export const CollegeDashboard = () => {
  const [collaborationOffers, setCollaborationOffers] = useState(collegeStats.collaborationOffers);
  const [connectedIds, setConnectedIds] = useState([]);

  const handleConnect = (offerId) => {
    setConnectedIds((prev) => [...prev, offerId]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-900/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
              <School className="w-3.5 h-3.5" />
              COLLEGE / ACADEMIA MODULE
            </span>
            <span className="text-xs text-slate-400">ABC Institute of Technology</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Institutional Skill Mapping & Placement Telemetry
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Real-time aggregate telemetry highlighting student cohort skill deficiencies, industry demand alignment,
            and sponsored university-industry collaborative intervention programs.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center shrink-0">
          <span className="text-3xl font-black text-amber-400">
            {collegeStats.placementReadiness}%
          </span>
          <p className="text-[10px] uppercase font-bold text-slate-400">Placement Readiness</p>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Enrolled</span>
          <p className="text-2xl font-black text-white">{collegeStats.totalStudents}</p>
          <p className="text-[10px] text-slate-500">CS & Engineering</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Verified Skills</span>
          <p className="text-2xl font-black text-brand-300">{collegeStats.verifiedSkillsCount}</p>
          <p className="text-[10px] text-slate-500">Passed Break-Adapt</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Active Internships</span>
          <p className="text-2xl font-black text-indigo-400">{collegeStats.activeInternships}</p>
          <p className="text-[10px] text-slate-500">Industry Matched</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Final Placements</span>
          <p className="text-2xl font-black text-emerald-400">{collegeStats.placedStudents}</p>
          <p className="text-[10px] text-slate-500">PPO Conversion 92%</p>
        </div>
      </div>

      {/* Skill Gap Analytics Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Aggregate Cohort Skill Gap Analytics
            </h3>
            <p className="text-xs text-slate-400">
              Identifies which technical domains have the highest percentage of students failing production benchmarks.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">1,250 Students Analyzed</span>
        </div>

        <div className="space-y-4">
          {collegeStats.skillGapAnalytics.map((item) => (
            <div
              key={item.domain}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-slate-100 text-sm">{item.domain}</span>
                <span className="text-rose-400 font-black font-mono">
                  {item.percentageNeedingImprovement}% Students Need Improvement ({item.impactedStudents} students)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full"
                  style={{ width: `${item.percentageNeedingImprovement}%` }}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Recommended Intervention:{' '}
                  <strong className="text-amber-300">{item.actionRecommended}</strong>
                </span>
                <span className="text-slate-500 font-mono">Severity: {item.severity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended College Actions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpenCheck className="w-4 h-4 text-emerald-400" />
          Recommended Institutional Interventions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {collegeStats.recommendedCollegeActions.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono text-[10px] font-bold">
                    {act.category}
                  </span>
                  <span className="text-emerald-400 font-bold">{act.status}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-100 mt-2">{act.title}</h4>
                <p className="text-slate-400 mt-1">
                  Target: {act.targetStudents} • Partner: <strong className="text-slate-200">{act.industryPartner}</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-brand-300 font-medium">
                Impact: {act.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 12: Industry-College Collaboration */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Handshake className="w-5 h-5 text-indigo-400" />
              Industry-College Collaboration Marketplace
            </h3>
            <p className="text-xs text-slate-400">
              Industry partners offering workshops, guest lectures, live capstone sandboxes, and faculty training.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-300">Section 12 Compliant</span>
        </div>

        <div className="space-y-3">
          {collaborationOffers.map((collab) => {
            const isConnected = connectedIds.includes(collab.id);
            return (
              <div
                key={collab.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{collab.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {collab.type}
                    </span>
                  </div>
                  <p className="text-slate-300">{collab.description}</p>
                  <p className="text-slate-400 text-[11px]">
                    Offered by: <strong className="text-brand-300">{collab.company}</strong> • Available Slots: {collab.slots}
                  </p>
                </div>

                <button
                  onClick={() => handleConnect(collab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  }`}
                >
                  {isConnected ? '✓ Connection Requested' : 'Connect with Industry'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
