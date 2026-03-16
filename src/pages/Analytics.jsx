import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts"

const COLORS = ["#1d4ed8", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"]

function Analytics() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAnalytics() }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/analytics")
      setData(response.data)
    } catch (err) {
      console.error("Failed to fetch analytics", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => { await logout(); navigate("/") }

  if (loading) return (
    <div style={{ ...styles.wrapper, justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ color: '#64748b', fontSize: '16px' }}>Loading analytics...</p>
    </div>
  )

  const employmentData = data?.employment_stats?.map(e => ({
    name: e.status.charAt(0).toUpperCase() + e.status.slice(1),
    value: e.count
  })) || []

  const industryData = data?.industry_stats?.map(i => ({
    name: i.industry, count: i.count
  })) || []

  const batchData = data?.batch_stats?.map(b => ({
    name: b.batch_year, alumni: b.count
  })) || []

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const growthData = data?.growth_stats?.map(g => ({
    name: monthNames[g.month - 1] + " " + g.year,
    registrations: g.count
  })) || []

  const summaryCards = [
    { label: "Total Alumni", value: data?.total_alumni || 0, icon: "👥", color: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
    { label: "Employed", value: data?.employment_stats?.find(e => e.status === 'employed')?.count || 0, icon: "💼", color: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
    { label: "Total Jobs", value: data?.total_jobs || 0, icon: "📋", color: '#faf5ff', border: '#e9d5ff', text: '#7c3aed' },
    { label: "Batch Years", value: data?.batch_stats?.length || 0, icon: "🎓", color: '#fff7ed', border: '#fed7aa', text: '#d97706' },
  ]

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
            { icon: "◈", label: "Job Board", path: "/jobs" },
            { icon: "◉", label: "Analytics", path: "/analytics", active: true },
            ...(user?.role === "admin" ? [{ icon: "⊛", label: "Admin Panel", path: "/admin" }] : []),
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
            <h1 style={styles.pageTitle}>Analytics Dashboard</h1>
            <p style={styles.pageSubtitle}>Overview of alumni data, employment trends and statistics</p>
          </div>
          <div style={styles.refreshBadge}>
            Live Data
          </div>
        </header>

        {/* Summary Cards */}
        <div style={styles.statsGrid}>
          {summaryCards.map((s, i) => (
            <div key={i} style={{ ...styles.statCard, background: s.color, border: `1px solid ${s.border}` }}>
              <div style={styles.statTop}>
                <span style={styles.statIcon}>{s.icon}</span>
                <span style={{ ...styles.statValue, color: s.text }}>{s.value}</span>
              </div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div style={styles.chartsRow}>
          {/* Pie Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Employment Status</h3>
              <span style={styles.chartSubtitle}>Distribution of alumni</span>
            </div>
            {employmentData.length === 0 ? (
              <div style={styles.noData}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={employmentData} cx="50%" cy="50%" outerRadius={90}
                    dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {employmentData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Batch Bar Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Alumni by Batch Year</h3>
              <span style={styles.chartSubtitle}>Registration per batch</span>
            </div>
            {batchData.length === 0 ? (
              <div style={styles.noData}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={batchData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="alumni" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div style={styles.chartsRow}>
          {/* Industry Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Industry Distribution</h3>
              <span style={styles.chartSubtitle}>Where alumni work</span>
            </div>
            {industryData.length === 0 ? (
              <div style={styles.noData}>No data yet — update profiles with industry info</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={industryData} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="count" fill="#16a34a" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Growth Line Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Registrations Over Time</h3>
              <span style={styles.chartSubtitle}>New alumni per month</span>
            </div>
            {growthData.length === 0 ? (
              <div style={styles.noData}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={growthData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="registrations" stroke="#7c3aed"
                    strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
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
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  pageSubtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  refreshBadge: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d',
    padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { borderRadius: '14px', padding: '20px' },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  statIcon: { fontSize: '24px' },
  statValue: { fontSize: '32px', fontWeight: '700' },
  statLabel: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  chartCard: {
    background: 'white', borderRadius: '16px', padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
  },
  chartHeader: { marginBottom: '20px' },
  chartTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  chartSubtitle: { fontSize: '13px', color: '#94a3b8' },
  noData: {
    height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#94a3b8', fontSize: '14px', fontStyle: 'italic',
  },
}

export default Analytics