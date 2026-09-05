import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { User, School, GraduationCap, Compass, ArrowRight, Mail, Calendar, Shield, Sparkles } from 'lucide-react';
import { storageService } from '../services/storageService';
import { roleTracks } from '../data/mockData';

export const CandidateProfileModal = ({ isOpen, onClose, onProfileSaved, currentStudent }) => {
  const [name, setName] = useState(currentStudent?.name || '');
  const [email, setEmail] = useState(currentStudent?.email || '');
  const [college, setCollege] = useState(currentStudent?.college || '');
  const [degree, setDegree] = useState(currentStudent?.degree || 'B.Tech Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState(currentStudent?.graduationYear || 2026);
  const [targetRole, setTargetRole] = useState(currentStudent?.targetRole || roleTracks[0].title);

  // Sync state whenever modal opens or currentStudent changes
  useEffect(() => {
    if (isOpen && currentStudent) {
      setName(currentStudent.name || '');
      setEmail(currentStudent.email || '');
      setCollege(currentStudent.college || '');
      setDegree(currentStudent.degree || 'B.Tech Computer Science & Engineering');
      setGraduationYear(currentStudent.graduationYear || 2026);
      setTargetRole(currentStudent.targetRole || roleTracks[0].title);
    }
  }, [isOpen, currentStudent]);

  const selectedTrack = roleTracks.find((r) => r.title === targetRole) || roleTracks[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated = storageService.updateStudentProfile({
      name: name.trim(),
      email: email.trim() || 'candidate@university.edu',
      college: college.trim() || 'Institute of Technology',
      degree: degree.trim() || 'B.Tech Computer Science',
      graduationYear: Number(graduationYear) || 2026,
      targetRole: targetRole.trim()
    });

    if (onProfileSaved) {
      onProfileSaved(updated);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Registration & Career Role Mapping"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 bg-brand-500/10 border border-brand-500/20 rounded-xl text-brand-300">
          <p className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> SIH 2026 Candidate Profile System
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Your name, college, and target career role define your tailored Skill Battery checklist, gap analysis, and 1-click internship matching.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-400" /> Full Name:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rohan Verma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-400" /> College Email:
            </label>
            <input
              type="email"
              placeholder="e.g. rohan@univ.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-brand-400" /> College / University:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Delhi Technological University"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-400" /> Grad Year:
            </label>
            <input
              type="number"
              min="2024"
              max="2030"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-brand-400" /> Degree / Branch:
          </label>
          <input
            type="text"
            required
            placeholder="e.g. B.Tech Computer Science & Engineering"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
          />
        </div>

        <div className="space-y-2 pt-1">
          <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand-400" /> Target Career Track / Role to Prepare For:
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-semibold"
          >
            {roleTracks.map((track) => (
              <option key={track.id} value={track.title}>
                {track.title} ({track.demand} Demand • Avg {track.avgStipend})
              </option>
            ))}
          </select>
        </div>

        {/* Required Skills Battery Preview */}
        <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Required Skill Battery for {selectedTrack.title}:
            </span>
            <span className="text-emerald-400 font-mono text-[10px] font-bold">
              {selectedTrack.requiredSkills.length} Skills to Prove
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedTrack.requiredSkills.map((req) => (
              <span
                key={req.id}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1 font-mono"
              >
                <span>{req.name}</span>
                <span className="text-brand-400 text-[10px] font-bold">(&ge;{req.minScore}%)</span>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Save Profile & Update Targets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </Modal>
  );
};
