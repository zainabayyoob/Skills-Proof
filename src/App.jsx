import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { storageService } from './services/storageService';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { SkillAssessment } from './pages/SkillAssessment';
import { SkillQuizRunner } from './pages/SkillQuizRunner';
import { BuildBreakAdapt } from './pages/BuildBreakAdapt';
import { SkillGap } from './pages/SkillGap';
import { LearningRoadmap } from './pages/LearningRoadmap';
import { SkillGraph } from './pages/SkillGraph';
import { SkillProofPassport } from './pages/SkillProofPassport';
import { InternshipsJobs } from './pages/InternshipsJobs';
import { Applications } from './pages/Applications';
import { IndustryDashboard } from './pages/IndustryDashboard';
import { CollegeDashboard } from './pages/CollegeDashboard';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

const AppContent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [localStudent, setLocalStudent] = useState(storageService.getStudentData());
  const [currentRole, setCurrentRole] = useState(storageService.getActiveRole());
  const [opportunities, setOpportunities] = useState(storageService.getOpportunities());
  const [applications, setApplications] = useState(storageService.getApplications());

  // Active student prioritizes authenticated user profile from backend
  const student = (currentRole === 'STUDENT' && user) ? user : localStudent;

  const refreshState = async () => {
    setLocalStudent(storageService.getStudentData());

    try {
      const oppRes = await api.opportunities.list();
      if (oppRes && Array.isArray(oppRes.opportunities) && oppRes.opportunities.length > 0) {
        setOpportunities(oppRes.opportunities);
      } else {
        setOpportunities(storageService.getOpportunities());
      }
    } catch {
      setOpportunities(storageService.getOpportunities());
    }

    if (api.auth.isAuthenticated()) {
      try {
        const appRes = await api.applications.list();
        if (appRes && Array.isArray(appRes.applications)) {
          setApplications(appRes.applications);
        } else {
          setApplications(storageService.getApplications());
        }
      } catch {
        setApplications(storageService.getApplications());
      }
      await refreshUser();
    } else {
      setApplications(storageService.getApplications());
    }
  };

  useEffect(() => {
    refreshState();
  }, [isAuthenticated]);

  const handleSwitchRole = (newRole) => {
    storageService.setActiveRole(newRole);
    setCurrentRole(newRole);
    if (newRole === 'INDUSTRY') {
      navigate('/industry');
    } else if (newRole === 'FACULTY' || newRole === 'COLLEGE') {
      navigate('/faculty');
    } else {
      navigate('/');
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo data back to clean baseline state for SIH presentation?')) {
      storageService.resetDemoData();
      refreshState();
      setCurrentRole('STUDENT');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Auth Modal for Sign In / Sign Up */}
      <AuthModal />


        {/* Navigation Bar */}
        <Navbar
          currentRole={currentRole}
          onSwitchRole={handleSwitchRole}
          onResetData={handleResetDemo}
          student={student}
        />

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar currentRole={currentRole} />

          {/* Viewport */}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    student={student}
                    opportunities={opportunities}
                    applications={applications}
                    onProfileUpdated={refreshState}
                  />
                }
              />
              <Route path="/assessment" element={<SkillAssessment student={student} />} />
              <Route path="/quiz" element={<SkillQuizRunner onAssessmentCompleted={refreshState} />} />
              <Route path="/build-break-adapt" element={<BuildBreakAdapt onScoreUpdated={refreshState} />} />
              <Route path="/skill-gap" element={<SkillGap student={student} />} />
              <Route path="/roadmap" element={<LearningRoadmap student={student} />} />
              <Route path="/skill-graph" element={<SkillGraph student={student} />} />
              <Route path="/passport" element={<SkillProofPassport student={student} />} />
              <Route
                path="/opportunities"
                element={
                  <InternshipsJobs
                    student={student}
                    onApplicationSubmitted={refreshState}
                  />
                }
              />
              <Route path="/applications" element={<Applications />} />
              <Route path="/industry" element={<IndustryDashboard student={student} />} />
              <Route path="/faculty" element={<CollegeDashboard />} />
              <Route path="/college" element={<CollegeDashboard />} />
              <Route
                path="/profile"
                element={
                  <Profile
                    student={student}
                    onResetData={handleResetDemo}
                    onProfileUpdated={refreshState}
                  />
                }
              />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
  );
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

