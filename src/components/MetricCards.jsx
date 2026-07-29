import React from 'react';
import { 
  Users, 
  UserCheck, 
  Award, 
  GraduationCap, 
  Layers, 
  FileCheck,
  TrendingUp,
  Briefcase
} from 'lucide-react';

export default function MetricCards({ dataSummary }) {
  const total = dataSummary?.total_records || dataSummary?.totalRecords || 0;
  const genderCounts = dataSummary?.gender_counts || dataSummary?.genderCounts || {};
  const categoryCounts = dataSummary?.category_counts || dataSummary?.categoryCounts || {};
  const courseCounts = dataSummary?.course_counts || dataSummary?.courseCounts || {};
  const qualificationCounts = dataSummary?.qualification_counts || dataSummary?.qualificationCounts || {};

  const femaleCount = genderCounts['Female'] || 0;
  const femalePct = total ? ((femaleCount / total) * 100).toFixed(1) : 0;

  const scCount = categoryCounts['SC'] || 0;
  const obcCount = categoryCounts['OBC'] || 0;
  const ewsCount = categoryCounts['EWS'] || 0;
  const genWomenCount = categoryCounts['General (Women)'] || 0;
  const genCount = categoryCounts['General'] || 0;
  const stCount = categoryCounts['ST'] || 0;

  const activeCoursesCount = Object.keys(courseCounts).filter(c => c !== 'Other / Unspecified').length;
  const degreeGradCount = qualificationCounts['Degree / Graduation'] || 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Registrations Card */}
      <div className="glass-card glass-card-hover p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Total Registrations
          </span>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold brand-font text-[var(--text-primary)]">
            {total.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> +100%
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Live sync from Google Sheets · Main Data
        </p>
      </div>

      {/* Female Applicants Card */}
      <div className="glass-card glass-card-hover p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Female Enrollment
          </span>
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold brand-font text-[var(--text-primary)]">
            {femaleCount.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-pink-400">
            {femalePct}% ratio
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-[var(--border-color)] h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${femalePct}%` }}
          ></div>
        </div>
      </div>

      {/* Category Breakdown Summary Card */}
      <div className="glass-card glass-card-hover p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Category Breakdown
          </span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="badge badge-sc" title="Scheduled Caste">SC: {scCount}</span>
          <span className="badge badge-obc" title="Other Backward Class">OBC: {obcCount}</span>
          <span className="badge badge-ews" title="Economically Weaker Section">EWS: {ewsCount}</span>
          <span className="badge badge-gen" title="General & Women">Gen/W: {genWomenCount + genCount}</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2.5">
          Government reservation seat coverage
        </p>
      </div>

      {/* NSQF Certified Courses Card */}
      <div className="glass-card glass-card-hover p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            NSQF Courses Active
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold brand-font text-[var(--text-primary)]">
            {activeCoursesCount}
          </span>
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            Certified Tracks
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Graphics, VFX, Animation & Mechatronics
        </p>
      </div>

    </section>
  );
}
