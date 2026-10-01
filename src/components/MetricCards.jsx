import React from 'react';
import { 
  Users, 
  UserCheck, 
  Award, 
  GraduationCap, 
  Layers, 
  FileCheck,
  TrendingUp,
  Briefcase,
  UserPlus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function MetricCards({ dataSummary }) {
  const total = dataSummary?.total_records || dataSummary?.totalRecords || 0;
  const alreadyEnrolledCount = dataSummary?.already_enrolled_count || 0;
  const newLeadsCount = dataSummary?.not_enrolled_count || (total - alreadyEnrolledCount);

  const genderCounts = dataSummary?.gender_counts || dataSummary?.genderCounts || {};
  const categoryCounts = dataSummary?.category_counts || dataSummary?.categoryCounts || {};
  const courseCounts = dataSummary?.course_counts || dataSummary?.courseCounts || {};

  const femaleCount = genderCounts['Female'] || 0;
  const femalePct = total ? ((femaleCount / total) * 100).toFixed(1) : 0;

  const scCount = categoryCounts['SC'] || 0;
  const obcCount = categoryCounts['OBC'] || 0;
  const ewsCount = categoryCounts['EWS'] || 0;
  const genWomenCount = categoryCounts['General (Women)'] || 0;
  const genCount = categoryCounts['General'] || 0;

  const newLeadsPct = total ? ((newLeadsCount / total) * 100).toFixed(1) : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      
      {/* Total Registrations Card */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Total Applications
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold brand-font text-[var(--text-primary)]">
            {total.toLocaleString()}
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] truncate">
          Verified with documents
        </p>
      </div>

      {/* New Leads for Counsellor Card */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group border-emerald-500/30">
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Fresh Leads (Counsel)
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <UserPlus className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold brand-font text-emerald-400">
            {newLeadsCount.toLocaleString()}
          </span>
          <span className="text-[11px] font-semibold text-emerald-400/90">
            {newLeadsPct}%
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] truncate">
          Not yet enrolled in IDEMI
        </p>
      </div>

      {/* Already Enrolled Card */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            Already Enrolled
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold brand-font text-[var(--text-primary)]">
            {alreadyEnrolledCount.toLocaleString()}
          </span>
          <span className="text-[11px] font-semibold text-amber-400">
            {((alreadyEnrolledCount / (total || 1)) * 100).toFixed(1)}%
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] truncate">
          Animation Dept (Last 3 Yrs)
        </p>
      </div>

      {/* Female Enrollment Card */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Female Applicants
          </span>
          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold brand-font text-[var(--text-primary)]">
            {femaleCount.toLocaleString()}
          </span>
          <span className="text-[11px] font-semibold text-pink-400">
            {femalePct}%
          </span>
        </div>
        <div className="w-full bg-[var(--border-color)] h-1.5 rounded-full overflow-hidden mt-1">
          <div 
            className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${femalePct}%` }}
          ></div>
        </div>
      </div>

      {/* Category Breakdown Card */}
      <div className="glass-card glass-card-hover p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Category Matrix
          </span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-1 flex-wrap text-[10px]">
          <span className="badge badge-sc">SC: {scCount}</span>
          <span className="badge badge-obc">OBC: {obcCount}</span>
          <span className="badge badge-ews">EWS: {ewsCount}</span>
          <span className="badge badge-gen">Gen: {genWomenCount + genCount}</span>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-1">
          Quota distribution
        </p>
      </div>

    </section>
  );
}
