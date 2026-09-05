import React, { useState } from 'react';
import {
  Building2,
  Users,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Eye,
  Award,
  Sparkles,
  CodeXml,
  Filter,
  Search,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { Modal } from '../components/Modal';

export const IndustryDashboard = ({ student }) => {
  const [opportunities, setOpportunities] = useState(storageService.getOpportunities());
  const [applications, setApplications] = useState(storageService.getApplications());
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);

  // New Opportunity Form
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Apex Data Systems');
  const [location, setLocation] = useState('Bangalore, India (Hybrid)');
  const [stipend, setStipend] = useState('₹45,000 / month');
  const [type, setType] = useState('Internship');
  const [description, setDescription] = useState('');
  const [reqSkills, setReqSkills] = useState('Python, SQL, React, Git');

  const handlePostOpportunity = (e) => {
    e.preventDefault();
    const skillsArray = reqSkills.split(',').map((s) => ({
      name: s.trim(),
      weight: 0.25,
      minScore: 75,
    }));

    const created = storageService.addOpportunity({
      title,
      company,
      location,
      stipend,
      type,
      description,
      requiredSkills: skillsArray,
      openings: 3,
      deadline: '2026-11-30',
    });

    setOpportunities(storageService.getOpportunities());
    setPostModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleUpdateStatus = (appId, newStatus) => {
    const updated = storageService.updateApplicationStatus(appId, newStatus);
    setApplications(updated);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              INDUSTRY RECRUITER PORTAL
            </span>
            <span className="text-xs text-slate-400">Apex Data Systems Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Verified Engineering Talent Pipeline
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Eliminate resume screening fluff. View candidates who have demonstrated proof under live code mutations.
            Inspect side-by-side diffs before scheduling technical rounds.
          </p>
        </div>

        <button
          onClick={() => setPostModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 shrink-0 transition-all self-start md:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Internship / Job / Project</span>
        </button>
      </div>

      {/* Matched Candidate Section: Aarav Sharma Spotlight */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Top Matched Candidate</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                Candidate Match: 91%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Matched for: <strong className="text-slate-200">Software Development Intern</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setInspectModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <CodeXml className="w-3.5 h-3.5 text-brand-400" />
              <span>Inspect Code Diff</span>
            </button>

            <button
              onClick={() => handleUpdateStatus('app-1', 'Shortlisted')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
            >
              Shortlist Candidate
            </button>
          </div>
        </div>

        {/* Candidate Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200 text-sm">{student.name}</p>
            <p className="text-slate-400">{student.degree}</p>
            <p className="text-brand-400 font-semibold">{student.college}</p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">Readiness:</span>
              <span className="font-bold text-emerald-400">{student.careerReadiness}%</span>
            </div>
          </div>

          {/* Skill Breakdown Badges */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">
                Required Skills Match vs Benchmark:
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                Python ✓ • SQL ✓ • React ✓ • Git ⚠
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                <p className="font-bold">Python ✓</p>
                <p className="text-[10px] text-slate-400">Score: 86% (Req 80%)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                <p className="font-bold">SQL ✓</p>
                <p className="text-[10px] text-slate-400">Score: 81% (Req 75%)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                <p className="font-bold">React ✓</p>
                <p className="text-[10px] text-slate-400">Score: 74% (Req 70%)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-200">
                <p className="font-bold">Git ⚠</p>
                <p className="text-[10px] text-slate-400">Score: 60% (Req 65%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* WHY THIS MATCH? Section */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
          <p className="font-bold text-brand-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            WHY THIS MATCH?
          </p>
          <p className="text-slate-300 leading-relaxed italic">
            "Candidate Aarav Sharma exceeded benchmarks on 3 out of 4 core requirements with demonstrated resilience in handling corrupted records and currency normalization in Python. Minor 5% delta in Git workflows does not impact core data pipeline duties."
          </p>
        </div>
      </div>

      {/* Posted Opportunities List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Active Postings by Apex Data Systems</h3>
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <h4 className="font-bold text-sm text-white">{opp.title}</h4>
                <p className="text-slate-400 mt-0.5">
                  {opp.type} • {opp.location} • {opp.stipend} • Required:{' '}
                  {opp.requiredSkills.map((s) => s.name).join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                  {opp.openings} Openings
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Opportunity Modal */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title="Post New Opportunity (Internship / Job / Project)"
      >
        <form onSubmit={handlePostOpportunity} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Opportunity Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Cloud Data Platform Intern"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Opportunity Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="Internship">Internship</option>
                <option value="Full-Time Job">Full-Time Job</option>
                <option value="Capstone Project">Capstone Project</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Stipend / CTC</label>
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={reqSkills}
              onChange={(e) => setReqSkills(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              placeholder="Python, SQL, React, Git"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Role Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe real-world engineering responsibilities and problem-solving expected..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setPostModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Publish Opportunity
            </button>
          </div>
        </form>
      </Modal>

      {/* Code Inspection Diff Modal */}
      <Modal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        title="Candidate Build-Break-Adapt Code Diff Audit"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white">Challenge: Sales Dataset Analysis</span>
            <span className="text-emerald-400 font-mono font-bold">Score: 86/100 Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-rose-400 font-mono">
                Naive Build Code (Crashed on Missing Data):
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-rose-900/40 text-[11px] font-mono text-rose-200 overflow-x-auto leading-relaxed max-h-64">
{`# Naive Baseline (Crashed on contaminated batch)
def analyze_sales_data(transactions):
    total = 0
    for r in transactions:
        total += r["units"] * r["price"] # crashed on None
    return total / len(transactions)`}
              </pre>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-400 font-mono">
                Adapted Defensive Code (Passed 100% Mutations):
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-emerald-900/40 text-[11px] font-mono text-emerald-200 overflow-x-auto leading-relaxed max-h-64">
{`# Adapted Implementation by Aarav Sharma
import re
def analyze_sales_data(transactions):
    seen = set()
    total = 0
    for r in transactions:
        if not r.get("units") or r["id"] in seen:
            continue
        seen.add(r["id"])
        # regex strip currency
        p = float(re.sub(r'[^0-9.]', '', str(r["price"])))
        total += int(r["units"]) * p`}
              </pre>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 italic">
            "Candidate Fix Rationale: Quarantined NoneType records, stripped contaminated currency symbols, deduplicated transactions using a Set, and prevented zero-division on AOV."
          </div>
        </div>
      </Modal>
    </div>
  );
};
