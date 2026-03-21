import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"
import Sidebar from "../components/Sidebar"

function JobBoard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDark } = useTheme()
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

  const filtered = filterType ? jobs.filter(j => j.type === filterType) : jobs

  const typeStyles = {
    "full-time":  { bg: '#dbeafe', color: '#1d4ed8' },
    "part-time":  { bg: '#ede9fe', color: '#7c3aed' },
    "internship": { bg: '#dcfce7', color: '#15803d' },
    "freelance":  { bg: '#fef3c7', color: '#d97706' },
  }

  const bg = isDark ? '#0f172a' : '#f1f5f9'
  const card = isDark ? '#1e293b' : 'white'
  const text = isDark ? '#f1f5f9' : '#0f172a'
  const subtext = isDark ? '#94a3b8' : '#64748b'
  const border = isDark ? '#334155' : '#f1f5f9'
  const inputBg = isDark ? '#0f172a' : '#f8fafc'
  const inputBorder = isDark ? '#334155' : '#e2e8f0'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: 'sans-serif' }}>
      <Sidebar />

      <main style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Job Board</h1>
            <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Opportunities posted by alumni for students and fellow graduates</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ background: showForm ? '#64748b' : '#1d4ed8', color: 'white', border: 'none', padding: '11px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
          >
            {showForm ? "✕ Cancel" : "+ Post a Job"}
          </button>
        </header>

        {/* Success */}
        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>
            ✓ {success}
          </div>
        )}

        {/* Post Form */}
        {showForm && (
          <div style={{ background: card, borderRadius: '16px', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${border}` }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: text, margin: '0 0 20px' }}>Post a New Opportunity</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { name: 'title', label: 'Job Title *', placeholder: 'Frontend Developer', type: 'text', required: true },
                  { name: 'company', label: 'Company *', placeholder: 'Tech Nepal Pvt. Ltd.', type: 'text', required: true },
                  { name: 'location', label: 'Location *', placeholder: 'Kathmandu, Nepal', type: 'text', required: true },
                  { name: 'contact_email', label: 'Contact Email', placeholder: 'hr@company.com', type: 'email' },
                  { name: 'deadline', label: 'Deadline', placeholder: '', type: 'date' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: subtext, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                    <input type={f.type} name={f.name} required={f.required}
                      style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: inputBg, color: text, fontFamily: 'sans-serif' }}
                      placeholder={f.placeholder} value={formData[f.name]} onChange={handleChange}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: subtext, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Job Type *</label>
                  <select name="type" style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: inputBg, color: text }} value={formData.type} onChange={handleChange}>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: subtext, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Industry</label>
                  <select name="industry" style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: inputBg, color: text }} value={formData.industry} onChange={handleChange}>
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
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: subtext, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Job Description *</label>
                <textarea name="description" required rows={4}
                  style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: inputBg, color: text, resize: 'vertical', fontFamily: 'sans-serif' }}
                  placeholder="Describe the role, requirements..." value={formData.description} onChange={handleChange}
                />
              </div>
              <button type="submit" disabled={submitting}
                style={{ marginTop: '16px', padding: '12px 24px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                {submitting ? "Posting..." : "Post Job"}
              </button>
            </form>
          </div>
        )}

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {["", "full-time", "part-time", "internship", "freelance"].map(type => (
            <button key={type} onClick={() => setFilterType(type)}
              style={{
                padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.15s',
                background: filterType === type ? '#1d4ed8' : card,
                color: filterType === type ? 'white' : subtext,
                border: filterType === type ? '1.5px solid #1d4ed8' : `1.5px solid ${inputBorder}`,
              }}
            >
              {type === "" ? "All Jobs" : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: subtext }}>{filtered.length} {filtered.length === 1 ? 'job' : 'jobs'} found</span>
        </div>

        {/* Job Cards */}
        {loading ? (
          <p style={{ textAlign: 'center', color: subtext, padding: '48px' }}>Loading jobs...</p>
        ) : filtered.length === 0 ? (
          <div style={{ background: card, borderRadius: '16px', padding: '64px', textAlign: 'center', border: `1px solid ${border}` }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: text, margin: '0 0 8px' }}>No jobs posted yet</p>
            <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Be the first to post an opportunity!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(job => {
              const ts = typeStyles[job.type] || { bg: '#f1f5f9', color: '#64748b' }
              return (
                <div key={job.id} style={{ background: card, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${border}` }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '20px', flexShrink: 0 }}>
                      {job.company?.charAt(0) || "J"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: '700', color: text, margin: 0 }}>{job.title}</h3>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: ts.bg, color: ts.color }}>{job.type}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#2563eb', fontWeight: '600', margin: 0 }}>{job.company}</p>
                    </div>
                    {(user?.role === "admin" || user?.id === job.posted_by?.id) && (
                      <button onClick={() => handleDelete(job.id)}
                        style={{ padding: '7px 12px', background: 'transparent', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                      >Delete</button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', color: subtext }}>📍 {job.location}</span>
                    {job.industry && <span style={{ fontSize: '13px', color: subtext }}>🏢 {job.industry}</span>}
                    {job.deadline && <span style={{ fontSize: '13px', color: subtext }}>📅 {job.deadline}</span>}
                  </div>
                  <p style={{ fontSize: '14px', color: subtext, lineHeight: '1.6', margin: '0 0 16px' }}>{job.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: `1px solid ${border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>
                        {job.posted_by?.name?.charAt(0)}
                      </div>
                      <span style={{ fontSize: '13px', color: subtext }}>
                        {job.posted_by?.name} · {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {job.contact_email && (
                      <a href={"mailto:" + job.contact_email}
                        style={{ padding: '8px 16px', background: '#1d4ed8', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}
                      >Apply Now</a>
                    )}
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

export default JobBoard