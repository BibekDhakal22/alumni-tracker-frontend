import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function AdminPanel() {
  const navigate = useNavigate()
  const { logout } = useAuth()
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

  const handleLogout = async () => {
    await logout()
    navigate("/")
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
    employed: { bg: '#dcfce7', color: '#15803d' },
    unemployed: { bg: '#fee2e2', color: '#dc2626' },
    studying: { bg: '#dbeafe', color: '#1d4ed8' },
  }

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.logoMark}>AT</div>
          <div>
            <div style={styles.logoText}>Alumni Tracker</div>
            <div style={styles.logoSub}>Admin Panel</div>
          </div>
        </div>
        <nav style={styles.sidebarNav}>
          {[
            { icon: "⊞", label: "Admin Panel", path: "/admin", active: true },
            { icon: "◉", label: "Analytics", path: "/analytics" },
            { icon: "◈", label: "Job Board", path: "/jobs" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ ...styles.navItem, ...(item.active ? styles.navItemActive : {}) }}
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

      {/* Main */}
      <main style={styles.main}>
        <header style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Alumni Management</h1>
            <p style={styles.pageSubtitle}>Manage and monitor all registered alumni</p>
          </div>
          <button
            style={styles.exportBtn}
            onClick={handleExport}
            onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
            onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
          >
            ↓ Export CSV
          </button>
        </header>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: "Total Alumni", value: totalAlumni, icon: "👥", color: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
            { label: "Employed", value: employed, icon: "💼", color: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
            { label: "Unemployed", value: unemployed, icon: "📋", color: '#fef2f2', border: '#fecaca', text: '#dc2626' },
            { label: "Batch Years", value: batches.length, icon: "🎓", color: '#faf5ff', border: '#e9d5ff', text: '#7c3aed' },
          ].map((s, i) => (
            <div key={i} style={{ ...styles.statCard, background: s.color, border: `1px solid ${s.border}` }}>
              <div style={styles.statTop}>
                <span style={styles.statIcon}>{s.icon}</span>
                <span style={{ ...styles.statValue, color: s.text }}>{s.value}</span>
              </div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div style={styles.tableCard}>
          {/* Tabs */}
          <div style={styles.tabRow}>
            {["alumni", "pending"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
              >
                {tab === "alumni" ? "All Alumni" : "Pending Approvals"}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div style={styles.filterRow}>
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                style={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              style={styles.select}
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
            <div style={styles.tableWrapper}>
              {loading ? (
                <p style={styles.emptyText}>Loading...</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      {["#", "Name", "Email", "Batch", "Job Title", "Company", "Status", "Actions"].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={styles.emptyText}>No alumni found</td>
                      </tr>
                    ) : filtered.map((a, i) => {
                      const s = statusColor[a.alumni_profile?.status] || { bg: '#f1f5f9', color: '#64748b' }
                      return (
                        <tr key={a.id}
                          style={styles.tr}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                          <td style={{ ...styles.td, color: '#94a3b8' }}>{i + 1}</td>
                          <td style={styles.td}>
                            <div style={styles.nameCell}>
                              <div style={styles.avatar}>{a.name.charAt(0)}</div>
                              <span style={styles.nameText}>{a.name}</span>
                            </div>
                          </td>
                          <td style={{ ...styles.td, color: '#64748b' }}>{a.email}</td>
                          <td style={styles.td}>{a.alumni_profile?.batch_year || "—"}</td>
                          <td style={styles.td}>{a.alumni_profile?.current_job || "—"}</td>
                          <td style={styles.td}>{a.alumni_profile?.company || "—"}</td>
                          <td style={styles.td}>
                            <span style={{ ...styles.badge, background: s.bg, color: s.color }}>
                              {a.alumni_profile?.status || "unknown"}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.actions}>
                              <button style={styles.editBtn}
                                onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                                onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}
                              >Edit</button>
                              <button
                                style={styles.deleteBtn}
                                onClick={() => handleDelete(a.id)}
                                onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
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
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <p style={styles.emptyTitle}>No pending approvals</p>
              <p style={styles.emptyDesc}>New registrations will appear here for review</p>
            </div>
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
    padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px',
  },
  logoMark: {
    width: '40px', height: '40px', background: '#2563eb', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700', fontSize: '14px', flexShrink: 0,
  },
  logoText: { color: 'white', fontWeight: '700', fontSize: '15px' },
  logoSub: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '2px' },
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
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  pageSubtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  exportBtn: {
    background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
    transition: 'background 0.2s',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { borderRadius: '14px', padding: '20px' },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  statIcon: { fontSize: '24px' },
  statValue: { fontSize: '32px', fontWeight: '700' },
  statLabel: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
  tableCard: { background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' },
  tabRow: { display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '0 24px' },
  tab: {
    padding: '16px 20px', border: 'none', background: 'transparent',
    fontSize: '14px', fontWeight: '600', color: '#94a3b8', cursor: 'pointer',
    borderBottom: '2px solid transparent', transition: 'all 0.15s',
  },
  tabActive: { color: '#1d4ed8', borderBottom: '2px solid #1d4ed8' },
  filterRow: { display: 'flex', gap: '12px', padding: '16px 24px', borderBottom: '1px solid #f8fafc' },
  searchWrapper: { flex: 1, position: 'relative' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' },
  searchInput: {
    width: '100%', padding: '10px 12px 10px 36px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    background: '#f8fafc',
  },
  select: {
    padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '14px', outline: 'none', background: '#f8fafc', cursor: 'pointer',
  },
  tableWrapper: { overflowX: 'auto', padding: '0 24px 24px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '8px' },
  thead: { background: '#f8fafc' },
  th: {
    padding: '12px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '700',
    color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px',
    borderBottom: '1px solid #f1f5f9',
  },
  tr: { transition: 'background 0.15s' },
  td: { padding: '14px 12px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #f8fafc' },
  nameCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%', background: '#dbeafe',
    color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '13px', flexShrink: 0,
  },
  nameText: { fontWeight: '600', color: '#0f172a' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  actions: { display: 'flex', gap: '6px' },
  editBtn: {
    padding: '5px 12px', background: '#eff6ff', color: '#1d4ed8', border: 'none',
    borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'background 0.15s',
  },
  deleteBtn: {
    padding: '5px 12px', background: '#fee2e2', color: '#dc2626', border: 'none',
    borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'background 0.15s',
  },
  emptyText: { textAlign: 'center', color: '#94a3b8', padding: '32px' },
  emptyState: { padding: '60px', textAlign: 'center' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { fontSize: '16px', fontWeight: '600', color: '#334155', marginBottom: '8px' },
  emptyDesc: { fontSize: '14px', color: '#94a3b8' },
}

export default AdminPanel