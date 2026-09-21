import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Flame,
  BarChart2,
  Route,
  GitFork,
  Award,
  Briefcase,
  FileCheck2,
  Building2,
  School,
  User,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ currentRole }) => {
  const { user } = useAuth();
  const isAdmin = user && ['admin', 'host'].includes(String(user.role || '').toLowerCase());

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, category: 'Core' },
    { to: '/assessment', label: 'Skill Assessment', icon: Cpu, category: 'Evaluation' },
    { to: '/build-break-adapt', label: 'Build → Break → Adapt', icon: Flame, badge: 'Flagship', category: 'Evaluation' },
    { to: '/skill-gap', label: 'Skill Gap Analysis', icon: BarChart2, category: 'Telemetry' },
    { to: '/roadmap', label: 'Learning Roadmap', icon: Route, category: 'Telemetry' },
    { to: '/skill-graph', label: 'Skill Graph', icon: GitFork, category: 'Telemetry' },
    { to: '/passport', label: 'SkillProof Passport', icon: Award, badge: 'Verified', category: 'Portfolio' },
    { to: '/opportunities', label: 'Internships & Jobs', icon: Briefcase, badge: 'Matched', category: 'Matching' },
    { to: '/applications', label: 'Applications', icon: FileCheck2, category: 'Matching' },
    { to: '/industry', label: 'Industry Module', icon: Building2, highlight: currentRole === 'INDUSTRY', category: 'Portals' },
    { to: '/faculty', label: 'Faculty / Academia', icon: School, highlight: currentRole === 'FACULTY' || currentRole === 'COLLEGE', category: 'Portals' },
    { to: '/profile', label: 'Student Profile', icon: User, category: 'Portals' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Console', icon: ShieldCheck, badge: 'Host', highlight: true, category: 'Admin' }] : []),
  ];

  return (
    <aside className="w-64 bg-slate-950/70 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 select-none overflow-y-auto">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Navigation Menu</span>
            <span className="text-[10px] text-brand-400 font-mono">SIH 2026</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-sm shadow-brand-500/10'
                        : item.highlight
                        ? 'bg-slate-900/90 text-white border border-slate-700 hover:bg-slate-800'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Hackathon Core Thesis Callout */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SIH 2026 Core Flow</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
            ASSESS → PROVE → BREAK → ADAPT → VERIFY → MATCH
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 px-3">
        SkillProof • PS 26044
      </div>
    </aside>
  );
};
