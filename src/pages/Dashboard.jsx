import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [alumniList, setAlumniList] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!user) { navigate("/"); return }
    fetchAlumni()
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

  const handleLogout = async () => {
    await logout()
    navigate("/")
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
    employed: { bg: '#dcfce7', color: '#15803d' },
    unemployed: { bg: '#fee2e2', color: '#dc2626' },
    studying: { bg: '#dbeafe', color: '#1d4ed8' },
  }
  const st = statusColor[profile?.status] || statusColor.unemployed

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
            { icon: "⊞", label: "Dashboard", path: "/dashboard", active: true },
            { icon: "◎", label: "Edit Profile", path: "/profile/edit" },
            { icon: "◈", label: "Job Board", path: "/jobs" },
            { icon: "◉", label: "Analytics", path: "/analytics" },
            { icon: "🗓", label: "Events", path: "/events" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                ...(item.active ? styles.navItemActive : {})
              }}
              onMouseEnter={e => !item.active && (e.currentTarget.style.background = '#1e3a8a')}
              onMouseLeave={e => !item.active && (e.currentTarget.style.background = 'transparent')}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseEnter={e => e.currentTarget.style.background = '#1e3a8a'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={styles.navIcon}>→</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Top Bar */}
        <header style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.pageSubtitle}>Welcome back, {user.name}</p>
          </div>
          <div style={styles.topBarRight}>
            <div style={styles.avatar}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Profile Hero Card */}
        <div style={styles.heroCard}>
          <div style={styles.heroLeft}>
            <div style={styles.heroBigAvatar}>
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 style={styles.heroName}>{user.name}</h2>
              <p style={styles.heroEmail}>{user.email}</p>
              <div style={styles.heroBadges}>
                <span style={styles.batchBadge}>
                  Batch {profile?.batch_year || "N/A"}
                </span>
                <span style={{
                  ...styles.statusBadge,
                  background: st.bg,
                  color: st.color
                }}>
                  {profile?.status || "Not set"}
                </span>
              </div>
            </div>
          </div>
         <div style={{display: 'flex', gap: '10px'}}>
            <button
              style={styles.printBtn}
              onClick={() => navigate("/profile/print")}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              ↓ Export PDF
            </button>
            <button
              style={styles.editBtn}
              onClick={() => navigate("/profile/edit")}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={styles.statsGrid}>
          {[
            { label: "Total Alumni", value: total, icon: "👥", color: '#eff6ff', border: '#bfdbfe' },
            { label: "Employed", value: employed, icon: "💼", color: '#f0fdf4', border: '#bbf7d0' },
            { label: "Batch Years", value: batches.length, icon: "🎓", color: '#faf5ff', border: '#e9d5ff' },
            { label: "Jobs Posted", value: "-", icon: "📋", color: '#fff7ed', border: '#fed7aa' },
          ].map((stat, i) => (
            <div key={i} style={{
              ...styles.statCard,
              background: stat.color,
              border: `1px solid ${stat.border}`
            }}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Info Grid */}
        <div style={styles.infoGrid}>
          {/* Personal Info */}
          <div style={styles.infoCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Personal Information</h3>
              <div style={styles.cardDivider} />
            </div>
            <div style={styles.infoList}>
              {[
                { label: "Phone", value: profile?.phone || "Not set" },
                { label: "Location", value: profile?.address || "Not set" },
                { label: "LinkedIn", value: profile?.linkedin || "Not set" },
              ].map((item, i) => (
                <div key={i} style={styles.infoRow}>
                  <span style={styles.infoLabel}>{item.label}</span>
                  <span style={styles.infoValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Employment */}
          <div style={styles.infoCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Employment Details</h3>
              <div style={styles.cardDivider} />
            </div>
            <div style={styles.infoList}>
              {[
                { label: "Job Title", value: profile?.current_job || "Not set" },
                { label: "Company", value: profile?.company || "Not set" },
                { label: "Industry", value: profile?.industry || "Not set" },
              ].map((item, i) => (
                <div key={i} style={styles.infoRow}>
                  <span style={styles.infoLabel}>{item.label}</span>
                  <span style={styles.infoValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Alumni */}
        {/* Recent Alumni */}
        <div style={styles.tableCard}>
          <div style={{ ...styles.cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={styles.cardTitle}>Alumni Directory</h3>
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search alumni..."
                style={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div style={styles.cardDivider} />
          {loading ? (
            <p style={styles.emptyText}>Loading...</p>
          ) : filteredAlumni.length === 0 ? (
            <p style={styles.emptyText}>No alumni found</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Name", "Batch", "Job", "Company", "Status"].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAlumni.slice(0, 8).map((a, i) => {
                  const s = statusColor[a.alumni_profile?.status] || statusColor.unemployed
                  return (
                    <tr key={i} style={styles.tr}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                      <td style={styles.td}>
                        <div style={styles.tdName}>
                          <div style={styles.smallAvatar}>{a.name.charAt(0)}</div>
                          <span style={styles.tdNameText}>{a.name}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{a.alumni_profile?.batch_year || "—"}</td>
                      <td style={styles.td}>{a.alumni_profile?.current_job || "—"}</td>
                      <td style={styles.td}>{a.alumni_profile?.company || "—"}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: s.bg, color: s.color }}>
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

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'sans-serif' },
  sidebar: {
    width: '240px', background: '#1e3a8a', display: 'flex',
    flexDirection: 'column', padding: '24px 0', position: 'fixed',
    top: 0, left: 0, height: '100vh', zIndex: 10,
  },
  sidebarLogo: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '16px',
  },
  logoMark: {
    width: '36px', height: '36px', background: '#2563eb',
    borderRadius: '10px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px',
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
    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 24px',
    border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer', fontSize: '14px', borderTop: '1px solid rgba(255,255,255,0.1)',
    marginTop: '8px', paddingTop: '16px', transition: 'all 0.15s', width: '100%',
  },
  main: { marginLeft: '240px', flex: 1, padding: '32px', minHeight: '100vh' },
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '28px',
  },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  pageSubtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  topBarRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: {
    width: '40px', height: '40px', borderRadius: '50%', background: '#1d4ed8',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '16px',
  },
  heroCard: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    borderRadius: '16px', padding: '28px 32px', marginBottom: '24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  heroLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  heroBigAvatar: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700', fontSize: '24px',
  },
  heroName: { fontSize: '22px', fontWeight: '700', color: 'white', margin: '0 0 4px' },
  heroEmail: { fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px' },
  heroBadges: { display: 'flex', gap: '8px' },
  batchBadge: {
    background: 'rgba(255,255,255,0.15)', color: 'white',
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
  },
  statusBadge: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
  },
  editBtn: {
    background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.3)',
    color: 'white', padding: '10px 20px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s',
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px', marginBottom: '24px',
  },
  statCard: {
    borderRadius: '14px', padding: '20px', textAlign: 'center',
  },
  statIcon: { fontSize: '24px', marginBottom: '8px' },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  statLabel: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  infoCard: { background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  cardHeader: { marginBottom: '16px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 10px' },
  cardDivider: { height: '1px', background: '#f1f5f9' },
  infoList: { display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: '13px', color: '#94a3b8', fontWeight: '500' },
  infoValue: { fontSize: '13px', color: '#334155', fontWeight: '600' },
  tableCard: { background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '8px' },
  th: {
    textAlign: 'left', padding: '10px 12px', fontSize: '12px',
    color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase',
    letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9',
  },
  tr: { transition: 'background 0.15s', cursor: 'default' },
  td: { padding: '12px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f8fafc' },
  tdName: { display: 'flex', alignItems: 'center', gap: '10px' },
  smallAvatar: {
    width: '32px', height: '32px', borderRadius: '50%', background: '#dbeafe',
    color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '13px',
  },
  tdNameText: { fontWeight: '600', color: '#0f172a' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#94a3b8', padding: '32px' },

  searchWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '10px', fontSize: '13px', pointerEvents: 'none' },
  searchInput: {
    padding: '8px 12px 8px 32px', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', fontSize: '13px', outline: 'none',
    background: '#f8fafc', width: '200px',
  },
  printBtn: {
    background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.3)',
    color: 'white', padding: '10px 20px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s',
  },
}

export default Dashboard