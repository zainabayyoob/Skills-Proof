import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { storageService } from '../services/storageService';

const STATUS_PIPELINE = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Selected',
];

export const Applications = () => {
  const [applications, setApplications] = useState(storageService.getApplications());
  const [activeFilter, setActiveFilter] = useState('All');

  const handleStatusChange = (appId, newStatus) => {
    const updated = storageService.updateApplicationStatus(appId, newStatus);
    setApplications(updated);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Interview':
        return 'bg-brand-500/20 text-brand-300 border-brand-500/40';
      case 'Shortlisted':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Under Review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const counts = {
    All: applications.length,
    Applied: applications.filter((a) => a.status === 'Applied').length,
    'Under Review': applications.filter((a) => a.status === 'Under Review' || a.status === 'Shortlisted').length,
    Interview: applications.filter((a) => a.status === 'Interview').length,
    Selected: applications.filter((a) => a.status === 'Selected').length,
  };

  const filteredApplications = applications.filter((app) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Applied') return app.status === 'Applied';
    if (activeFilter === 'Under Review') return app.status === 'Under Review' || app.status === 'Shortlisted';
    if (activeFilter === 'Interview') return app.status === 'Interview';
    if (activeFilter === 'Selected') return app.status === 'Selected';
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
              APPLICATION TRACKER
            </span>
            <span className="text-xs text-slate-400">SIH Status Progression Lifecycle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Application Pipeline & Status Tracker
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Track your verified SkillProof applications in real time. For hackathon demonstration,
            you can change status stages directly in the dropdown below.
          </p>
        </div>

        <Link
          to="/opportunities"
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <span>Find More Opportunities</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
        {['All', 'Applied', 'Under Review', 'Interview', 'Selected'].map((filterKey) => {
          const isActive = activeFilter === filterKey;
          return (
            <button
              key={filterKey}
              type="button"
              onClick={() => setActiveFilter(filterKey)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{filterKey}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white font-bold' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {counts[filterKey] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
            <p>No applications currently in <strong className="text-white">"{activeFilter}"</strong> stage.</p>
            {activeFilter !== 'All' ? (
              <button
                type="button"
                onClick={() => setActiveFilter('All')}
                className="text-brand-400 hover:underline text-xs font-bold cursor-pointer"
              >
                View all applications ({applications.length})
              </button>
            ) : (
              <Link to="/opportunities" className="text-brand-400 hover:underline font-bold block">
                Explore Matched Opportunities with SkillProof Passport!
              </Link>
            )}
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 rounded-2xl p-6 transition-all space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-white">{app.opportunityTitle}</h3>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/40">
                      {app.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-1">
                    <Building className="w-3.5 h-3.5 text-brand-400" />
                    <span>{app.company}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400 font-mono text-[11px]">Applied on {app.appliedDate}</span>
                  </p>
                </div>

                {/* Status Changer Dropdown */}
                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  <span className="text-xs text-slate-400">Current Stage:</span>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold focus:outline-none cursor-pointer transition-colors ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {STATUS_PIPELINE.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Visual Pipeline Bar */}
              <div className="pt-2">
                <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold font-mono">
                  {STATUS_PIPELINE.map((st, sIdx) => {
                    const currentIdx = STATUS_PIPELINE.indexOf(app.status);
                    const isPassed = sIdx <= currentIdx;
                    return (
                      <div
                        key={st}
                        className={`py-2 px-1 rounded-lg border transition-all ${
                          isPassed
                            ? 'bg-brand-600/30 text-brand-200 border-brand-500/50'
                            : 'bg-slate-950 text-slate-600 border-slate-800'
                        }`}
                      >
                        {st} {isPassed ? '✓' : ''}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Matching & Missing Highlights */}
              <div className="pt-3 border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Verified Matches:</span>
                  {app.matchingSkills?.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-slate-950 text-emerald-300 text-[11px] font-mono border border-slate-800"
                    >
                      ✓ {m}
                    </span>
                  ))}
                </div>

                <span className="text-slate-400 text-[11px] italic">
                  Note: {app.notes}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
