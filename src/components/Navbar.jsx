import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, RotateCcw, Award, LogIn, LogOut, UserPlus, User } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ currentRole, onSwitchRole, onResetData, student: propStudent }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const activeStudent = (currentRole === 'STUDENT' && user) ? user : propStudent;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/25 border border-brand-400/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                SkillProof
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30">
                <Sparkles className="w-2.5 h-2.5" /> SIH 2026 • PS 26044
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Don't Just Claim a Skill. <span className="text-brand-300 font-bold">Prove It.</span>
            </p>
          </div>
        </Link>

        {/* Center/Right: Role Switcher, Auth & Profile */}
        <div className="flex items-center gap-3">
          <RoleSwitcher currentRole={currentRole} onSwitchRole={onSwitchRole} />

          <button
            onClick={onResetData}
            title="Reset to fresh demo state for presentation"
            className="p-2 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px] font-medium">Reset Demo</span>
          </button>

          {/* If Authenticated: Profile Info & Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              {(user?.role === 'admin' || user?.role === 'host') && (
                <Link
                  to="/admin"
                  title="Host & Administrator Console"
                  className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Admin Console</span>
                </Link>
              )}

              <Link
                to="/profile"
                title="View & Edit Student Profile"
                className="flex items-center gap-2 hover:opacity-85 transition-opacity group cursor-pointer"
              >
                <img
                  src={
                    currentRole === 'STUDENT'
                      ? activeStudent?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                      : currentRole === 'INDUSTRY'
                      ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                      : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100"
                  }
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full ring-2 ring-brand-500/40 group-hover:ring-brand-400 object-cover transition-all"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-200 leading-tight group-hover:text-brand-300 transition-colors max-w-[120px] truncate">
                    {user?.role === 'admin'
                      ? user?.name || 'Administrator'
                      : currentRole === 'STUDENT'
                      ? activeStudent?.name || 'Candidate'
                      : currentRole === 'INDUSTRY'
                      ? 'Apex Data Systems'
                      : ((user?.role === 'faculty' || user?.role === 'college') && user?.name)
                      ? user.name
                      : 'Faculty Member (ABC Tech)'}
                  </p>
                  <p className={`text-[10px] font-semibold flex items-center gap-1 ${
                    currentRole === 'STUDENT' && (!activeStudent?.verifiedSkills || activeStudent?.verifiedSkills?.length === 0)
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    <Award className="w-2.5 h-2.5" />
                    {currentRole === 'STUDENT'
                      ? activeStudent?.verifiedSkills?.length > 0
                        ? `Readiness: ${activeStudent.careerReadiness}%`
                        : 'Unverified (0%)'
                      : 'Verified Entity'}
                  </p>
                </div>
              </Link>
              <button
                onClick={logout}
                title="Log out of account"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-slate-800/60 transition-colors text-xs flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-brand-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="hidden sm:flex px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 items-center gap-1.5 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
