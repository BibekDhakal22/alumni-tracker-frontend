import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"
import Sidebar from "../components/Sidebar"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts"

const COLORS = ["#1d4ed8", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"]

function Analytics() {
  const { isDark } = useTheme()
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

  const bg = isDark ? '#0f172a' : '#f1f5f9'
  const card = isDark ? '#1e293b' : 'white'
  const text = isDark ? '#f1f5f9' : '#0f172a'
  const subtext = isDark ? '#94a3b8' : '#64748b'
  const border = isDark ? '#334155' : '#f1f5f9'
  const gridColor = isDark ? '#334155' : '#f1f5f9'
  const axisColor = isDark ? '#64748b' : '#94a3b8'
  const tooltipBg = isDark ? '#1e293b' : 'white'
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0'

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg }}>
      <Sidebar />
      <main style={{ marginLeft: '240px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: subtext, fontSize: '16px' }}>Loading analytics...</p>
      </main>
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
    { label: "Total Alumni", value: data?.total_alumni || 0, icon: "👥", color: isDark ? '#1e3a8a' : '#eff6ff', border: isDark ? '#1d4ed8' : '#bfdbfe', textColor: '#1d4ed8' },
    { label: "Employed", value: data?.employment_stats?.find(e => e.status === 'employed')?.count || 0, icon: "💼", color: isDark ? '#14532d' : '#f0fdf4', border: isDark ? '#16a34a' : '#bbf7d0', textColor: '#15803d' },
    { label: "Total Jobs", value: data?.total_jobs || 0, icon: "📋", color: isDark ? '#3b0764' : '#faf5ff', border: isDark ? '#7c3aed' : '#e9d5ff', textColor: '#7c3aed' },
    { label: "Batch Years", value: data?.batch_stats?.length || 0, icon: "🎓", color: isDark ? '#431407' : '#fff7ed', border: isDark ? '#ea580c' : '#fed7aa', textColor: '#d97706' },
  ]

  const tooltipStyle = {
    backgroundColor: tooltipBg,
    border: `1px solid ${tooltipBorder}`,
    borderRadius: '10px',
    color: text,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: 'sans-serif' }}>
      <Sidebar />

      <main style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Analytics Dashboard</h1>
            <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Overview of alumni data, employment trends and statistics</p>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
            Live Data
          </div>
        </header>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
          {summaryCards.map((s, i) => (
            <div key={i} style={{ borderRadius: '14px', padding: '20px', background: s.color, border: `1px solid ${s.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>{s.icon}</span>
                <span style={{ fontSize: '32px', fontWeight: '700', color: s.textColor }}>{s.value}</span>
              </div>
              <div style={{ fontSize: '13px', color: subtext, fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Pie Chart */}
          <div style={{ background: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Employment Status</h3>
            <p style={{ fontSize: '13px', color: subtext, margin: '0 0 20px' }}>Distribution of alumni</p>
            {employmentData.length === 0 ? (
              <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: subtext, fontSize: '14px', fontStyle: 'italic' }}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={employmentData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {employmentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ color: text }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Batch Bar Chart */}
          <div style={{ background: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Alumni by Batch Year</h3>
            <p style={{ fontSize: '13px', color: subtext, margin: '0 0 20px' }}>Registration per batch</p>
            {batchData.length === 0 ? (
              <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: subtext, fontSize: '14px', fontStyle: 'italic' }}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={batchData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: axisColor }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: axisColor }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="alumni" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Industry Chart */}
          <div style={{ background: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Industry Distribution</h3>
            <p style={{ fontSize: '13px', color: subtext, margin: '0 0 20px' }}>Where alumni work</p>
            {industryData.length === 0 ? (
              <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: subtext, fontSize: '14px', fontStyle: 'italic' }}>No data yet — update profiles with industry info</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={industryData} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: axisColor }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: axisColor }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="#16a34a" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Growth Line Chart */}
          <div style={{ background: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Registrations Over Time</h3>
            <p style={{ fontSize: '13px', color: subtext, margin: '0 0 20px' }}>New alumni per month</p>
            {growthData.length === 0 ? (
              <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: subtext, fontSize: '14px', fontStyle: 'italic' }}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={growthData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: axisColor }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="registrations" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Analytics