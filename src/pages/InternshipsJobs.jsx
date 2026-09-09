import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building,
  ArrowRight,
  Zap,
  Info,
  Clock,
  Send,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateOpportunityMatch } from '../utils/matchingAlgorithm';
import { storageService } from '../services/storageService';
import { Modal } from '../components/Modal';
import { skillsCatalogue } from '../data/assessmentsData';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const InternshipsJobs = ({ student, onApplicationSubmitted }) => {
  const { isAuthenticated } = useAuth();
  const [opportunities, setOpportunities] = useState(storageService.getOpportunities());
  const [applications, setApplications] = useState(storageService.getApplications());
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [candidateNote, setCandidateNote] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');

  // Compute smart match for all listings
  const enrichedOpportunities = opportunities.map((opp) => {
    const matchAnalysis = calculateOpportunityMatch(opp, student);
    const existingApp = applications.find((a) => a.opportunityId === opp.id);
    return {
      ...opp,
      matchScore: matchAnalysis.matchPercentage,
      matchingSkills: matchAnalysis.matchingSkills,
      missingSkills: matchAnalysis.missingSkills,
      rationale: matchAnalysis.rationale,
      application: existingApp || null
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const filteredOpportunities = enrichedOpportunities.filter((opp) => {
    if (typeFilter !== 'All') {
      const t = (opp.type || '').toLowerCase();
      if (typeFilter === 'Job' && !t.includes('job') && !t.includes('placement') && !t.includes('full-time')) return false;
      if (typeFilter === 'Internship' && !t.includes('internship')) return false;
      if (typeFilter === 'Part-time' && !t.includes('part-time')) return false;
      if (typeFilter === 'Startup' && !t.includes('startup')) return false;
      if (typeFilter === 'Project' && !t.includes('project')) return false;
    }
    if (workModeFilter !== 'All') {
      const loc = (opp.location || '').toLowerCase();
      const wm = (opp.workMode || '').toLowerCase();
      if (workModeFilter === 'Remote' && !loc.includes('remote') && !wm.includes('remote')) return false;
      if (workModeFilter === 'Hybrid' && !loc.includes('hybrid') && !wm.includes('hybrid')) return false;
      if (workModeFilter === 'On-site' && (loc.includes('remote') || loc.includes('hybrid') || wm.includes('remote') || wm.includes('hybrid'))) return false;
    }
    return true;
  });

  const handleOpenApplyModal = (opp) => {
    setSelectedOpp(opp);
    setCandidateNote(`Excited to apply for the ${opp.title} role! My SkillProof Passport contains verified capability evidence withstanding production mutations.`);
    setAppliedSuccess(false);
    setApplyModalOpen(true);
  };

  const handleConfirmApply = async () => {
    if (!selectedOpp) return;
    storageService.applyToOpportunity(selectedOpp, student, candidateNote);

    if (isAuthenticated) {
      try {
        await api.opportunities.apply(selectedOpp.id, candidateNote);
      } catch (err) {
        console.warn('Backend application sync warning:', err);
      }
    }

    setApplications(storageService.getApplications());
    setAppliedSuccess(true);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onApplicationSubmitted) onApplicationSubmitted();
  };

  const getSkillIdByName = (name) => {
    const item = skillsCatalogue.find(
      (s) => s.name.toLowerCase() === name.toLowerCase() || s.id.toLowerCase() === name.toLowerCase()
    );
    return item ? item.id : 'python';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SMART OPPORTUNITY MATCHER
            </span>
            <span className="text-xs text-slate-400">Target Role: {student?.targetRole || 'Full Stack Web Developer'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Matched Internships & Career Opportunities
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Every match score is calculated against your actual verified SkillProof scores rather than
            unverified resume keywords. Apply directly with your cryptographic passport credential!
          </p>
        </div>

        <Link
          to="/applications"
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <span>Track Applications ({applications.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Unverified Lock Banner */}
      {(!student.verifiedSkills || student.verifiedSkills.length === 0) && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Opportunity Matching Locked (SkillProof Assessment Required)
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              SkillProof matches candidates against authentic, mutation-tested code rather than unverified resume claims. Pass a Build → Break → Adapt assessment in any language to calculate your authentic match score and unlock 1-click apply!
            </p>
          </div>
          <Link
            to="/build-break-adapt?skill=python"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-1.5 shrink-0 transition-all"
          >
            <span>Take Practical Test Now →</span>
          </Link>
        </div>
      )}

      {/* Type & Work Mode Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Opportunity Type Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Type:</span>
            {['All', 'Job', 'Internship', 'Part-time', 'Startup', 'Project'].map((t) => {
              const active = typeFilter === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {t === 'All' ? 'All Types' : t}
                </button>
              );
            })}
          </div>

          {/* Work Mode Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Location:</span>
            {['All', 'Remote', 'Hybrid', 'On-site'].map((m) => {
              const active = workModeFilter === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setWorkModeFilter(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
            <p>No opportunities match the selected filters ({typeFilter} • {workModeFilter}).</p>
            <button
              type="button"
              onClick={() => { setTypeFilter('All'); setWorkModeFilter('All'); }}
              className="text-brand-400 hover:underline text-xs font-bold cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredOpportunities.map((opp) => {
          const isApplied = !!opp.application;
          const isVerified = student.verifiedSkills && student.verifiedSkills.length > 0;

          return (
            <div
              key={opp.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 rounded-2xl p-6 transition-all space-y-4 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{opp.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
                      {opp.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {opp.stipend}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-slate-200">
                      <Building className="w-3.5 h-3.5 text-brand-400" /> {opp.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {opp.duration}
                    </span>
                  </div>
                </div>

                {/* Match Badge & Action */}
                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  <div className="text-right">
                    <span className={`text-2xl font-black ${isVerified ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {isVerified ? `${opp.matchScore}%` : '0%'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {isVerified ? 'Verified Fit' : 'Locked'}
                    </span>
                  </div>

                  {isApplied ? (
                    <button
                      disabled
                      className="px-4 py-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 cursor-default"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Applied ✓</span>
                    </button>
                  ) : !isVerified ? (
                    <Link
                      to="/build-break-adapt?skill=python"
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Qualify Test to Apply</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleOpenApplyModal(opp)}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>1-Click Apply</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Match Rationale Callout */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    <Info className="w-3 h-3 text-brand-400" /> Matching Analysis:
                  </span>
                  <span>{opp.description}</span>
                </div>
                <p className="text-slate-300 italic text-[11px] leading-relaxed">
                  "{opp.rationale}"
                </p>

                {/* Matching Skills vs Missing Skills Tags with Direct Links */}
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-900">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Matching:</span>
                  {opp.matchingSkills.map((m) => (
                    <span
                      key={m.name}
                      className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-[11px] font-mono flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {m.name} ({m.studentScore}%)
                    </span>
                  ))}

                  {opp.missingSkills.length > 0 && (
                    <>
                      <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Missing:</span>
                      {opp.missingSkills.map((mis) => (
                        <Link
                          key={mis.name}
                          to={`/build-break-adapt?skill=${getSkillIdByName(mis.name)}`}
                          className="px-2 py-0.5 rounded-md bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 hover:text-amber-200 text-[11px] font-mono flex items-center gap-1 transition-colors"
                          title={`Click to take practical assessment for ${mis.name}`}
                        >
                          <AlertCircle className="w-3 h-3 text-amber-400" />
                          <span>{mis.name} (Need {mis.minRequired}%)</span>
                          <span className="text-[9px] underline text-brand-300">Take Test →</span>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* 1-Click Apply Modal */}
      {selectedOpp && (
        <Modal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          title={`Apply to ${selectedOpp.title} at ${selectedOpp.company}`}
          maxWidth="max-w-lg"
        >
          {appliedSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Application Successfully Submitted!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Your verified SkillProof Passport hash <strong className="text-emerald-400">{student.passportHash}</strong> has been transmitted. The recruiter at{' '}
                <strong>{selectedOpp.company}</strong> can now inspect your code diffs, capability evidence, and mutation audit trail.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <Link
                  to="/applications"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  View in Applications Tracker →
                </Link>
                <button
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{selectedOpp.title}</span>
                  <span className="font-bold text-emerald-400 text-sm">{selectedOpp.matchScore}% Match</span>
                </div>
                <p className="text-slate-400">{selectedOpp.company} • {selectedOpp.stipend} • {selectedOpp.location}</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-200">Attached SkillProof Credentials:</p>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-300">
                  <p>✓ Candidate: {student.name} ({student.college})</p>
                  <p>✓ Career Readiness Index: {student.careerReadiness}%</p>
                  <p>✓ Verified Evidence: BUILD ✓ BREAK ✓ ADAPT ✓</p>
                  <p>✓ Cryptographic Hash: {student.passportHash || 'SKP-2026-VERIFIED-HASH'}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                  Candidate Introduction Note (Optional):
                </label>
                <textarea
                  value={candidateNote}
                  onChange={(e) => setCandidateNote(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApply}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm & Submit with Passport</span>
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
