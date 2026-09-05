import React from 'react';
import { CheckCircle2, Award, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SkillCard = ({ skill, onRetest }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 rounded-2xl p-5 transition-all group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                {skill.name}
              </h3>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Level: <span className="text-slate-300 font-medium">{skill.level}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400">{skill.score}%</span>
            <p className="text-[10px] font-mono uppercase text-slate-400">Verified</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 mt-4 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${skill.score}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">
          Badge: <span className="text-amber-300 font-semibold">{skill.badge || 'Gold'}</span>
        </span>
        <Link
          to={`/build-break-adapt?skill=${skill.name.toLowerCase()}`}
          className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
        >
          <span>Retest / Prove</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
