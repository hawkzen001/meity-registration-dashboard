import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import CourseIntakeTracker from './components/CourseIntakeTracker';
import AnalyticsCharts from './components/AnalyticsCharts';
import ApplicantsTable from './components/ApplicantsTable';
import CandidateProfileModal from './components/CandidateProfileModal';
import AiAssistant from './components/AiAssistant';
import AuthScreen from './components/AuthScreen';
import initialData from './data/registrations.json';
import { 
  isEncrypted, 
  loadSession, 
  saveSession, 
  clearSession, 
  decryptWithMasterKey 
} from './utils/crypto';
import confetti from 'canvas-confetti';
import { ShieldCheck, Lock } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [dataPayload, setDataPayload] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileApplicant, setProfileApplicant] = useState(null); // clicked name → full profile
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Authenticate / restore session on mount
  useEffect(() => {
    async function initAuth() {
      if (!isEncrypted(initialData)) {
        // Unencrypted fallback (e.g. dev mode)
        setDataPayload(initialData);
        setCurrentUser({ username: 'staff', name: 'Authorized Staff', role: 'staff' });
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        return;
      }

      // Check existing active session
      const cachedSession = loadSession();
      if (cachedSession && cachedSession.masterKeyRaw) {
        try {
          const decrypted = await decryptWithMasterKey(initialData, cachedSession.masterKeyRaw);
          setDataPayload(decrypted);
          setCurrentUser(cachedSession.user);
          setIsAuthenticated(true);
        } catch (err) {
          console.warn('Session restoration failed:', err);
          clearSession();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsCheckingAuth(false);
    }

    initAuth();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginSuccess = (decryptedData, user) => {
    setDataPayload(decryptedData);
    setCurrentUser(user);
    setIsAuthenticated(true);

    // Subtle celebration on successful unlock
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setDataPayload(null);
    setIsAuthenticated(false);
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

  // 1. Loading Splash while verifying cached credentials
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 animate-pulse">
            <Lock className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Verifying secure session…
          </p>
        </div>
      </div>
    );
  }

  // 2. Auth Screen if not logged in
  if (!isAuthenticated || !dataPayload) {
    return (
      <AuthScreen
        encryptedEnvelope={initialData}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // 3. Full Protected Dashboard
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
        currentUser={currentUser}
        onLogout={handleLogout}
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
