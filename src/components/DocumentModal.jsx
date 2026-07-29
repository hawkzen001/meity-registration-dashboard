import React from 'react';
import { 
  X, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  Image, 
  CreditCard, 
  FileCheck2,
  Download
} from 'lucide-react';

export default function DocumentModal({ applicant, onClose }) {
  if (!applicant) return null;

  const docs = applicant.documents || {};
  const docKeys = Object.keys(docs);

  const docLabels = {
    ssc: { label: 'SSC Marksheet', icon: FileText, color: 'text-blue-400 bg-blue-500/10' },
    hsc: { label: 'HSC Marksheet', icon: FileText, color: 'text-indigo-400 bg-indigo-500/10' },
    graduation: { label: 'Graduation Marksheet', icon: FileCheck2, color: 'text-purple-400 bg-purple-500/10' },
    diploma: { label: 'Diploma Marksheet', icon: FileCheck2, color: 'text-violet-400 bg-violet-500/10' },
    age_proof: { label: 'Age Proof Document', icon: CreditCard, color: 'text-amber-400 bg-amber-500/10' },
    photo: { label: 'Passport Photograph', icon: Image, color: 'text-emerald-400 bg-emerald-500/10' },
    identity: { label: 'Govt. Identity Card / Aadhaar', icon: CreditCard, color: 'text-cyan-400 bg-cyan-500/10' },
    caste: { label: 'Caste Certificate', icon: ShieldCheck, color: 'text-rose-400 bg-rose-500/10' },
    ews_income: { label: 'EWS / Income Proof', icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                Uploaded Verification Documents
              </h3>
              <span className="badge badge-obc text-[10px]">
                {docKeys.length} Files Attached
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Candidate: <strong className="text-[var(--text-primary)]">{applicant.name}</strong> ({applicant.category})
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
          {docKeys.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-muted)]">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No document links attached for this record.</p>
            </div>
          ) : (
            docKeys.map(key => {
              const info = docLabels[key] || { label: key.toUpperCase(), icon: FileText, color: 'text-indigo-400 bg-indigo-500/10' };
              const IconComp = info.icon;
              const url = docs[key];

              return (
                <div 
                  key={key}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-indigo-500/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${info.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">
                        {info.label}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[200px]">
                        Google Drive File Link
                      </p>
                    </div>
                  </div>

                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all group-hover:scale-105"
                  >
                    <span>View / Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
