import React from 'react';
import { GraduationCap, Building2, School, ArrowRightLeft } from 'lucide-react';

export const RoleSwitcher = ({ currentRole, onSwitchRole }) => {
  return (
    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 p-1 rounded-xl shadow-inner">
      <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-400 font-medium hidden sm:flex">
        <ArrowRightLeft className="w-3.5 h-3.5 text-brand-400" />
        <span>Role:</span>
      </div>

      <button
        onClick={() => onSwitchRole('STUDENT')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          currentRole === 'STUDENT'
            ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="Student: Aarav Sharma (B.Tech CS 2026)"
      >
        <GraduationCap className="w-3.5 h-3.5" />
        <span>Student</span>
      </button>

      <button
        onClick={() => onSwitchRole('INDUSTRY')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          currentRole === 'INDUSTRY'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="Industry Recruiter: Apex Data Systems"
      >
        <Building2 className="w-3.5 h-3.5" />
        <span>Industry</span>
      </button>

      <button
        onClick={() => onSwitchRole('COLLEGE')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          currentRole === 'COLLEGE'
            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="College Placement Cell: ABC Institute of Technology"
      >
        <School className="w-3.5 h-3.5" />
        <span>College</span>
      </button>
    </div>
  );
};
