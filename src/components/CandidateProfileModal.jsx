import React, { useEffect } from 'react';
import {
  X,
  User,
  Users,
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  Tag,
  Layers,
  FileText,
  ExternalLink,
  ShieldCheck,
  Image,
  CreditCard,
  FileCheck2,
  Paperclip,
  Link2,
  BadgeCheck
} from 'lucide-react';

/* ── Document label map ─────────────────────────────────────────────────── */
const DOC_LABELS = {
  ssc:        { label: 'SSC Marksheet',               icon: FileText,   color: 'text-blue-400   bg-blue-500/10   border-blue-500/20' },
  hsc:        { label: 'HSC Marksheet',               icon: FileText,   color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  graduation: { label: 'Graduation Marksheet',        icon: FileCheck2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  diploma:    { label: 'Diploma Marksheet',           icon: FileCheck2, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  age_proof:  { label: 'Age Proof Document',          icon: CreditCard, color: 'text-amber-400  bg-amber-500/10  border-amber-500/20'  },
  photo:      { label: 'Passport Photograph',         icon: Image,      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  identity:   { label: 'Govt. ID / Aadhaar',         icon: CreditCard, color: 'text-cyan-400   bg-cyan-500/10   border-cyan-500/20'   },
  caste:      { label: 'Caste Certificate',           icon: ShieldCheck,color: 'text-rose-400   bg-rose-500/10   border-rose-500/20'   },
  ews_income: { label: 'EWS / Income Certificate',   icon: ShieldCheck,color: 'text-teal-400   bg-teal-500/10   border-teal-500/20'   },
};

/* ── Category badge colour ──────────────────────────────────────────────── */
const CAT_COLOUR = {
  SC:              'badge-sc',
  ST:              'badge-st',
  OBC:             'badge-obc',
  EWS:             'badge-ews',
  'General (Women)':'badge-gen',
  General:         'badge-gen',
};

/* ── Small info row ─────────────────────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value, mono = false, full = false }) {
  if (!value) return null;
  return (
    <div className={`flex items-start gap-3 ${full ? 'col-span-2' : ''}`}>
      <div className="mt-0.5 p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] shrink-0">
        <Icon className="w-3.5 h-3.5 text-indigo-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-0.5">{label}</p>
        <p className={`text-xs font-semibold text-[var(--text-primary)] leading-snug break-words ${mono ? 'font-mono' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function CandidateProfileModal({ applicant, onClose }) {
  /* Close on Escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!applicant) return null;

  const docs    = applicant.documents || {};
  const docKeys = Object.keys(docs);

  /* Derive initials for avatar */
  const initials = (applicant.name || '?')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const catClass = CAT_COLOUR[applicant.category] || 'badge-gen';

  return (
    /* ── Backdrop ─────────────────────────────────────────────────────── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* ── Modal Panel ──────────────────────────────────────────────── */}
      <div
        className="relative bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp .25s cubic-bezier(.4,0,.2,1) both' }}
      >

        {/* ── Gradient accent bar ───────────────────────────────────── */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 shrink-0" />

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-card)] shrink-0">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20 shrink-0">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-[var(--text-primary)] truncate">
              {applicant.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              <span className={`badge ${catClass} text-[10px]`}>{applicant.category}</span>
              <span className="text-[11px] text-[var(--text-muted)]">·</span>
              <span className="text-[11px] text-[var(--text-secondary)]">{applicant.gender}</span>
              <span className="text-[11px] text-[var(--text-muted)]">·</span>
              <span className="text-[11px] text-[var(--text-secondary)]">{applicant.qualification}</span>
            </div>
          </div>

          {/* Doc count pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold shrink-0">
            <Paperclip className="w-3 h-3" />
            {docKeys.length} Docs
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable Body ──────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* ── Section: IDEMI Enrollment Verification Status ────── */}
          {applicant.already_enrolled_at_idemi ? (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-amber-200">Already Enrolled in IDEMI Animation Department</p>
                {applicant.enrollment_match_detail?.includes(' | ') ? (
                  <div className="mt-2 space-y-1.5 p-2.5 rounded bg-amber-950/30 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-500/70 font-semibold w-24 shrink-0">Course:</span>
                      <span className="text-amber-300 font-medium">{applicant.enrollment_match_detail.split(' | ')[1]}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-500/70 font-semibold w-24 shrink-0">Enrollment No:</span>
                      <span className="text-amber-300 font-mono">{applicant.enrollment_match_detail.split(' | ')[2]?.replace('#', '')}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-500/70 font-semibold w-24 shrink-0">Match Type:</span>
                      <span className="text-amber-400/80 capitalize">{applicant.enrollment_match_detail.split(' | ')[0]}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-400/80 mt-0.5">
                    Matched in last 3 academic years ({applicant.enrollment_match_detail || 'Exact name match'}). 
                  </p>
                )}
                <p className="text-[11px] text-amber-500/80 mt-2 font-medium">Exclude from new recruitment outreach.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-emerald-200">Fresh Candidate / Not Yet Enrolled</p>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">
                  No prior enrollment record found in IDEMI Animation files. Recommended for Academic Counsellor outreach!
                </p>
              </div>
            </div>
          )}

          {/* ── Section: Personal Information ────────────────────── */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5" />
              Personal Information
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <InfoRow icon={User}        label="Full Name"       value={applicant.name} />
              <InfoRow icon={Users}       label="Father's Name"   value={applicant.father_name} />
              <InfoRow icon={CalendarDays}label="Date of Birth"   value={applicant.dob} />
              <InfoRow icon={Tag}         label="Category"        value={applicant.raw_category || applicant.category} />
              <InfoRow icon={User}        label="Gender"          value={applicant.gender} />
              <InfoRow icon={BookOpen}    label="Qualification"   value={applicant.qualification} />
              <InfoRow icon={Link2}       label="Reference / How Heard"  value={applicant.reference} full={false} />
              <InfoRow icon={MapPin}      label="Full Permanent Address"  value={applicant.address} full={true} />
            </div>
          </div>

          {/* ── Section: Contact Details ─────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              Contact Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <InfoRow icon={Phone} label="WhatsApp / Primary"  value={applicant.whatsapp}  mono />
              <InfoRow icon={Phone} label="Alternate Phone"     value={applicant.alt_phone} mono />
              <InfoRow icon={Mail}  label="Email Address"       value={applicant.email}     mono />
            </div>
          </div>

          {/* ── Section: Enrolment Details ───────────────────────── */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Enrolment Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <InfoRow icon={Layers}      label="Course Applied"   value={applicant.course}    full={true} />
              <InfoRow icon={CalendarDays}label="Form Submitted"   value={applicant.timestamp ? new Date(applicant.timestamp).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'}) : applicant.timestamp} />
              <InfoRow icon={FileText}    label="Data Source Sheet"value={applicant.sheet} />
            </div>
          </div>

          {/* ── Section: Uploaded Documents ──────────────────────── */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" />
              Uploaded Verification Documents
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 text-[10px] font-bold">{docKeys.length}</span>
            </p>

            {docKeys.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)] bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No documents uploaded for this candidate.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {docKeys.map(key => {
                  const info     = DOC_LABELS[key] || { label: key.toUpperCase(), icon: FileText, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
                  const IconComp = info.icon;
                  const url      = docs[key];
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-indigo-500/50 hover:bg-[var(--bg-card-hover)] transition-all group"
                    >
                      <div className={`p-2 rounded-lg border ${info.color} shrink-0`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{info.label}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Google Drive · Click to view</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-indigo-400 transition-colors shrink-0" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between shrink-0">
          <p className="text-[10px] text-[var(--text-muted)]">
            Registration #{applicant.id} · Press <kbd className="px-1 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] text-[9px]">Esc</kbd> to close
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Slide-up keyframe (inline so no CSS file dependency) */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
      `}</style>
    </div>
  );
}
