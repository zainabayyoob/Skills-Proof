import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  PlusCircle,
  Search,
  Trash2,
  Edit3,
  Calendar,
  AlertCircle,
  History,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { api } from '../services/api';
import { Modal } from '../components/Modal';

export const STATUS_PIPELINE = [
  'Saved',
  'Applied',
  'Under Review',
  'Shortlisted',
  'Assessment',
  'Interview',
  'Offer',
  'Selected',
  'Rejected',
  'Withdrawn',
];

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [expandedTimelineId, setExpandedTimelineId] = useState(null);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditApp, setCurrentEditApp] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Add Form State
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    opportunityType: 'Internship',
    location: 'Bangalore, India (Hybrid)',
    stipend: '₹40,000 / month',
    applicationUrl: '',
    status: 'Applied',
    notes: '',
    followUpDate: '',
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    status: 'Applied',
    notes: '',
    followUpDate: '',
    interviewDate: '',
    statusChangeNote: '',
  });

  // Load applications from API (or fallback to storageService for guest)
  const loadApplications = async () => {
    try {
      setLoading(true);
      if (api.auth.isAuthenticated()) {
        const res = await api.applications.list();
        if (res && Array.isArray(res.applications)) {
          setApplications(res.applications);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not load from API, falling back:', e);
    }
    const local = storageService.getApplications();
    setApplications(local);
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Offer':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'Interview':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Assessment':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Shortlisted':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Under Review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Applied':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Saved':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Withdrawn':
        return 'bg-zinc-800/80 text-zinc-400 border-zinc-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleInlineStatusChange = async (appId, newStatus) => {
    try {
      if (api.auth.isAuthenticated()) {
        await api.applications.update(appId, {
          status: newStatus,
          statusChangeNote: `User updated stage to ${newStatus}`,
        });
      }
    } catch (err) {
      console.warn('API update failed:', err);
    }
    storageService.updateApplicationStatus(appId, newStatus, `Stage updated to ${newStatus}`);
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const hist = a.statusHistory || [
            { status: a.status, timestamp: a.appliedDate || new Date().toISOString(), note: 'Initial application' },
          ];
          hist.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: `Status updated to ${newStatus}`,
          });
          return { ...a, status: newStatus, statusHistory: hist };
        }
        return a;
      })
    );
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      company: formData.company,
      role: formData.role,
      opportunityTitle: formData.role,
      opportunityType: formData.opportunityType,
      location: formData.location,
      stipend: formData.stipend,
      applicationUrl: formData.applicationUrl,
      status: formData.status,
      notes: formData.notes,
      followUpDate: formData.followUpDate || null,
      source: formData.applicationUrl ? 'External Career Portal' : 'Direct Add',
      isExternal: Boolean(formData.applicationUrl),
      matchScore: 88,
    };

    let createdApp = null;
    try {
      if (api.auth.isAuthenticated()) {
        const res = await api.applications.create(payload);
        if (res && res.application) {
          createdApp = res.application;
        }
      }
    } catch (err) {
      console.warn('API create application error:', err);
    }

    if (!createdApp) {
      createdApp = storageService.addCustomApplication(payload);
    }

    setApplications((prev) => [createdApp, ...prev.filter((p) => p.id !== createdApp.id)]);
    setAddModalOpen(false);
    setFormData({
      company: '',
      role: '',
      opportunityType: 'Internship',
      location: 'Bangalore, India (Hybrid)',
      stipend: '₹40,000 / month',
      applicationUrl: '',
      status: 'Applied',
      notes: '',
      followUpDate: '',
    });
  };

  const handleOpenEdit = (app) => {
    setCurrentEditApp(app);
    setEditFormData({
      status: app.status || 'Applied',
      notes: app.notes || '',
      followUpDate: app.followUpDate || '',
      interviewDate: app.interviewDate || '',
      statusChangeNote: '',
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!currentEditApp) return;

    const updates = {
      status: editFormData.status,
      notes: editFormData.notes,
      followUpDate: editFormData.followUpDate || null,
      interviewDate: editFormData.interviewDate || null,
      statusChangeNote: editFormData.statusChangeNote || `Application details updated`,
    };

    try {
      if (api.auth.isAuthenticated()) {
        await api.applications.update(currentEditApp.id, updates);
      }
    } catch (err) {
      console.warn('API update failed:', err);
    }

    storageService.updateApplication(currentEditApp.id, updates);

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === currentEditApp.id) {
          const hist = [...(a.statusHistory || [])];
          if (updates.status !== a.status) {
            hist.push({
              status: updates.status,
              timestamp: new Date().toISOString(),
              note: updates.statusChangeNote || `Status changed to ${updates.status}`,
            });
          }
          return { ...a, ...updates, statusHistory: hist };
        }
        return a;
      })
    );

    setEditModalOpen(false);
    setCurrentEditApp(null);
  };

  const handleDelete = async (appId) => {
    try {
      if (api.auth.isAuthenticated()) {
        await api.applications.delete(appId);
      }
    } catch (err) {
      console.warn('API delete failed:', err);
    }
    storageService.deleteApplication(appId);
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    setDeleteConfirmId(null);
  };

  // Filter & Search
  const filtered = applications.filter((app) => {
    const title = (app.opportunityTitle || app.role || '').toLowerCase();
    const company = (app.company || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = !query || title.includes(query) || company.includes(query);
    const matchesFilter = activeFilter === 'All' || app.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'latest') {
      return (b.appliedDate || '').localeCompare(a.appliedDate || '');
    }
    if (sortBy === 'match') {
      return (b.matchScore || 0) - (a.matchScore || 0);
    }
    if (sortBy === 'company') {
      return (a.company || '').localeCompare(b.company || '');
    }
    if (sortBy === 'status') {
      return (a.status || '').localeCompare(b.status || '');
    }
    return 0;
  });

  // Dynamic counts for each status
  const counts = {
    All: applications.length,
  };
  STATUS_PIPELINE.forEach((st) => {
    counts[st] = applications.filter((a) => a.status === st).length;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
              REAL APPLICATION TRACKER
            </span>
            <span className="text-xs text-slate-400">10-Stage Progression Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Application Pipeline & Status Tracker
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Monitor all your verified SkillProof applications and custom job submissions with complete lifecycle
            history, follow-up reminders, and official recruitment portal links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-center">
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Custom Application</span>
          </button>

          <Link
            to="/opportunities"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
          >
            <span>Explore Opportunities</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, role title, or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="latest">Latest Applied</option>
            <option value="match">Highest Match Score</option>
            <option value="company">Company (A-Z)</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* 10-Status Filter Tabs */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg min-w-max">
          {['All', ...STATUS_PIPELINE].map((filterKey) => {
            const isActive = activeFilter === filterKey;
            const count = counts[filterKey] || 0;
            return (
              <button
                key={filterKey}
                type="button"
                onClick={() => setActiveFilter(filterKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{filterKey}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            Loading your application pipeline...
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-3">
            <p className="text-base font-semibold text-slate-300">
              No applications match "{searchQuery || activeFilter}".
            </p>
            <p className="text-xs text-slate-500">
              {searchQuery
                ? 'Try adjusting your search keywords or clearing active filters.'
                : 'Start tracking an application or apply to real-world opportunities.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              {(activeFilter !== 'All' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                + Add Custom Application
              </button>
            </div>
          </div>
        ) : (
          sorted.map((app) => {
            const hasTimeline = app.statusHistory && app.statusHistory.length > 0;
            const isTimelineOpen = expandedTimelineId === app.id;

            return (
              <div
                key={app.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 rounded-2xl p-6 transition-all space-y-4 shadow-xl"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-bold text-white">
                        {app.opportunityTitle || app.role}
                      </h3>
                      {app.matchScore && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/40">
                          {app.matchScore}% Match
                        </span>
                      )}
                      {app.opportunityType && (
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {app.opportunityType}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 font-medium flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-brand-300 font-semibold">
                        <Building className="w-3.5 h-3.5 text-brand-400" />
                        {app.company}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{app.location || 'Remote / Hybrid'}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        Applied on {app.appliedDate || 'Recent'}
                      </span>
                    </p>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold">Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleInlineStatusChange(app.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none cursor-pointer transition-colors ${getStatusColor(
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

                    {/* Edit button */}
                    <button
                      onClick={() => handleOpenEdit(app)}
                      title="Edit Application & Notes"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setDeleteConfirmId(app.id)}
                      title="Delete Application"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Visual Pipeline Bar */}
                <div className="pt-2">
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-center text-[9px] font-bold font-mono">
                    {STATUS_PIPELINE.map((st, sIdx) => {
                      const currentIdx = STATUS_PIPELINE.indexOf(app.status);
                      const isPassed = sIdx <= currentIdx;
                      const isCurrent = sIdx === currentIdx;
                      return (
                        <div
                          key={st}
                          className={`py-1.5 px-0.5 rounded border transition-all truncate ${
                            isCurrent
                              ? 'bg-brand-600 text-white border-brand-400 shadow-md shadow-brand-600/30'
                              : isPassed
                              ? 'bg-brand-600/30 text-brand-200 border-brand-500/40'
                              : 'bg-slate-950 text-slate-600 border-slate-800'
                          }`}
                          title={st}
                        >
                          {st}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* External Portal & Follow-Up Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  {/* Left: Reminders & Notes */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {app.followUpDate && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Follow-up: {app.followUpDate}</span>
                      </span>
                    )}

                    {app.interviewDate && (
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Interview: {app.interviewDate}</span>
                      </span>
                    )}

                    {/* External Submission Label */}
                    {(app.isExternal || app.applicationUrl) && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Applied externally
                      </span>
                    )}
                  </div>

                  {/* Right: Official Portal Link & Timeline Toggle */}
                  <div className="flex items-center gap-2">
                    {app.applicationUrl && (
                      <a
                        href={app.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
                        <span>Open Official Portal</span>
                      </a>
                    )}

                    <button
                      onClick={() =>
                        setExpandedTimelineId(isTimelineOpen ? null : app.id)
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>{isTimelineOpen ? 'Hide History' : 'Timeline History'}</span>
                    </button>
                  </div>
                </div>

                {/* Notes Display */}
                {app.notes && (
                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Notes: </span>
                    <span className="italic">{app.notes}</span>
                  </div>
                )}

                {/* Collapsible Timeline History */}
                {isTimelineOpen && (
                  <div className="pt-3 border-t border-slate-800 space-y-2 bg-slate-950/60 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-brand-400" />
                      Status Progression Timeline
                    </h4>
                    <div className="space-y-2 pt-1">
                      {(app.statusHistory || [
                        { status: app.status, timestamp: app.appliedDate || new Date().toISOString(), note: 'Application created' },
                      ]).map((item, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                          <div>
                            <span className="font-bold text-white">{item.status}</span>
                            <span className="text-slate-500 text-[11px] ml-2 font-mono">
                              {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Date logged'}
                            </span>
                            {item.note && (
                              <p className="text-[11px] text-slate-400 mt-0.5">{item.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Application Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Track New Application"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., Google, Microsoft, Razorpay"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Role / Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Software Engineering Intern"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Type</label>
              <select
                value={formData.opportunityType}
                onChange={(e) => setFormData({ ...formData, opportunityType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="Internship">Internship</option>
                <option value="Full-Time Job">Full-Time Job</option>
                <option value="Contract">Contract</option>
                <option value="Research Fellow">Research Fellow</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bangalore, India"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Stipend / CTC</label>
              <input
                type="text"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                placeholder="e.g. ₹50,000 / month"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Official Application / Career URL
            </label>
            <input
              type="url"
              value={formData.applicationUrl}
              onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
              placeholder="https://careers.google.com/jobs/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                {STATUS_PIPELINE.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Follow-up Reminder Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Notes & Application Context
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Applied via official portal with verified Python & SQL SkillProof Passport credentials."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
            >
              Add to Tracker
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Application Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Application: ${currentEditApp?.company || ''}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Current Stage</label>
            <select
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            >
              {STATUS_PIPELINE.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Follow-up Date
              </label>
              <input
                type="date"
                value={editFormData.followUpDate}
                onChange={(e) => setEditFormData({ ...editFormData, followUpDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Interview Scheduled Date
              </label>
              <input
                type="date"
                value={editFormData.interviewDate}
                onChange={(e) => setEditFormData({ ...editFormData, interviewDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Status Change Note</label>
            <input
              type="text"
              value={editFormData.statusChangeNote}
              onChange={(e) => setEditFormData({ ...editFormData, statusChangeNote: e.target.value })}
              placeholder="e.g., Completed Round 1 Technical Interview"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Notes</label>
            <textarea
              rows={3}
              value={editFormData.notes}
              onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Remove Application"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Are you sure you want to remove this application from your tracking pipeline? This will
            delete its timeline history.
          </p>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDelete(deleteConfirmId)}
              className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
