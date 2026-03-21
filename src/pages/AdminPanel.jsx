import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"
import Sidebar from "../components/Sidebar"

function AdminPanel() {
  const navigate = useNavigate()
  const { useTheme: th } = useTheme?.() || {}
  const { isDark } = useTheme()
  const [search, setSearch] = useState("")
  const [filterBatch, setFilterBatch] = useState("")
  const [activeTab, setActiveTab] = useState("alumni")
  const [alumniList, setAlumniList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAlumni() }, [])

  const fetchAlumni = async () => {
    try {
      const response = await api.get("/alumni")
      setAlumniList(response.data)
    } catch (err) {
      console.error("Failed to fetch alumni", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alumni?")) return
    try {
      await api.delete(`/alumni/${id}`)
      setAlumniList(alumniList.filter(a => a.id !== id))
    } catch (err) {
      alert("Failed to delete alumni")
    }
  }

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://127.0.0.1:8000/api/alumni/export", {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "text/csv",
        },
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "alumni_export.csv"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert("Failed to export data")
    }
  }

  const filtered = alumniList.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    const matchBatch = filterBatch ? a.alumni_profile?.batch_year === filterBatch : true
    return matchSearch && matchBatch
  })

  const totalAlumni = alumniList.length
  const employed = alumniList.filter(a => a.alumni_profile?.status === "employed").length
  const unemployed = alumniList.filter(a => a.alumni_profile?.status === "unemployed").length
  const batches = [...new Set(alumniList.map(a => a.alumni_profile?.batch_year).filter(Boolean))]

  const statusColor = {
    employed:   { bg: '#dcfce7', color: '#15803d' },
    unemployed: { bg: '#fee2e2', color: '#dc2626' },
    studying:   { bg: '#dbeafe', color: '#1d4ed8' },
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
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Alumni Management</h1>
            <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Manage and monitor all registered alumni</p>
          </div>
          <button
            onClick={handleExport}
            style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
            onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
            onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
          >
            ↓ Export CSV
          </button>
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: "Total Alumni", value: totalAlumni, icon: "👥", color: isDark ? '#1e3a8a' : '#eff6ff', border: isDark ? '#1d4ed8' : '#bfdbfe', text: '#1d4ed8' },
            { label: "Employed", value: employed, icon: "💼", color: isDark ? '#14532d' : '#f0fdf4', border: isDark ? '#16a34a' : '#bbf7d0', text: '#15803d' },
            { label: "Unemployed", value: unemployed, icon: "📋", color: isDark ? '#450a0a' : '#fef2f2', border: isDark ? '#dc2626' : '#fecaca', text: '#dc2626' },
            { label: "Batch Years", value: batches.length, icon: "🎓", color: isDark ? '#3b0764' : '#faf5ff', border: isDark ? '#7c3aed' : '#e9d5ff', text: '#7c3aed' },
          ].map((s, i) => (
            <div key={i} style={{ borderRadius: '14px', padding: '20px', background: s.color, border: `1px solid ${s.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>{s.icon}</span>
                <span style={{ fontSize: '32px', fontWeight: '700', color: s.text }}>{s.value}</span>
              </div>
              <div style={{ fontSize: '13px', color: subtext, fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div style={{ background: card, borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', border: `1px solid ${border}` }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${border}`, padding: '0 24px' }}>
            {["alumni", "pending"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 20px', border: 'none', background: 'transparent',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  color: activeTab === tab ? '#1d4ed8' : subtext,
                  borderBottom: activeTab === tab ? '2px solid #1d4ed8' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {tab === "alumni" ? "All Alumni" : "Pending Approvals"}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', padding: '16px 24px', borderBottom: `1px solid ${border}` }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: inputBg, color: text }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              style={{ padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: inputBg, color: text, cursor: 'pointer' }}
              value={filterBatch}
              onChange={e => setFilterBatch(e.target.value)}
            >
              <option value="">All Batches</option>
              {batches.sort().map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          {activeTab === "alumni" && (
            <div style={{ overflowX: 'auto', padding: '0 24px 24px' }}>
              {loading ? (
                <p style={{ textAlign: 'center', color: subtext, padding: '32px' }}>Loading...</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                  <thead>
                    <tr style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
                      {["#", "Name", "Email", "Batch", "Job Title", "Company", "Status", "Actions"].map(h => (
                        <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: subtext, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan="8" style={{ textAlign: 'center', color: subtext, padding: '32px' }}>No alumni found</td></tr>
                    ) : filtered.map((a, i) => {
                      const s = statusColor[a.alumni_profile?.status] || { bg: '#f1f5f9', color: '#64748b' }
                      return (
                        <tr key={a.id}
                          onMouseEnter={e => e.currentTarget.style.background = isDark ? '#0f172a' : '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '14px 12px', fontSize: '14px', color: subtext, borderBottom: `1px solid ${border}` }}>{i + 1}</td>
                          <td style={{ padding: '14px 12px', borderBottom: `1px solid ${border}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                                {a.name.charAt(0)}
                              </div>
                              <span style={{ fontWeight: '600', color: text, fontSize: '14px' }}>{a.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 12px', fontSize: '14px', color: subtext, borderBottom: `1px solid ${border}` }}>{a.email}</td>
                          <td style={{ padding: '14px 12px', fontSize: '14px', color: text, borderBottom: `1px solid ${border}` }}>{a.alumni_profile?.batch_year || "—"}</td>
                          <td style={{ padding: '14px 12px', fontSize: '14px', color: text, borderBottom: `1px solid ${border}` }}>{a.alumni_profile?.current_job || "—"}</td>
                          <td style={{ padding: '14px 12px', fontSize: '14px', color: text, borderBottom: `1px solid ${border}` }}>{a.alumni_profile?.company || "—"}</td>
                          <td style={{ padding: '14px 12px', borderBottom: `1px solid ${border}` }}>
                            <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: s.bg, color: s.color }}>
                              {a.alumni_profile?.status || "unknown"}
                            </span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: `1px solid ${border}` }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button style={{ padding: '5px 12px', background: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Edit</button>
                              <button
                                onClick={() => handleDelete(a.id)}
                                style={{ padding: '5px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                              >Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "pending" && (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: text, marginBottom: '8px' }}>No pending approvals</p>
              <p style={{ fontSize: '14px', color: subtext }}>New registrations will appear here for review</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminPanel