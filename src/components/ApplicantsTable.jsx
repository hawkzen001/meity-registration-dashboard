import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Paperclip,
  CheckCircle,
  XCircle,
  Eye,
  Phone,
  Mail,
  User,
  MapPin,
  Sparkles,
  UserCheck,
  UserPlus,
  BadgeCheck,
  AlertTriangle
} from 'lucide-react';

export default function ApplicantsTable({ records = [], onSelectApplicant }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [qualFilter, setQualFilter] = useState('All');
  const [enrollmentFilter, setEnrollmentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Extract filter option lists
  const courseOptions = useMemo(() => {
    const set = new Set(records.map(r => r.course).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [records]);

  const categoryOptions = ['All', 'SC', 'OBC', 'EWS', 'General (Women)', 'General', 'ST'];
  const genderOptions = ['All', 'Female', 'Male', 'Transgender', 'Other'];
  const qualOptions = ['All', '12th / ITI', 'Degree / Graduation', 'Diploma', '10th Pass'];

  // Filter records based on active criteria
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = rec.name && rec.name.toLowerCase().includes(query);
        const matchEmail = rec.email && rec.email.toLowerCase().includes(query);
        const matchFather = rec.father_name && rec.father_name.toLowerCase().includes(query);
        const matchPhone = rec.whatsapp && rec.whatsapp.includes(query);
        const matchAddress = rec.address && rec.address.toLowerCase().includes(query);

        if (!matchName && !matchEmail && !matchFather && !matchPhone && !matchAddress) {
          return false;
        }
      }

      // Course filter
      if (courseFilter !== 'All' && rec.course !== courseFilter) return false;

      // Category filter
      if (categoryFilter !== 'All' && rec.category !== categoryFilter) return false;

      // Gender filter
      if (genderFilter !== 'All' && rec.gender !== genderFilter) return false;

      // Qualification filter
      if (qualFilter !== 'All' && rec.qualification !== qualFilter) return false;

      // Enrollment Status filter
      if (enrollmentFilter === 'NotEnrolled' && rec.already_enrolled_at_idemi) return false;
      if (enrollmentFilter === 'AlreadyEnrolled' && !rec.already_enrolled_at_idemi) return false;

      return true;
    });
  }, [records, searchTerm, courseFilter, categoryFilter, genderFilter, qualFilter, enrollmentFilter]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, courseFilter, categoryFilter, genderFilter, qualFilter, enrollmentFilter, rowsPerPage]);

  // Calculate Pagination
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + rowsPerPage);

  // Category Badge helper
  const renderCategoryBadge = (cat) => {
    switch (cat) {
      case 'SC': return <span className="badge badge-sc">SC</span>;
      case 'ST': return <span className="badge badge-st">ST</span>;
      case 'OBC': return <span className="badge badge-obc">OBC</span>;
      case 'EWS': return <span className="badge badge-ews">EWS</span>;
      case 'General (Women)': return <span className="badge badge-gen">Gen (W)</span>;
      default: return <span className="badge badge-gen">General</span>;
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (!filteredRecords.length) return;

    const cols = [
      'SR No',
      'Sheet',
      'Timestamp',
      'Student Name',
      'Father\'s Name',
      'Email',
      'WhatsApp Mobile',
      'Alternate Phone',
      'Gender',
      'Category',
      'Date of Birth',
      'Qualification',
      'Course',
      'Reference / How Heard',
      'Full Permanent Address',
      'IDEMI Enrollment Status',
      'Enrollment Match Detail',
      'Documents Uploaded',
    ];

    const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

    const rows = [cols.join(',')];

    filteredRecords.forEach((r, idx) => {
      rows.push([
        idx + 1,
        q(r.sheet),
        q(r.timestamp),
        q(r.name),
        q(r.father_name),
        q(r.email),
        q(r.whatsapp),
        q(r.alt_phone),
        q(r.gender),
        q(r.category),
        q(r.dob),
        q(r.qualification),
        q(r.course),
        q(r.reference),
        q(r.address),
        r.already_enrolled_at_idemi ? "Already Enrolled at IDEMI" : "Not Enrolled (Fresh Lead)",
        q(r.enrollment_match_detail),
        r.doc_count ?? 0,
      ].join(','));
    });

    const BOM = '\uFEFF';
    const csvString = BOM + rows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    
    const filterSuffix = enrollmentFilter === 'NotEnrolled' ? '_FreshLeads' : enrollmentFilter === 'AlreadyEnrolled' ? '_Enrolled' : '';
    link.download = `MeitY_Registrations${filterSuffix}_${new Date().toISOString().slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 500);
  };


  return (
    <section className="glass-card p-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border-color)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            Student Applicant Master Directory
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Showing <strong className="text-[var(--text-primary)]">{filteredRecords.length.toLocaleString()}</strong> matching registrations out of {records.length.toLocaleString()} total.
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          disabled={!filteredRecords.length}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all self-start lg:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered CSV ({filteredRecords.length})</span>
        </button>
      </div>

      {/* Search & Multi-Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-6">
        
        {/* Search Box */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate, email, mobile, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Enrollment Status Filter (Fresh Leads vs Already Enrolled) */}
        <div>
          <select
            value={enrollmentFilter}
            onChange={(e) => setEnrollmentFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg bg-indigo-950/40 border border-indigo-500/40 font-semibold text-indigo-300 focus:outline-none focus:border-indigo-400"
          >
            <option value="All">All Enrollment Status</option>
            <option value="NotEnrolled">🟢 Fresh Leads (Not Enrolled)</option>
            <option value="AlreadyEnrolled">⚠️ Already Enrolled in IDEMI</option>
          </select>
        </div>

        {/* Course Filter */}
        <div>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Courses</option>
            {courseOptions.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Categories</option>
            {categoryOptions.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Genders</option>
            {genderOptions.filter(g => g !== 'All').map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Qualification Filter */}
        <div>
          <select
            value={qualFilter}
            onChange={(e) => setQualFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Qualifications</option>
            {qualOptions.filter(q => q !== 'All').map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] mb-4">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--bg-card)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Candidate Details</th>
              <th className="py-3 px-4">Enrollment Status</th>
              <th className="py-3 px-4">Category / Gender</th>
              <th className="py-3 px-4">Course Track</th>
              <th className="py-3 px-4">Qualification</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4 text-center">Docs</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-[var(--text-muted)]">
                  No applicant records found matching your filters.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((applicant, index) => (
                <tr 
                  key={applicant.id} 
                  className={`hover:bg-[var(--bg-card-hover)] transition-colors group ${applicant.already_enrolled_at_idemi ? 'bg-amber-950/10' : ''}`}
                >
                  <td className="py-3.5 px-4 font-semibold text-[var(--text-muted)]">
                    {startIndex + index + 1}
                  </td>
                  
                  {/* Candidate Name & Father Name — click name to open profile */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onSelectApplicant(applicant)}
                      className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-2 text-xs text-left transition-colors cursor-pointer"
                      title="Click to view full profile"
                    >
                      {applicant.name}
                    </button>
                    {applicant.father_name && (
                      <div className="text-[11px] text-[var(--text-muted)]">
                        Father: {applicant.father_name}
                      </div>
                    )}
                    <div className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-[var(--text-muted)]" />
                      {applicant.email || 'N/A'}
                    </div>
                  </td>

                  {/* Enrollment Status Badge */}
                  <td className="py-3.5 px-4">
                    {applicant.already_enrolled_at_idemi ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30" title={`Matched IDEMI records: ${applicant.enrollment_match_detail}`}>
                        <AlertTriangle className="w-3 h-3" />
                        Already Enrolled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <UserPlus className="w-3 h-3" />
                        Fresh Lead
                      </span>
                    )}
                  </td>

                  {/* Category / Gender */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {renderCategoryBadge(applicant.category)}
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                        {applicant.gender}
                      </span>
                    </div>
                  </td>

                  {/* Course Track */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-indigo-400">
                      {applicant.course}
                    </span>
                  </td>

                  {/* Qualification */}
                  <td className="py-3.5 px-4">
                    <span className="text-[var(--text-secondary)] font-medium">
                      {applicant.qualification}
                    </span>
                  </td>

                  {/* Contact Phone */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-[var(--text-primary)] font-medium">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      {applicant.whatsapp || applicant.alt_phone || 'N/A'}
                    </div>
                  </td>

                  {/* Documents Count */}
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      applicant.doc_count > 0 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border-color)]'
                    }`}>
                      <Paperclip className="w-3 h-3" />
                      {applicant.doc_count}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectApplicant(applicant)}
                      className="inline-flex items-center gap-1 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="py-1 px-2 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>
            Showing {startIndex + 1} - {Math.min(startIndex + rowsPerPage, filteredRecords.length)} of {filteredRecords.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-semibold px-3 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </section>
  );
}
