import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"
import Sidebar from "../components/Sidebar"

function AlumniGallery() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDark } = useTheme()
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterBatch, setFilterBatch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterIndustry, setFilterIndustry] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedAlumni, setSelectedAlumni] = useState(null)

  useEffect(() => { fetchAlumni() }, [])

  const fetchAlumni = async () => {
    try {
      const response = await api.get("/alumni")
      setAlumni(response.data)
    } catch (err) {
      console.error("Failed to fetch alumni", err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = alumni.filter(a => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.alumni_profile?.company?.toLowerCase().includes(search.toLowerCase())
    const matchBatch = filterBatch ? a.alumni_profile?.batch_year === filterBatch : true
    const matchStatus = filterStatus ? a.alumni_profile?.status === filterStatus : true
    const matchIndustry = filterIndustry ? a.alumni_profile?.industry === filterIndustry : true
    return matchSearch && matchBatch && matchStatus && matchIndustry
  })

  const batches = [...new Set(alumni.map(a => a.alumni_profile?.batch_year).filter(Boolean))].sort()
  const industries = [...new Set(alumni.map(a => a.alumni_profile?.industry).filter(Boolean))].sort()

  const statusColors = {
    employed:   { bg: '#dcfce7', color: '#15803d' },
    unemployed: { bg: '#fee2e2', color: '#dc2626' },
    studying:   { bg: '#dbeafe', color: '#1d4ed8' },
  }

  const avatarColors = [
    '#1d4ed8', '#7c3aed', '#0891b2', '#15803d',
    '#d97706', '#dc2626', '#db2777', '#0d9488'
  ]

  const getAvatarColor = (name) => {
    const index = name.charCodeAt(0) % avatarColors.length
    return avatarColors[index]
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
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Alumni Gallery</h1>
            <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>
              Browse and connect with {alumni.length} alumni from all batches
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {["grid", "list"].map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '600', border: `1.5px solid ${inputBorder}`,
                  background: viewMode === mode ? '#1d4ed8' : card,
                  color: viewMode === mode ? 'white' : subtext,
                }}
              >
                {mode === 'grid' ? '⊞ Grid' : '☰ List'}
              </button>
            ))}
          </div>
        </header>

        {/* Search & Filters */}
        <div style={{ background: card, borderRadius: '16px', padding: '20px', marginBottom: '24px', border: `1px solid ${border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔍</span>
              <input type="text" placeholder="Search by name, email or company..."
                style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: inputBg, color: text, boxSizing: 'border-box' }}
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              style={{ padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: inputBg, color: text }}
              value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
            >
              <option value="">All Batches</option>
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select
              style={{ padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: inputBg, color: text }}
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="studying">Studying</option>
            </select>
            <select
              style={{ padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: inputBg, color: text }}
              value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}
            >
              <option value="">All Industries</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          {(search || filterBatch || filterStatus || filterIndustry) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${border}` }}>
              <span style={{ fontSize: '13px', color: subtext }}>
                Showing {filtered.length} of {alumni.length} alumni
              </span>
              <button
                onClick={() => { setSearch(""); setFilterBatch(""); setFilterStatus(""); setFilterIndustry("") }}
                style={{ fontSize: '13px', color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Alumni Modal */}
        {selectedAlumni && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setSelectedAlumni(null)}
          >
            <div style={{ background: card, borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button onClick={() => setSelectedAlumni(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: subtext }}>✕</button>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: getAvatarColor(selectedAlumni.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '32px', margin: '0 auto 16px' }}>
                  {selectedAlumni.name.charAt(0)}
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: text, margin: '0 0 6px' }}>{selectedAlumni.name}</h2>
                <p style={{ fontSize: '14px', color: subtext, margin: '0 0 8px' }}>{selectedAlumni.email}</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    Batch {selectedAlumni.alumni_profile?.batch_year || "N/A"}
                  </span>
                  {selectedAlumni.alumni_profile?.status && (
                    <span style={{ background: statusColors[selectedAlumni.alumni_profile.status]?.bg, color: statusColors[selectedAlumni.alumni_profile.status]?.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                      {selectedAlumni.alumni_profile.status}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ height: '1px', background: border, marginBottom: '20px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: "Job Title", value: selectedAlumni.alumni_profile?.current_job },
                  { label: "Company", value: selectedAlumni.alumni_profile?.company },
                  { label: "Industry", value: selectedAlumni.alumni_profile?.industry },
                  { label: "Phone", value: selectedAlumni.alumni_profile?.phone },
                  { label: "Location", value: selectedAlumni.alumni_profile?.address },
                  { label: "LinkedIn", value: selectedAlumni.alumni_profile?.linkedin },
                ].filter(item => item.value).map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${border}` }}>
                    <span style={{ fontSize: '13px', color: subtext }}>{item.label}</span>
                    <span style={{ fontSize: '13px', color: text, fontWeight: '600' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              {selectedAlumni.alumni_profile?.linkedin && (
                <a href={"https://" + selectedAlumni.alumni_profile.linkedin}
                  target="_blank" rel="noreferrer"
                  style={{ display: 'block', textAlign: 'center', marginTop: '20px', padding: '12px', background: '#1d4ed8', color: 'white', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}
                >
                  View LinkedIn Profile →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: subtext }}>Loading alumni...</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: card, borderRadius: '16px', padding: '64px', textAlign: 'center', border: `1px solid ${border}` }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: text, margin: '0 0 8px' }}>No alumni found</p>
            <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {filtered.map(a => {
              const sc = statusColors[a.alumni_profile?.status]
              const avatarColor = getAvatarColor(a.name)
              return (
                <div key={a.id}
                  style={{ background: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}`, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
                  onClick={() => setSelectedAlumni(a)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: avatarColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '28px', margin: '0 auto 14px' }}>
                    {a.name.charAt(0)}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: text, margin: '0 0 4px' }}>{a.name}</h3>
                  <p style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: '600', margin: '0 0 4px' }}>
                    {a.alumni_profile?.current_job || "—"}
                  </p>
                  <p style={{ fontSize: '12px', color: subtext, margin: '0 0 12px' }}>
                    {a.alumni_profile?.company || "—"}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ background: isDark ? '#1e3a8a' : '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                      Batch {a.alumni_profile?.batch_year || "N/A"}
                    </span>
                    {sc && (
                      <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                        {a.alumni_profile?.status}
                      </span>
                    )}
                  </div>
                  {a.alumni_profile?.industry && (
                    <p style={{ fontSize: '12px', color: subtext, margin: 0 }}>🏢 {a.alumni_profile.industry}</p>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* List View */
          <div style={{ background: card, borderRadius: '16px', border: `1px solid ${border}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
                  {["Alumni", "Batch", "Job Title", "Company", "Industry", "Status"].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: subtext, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => {
                  const sc = statusColors[a.alumni_profile?.status]
                  const avatarColor = getAvatarColor(a.name)
                  return (
                    <tr key={a.id} style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                      onClick={() => setSelectedAlumni(a)}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e293b' : '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', borderBottom: `1px solid ${border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: avatarColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', flexShrink: 0 }}>
                            {a.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: text }}>{a.name}</div>
                            <div style={{ fontSize: '12px', color: subtext }}>{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: text, borderBottom: `1px solid ${border}` }}>{a.alumni_profile?.batch_year || "—"}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: text, borderBottom: `1px solid ${border}` }}>{a.alumni_profile?.current_job || "—"}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1d4ed8', fontWeight: '600', borderBottom: `1px solid ${border}` }}>{a.alumni_profile?.company || "—"}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: subtext, borderBottom: `1px solid ${border}` }}>{a.alumni_profile?.industry || "—"}</td>
                      <td style={{ padding: '14px 16px', borderBottom: `1px solid ${border}` }}>
                        {sc ? (
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: sc.bg, color: sc.color }}>
                            {a.alumni_profile?.status}
                          </span>
                        ) : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default AlumniGallery