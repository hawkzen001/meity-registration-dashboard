import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { PieChart, BarChart2, Award, UserCheck } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function AnalyticsCharts({ dataSummary, theme }) {
  const courseCounts = dataSummary?.course_counts || dataSummary?.courseCounts || {};
  const categoryCounts = dataSummary?.category_counts || dataSummary?.categoryCounts || {};
  const genderCounts = dataSummary?.gender_counts || dataSummary?.genderCounts || {};
  const qualificationCounts = dataSummary?.qualification_counts || dataSummary?.qualificationCounts || {};

  const isDark = theme === 'dark';
  const textColor = isDark ? '#f3f4f6' : '#1f2937';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  // 1. Course Bar Chart Data
  const filteredCourses = Object.entries(courseCounts)
    .filter(([k]) => k !== 'Other / Unspecified')
    .sort((a, b) => b[1] - a[1]);

  const courseBarData = {
    labels: filteredCourses.map(([c]) => c.replace(' (NSQF Level 4)', '').replace(' (NSQF Level 3)', '').replace(' (NSQF Level 4.5)', '')),
    datasets: [
      {
        label: 'Applicants',
        data: filteredCourses.map(([, count]) => count),
        backgroundColor: [
          'rgba(99, 102, 241, 0.85)',
          'rgba(168, 85, 247, 0.85)',
          'rgba(236, 72, 153, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(59, 130, 246, 0.85)',
          'rgba(14, 165, 233, 0.85)',
          'rgba(20, 184, 166, 0.85)'
        ],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    ]
  };

  // 2. Category Doughnut Chart Data
  const categoryLabels = Object.keys(categoryCounts);
  const categoryDataValues = Object.values(categoryCounts);

  const categoryDoughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryDataValues,
        backgroundColor: [
          '#ef4444', // SC
          '#3b82f6', // OBC
          '#ec4899', // Gen Women
          '#10b981', // EWS
          '#a855f7', // General
          '#f59e0b'  // ST
        ],
        borderWidth: 2,
        borderColor: isDark ? '#111827' : '#ffffff'
      }
    ]
  };

  // 3. Gender Pie Chart Data
  const genderLabels = Object.keys(genderCounts);
  const genderValues = Object.values(genderCounts);

  const genderPieData = {
    labels: genderLabels,
    datasets: [
      {
        data: genderValues,
        backgroundColor: [
          '#6366f1', // Male
          '#ec4899', // Female
          '#10b981', // Other / Transgender
          '#94a3b8'
        ],
        borderWidth: 2,
        borderColor: isDark ? '#111827' : '#ffffff'
      }
    ]
  };

  // 4. Qualification Bar Chart Data
  const qualEntries = Object.entries(qualificationCounts).sort((a, b) => b[1] - a[1]);

  const qualBarData = {
    labels: qualEntries.map(([q]) => q),
    datasets: [
      {
        label: 'Applicants',
        data: qualEntries.map(([, count]) => count),
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 },
          boxWidth: 12
        }
      },
      tooltip: {
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 700 },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 }
      }
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { size: 10 } },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: textColor, font: { size: 10 } },
        grid: { color: gridColor }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 },
          padding: 14,
          boxWidth: 12
        }
      }
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      {/* 1. Course Distribution Chart */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-color)]">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Course Registration Breakdown
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">Total applications received per NSQF training course</p>
          </div>
        </div>
        <div className="h-64 relative">
          <Bar data={courseBarData} options={chartOptions} />
        </div>
      </div>

      {/* 2. Category Distribution Chart */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-color)]">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Social Reservation Category Ratio
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">SC, OBC, EWS, ST, General (Women) representation</p>
          </div>
        </div>
        <div className="h-64 relative flex items-center justify-center">
          <Doughnut data={categoryDoughnutData} options={pieOptions} />
        </div>
      </div>

      {/* 3. Gender Split Chart */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-color)]">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Gender Demographics
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">Male, Female, and Other applicant proportions</p>
          </div>
        </div>
        <div className="h-64 relative flex items-center justify-center">
          <Pie data={genderPieData} options={pieOptions} />
        </div>
      </div>

      {/* 4. Qualification Matrix Chart */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-color)]">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Educational Qualification Matrix
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">10th, 12th/ITI, Diploma, and Graduation degree holders</p>
          </div>
        </div>
        <div className="h-64 relative">
          <Bar data={qualBarData} options={{ ...chartOptions, indexAxis: 'y' }} />
        </div>
      </div>

    </section>
  );
}
