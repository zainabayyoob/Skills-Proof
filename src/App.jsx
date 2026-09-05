import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { SkillAssessment } from './pages/SkillAssessment';
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

export const App = () => {
  const [student, setStudent] = useState(storageService.getStudentData());
  const [currentRole, setCurrentRole] = useState(storageService.getActiveRole());
  const [opportunities, setOpportunities] = useState(storageService.getOpportunities());
  const [applications, setApplications] = useState(storageService.getApplications());

  const refreshState = () => {
    setStudent(storageService.getStudentData());
    setOpportunities(storageService.getOpportunities());
    setApplications(storageService.getApplications());
  };

  const handleSwitchRole = (newRole) => {
    storageService.setActiveRole(newRole);
    setCurrentRole(newRole);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo data back to clean baseline state for SIH presentation?')) {
      storageService.resetDemoData();
      refreshState();
      setCurrentRole('STUDENT');
      window.location.hash = '#/';
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
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
              <Route path="/assessment" element={<SkillAssessment />} />
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};
