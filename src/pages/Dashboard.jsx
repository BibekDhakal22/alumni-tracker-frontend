import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"
import Sidebar from "../components/Sidebar"
import Avatar from "../components/Avatar"

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDark } = useTheme()
  const [alumniList, setAlumniList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [jobsCount, setJobsCount] = useState(0)

  useEffect(() => {
    if (!user) { navigate("/"); return }
    fetchAlumni()
    fetchJobsCount()
  }, [user])

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

  const fetchJobsCount = async () => {
    try {
      const response = await api.get("/jobs")
      setJobsCount(response.data.length)
    } catch (err) {
      console.error("Failed to fetch jobs", err)
    }
  }

  if (!user) return null

  const profile = user.alumni_profile
  const employed = alumniList.filter(a => a.alumni_profile?.status === "employed").length
  const total = alumniList.length
  const batches = [...new Set(alumniList.map(a => a.alumni_profile?.batch_year).filter(Boolean))]

  const filteredAlumni = alumniList.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.alumni_profile?.batch_year?.includes(search) ||
    a.alumni_profile?.company?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = {
    employed:   { bg: '#dcfce7', color: '#15803d' },
    unemployed: { bg: '#fee2e2', color: '#dc2626' },
    studying:   { bg: '#dbeafe', color: '#1d4ed8' },
  }
  const st = statusColor[profile?.status] || statusColor.unemployed

  const card = isDark ? '#1e293b' : 'white'
  const text = isDark ? '#f1f5f9' : '#0f172a'
  const subtext = isDark ? '#94a3b8' : '#64748b'
  const border = isDark ? '#334155' : '#f1f5f9'
  const inputBg = isDark ? '#0f172a' : '#f8fafc'
  const inputBorder = isDark ? '#334155' : '#e2e8f0'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: isDark ? '#0f172a' : '#f1f5f9', fontFamily: 'sans-serif' }}>
      <Sidebar />

      <main style={{ marginLeft: '240px', flex: 1, padding: '32px', minHeight: '100vh' }}>

        {/* Top Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Dashboard</h1>
            <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Welcome back, {user.name}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: text }}>{user.name}</div>
              <div style={{ fontSize: '11px', color: subtext, textTransform: 'capitalize' }}>{user.role}</div>
            </div>
            <Avatar name={user.name} photo={profile?.photo} size={42} fontSize={16} />
          </div>
        </header>

        {/* Profile Hero Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: '16px', padding: '28px 32px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ border: '3px solid rgba(255,255,255,0.4)', borderRadius: '50%', padding: '2px' }}>
              <Avatar name={user.name} photo={profile?.photo} size={68} fontSize={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'white', margin: '0 0 4px' }}>{user.name}</h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px' }}>{user.email}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  Batch {profile?.batch_year || "N/A"}
                </span>
                <span style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {profile?.status || "Not set"}
                </span>
                {profile?.current_job && (
                  <span style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                    {profile.current_job}{profile.company ? ` @ ${profile.company}` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.3)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
              onClick={() => navigate("/profile/print")}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >↓ Export PDF</button>
            <button
              style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.3)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
              onClick={() => navigate("/profile/edit")}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >Edit Profile</button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: "Total Alumni", value: total, icon: "👥", color: isDark ? '#1e3a8a' : '#eff6ff', border: isDark ? '#1d4ed8' : '#bfdbfe' },
            { label: "Employed", value: employed, icon: "💼", color: isDark ? '#14532d' : '#f0fdf4', border: isDark ? '#16a34a' : '#bbf7d0' },
            { label: "Batch Years", value: batches.length, icon: "🎓", color: isDark ? '#3b0764' : '#faf5ff', border: isDark ? '#7c3aed' : '#e9d5ff' },
            { label: "Jobs Posted", value: jobsCount, icon: "📋", color: isDark ? '#431407' : '#fff7ed', border: isDark ? '#ea580c' : '#fed7aa' },
          ].map((stat, i) => (
            <div key={i} style={{ borderRadius: '14px', padding: '20px', textAlign: 'center', background: stat.color, border: `1px solid ${stat.border}`, cursor: 'pointer', transition: 'transform 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: text, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: subtext, fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Personal Info */}
          <div style={{ background: card, borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: text, margin: 0 }}>Personal Information</h3>
              <button onClick={() => navigate('/profile/edit')}
                style={{ fontSize: '12px', color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >Edit →</button>
            </div>
            <div style={{ height: '1px', background: border, marginBottom: '12px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: "Phone", value: profile?.phone || "—" },
                { label: "Location", value: profile?.address || "—" },
                { label: "LinkedIn", value: profile?.linkedin || "—" },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: subtext }}>{item.label}</span>
                  <span style={{ fontSize: '13px', color: item.value === '—' ? subtext : text, fontWeight: item.value === '—' ? '400' : '600' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Employment */}
          <div style={{ background: card, borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: text, margin: 0 }}>Employment Details</h3>
              <button onClick={() => navigate('/profile/edit')}
                style={{ fontSize: '12px', color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >Edit →</button>
            </div>
            <div style={{ height: '1px', background: border, marginBottom: '12px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: "Job Title", value: profile?.current_job || "—" },
                { label: "Company", value: profile?.company || "—" },
                { label: "Industry", value: profile?.industry || "—" },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: subtext }}>{item.label}</span>
                  <span style={{ fontSize: '13px', color: item.value === '—' ? subtext : text, fontWeight: item.value === '—' ? '400' : '600' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alumni Directory */}
        <div style={{ background: card, borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: `1px solid ${border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: text, margin: '0 0 2px' }}>Alumni Directory</h3>
              <p style={{ fontSize: '12px', color: subtext, margin: 0 }}>{filteredAlumni.length} alumni found</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', pointerEvents: 'none' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search alumni..."
                  style={{ padding: '8px 12px 8px 32px', border: `1.5px solid ${inputBorder}`, borderRadius: '8px', fontSize: '13px', outline: 'none', background: inputBg, color: text, width: '200px' }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button onClick={() => navigate('/gallery')}
                style={{ padding: '8px 14px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >View All →</button>
            </div>
          </div>
          <div style={{ height: '1px', background: border, marginBottom: '8px' }} />
          {loading ? (
            <p style={{ textAlign: 'center', color: subtext, padding: '32px' }}>Loading...</p>
          ) : filteredAlumni.length === 0 ? (
            <p style={{ textAlign: 'center', color: subtext, padding: '32px' }}>No alumni found</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {["Name", "Batch", "Job", "Company", "Status"].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: subtext, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAlumni.slice(0, 20).map((a, i) => {
                  const s = statusColor[a.alumni_profile?.status] || statusColor.unemployed
                  return (
                    <tr key={i}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e293b' : '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px', fontSize: '14px', color: text, borderBottom: `1px solid ${border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar name={a.name} photo={a.alumni_profile?.photo} size={32} fontSize={13} />
                          <span style={{ fontWeight: '600' }}>{a.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: subtext, borderBottom: `1px solid ${border}` }}>{a.alumni_profile?.batch_year || "—"}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: subtext, borderBottom: `1px solid ${border}` }}>{a.alumni_profile?.current_job || "—"}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: subtext, borderBottom: `1px solid ${border}` }}>{a.alumni_profile?.company || "—"}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${border}` }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: s.bg, color: s.color }}>
                          {a.alumni_profile?.status || "unknown"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  )
}

export default Dashboard