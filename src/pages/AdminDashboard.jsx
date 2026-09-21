import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Filter,
  Users,
  Building2,
  School,
  UserCheck,
  UserX,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Copy,
  Eye,
  Lock,
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { user: authUser, isAuthenticated } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    candidatesCount: 0,
    activeCandidatesCount: 0,
    industryCount: 0,
    facultyCount: 0,
    adminCount: 0,
    deactivatedCount: 0,
    totalTestAttempts: 0,
    totalApplications: 0,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [detailedData, setDetailedData] = useState(null);

  // Deactivation Confirmation Modal
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);

  // Removal Safety Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const [copiedId, setCopiedId] = useState(null);

  const isAdmin = authUser && ['admin', 'host'].includes(String(authUser.role || '').toLowerCase());

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, roleFilter, statusFilter]);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getUsers({
          search: searchTerm,
          role: roleFilter,
          status: statusFilter,
        }),
      ]);

      if (statsRes) setStats(statsRes);
      if (usersRes && Array.isArray(usersRes.users)) {
        setUsers(usersRes.users);
      }
    } catch (err) {
      console.error('Admin load error:', err);
      setErrorMsg(err.message || 'Failed to load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Inspect User Details
  const handleOpenUserDetails = async (user) => {
    setSelectedUser(user);
    setUserDetailsModalOpen(true);
    setUserDetailsLoading(true);
    try {
      const res = await api.admin.getUserById(user.id);
      setDetailedData(res);
    } catch (err) {
      console.error('Failed to load user details:', err);
    } finally {
      setUserDetailsLoading(false);
    }
  };

  // Safe Deactivate / Reactivate
  const handleToggleDeactivation = (user) => {
    if (user.isDeactivated) {
      // Direct Reactivate
      executeReactivate(user);
    } else {
      // Open confirmation modal for deactivation
      setUserToDeactivate(user);
      setDeactivateModalOpen(true);
    }
  };

  const executeDeactivate = async () => {
    if (!userToDeactivate) return;
    setIsDeactivating(true);
    setErrorMsg('');
    setActionSuccessMsg('');
    try {
      const res = await api.admin.deactivateUser(userToDeactivate.id);
      setActionSuccessMsg(res.message || `User ${userToDeactivate.name} deactivated.`);
      setDeactivateModalOpen(false);
      setUserToDeactivate(null);
      await loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to deactivate user.');
    } finally {
      setIsDeactivating(false);
    }
  };

  const executeReactivate = async (user) => {
    setIsDeactivating(true);
    setErrorMsg('');
    setActionSuccessMsg('');
    try {
      const res = await api.admin.reactivateUser(user.id);
      setActionSuccessMsg(res.message || `User ${user.name} reactivated.`);
      await loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reactivate user.');
    } finally {
      setIsDeactivating(false);
    }
  };

  // Permanent Removal
  const handleOpenDeleteConfirm = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const executeDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setErrorMsg('');
    setActionSuccessMsg('');
    try {
      const res = await api.admin.deleteUser(userToDelete.id);
      setActionSuccessMsg(res.message || `User ${userToDelete.name} permanently removed.`);
      setDeleteModalOpen(false);
      setUserToDelete(null);
      await loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to permanently remove user.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center mx-auto mb-4 text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Administrative Console Restricted</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          You must be logged in as an authorized Host or Administrator (<code className="text-brand-300">admin@skillproof.org</code>) to access user management controls.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Main Application
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-purple-400/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Host / Administrator Console
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Host Authority
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live database user registry, standardized identity verification, and safe candidate removal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-400' : ''}`} />
            <span>Refresh Registry</span>
          </button>
        </div>
      </div>

      {/* Alert Notices */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between gap-3 text-emerald-300 text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg('')}
            className="text-emerald-400/60 hover:text-emerald-300 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-between gap-3 text-rose-300 text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg('')}
            className="text-rose-400/60 hover:text-rose-300 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Live System Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</p>
          <p className="text-[10px] text-slate-500 mt-1">Registered in db.json</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[11px] font-medium text-brand-400 uppercase tracking-wider">Active Candidates</p>
          <p className="text-2xl font-bold text-brand-300 mt-1">{stats.activeCandidatesCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Eligible for Industry search</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">Recruiters</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{stats.industryCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Industry partners</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">Faculty</p>
          <p className="text-2xl font-bold text-amber-300 mt-1">{stats.facultyCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Academic evaluators</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[11px] font-medium text-rose-400 uppercase tracking-wider">Deactivated</p>
          <p className="text-2xl font-bold text-rose-300 mt-1">{stats.deactivatedCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Access suspended</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[11px] font-medium text-purple-400 uppercase tracking-wider">Admins</p>
          <p className="text-2xl font-bold text-purple-300 mt-1">{stats.adminCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">System controllers</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by User ID (e.g. SP-STU-...), Name, Email, or College..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Roles</option>
              <option value="candidate">Student / Candidate</option>
              <option value="industry">Industry / Recruiter</option>
              <option value="faculty">Faculty / Academia</option>
              <option value="admin">Administrator</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="deactivated">Deactivated Only</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Users Registry Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" /> Registered User Accounts
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Showing {users.length} {users.length === 1 ? 'user' : 'users'} in persistent storage
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-400" />
            Loading user registry...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No users match the search criteria</p>
            <p className="text-xs text-slate-500">
              Only real accounts registered through the application will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Permanent User ID</th>
                  <th className="px-5 py-3">User Details</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Skills / Resume</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => {
                  const isUserAdmin = u.role === 'admin' || u.role === 'host';
                  const isSelf = u.id === authUser?.id;

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        u.isDeactivated ? 'opacity-60 bg-rose-950/10' : ''
                      }`}
                    >
                      {/* User ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <code className="text-xs font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                            {u.id}
                          </code>
                          <button
                            onClick={() => handleCopyId(u.id)}
                            title="Copy User ID"
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {copiedId === u.id && (
                          <span className="text-[10px] text-emerald-400 block mt-0.5">Copied!</span>
                        )}
                      </td>

                      {/* User Details */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm">{u.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{u.email}</span>
                        </div>
                        {u.college && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <School className="w-3 h-3 text-slate-600" />
                            <span>{u.college}</span>
                          </div>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            u.role === 'admin' || u.role === 'host'
                              ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                              : u.role === 'industry' || u.role === 'recruiter'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                              : u.role === 'faculty' || u.role === 'college'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                              : 'bg-brand-950/80 text-brand-300 border-brand-800'
                          }`}
                        >
                          {u.role === 'candidate' || u.role === 'student'
                            ? 'Student / Candidate'
                            : u.role === 'industry'
                            ? 'Industry Recruiter'
                            : u.role === 'faculty'
                            ? 'Faculty / Academia'
                            : 'Host / Admin'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {u.isDeactivated ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                            <XCircle className="w-3 h-3 text-rose-400" /> Deactivated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                          </span>
                        )}
                      </td>

                      {/* Skills / Resume */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-300 block">
                            {u.verifiedSkillsCount || 0} Verified Skills
                          </span>
                          {u.hasResume ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-brand-300">
                              <FileText className="w-3 h-3" /> Resume Uploaded
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">No Resume</span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Details */}
                          <button
                            onClick={() => handleOpenUserDetails(u)}
                            title="Inspect User Details & Telemetry"
                            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Deactivate / Reactivate Toggle */}
                          {!isSelf && !isUserAdmin && (
                            <button
                              onClick={() => handleToggleDeactivation(u)}
                              title={u.isDeactivated ? "Reactivate User Account" : "Safe Deactivate Account"}
                              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                u.isDeactivated
                                  ? 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-800 text-emerald-300'
                                  : 'bg-amber-950/60 hover:bg-amber-900 border-amber-800 text-amber-300'
                              }`}
                            >
                              {u.isDeactivated ? (
                                <UserCheck className="w-3.5 h-3.5" />
                              ) : (
                                <UserX className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {/* Permanent Removal Button */}
                          {!isSelf && !isUserAdmin && (
                            <button
                              onClick={() => handleOpenDeleteConfirm(u)}
                              title="Permanently Remove User (Confirmation Required)"
                              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          USER DETAILS INSPECTION MODAL
      ======================================================== */}
      {userDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">User Profile & Telemetry</h3>
                  <code className="text-[11px] font-mono text-slate-400">{selectedUser.id}</code>
                </div>
              </div>
              <button
                onClick={() => setUserDetailsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {userDetailsLoading ? (
                <div className="py-12 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-400" />
                  Loading detailed telemetry...
                </div>
              ) : (
                <>
                  {/* Basic Profile Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Full Name</p>
                      <p className="text-white font-semibold text-sm mt-0.5">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Email Address</p>
                      <p className="text-slate-300 font-mono mt-0.5">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Account Role</p>
                      <p className="text-brand-300 font-semibold mt-0.5 uppercase">{selectedUser.role}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Account Status</p>
                      <p className={selectedUser.isDeactivated ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {selectedUser.isDeactivated ? 'Deactivated' : 'Active'}
                      </p>
                    </div>
                    {selectedUser.phone && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Phone</p>
                        <p className="text-slate-300 font-mono mt-0.5">{selectedUser.countryCode || '+91'} {selectedUser.phone}</p>
                      </div>
                    )}
                    {selectedUser.college && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">College / Institution</p>
                        <p className="text-slate-300 mt-0.5">{selectedUser.college}</p>
                      </div>
                    )}
                    {selectedUser.degree && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Degree & Batch</p>
                        <p className="text-slate-300 mt-0.5">{selectedUser.degree} ({selectedUser.graduationYear})</p>
                      </div>
                    )}
                    {selectedUser.targetRole && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Target Role</p>
                        <p className="text-brand-300 mt-0.5">{selectedUser.targetRole}</p>
                      </div>
                    )}
                  </div>

                  {/* Verified Skills */}
                  <div>
                    <h4 className="font-bold text-white text-xs mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Verified Skills ({selectedUser.verifiedSkills?.length || 0})
                    </h4>
                    {selectedUser.verifiedSkills && selectedUser.verifiedSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.verifiedSkills.map((s, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2"
                          >
                            <span className="font-semibold text-white">{s.name}</span>
                            <span className="px-1.5 py-0.2 rounded bg-brand-950 text-brand-300 text-[10px] font-bold border border-brand-800">
                              {s.score}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">No verified skills recorded yet.</p>
                    )}
                  </div>

                  {/* Resume Details */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-brand-400" /> Uploaded Resume
                      </h4>
                      <p className="text-slate-400 mt-1">
                        {selectedUser.hasResume
                          ? `${selectedUser.resumeFileName} (${selectedUser.resumeFileSize || 'Stored'})`
                          : 'No resume uploaded by user.'}
                      </p>
                    </div>
                  </div>

                  {/* Applications & Attempts */}
                  {detailedData && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                        <p className="text-slate-500 text-[10px] uppercase font-bold">Applications Submitted</p>
                        <p className="text-xl font-bold text-white mt-0.5">{detailedData.applications?.length || 0}</p>
                      </div>
                      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                        <p className="text-slate-500 text-[10px] uppercase font-bold">Test Attempts</p>
                        <p className="text-xl font-bold text-white mt-0.5">{detailedData.testAttempts?.length || 0}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setUserDetailsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SAFETY DEACTIVATION CONFIRMATION MODAL
      ======================================================== */}
      {deactivateModalOpen && userToDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Deactivate User Account</h3>
                <p className="text-xs text-slate-400">Suspend user access and candidate queries</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to deactivate this user account? The candidate will be immediately excluded from Industry candidate search and Faculty active views, and will be blocked from logging in.
            </p>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">User ID:</span>
                <span className="font-mono text-white font-bold">{userToDeactivate.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Full Name:</span>
                <span className="text-white font-semibold">{userToDeactivate.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-300 font-mono">{userToDeactivate.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="text-brand-300 uppercase">{userToDeactivate.role}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeactivating}
                onClick={() => setDeactivateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeactivating}
                onClick={executeDeactivate}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                {isDeactivating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deactivating...</span>
                  </>
                ) : (
                  <span>Confirm Deactivation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SAFETY PERMANENT REMOVAL CONFIRMATION MODAL
      ======================================================== */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-rose-800/80 rounded-3xl shadow-2xl shadow-rose-950/40 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Remove User</h3>
                <p className="text-xs text-rose-400/80 font-medium">Critical Administrative Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Are you sure you want to permanently remove this user account?
            </p>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-[11px] text-rose-300 leading-relaxed">
              <strong>Warning:</strong> This will cascade delete this user record, associated test attempts, applications, and physically delete any uploaded resume or photo files from the server. This action cannot be undone.
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">User ID:</span>
                <span className="font-mono text-white font-bold">{userToDelete.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Full Name:</span>
                <span className="text-white font-semibold">{userToDelete.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-300 font-mono">{userToDelete.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="text-brand-300 uppercase">{userToDelete.role}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={executeDeleteUser}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <span>Confirm & Remove User</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
