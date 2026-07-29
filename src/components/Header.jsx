import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw, 
  Sun, 
  Moon, 
  Sparkles,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  lastUpdated, 
  isRefreshing, 
  onRefresh,
  totalRecords,
  onOpenAiDrawer 
}) {
  return (
    <header className="sticky top-0 z-30 bg-opacity-80 backdrop-blur-md border-b border-[var(--border-color)] bg-[var(--bg-surface)] py-3 px-4 sm:px-6 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Titles */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                MeitY Student Registration Dashboard
              </h1>
              <span className="badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                IDEMI MUMBAI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Ministry of Electronics & Information Technology (MeitY) Project Response Portal
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap w-full md:w-auto justify-end">
          
          {/* Live Status & Refresh */}
          <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg text-xs">
            <span className="pulse-dot"></span>
            <div className="flex flex-col leading-tight">
              <span className="text-[var(--text-secondary)] font-semibold">
                Live · {totalRecords.toLocaleString()} Registrations
              </span>
              <span className="text-[var(--text-muted)] text-[10px]">
                Google Sheets · Main Data · {lastUpdated ? new Date(lastUpdated).toLocaleString('en-IN',{dateStyle:'short',timeStyle:'short'}) : 'Syncing…'}
              </span>
            </div>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh dataset from Google Sheets"
              className="ml-1 p-1 hover:bg-[var(--bg-card-hover)] rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>

          {/* Ask AI Button */}
          <button
            onClick={onOpenAiDrawer}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ask AI</span>
          </button>

          {/* External Google Sheet / Form Links */}
          <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-1">
            <a
              href="https://docs.google.com/forms/d/1Bs_xlsyPvKrUDhmhBWVw2KjOr24YQfSFpnvOKTclPII/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs px-2 py-1 rounded text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-[var(--bg-card-hover)] transition-colors"
              title="Open Google Form"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Form</span>
              <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
            </a>

            <a
              href="https://docs.google.com/spreadsheets/d/1vL2_xcWv_IvgqGIGrtWIQFCXXQ9qHAvuTpfdY_uKFyM/edit?resourcekey=&gid=2069006072#gid=2069006072"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs px-2 py-1 rounded text-[var(--text-secondary)] hover:text-emerald-400 hover:bg-[var(--bg-card-hover)] transition-colors"
              title="Open Live Google Sheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sheets</span>
              <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
            </a>
          </div>

          {/* Light / Dark Mode Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
