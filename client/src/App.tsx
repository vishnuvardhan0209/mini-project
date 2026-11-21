import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudyMaterialPage } from './pages/StudyMaterialPage';
import { MCQGeneratorPage } from './pages/MCQGeneratorPage';
import { TestsListPage } from './pages/TestsListPage';
import { TestRunnerPage } from './pages/TestRunnerPage';
import { TestResultsPage } from './pages/TestResultsPage';
import { AreasToImprovePage } from './pages/AreasToImprovePage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { JobMatchPage } from './pages/JobMatchPage';
import { AIChatPage } from './pages/AIChatPage';
import { InterviewPracticePage } from './pages/InterviewPracticePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/study-material" element={<StudyMaterialPage />} />
            <Route path="/mcq-generator" element={<MCQGeneratorPage />} />
            <Route path="/tests" element={<TestsListPage />} />
            <Route path="/test-runner" element={<TestRunnerPage />} />
            <Route path="/test-results/:id" element={<TestResultsPage />} />
            <Route path="/areas-to-improve" element={<AreasToImprovePage />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
            <Route path="/job-match" element={<JobMatchPage />} />
            <Route path="/career-chat" element={<AIChatPage />} />
            <Route path="/interview-practice" element={<InterviewPracticePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
