import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { decryptWithPassword, saveSession } from '../utils/crypto';

export default function AuthScreen({ encryptedEnvelope, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCredentialHints, setShowCredentialHints] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // Allow browser to render loading state before heavy PBKDF2 derivation
      await new Promise((r) => setTimeout(r, 50));

      const { data, user, masterKeyRaw } = await decryptWithPassword(
        encryptedEnvelope,
        username,
        password
      );

      // Save session
      saveSession(user, masterKeyRaw, rememberMe);

      // Notify parent app
      onLoginSuccess(data, user);
    } catch (err) {
      console.error('Authentication/Decryption error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (uname, pass) => {
    setUsername(uname);
    setPassword(pass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-200">
      
      {/* Top Bar Branding */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
              IDEMI MUMBAI
            </h2>
            <p className="text-[10px] text-[var(--text-muted)] font-medium">
              MSME Technology Centre
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          AES-256 Secured
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Authorized Staff Sign-In
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Ministry of Electronics & IT (MeitY) Registration Portal
          </p>
        </div>

        {/* Security Notice Pill */}
        <div className="mb-5 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
          <KeyRound className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Applicant personal data and uploaded documents are encrypted. Enter verified staff credentials to decrypt and unlock the portal.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-400 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Authorized Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or idemi_staff"
                className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Access Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[var(--border-color)] text-indigo-600 focus:ring-indigo-500/30"
              />
              <span>Remember session on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Decrypting Data…</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Unlock Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Credentials Reference Drawer (Convenience for Staff/Demo) */}
        <div className="mt-6 pt-5 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setShowCredentialHints(!showCredentialHints)}
            className="w-full flex items-center justify-between text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors py-1"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Default Authorized Accounts
            </span>
            {showCredentialHints ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showCredentialHints && (
            <div className="mt-3 space-y-2 text-xs bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">admin</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">MeitY@Admin#2026</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin', 'MeitY@Admin#2026')}
                  className="px-2 py-1 rounded bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 text-[11px] font-medium transition-colors"
                >
                  Use Admin
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">idemi_staff</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono">IDEMI@Staff$2026</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleFillDemo('idemi_staff', 'IDEMI@Staff$2026')}
                  className="px-2 py-1 rounded bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 text-[11px] font-medium transition-colors"
                >
                  Use Staff
                </button>
              </div>

              <p className="text-[10px] text-[var(--text-muted)] pt-1 italic">
                Tip: Passwords can be changed anytime in <code>scripts/auth_config.json</code> followed by running <code>python scripts/encrypt_data.py</code>.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Footer Branding */}
      <div className="max-w-md w-full mx-auto text-center pt-6 text-[11px] text-[var(--text-muted)]">
        <p>© 2026 Institute for Design of Electrical Measuring Instruments (IDEMI, Mumbai).</p>
        <p className="mt-0.5">MeitY Sponsored Training Project · Confidential Data</p>
      </div>

    </div>
  );
}
