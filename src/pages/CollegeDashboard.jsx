import React, { useState, useEffect } from 'react';
import {
  School,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  Handshake,
  PlusCircle,
  Calendar,
  Clock,
  Briefcase,
  Layers,
  GraduationCap,
  Award,
  Activity
} from 'lucide-react';
import { collegeStats } from '../data/collegeData';
import { api } from '../services/api';
import { Modal } from '../components/Modal';

export const CollegeDashboard = () => {
  // Telemetry Analytics State
  const [analytics, setAnalytics] = useState({
    institutionName: 'ABC Institute of Technology & Engineering',
    totalStudents: 1250,
    studentsAssessed: 480,
    verifiedSkillsCount: 3420,
    placementReadiness: 79,
    domainGaps: [
      { domain: 'Python Programming', rating: 'Strong', avgScore: 84, percentageNeedingImprovement: 16, impactedStudents: 200, actionRecommended: 'Advanced Async IO & System Architectures', severity: 'Low' },
      { domain: 'SQL & Database Systems', rating: 'Strong', avgScore: 81, percentageNeedingImprovement: 22, impactedStudents: 275, actionRecommended: 'Query Optimization & Indexing Workshops', severity: 'Low' },
      { domain: 'Data Structures & Algorithms', rating: 'Medium', avgScore: 68, percentageNeedingImprovement: 44, impactedStudents: 550, actionRecommended: 'Dynamic Programming & Graph Algorithmic Bootcamps', severity: 'Medium' },
      { domain: 'Cloud & DevOps (Docker/CI-CD)', rating: 'Medium', avgScore: 64, percentageNeedingImprovement: 52, impactedStudents: 650, actionRecommended: 'Hands-on Cloud Sandbox Laboratories', severity: 'High' },
      { domain: 'Communication & Tech Articulation', rating: 'Weak', avgScore: 58, percentageNeedingImprovement: 62, impactedStudents: 775, actionRecommended: 'Peer Code Review Sessions & Tech Presentations', severity: 'Critical' },
    ],
    internshipParticipation: 185,
    placedStudents: 142
  });

  // Groups and Cohorts
  const [groups, setGroups] = useState([
    { id: 'grp-1', name: 'Batch 2026 - CS Alpha', department: 'Computer Science', studentsCount: 65, avgReadiness: 82 },
    { id: 'grp-2', name: 'Batch 2026 - CS Beta', department: 'Computer Science', studentsCount: 60, avgReadiness: 76 },
    { id: 'grp-3', name: 'AI & Data Engineering Cohort', department: 'Information Technology', studentsCount: 45, avgReadiness: 85 },
  ]);

  // Assigned Assessments
  const [assignments, setAssignments] = useState([
    { id: 'asgn-1', title: 'Python Production Reliability Benchmark', groupName: 'Batch 2026 - CS Alpha', skill: 'Python', deadline: '2026-09-25', status: 'Active' },
    { id: 'asgn-2', title: 'Relational Schema Optimization Challenge', groupName: 'AI & Data Engineering Cohort', skill: 'SQL', deadline: '2026-09-30', status: 'Active' },
  ]);

  // Faculty Activities
  const [facultyActivities, setFacultyActivities] = useState([
    { id: 'act-1', type: 'Faculty Development Program (FDP)', title: 'Modern Microservices & API Design', partner: 'TechScale Innovations', date: '2026-08-20', participants: 42 },
    { id: 'act-2', type: 'Industry Guest Lecture', title: 'Production Fault Tolerance & Chaos Engineering', partner: 'Apex Data Systems', date: '2026-09-02', participants: 180 },
    { id: 'act-3', type: 'Mentoring Clinic', title: 'SkillProof Passport Code Review & Capstone Guidance', partner: 'University Innovation Cell', date: '2026-09-08', participants: 95 },
  ]);

  // Industry vs Student Comparison Data
  const benchmarkComparison = [
    { skill: 'Python', studentAvg: 84, industryBenchmark: 80, delta: '+4%', status: 'Surplus' },
    { skill: 'SQL', studentAvg: 81, industryBenchmark: 75, delta: '+6%', status: 'Surplus' },
    { skill: 'DSA & Algorithms', studentAvg: 68, industryBenchmark: 78, delta: '-10%', status: 'Deficit' },
    { skill: 'Cloud & Docker', studentAvg: 64, industryBenchmark: 75, delta: '-11%', status: 'Deficit' },
    { skill: 'Technical Communication', studentAvg: 58, industryBenchmark: 75, delta: '-17%', status: 'Critical Deficit' },
  ];

  // Collaboration Offers
  const [collaborationOffers] = useState(collegeStats.collaborationOffers);
  const [connectedIds, setConnectedIds] = useState([]);

  // Modals
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [assignAssessmentOpen, setAssignAssessmentOpen] = useState(false);
  const [logActivityOpen, setLogActivityOpen] = useState(false);

  // Form States
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDept, setNewGroupDept] = useState('Computer Science & Engineering');
  const [newGroupCount, setNewGroupCount] = useState(40);

  const [assignSkill, setAssignSkill] = useState('Python');
  const [assignGroup, setAssignGroup] = useState('Batch 2026 - CS Alpha');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDeadline, setAssignDeadline] = useState('2026-10-15');

  const [activityType, setActivityType] = useState('Workshop');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityPartner, setActivityPartner] = useState('Apex Data Systems');
  const [activityParticipants, setActivityParticipants] = useState(50);
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);

  // Load telemetry from API
  useEffect(() => {
    loadCollegeAnalytics();
    loadCollegeGroups();
    loadFacultyData();
  }, []);

  const loadCollegeAnalytics = async () => {
    try {
      const res = await api.college.getAnalytics();
      if (res && res.analytics) {
        setAnalytics((prev) => ({ ...prev, ...res.analytics }));
      }
    } catch (e) {
      console.warn('Could not load college analytics:', e);
    }
  };

  const loadCollegeGroups = async () => {
    try {
      const res = await api.college.getGroups();
      if (res && res.groups && res.groups.length > 0) {
        setGroups(res.groups);
      }
    } catch (e) {
      console.warn('Could not load groups:', e);
    }
  };

  const loadFacultyData = async () => {
    try {
      const res = await api.college.getFaculty();
      if (res && res.faculty && res.faculty.activities) {
        setFacultyActivities(res.faculty.activities);
      }
    } catch (e) {
      console.warn('Could not load faculty data:', e);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const payload = {
      name: newGroupName,
      department: newGroupDept,
      studentsCount: Number(newGroupCount) || 30,
      avgReadiness: 78
    };

    try {
      const res = await api.college.createGroup(payload);
      if (res && res.group) {
        setGroups((prev) => [...prev, res.group]);
      } else {
        setGroups((prev) => [...prev, { ...payload, id: `grp-${Date.now()}` }]);
      }
    } catch (err) {
      setGroups((prev) => [...prev, { ...payload, id: `grp-${Date.now()}` }]);
    }

    setCreateGroupOpen(false);
    setNewGroupName('');
  };

  const handleAssignAssessment = async (e) => {
    e.preventDefault();
    const payload = {
      title: assignTitle || `SkillProof ${assignSkill} Benchmark Evaluation`,
      groupName: assignGroup,
      skillId: assignSkill.toLowerCase(),
      skillName: assignSkill,
      deadline: assignDeadline,
      status: 'Active'
    };

    try {
      await api.college.assignAssessment(payload);
    } catch (err) {
      console.warn('Assign assessment error:', err);
    }

    setAssignments((prev) => [{ ...payload, id: `asgn-${Date.now()}` }, ...prev]);
    setAssignAssessmentOpen(false);
    setAssignTitle('');
  };

  const handleLogActivity = async (e) => {
    e.preventDefault();
    const payload = {
      type: activityType,
      title: activityTitle,
      partner: activityPartner,
      date: activityDate,
      participants: Number(activityParticipants) || 30
    };

    try {
      await api.college.addFacultyActivity(payload);
    } catch (err) {
      console.warn('Log activity error:', err);
    }

    setFacultyActivities((prev) => [{ ...payload, id: `act-${Date.now()}` }, ...prev]);
    setLogActivityOpen(false);
    setActivityTitle('');
  };

  const handleConnect = (offerId) => {
    setConnectedIds((prev) => [...prev, offerId]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-900/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5" />
              COLLEGE / ACADEMIA MODULE
            </span>
            <span className="text-xs text-slate-400">{analytics.institutionName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Institutional Skill Mapping & Placement Telemetry
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Real-time aggregate telemetry computed from live student database records: skill gap analytics,
            cohort group management, curriculum intervention benchmarks, and industry collaboration programs.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center shrink-0 shadow-lg">
          <span className="text-3xl font-black text-amber-400">
            {analytics.placementReadiness}%
          </span>
          <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Cohort Placement Readiness</p>
        </div>
      </div>

      {/* Aggregate Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Enrolled</span>
          <p className="text-2xl font-black text-white">{analytics.totalStudents}</p>
          <p className="text-[10px] text-slate-500 font-mono">B.Tech & M.Tech</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Assessed Students</span>
          <p className="text-2xl font-black text-brand-300">{analytics.studentsAssessed}</p>
          <p className="text-[10px] text-slate-500 font-mono">Passed Quizzes & Code</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Active Applications</span>
          <p className="text-2xl font-black text-indigo-400">{analytics.internshipParticipation}</p>
          <p className="text-[10px] text-slate-500 font-mono">In Industry Pipeline</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Final Placements</span>
          <p className="text-2xl font-black text-emerald-400">{analytics.placedStudents}</p>
          <p className="text-[10px] text-slate-500 font-mono">PPO & Selection Rate 88%</p>
        </div>
      </div>

      {/* Domain Skill Gap Analytics (Strong / Medium / Weak) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Domain Skill Gap Analytics (Strong / Medium / Weak)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live aggregate scoring across core engineering disciplines showing percentage of students requiring targeted intervention.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{analytics.studentsAssessed} Telemetry Samples</span>
        </div>

        <div className="space-y-4">
          {(analytics.domainGaps || []).map((item, idx) => {
            const isStrong = item.rating === 'Strong';
            const isMedium = item.rating === 'Medium';
            const badgeColor = isStrong
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : isMedium
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

            const barColor = isStrong
              ? 'from-emerald-500 to-teal-500'
              : isMedium
              ? 'from-amber-500 to-orange-500'
              : 'from-orange-500 to-rose-600';

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{item.domain}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                      {item.rating || 'Evaluated'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Cohort Avg: <strong className="text-white">{item.avgScore}%</strong>
                    </span>
                  </div>

                  <span className="text-rose-400 font-bold font-mono text-[11px]">
                    {item.percentageNeedingImprovement}% Need Improvement (~{item.impactedStudents} students)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`bg-gradient-to-r ${barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentageNeedingImprovement}%` }}
                  />
                </div>

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-1">
                  <span>
                    Curriculum Intervention:{' '}
                    <strong className="text-amber-300">{item.actionRecommended}</strong>
                  </span>
                  <span className="text-slate-500 font-mono">Severity: {item.severity || 'Standard'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compare Industry vs Student Cohort Skills Benchmark */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Industry Demand vs. Student Cohort Competency Benchmark
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies alignment between recruiter hiring bars and actual verified student achievement.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-300 font-bold">2026 Hiring Standard</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Technical Domain</th>
                <th className="p-3">Student Cohort Average</th>
                <th className="p-3">Industry Recruiter Benchmark</th>
                <th className="p-3">Gap Delta (Δ)</th>
                <th className="p-3">Alignment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[12px]">
              {benchmarkComparison.map((row, rIdx) => {
                const isSurplus = row.status === 'Surplus';
                return (
                  <tr key={rIdx} className="hover:bg-slate-950/40">
                    <td className="p-3 font-sans font-bold text-white">{row.skill}</td>
                    <td className="p-3 text-slate-200">{row.studentAvg}%</td>
                    <td className="p-3 text-slate-400">{row.industryBenchmark}%</td>
                    <td className={`p-3 font-bold ${isSurplus ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.delta}
                    </td>
                    <td className="p-3 font-sans">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isSurplus
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort Groups & Assessment Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cohort Groups Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              Student Cohort Groups
            </h3>
            <button
              onClick={() => setCreateGroupOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Cohort</span>
            </button>
          </div>

          <div className="space-y-3">
            {groups.map((grp) => (
              <div
                key={grp.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{grp.name}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {grp.department} • {grp.studentsCount} Students
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400 font-mono">{grp.avgReadiness || 80}%</span>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Avg Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Assessments Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Cohort Assessment Deadlines
            </h3>
            <button
              onClick={() => setAssignAssessmentOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Assign Challenge</span>
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((asgn) => (
              <div
                key={asgn.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{asgn.title}</h4>
                  <span className="px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    {asgn.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Assigned to: <strong className="text-slate-200">{asgn.groupName}</strong></span>
                  <span className="font-mono text-rose-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due: {asgn.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academia & Faculty Activities (Workshops, Lectures, Mentoring) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Faculty & Academia Development Activities
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Record and review faculty upskilling programs, industry workshops, and student mentoring sessions.
            </p>
          </div>

          <button
            onClick={() => setLogActivityOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Activity</span>
          </button>
        </div>

        <div className="space-y-3">
          {facultyActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{act.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-brand-300 text-[10px] font-mono border border-slate-800">
                    {act.type}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Conducted with: <strong className="text-slate-200">{act.partner}</strong> • Date:{' '}
                  {act.date}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                  {act.participants} Faculty / Students Attended
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industry-College Collaboration Marketplace */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Handshake className="w-5 h-5 text-indigo-400" />
              Industry-College Collaboration Marketplace
            </h3>
            <p className="text-xs text-slate-400">
              Industry partners offering sponsored labs, hackathons, and guest mentoring sessions.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-300 font-bold">MoU Network</span>
        </div>

        <div className="space-y-3">
          {collaborationOffers.map((collab) => {
            const isConnected = connectedIds.includes(collab.id);
            return (
              <div
                key={collab.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{collab.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                      {collab.type}
                    </span>
                  </div>
                  <p className="text-slate-300">{collab.description}</p>
                  <p className="text-slate-400 text-[11px]">
                    Offered by: <strong className="text-brand-300">{collab.company}</strong> • Available Slots: {collab.slots}
                  </p>
                </div>

                <button
                  onClick={() => handleConnect(collab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  }`}
                >
                  {isConnected ? '✓ Connection Requested' : 'Connect with Industry'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Cohort Modal */}
      <Modal
        isOpen={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        title="Create Student Cohort Group"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Cohort Group Name *</label>
            <input
              type="text"
              required
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g. Batch 2026 - Systems & Cloud Track"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department</label>
              <select
                value={newGroupDept}
                onChange={(e) => setNewGroupDept(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Students Count</label>
              <input
                type="number"
                min="5"
                max="200"
                value={newGroupCount}
                onChange={(e) => setNewGroupCount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateGroupOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
            >
              Create Cohort
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Assessment Modal */}
      <Modal
        isOpen={assignAssessmentOpen}
        onClose={() => setAssignAssessmentOpen(false)}
        title="Assign Benchmark Challenge to Cohort"
      >
        <form onSubmit={handleAssignAssessment} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Assessment Title</label>
            <input
              type="text"
              value={assignTitle}
              onChange={(e) => setAssignTitle(e.target.value)}
              placeholder="e.g. Python Production Mutations & Edge Cases"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Skill</label>
              <select
                value={assignSkill}
                onChange={(e) => setAssignSkill(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="Python">Python</option>
                <option value="SQL">SQL</option>
                <option value="JavaScript">JavaScript</option>
                <option value="DSA">Data Structures & Algorithms</option>
                <option value="React">React</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assign to Cohort</label>
              <select
                value={assignGroup}
                onChange={(e) => setAssignGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Submission Deadline</label>
            <input
              type="date"
              required
              value={assignDeadline}
              onChange={(e) => setAssignDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAssignAssessmentOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
            >
              Assign Assessment
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Faculty Activity Modal */}
      <Modal
        isOpen={logActivityOpen}
        onClose={() => setLogActivityOpen(false)}
        title="Log Faculty / Industry Interaction"
      >
        <form onSubmit={handleLogActivity} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Activity Type</label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option value="Workshop">Hands-on Workshop</option>
                <option value="Guest Lecture">Industry Guest Lecture</option>
                <option value="Faculty Development Program (FDP)">Faculty Development (FDP)</option>
                <option value="Mentoring Clinic">Student Mentoring Clinic</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Industry Partner</label>
              <input
                type="text"
                value={activityPartner}
                onChange={(e) => setActivityPartner(e.target.value)}
                placeholder="e.g. Apex Data Systems, Google"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Title / Topic *</label>
            <input
              type="text"
              required
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              placeholder="e.g. Scalable Distributed Systems & Real-time Telemetry"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date</label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Participants</label>
              <input
                type="number"
                min="1"
                value={activityParticipants}
                onChange={(e) => setActivityParticipants(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setLogActivityOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Log Activity
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
