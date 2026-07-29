import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import CourseIntakeTracker from './components/CourseIntakeTracker';
import AnalyticsCharts from './components/AnalyticsCharts';
import ApplicantsTable from './components/ApplicantsTable';
import CandidateProfileModal from './components/CandidateProfileModal';
import AiAssistant from './components/AiAssistant';
import initialData from './data/registrations.json';
import confetti from 'canvas-confetti';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [dataPayload, setDataPayload] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileApplicant, setProfileApplicant] = useState(null); // clicked name → full profile
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Trigger subtle confetti on initial load
  useEffect(() => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 }
      });
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      
      {/* Header Navigation */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        lastUpdated={dataPayload.generated_at}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        totalRecords={dataPayload.total_records}
        onOpenAiDrawer={() => setIsAiOpen(true)}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        
        {/* KPI Metric Cards */}
        <MetricCards dataSummary={dataPayload} />

        {/* Course Admission & Category Seat Tracker */}
        <CourseIntakeTracker 
          records={dataPayload.records} 
          capacities={dataPayload.course_capacities} 
        />

        {/* Visual Analytics Charts */}
        <AnalyticsCharts 
          dataSummary={dataPayload} 
          theme={theme} 
        />

        {/* Master Applicant Directory Table */}
        <ApplicantsTable
          records={dataPayload.records}
          onSelectApplicant={(applicant) => setProfileApplicant(applicant)}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-6 px-4 text-center text-xs text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Institute for Design of Electrical Measuring Instruments (IDEMI, Mumbai). All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <span>MeitY Sponsored Training Project Response Portal</span>
          </p>
        </div>
      </footer>

      {/* Candidate Full Profile Modal (name click OR View Docs button) */}
      <CandidateProfileModal
        applicant={profileApplicant}
        onClose={() => setProfileApplicant(null)}
      />

      {/* AI Assistant Drawer */}
      <AiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        dataSummary={dataPayload}
        records={dataPayload.records}
      />

    </div>
  );
}
