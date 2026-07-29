import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  BarChart3,
  Users
} from 'lucide-react';

export default function CourseIntakeTracker({ records = [], capacities = {} }) {
  const [selectedCourse, setSelectedCourse] = useState('All');

  // Compute actual registration counts per course per category
  const courseCategoryMatrix = {};

  records.forEach(rec => {
    const course = rec.course || 'Other / Unspecified';
    const cat = rec.category || 'General';

    if (!courseCategoryMatrix[course]) {
      courseCategoryMatrix[course] = {
        total: 0,
        SC: 0,
        ST: 0,
        OBC: 0,
        EWS: 0,
        General: 0,
        'General (Women)': 0
      };
    }

    courseCategoryMatrix[course].total += 1;
    if (courseCategoryMatrix[course][cat] !== undefined) {
      courseCategoryMatrix[course][cat] += 1;
    } else {
      courseCategoryMatrix[course]['General'] += 1;
    }
  });

  const courseList = Object.keys(capacities);

  const activeData = selectedCourse === 'All'
    ? courseList
    : courseList.filter(c => c === selectedCourse);

  return (
    <section className="glass-card p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Course Admission Status & Category Intake Matrix
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Compare target seat capacities against actual received student registrations by reservation category.
          </p>
        </div>

        {/* Course Filter Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCourse('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCourse === 'All'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            All Courses ({courseList.length})
          </button>
          {courseList.slice(0, 4).map(course => (
            <button
              key={course}
              onClick={() => setSelectedCourse(course)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCourse === course
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              {course.split(' ')[0]} {course.split(' ')[1] || ''}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activeData.map(courseName => {
          const targetCap = capacities[courseName] || { total: 60, SC: 9, ST: 5, OBC: 16, EWS: 6, General: 24 };
          const actualRegs = courseCategoryMatrix[courseName] || { total: 0, SC: 0, ST: 0, OBC: 0, EWS: 0, General: 0 };
          const fillRatio = ((actualRegs.total / targetCap.total) * 100).toFixed(0);

          return (
            <div 
              key={courseName}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 hover:border-indigo-500/50 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] leading-tight">
                    {courseName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[var(--text-secondary)]">
                      Target Capacity: <strong className="text-[var(--text-primary)]">{targetCap.total}</strong> seats
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">•</span>
                    <span className="text-xs text-indigo-400 font-semibold">
                      Received: {actualRegs.total} apps
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    actualRegs.total >= targetCap.total 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {fillRatio}% Filled
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[var(--bg-primary)] h-2 rounded-full overflow-hidden mb-4 border border-[var(--border-color)]">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    actualRegs.total >= targetCap.total 
                      ? 'bg-gradient-to-r from-indigo-500 to-emerald-400' 
                      : 'bg-gradient-to-r from-amber-500 to-indigo-500'
                  }`}
                  style={{ width: `${Math.min(fillRatio, 100)}%` }}
                ></div>
              </div>

              {/* Category Breakdown Table */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                
                {/* SC */}
                <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]">
                  <div className="font-semibold text-rose-400">SC</div>
                  <div className="text-[var(--text-primary)] font-bold my-0.5">{actualRegs.SC}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Cap: {targetCap.SC}</div>
                </div>

                {/* ST */}
                <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]">
                  <div className="font-semibold text-amber-400">ST</div>
                  <div className="text-[var(--text-primary)] font-bold my-0.5">{actualRegs.ST}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Cap: {targetCap.ST}</div>
                </div>

                {/* OBC */}
                <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]">
                  <div className="font-semibold text-blue-400">OBC</div>
                  <div className="text-[var(--text-primary)] font-bold my-0.5">{actualRegs.OBC}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Cap: {targetCap.OBC}</div>
                </div>

                {/* EWS */}
                <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]">
                  <div className="font-semibold text-emerald-400">EWS</div>
                  <div className="text-[var(--text-primary)] font-bold my-0.5">{actualRegs.EWS}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Cap: {targetCap.EWS}</div>
                </div>

                {/* General */}
                <div className="bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]">
                  <div className="font-semibold text-purple-400">GEN</div>
                  <div className="text-[var(--text-primary)] font-bold my-0.5">
                    {actualRegs.General + (actualRegs['General (Women)'] || 0)}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">Cap: {targetCap.General}</div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
