import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function JobBoard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [filterType, setFilterType] = useState("")
  const [formData, setFormData] = useState({
    title: "", description: "", company: "", location: "",
    type: "full-time", industry: "", deadline: "", contact_email: "",
  })

  useEffect(() => { fetchJobs() }, [])

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs")
      setJobs(response.data)
    } catch (err) {
      console.error("Failed to fetch jobs", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await api.post("/jobs", formData)
      setJobs([response.data, ...jobs])
      setShowForm(false)
      setSuccess("Job posted successfully!")
      setFormData({ title: "", description: "", company: "", location: "", type: "full-time", industry: "", deadline: "", contact_email: "" })
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Failed to post job", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job post?")) return
    try {
      await api.delete(`/jobs/${id}`)
      setJobs(jobs.filter(j => j.id !== id))
    } catch (err) {
      alert("Failed to delete job")
    }
  }

  const handleLogout = async () => { await logout(); navigate("/") }

  const filtered = filterType ? jobs.filter(j => j.type === filterType) : jobs

  const typeStyles = {
    "full-time":  { bg: '#dbeafe', color: '#1d4ed8' },
    "part-time":  { bg: '#ede9fe', color: '#7c3aed' },
    "internship": { bg: '#dcfce7', color: '#15803d' },
    "freelance":  { bg: '#fef3c7', color: '#d97706' },
  }

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.logoMark}>AT</div>
          <span style={styles.logoText}>Alumni Tracker</span>
        </div>
        <nav style={styles.sidebarNav}>
          {[
            { icon: "⊞", label: "Dashboard", path: "/dashboard" },
            { icon: "◈", label: "Job Board", path: "/jobs", active: true },
            { icon: "◉", label: "Analytics", path: "/analytics" },
          ].map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{ ...styles.navItem, ...(item.active ? styles.navItemActive : {}) }}
              onMouseEnter={e => !item.active && (e.currentTarget.style.background = '#1e3a8a')}
              onMouseLeave={e => !item.active && (e.currentTarget.style.background = 'transparent')}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} style={styles.logoutBtn}
          onMouseEnter={e => e.currentTarget.style.background = '#1e3a8a'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={styles.navIcon}>→</span><span>Logout</span>
        </button>
      </aside>

      <main style={styles.main}>
        {/* Header */}
        <header style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Job Board</h1>
            <p style={styles.pageSubtitle}>Opportunities posted by alumni for students and fellow graduates</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ ...styles.postBtn, background: showForm ? '#64748b' : '#1d4ed8' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {showForm ? "✕ Cancel" : "+ Post a Job"}
          </button>
        </header>

        {/* Success */}
        {success && (
          <div style={styles.successBox}>
            ✓ {success}
          </div>
        )}

        {/* Post Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Post a New Opportunity</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                {[
                  { name: 'title', label: 'Job Title *', placeholder: 'Frontend Developer', type: 'text', required: true },
                  { name: 'company', label: 'Company *', placeholder: 'Tech Nepal Pvt. Ltd.', type: 'text', required: true },
                  { name: 'location', label: 'Location *', placeholder: 'Kathmandu, Nepal', type: 'text', required: true },
                  { name: 'contact_email', label: 'Contact Email', placeholder: 'hr@company.com', type: 'email' },
                  { name: 'deadline', label: 'Application Deadline', placeholder: '', type: 'date' },
                ].map(f => (
                  <div key={f.name} style={styles.formGroup}>
                    <label style={styles.formLabel}>{f.label}</label>
                    <input type={f.type} name={f.name} required={f.required}
                      style={styles.formInput} placeholder={f.placeholder}
                      value={formData[f.name]} onChange={handleChange}
                      onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                ))}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Job Type *</label>
                  <select name="type" style={styles.formInput} value={formData.type} onChange={handleChange}>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Industry</label>
                  <select name="industry" style={styles.formInput} value={formData.industry} onChange={handleChange}>
                    <option value="">Select industry</option>
                    <option value="IT/Software">IT / Software</option>
                    <option value="Banking/Finance">Banking / Finance</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="NGO/INGO">NGO / INGO</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div style={{ ...styles.formGroup, marginTop: '4px' }}>
                <label style={styles.formLabel}>Job Description *</label>
                <textarea name="description" required rows={4} style={{ ...styles.formInput, resize: 'vertical' }}
                  placeholder="Describe the role, requirements, and responsibilities..."
                  value={formData.description} onChange={handleChange}
                />
              </div>
              <button type="submit" disabled={submitting} style={styles.submitBtn}
                onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
                onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
              >
                {submitting ? "Posting..." : "Post Job"}
              </button>
            </form>
          </div>
        )}

        {/* Filter Pills */}
        <div style={styles.filterRow}>
          {["", "full-time", "part-time", "internship", "freelance"].map(type => (
            <button key={type} onClick={() => setFilterType(type)}
              style={{
                ...styles.pill,
                background: filterType === type ? '#1d4ed8' : 'white',
                color: filterType === type ? 'white' : '#64748b',
                border: filterType === type ? '1.5px solid #1d4ed8' : '1.5px solid #e2e8f0',
              }}
              onMouseEnter={e => filterType !== type && (e.currentTarget.style.borderColor = '#93c5fd')}
              onMouseLeave={e => filterType !== type && (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              {type === "" ? "All Jobs" : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </button>
          ))}
          <span style={styles.jobCount}>{filtered.length} {filtered.length === 1 ? 'job' : 'jobs'} found</span>
        </div>

        {/* Job Cards */}
        {loading ? (
          <p style={styles.emptyText}>Loading jobs...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💼</div>
            <p style={styles.emptyTitle}>No jobs posted yet</p>
            <p style={styles.emptyDesc}>Be the first to post an opportunity for fellow alumni!</p>
          </div>
        ) : (
          <div style={styles.jobGrid}>
            {filtered.map(job => {
              const ts = typeStyles[job.type] || { bg: '#f1f5f9', color: '#64748b' }
              return (
                <div key={job.id} style={styles.jobCard}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                >
                  <div style={styles.jobCardTop}>
                    <div style={styles.jobCompanyLogo}>
                      {job.company?.charAt(0) || "J"}
                    </div>
                    <div style={styles.jobMeta}>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
                      <p style={styles.jobCompany}>{job.company}</p>
                    </div>
                    <span style={{ ...styles.typeBadge, background: ts.bg, color: ts.color }}>
                      {job.type}
                    </span>
                  </div>

                  <div style={styles.jobDetails}>
                    <span style={styles.jobDetail}>📍 {job.location}</span>
                    {job.industry && <span style={styles.jobDetail}>🏢 {job.industry}</span>}
                    {job.deadline && <span style={styles.jobDetail}>📅 {job.deadline}</span>}
                  </div>

                  <p style={styles.jobDesc}>{job.description}</p>

                  <div style={styles.jobFooter}>
                    <div style={styles.jobPoster}>
                      <div style={styles.posterAvatar}>{job.posted_by?.name?.charAt(0)}</div>
                      <span style={styles.posterName}>
                        {job.posted_by?.name} · {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={styles.jobActions}>
                      {job.contact_email && (
                        <a href={"mailto:" + job.contact_email} style={styles.applyBtn}
                          onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
                          onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
                        >
                          Apply Now
                        </a>
                      )}
                      {(user?.role === "admin" || user?.id === job.posted_by?.id) && (
                        <button onClick={() => handleDelete(job.id)} style={styles.deleteBtn}
                          onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'sans-serif' },
  sidebar: {
    width: '240px', background: '#1e3a8a', display: 'flex', flexDirection: 'column',
    padding: '24px 0', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 10,
  },
  sidebarLogo: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px',
  },
  logoMark: {
    width: '36px', height: '36px', background: '#2563eb', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700', fontSize: '14px',
  },
  logoText: { color: 'white', fontWeight: '700', fontSize: '16px' },
  sidebarNav: { flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
    borderRadius: '10px', border: 'none', background: 'transparent',
    color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px',
    fontWeight: '500', transition: 'all 0.15s', textAlign: 'left', width: '100%',
  },
  navItemActive: { background: '#2563eb', color: 'white' },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px',
    border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer', fontSize: '14px', borderTop: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.15s', width: '100%',
  },
  main: { marginLeft: '240px', flex: 1, padding: '32px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  pageSubtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  postBtn: {
    color: 'white', border: 'none', padding: '11px 20px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'opacity 0.2s',
  },
  successBox: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d',
    padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px',
  },
  formCard: {
    background: 'white', borderRadius: '16px', padding: '28px',
    marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
  },
  formTitle: { fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGroup: { marginBottom: '4px' },
  formLabel: {
    display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  formInput: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    background: '#f8fafc', transition: 'border-color 0.2s', fontFamily: 'sans-serif',
  },
  submitBtn: {
    marginTop: '16px', padding: '12px 24px', background: '#1d4ed8', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', transition: 'background 0.2s',
  },
  filterRow: {
    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap',
  },
  pill: {
    padding: '7px 16px', borderRadius: '20px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600', transition: 'all 0.15s',
  },
  jobCount: { marginLeft: 'auto', fontSize: '13px', color: '#94a3b8', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#94a3b8', padding: '48px' },
  emptyState: { background: 'white', borderRadius: '16px', padding: '64px', textAlign: 'center' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { fontSize: '16px', fontWeight: '600', color: '#334155', margin: '0 0 8px' },
  emptyDesc: { fontSize: '14px', color: '#94a3b8', margin: 0 },
  jobGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  jobCard: {
    background: 'white', borderRadius: '16px', padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s',
    border: '1px solid #f1f5f9',
  },
  jobCardTop: { display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' },
  jobCompanyLogo: {
    width: '48px', height: '48px', borderRadius: '12px', background: '#dbeafe',
    color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '20px', flexShrink: 0,
  },
  jobMeta: { flex: 1 },
  jobTitle: { fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  jobCompany: { fontSize: '14px', color: '#2563eb', fontWeight: '600', margin: 0 },
  typeBadge: { padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', flexShrink: 0 },
  jobDetails: { display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' },
  jobDetail: { fontSize: '13px', color: '#64748b' },
  jobDesc: {
    fontSize: '14px', color: '#475569', lineHeight: '1.6',
    margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  jobFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' },
  jobPoster: { display: 'flex', alignItems: 'center', gap: '8px' },
  posterAvatar: {
    width: '28px', height: '28px', borderRadius: '50%', background: '#dbeafe',
    color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '12px',
  },
  posterName: { fontSize: '13px', color: '#94a3b8' },
  jobActions: { display: 'flex', gap: '8px', alignItems: 'center' },
  applyBtn: {
    padding: '8px 16px', background: '#1d4ed8', color: 'white',
    borderRadius: '8px', fontSize: '13px', fontWeight: '600',
    textDecoration: 'none', transition: 'background 0.2s',
  },
  deleteBtn: {
    padding: '8px 12px', background: 'transparent', color: '#dc2626',
    border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s',
  },
}

export default JobBoard