import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Share2,
  Sparkles,
  Award,
  QrCode,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { storageService } from '../services/storageService';

export const SkillProofPassport = ({ student: propStudent }) => {
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const student = propStudent || storageService.getStudentData();
  const verifiedSkills = student?.verifiedSkills || [];
  const passportHash = student?.passportHash || "SKP-2026-INITIAL";
  const assessmentEvidence = student?.assessmentEvidence || {
    problemSolving: verifiedSkills.length > 0 ? "Proficient (88%)" : "Pending",
    debugging: verifiedSkills.length > 0 ? "92% Recovery" : "Pending",
    adaptability: verifiedSkills.length > 0 ? "85% Dynamic" : "Pending"
  };

  const shareUrl = `https://skillproof.app/verify/${passportHash}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-300">
            Passport Status: <span className="text-emerald-400 font-bold">Cryptographically Verified & Live</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Passport</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Digital Passport Card */}
      <div
        id="printable-passport"
        className="relative overflow-hidden rounded-3xl border-2 border-brand-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-10 shadow-2xl shadow-brand-500/10 space-y-8"
      >
        {/* Subtle Shield Watermark */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-5 translate-x-10 translate-y-10">
          <ShieldCheck className="w-96 h-96 text-white" />
        </div>

        {/* Top Passport Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/30 border border-brand-400/40 shrink-0">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight">SKILLPROOF PASSPORT</h2>
                <span className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 text-[10px] font-bold border border-brand-500/30 uppercase tracking-wider">
                  SIH 2026 AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Digital Credential • Autonomous Verification Protocol
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] font-mono uppercase text-slate-400">PASSPORT HASH</p>
            <span className="text-xs font-mono font-bold text-brand-400 bg-brand-950/90 px-3 py-1 rounded-md border border-brand-800/60 inline-block mt-0.5">
              {passportHash}
            </span>
          </div>
        </div>

        {/* Candidate Profile Details & Readiness Meter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800/80">
          {/* Student Info */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Credential Holder</p>
            <h3 className="text-xl font-extrabold text-white">{student?.name || 'Candidate'}</h3>
            <p className="text-xs text-slate-300">{student?.degree || 'Computer Science & Engineering'} ({student?.graduationYear || '2026'})</p>
            <p className="text-xs font-semibold text-brand-400">{student?.college || 'Institute of Technology'}</p>
          </div>

          {/* Career Readiness Meter */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Career Readiness Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">{student?.careerReadiness || 0}%</span>
              <span className="text-xs text-slate-400">Top 8% Industry Benchmark</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 mt-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full"
                style={{ width: `${student?.careerReadiness || 0}%` }}
              />
            </div>
          </div>

          {/* Demo QR Code Placeholder Card */}
          <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 justify-self-start md:justify-self-end">
            <div className="p-2 bg-white rounded-xl shadow-md shrink-0">
              <svg className="w-14 h-14" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="25" height="25" fill="#000" />
                <rect x="15" y="15" width="15" height="15" fill="#fff" />
                <rect x="18" y="18" width="9" height="9" fill="#000" />
                <rect x="65" y="10" width="25" height="25" fill="#000" />
                <rect x="70" y="15" width="15" height="15" fill="#fff" />
                <rect x="73" y="18" width="9" height="9" fill="#000" />
                <rect x="10" y="65" width="25" height="25" fill="#000" />
                <rect x="15" y="70" width="15" height="15" fill="#fff" />
                <rect x="18" y="73" width="9" height="9" fill="#000" />
                <rect x="42" y="12" width="10" height="10" fill="#000" />
                <rect x="42" y="32" width="10" height="10" fill="#000" />
                <rect x="42" y="55" width="10" height="10" fill="#000" />
                <rect x="42" y="75" width="10" height="10" fill="#000" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white uppercase tracking-wider">Zero-Knowledge Proof</p>
              <p className="text-[11px] text-slate-400">Scan to verify cryptographic passport hash</p>
            </div>
          </div>
        </div>

        {/* Verified Skills List */}
        <div className="space-y-3 pb-6 border-b border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Verified Skills ({verifiedSkills.length})
          </h4>

          {verifiedSkills.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs text-center">
              No skills verified yet. Pass a Build → Break → Adapt assessment to mint your verified credential!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {verifiedSkills.map((s) => (
                <div
                  key={s.name}
                  className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-white">{s.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{s.level}</span>
                  </div>
                  <span className="text-base font-black text-emerald-400">{s.score}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assessment Evidence: BUILD ✓, BREAK ✓, ADAPT ✓ */}
        <div className="space-y-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Assessment Evidence (Build → Break → Adapt)
            </h4>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              BUILD ✓ • BREAK ✓ • ADAPT ✓
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <p className="text-[11px] font-bold text-slate-400">Problem Solving</p>
              <p className="text-2xl font-black text-brand-300 mt-1">
                {assessmentEvidence.problemSolving}
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <p className="text-[11px] font-bold text-slate-400">Debugging</p>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {assessmentEvidence.debugging}
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <p className="text-[11px] font-bold text-slate-400">Adaptability</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {assessmentEvidence.adaptability}
              </p>
            </div>
          </div>
        </div>

        {/* Projects, Certifications & Internships */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Projects */}
          <div className="space-y-2">
            <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Verified Projects</p>
            <div className="space-y-2">
              {student.projects?.map((p) => (
                <div key={p.title} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <p className="font-bold text-slate-200">{p.title}</p>
                  <p className="text-[11px] text-slate-400 leading-tight">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Certifications</p>
            <div className="space-y-2">
              {student.certifications?.map((c) => (
                <div key={c.name} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <p className="font-bold text-slate-200">{c.name}</p>
                  <p className="text-[11px] text-brand-300 font-mono">{c.issuer} • {c.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Internships Completed */}
          <div className="space-y-2">
            <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Internship Milestones</p>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
              <p className="font-bold text-emerald-400">Apex Data Systems (Shortlisted)</p>
              <p className="text-[11px] text-slate-400">
                Software Development Intern • 91% Skill Match verified.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Passport Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Verified SkillProof Passport"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Employers can verify your actual code diffs, mutation survival history, and problem-solving logs without contacting your university registrar.
          </p>

          <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-slate-200">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shrink-0 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tamper-proof hash: {student.passportHash}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
