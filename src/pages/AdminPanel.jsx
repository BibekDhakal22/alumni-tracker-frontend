import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"
import Sidebar from "../components/Sidebar"
import Avatar from "../components/Avatar"

function AdminPanel() {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const [search, setSearch]           = useState("")
  const [filterBatch, setFilterBatch] = useState("")
  const [activeTab, setActiveTab]     = useState("alumni")
  const [alumniList, setAlumniList]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [deletingId, setDeletingId]   = useState(null)
  const [exporting, setExporting]     = useState(false)

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
    setDeletingId(id)
    try {
      await api.delete(`/alumni/${id}`)
      setAlumniList(prev => prev.filter(a => a.id !== id))
    } catch {
      alert("Failed to delete alumni.")
    } finally {
      setDeletingId(null)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://127.0.0.1:8000/api/alumni/export", {
        headers: { Authorization: "Bearer " + token, Accept: "text/csv" },
      })
      const blob = await response.blob()
      const url  = window.URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href = url
      a.download = "alumni_export.csv"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      alert("Failed to export data.")
    } finally {
      setExporting(false)
    }
  }

  // ── derived data ─────────────────────────────────────────────────────────────
  const filtered = alumniList.filter(a => {
    const matchSearch = (
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    )
    // batch_year can be a number from API — use String() for safe comparison
    const matchBatch = filterBatch
      ? String(a.alumni_profile?.batch_year) === String(filterBatch)
      : true
    return matchSearch && matchBatch
  })

  const totalAlumni = alumniList.length
  const employed    = alumniList.filter(a => a.alumni_profile?.status === "employed").length
  const unemployed  = alumniList.filter(a => a.alumni_profile?.status === "unemployed").length
  const batches     = [...new Set(alumniList.map(a => a.alumni_profile?.batch_year).filter(Boolean))]

  // ── theme tokens ──────────────────────────────────────────────────────────────
  const bg          = isDark ? "#0f172a" : "#f1f5f9"
  const card        = isDark ? "#1e293b" : "white"
  const text        = isDark ? "#f1f5f9" : "#0f172a"
  const subtext     = isDark ? "#94a3b8" : "#64748b"
  const border      = isDark ? "#334155" : "#f1f5f9"
  const inputBg     = isDark ? "#0f172a" : "#f8fafc"
  const inputBorder = isDark ? "#334155" : "#e2e8f0"

  const statusStyle = {
    employed:   { bg: isDark ? "#14532d" : "#dcfce7", color: "#15803d" },
    unemployed: { bg: isDark ? "#450a0a" : "#fee2e2", color: "#dc2626" },
    studying:   { bg: isDark ? "#1e3a8a" : "#dbeafe", color: "#1d4ed8" },
  }

  const statCards = [
    { label: "Total Alumni", value: totalAlumni, icon: "👥", accent: "#1d4ed8",
      bg: isDark ? "#1e3a8a22" : "#eff6ff", bd: isDark ? "#1d4ed8" : "#bfdbfe" },
    { label: "Employed",     value: employed,    icon: "💼", accent: "#15803d",
      bg: isDark ? "#14532d22" : "#f0fdf4", bd: isDark ? "#16a34a" : "#bbf7d0" },
    { label: "Unemployed",   value: unemployed,  icon: "📋", accent: "#dc2626",
      bg: isDark ? "#450a0a22" : "#fef2f2", bd: isDark ? "#dc2626" : "#fecaca" },
    { label: "Batch Years",  value: batches.length, icon: "🎓", accent: "#7c3aed",
      bg: isDark ? "#3b076422" : "#faf5ff", bd: isDark ? "#7c3aed" : "#e9d5ff" },
  ]

  const TABLE_HEADERS = ["#", "Name", "Email", "Batch", "Job Title", "Company", "Status", "Actions"]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <Sidebar />

      <main style={{ marginLeft: "240px", flex: 1, padding: "32px", minWidth: 0 }}>

        {/* ── Header ── */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: text, margin: "0 0 4px" }}>Alumni Management</h1>
            <p style={{ fontSize: "14px", color: subtext, margin: 0 }}>Manage and monitor all registered alumni</p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              background: exporting ? "#15803d" : "#16a34a", color: "white",
              border: "none", padding: "10px 20px", borderRadius: "10px",
              cursor: exporting ? "not-allowed" : "pointer", fontSize: "14px",
              fontWeight: "600", opacity: exporting ? 0.8 : 1, transition: "background 0.15s",
            }}
            onMouseEnter={e => !exporting && (e.currentTarget.style.background = "#15803d")}
            onMouseLeave={e => !exporting && (e.currentTarget.style.background = "#16a34a")}
          >
            {exporting ? "Exporting…" : "↓ Export CSV"}
          </button>
        </header>

        {/* ── Stat Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {statCards.map((s, i) => (
            <div key={i} style={{ borderRadius: "14px", padding: "20px", background: s.bg, border: `1px solid ${s.bd}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span style={{ fontSize: "22px" }}>{s.icon}</span>
                <span style={{ fontSize: "30px", fontWeight: "800", color: s.accent, lineHeight: 1 }}>{s.value}</span>
              </div>
              <div style={{ fontSize: "13px", color: subtext, fontWeight: "500" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Table Card ── */}
        <div style={{ background: card, borderRadius: "16px", border: `1px solid ${border}`, overflow: "hidden" }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${border}`, padding: "0 24px" }}>
            {[
              { key: "alumni",  label: "All Alumni" },
              { key: "pending", label: "Pending Approvals" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "16px 20px", border: "none", background: "transparent",
                  fontSize: "14px", fontWeight: "600", cursor: "pointer",
                  color: activeTab === tab.key ? "#1d4ed8" : subtext,
                  borderBottom: activeTab === tab.key ? "2px solid #1d4ed8" : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >{tab.label}</button>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "12px", padding: "16px 24px", borderBottom: `1px solid ${border}` }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                style={{
                  width: "100%", padding: "10px 12px 10px 36px",
                  border: `1.5px solid ${inputBorder}`, borderRadius: "10px",
                  fontSize: "14px", outline: "none", boxSizing: "border-box",
                  background: inputBg, color: text, fontFamily: "inherit",
                }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              style={{
                padding: "10px 14px", border: `1.5px solid ${inputBorder}`,
                borderRadius: "10px", fontSize: "14px", outline: "none",
                background: inputBg, color: text, cursor: "pointer", fontFamily: "inherit",
              }}
              value={filterBatch}
              onChange={e => setFilterBatch(e.target.value)}
            >
              <option value="">All Batches</option>
              {batches.sort().map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* ── Alumni Table ── */}
          {activeTab === "alumni" && (
            <div style={{ overflowX: "auto", padding: "0 24px 24px" }}>
              {loading ? (
                <p style={{ textAlign: "center", color: subtext, padding: "48px" }}>Loading alumni…</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px" }}>
                  <thead>
                    <tr style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
                      {TABLE_HEADERS.map(h => (
                        <th key={h} style={{
                          padding: "12px", textAlign: "left",
                          fontSize: "11px", fontWeight: "700", color: subtext,
                          textTransform: "uppercase", letterSpacing: "0.5px",
                          borderBottom: `1px solid ${border}`, whiteSpace: "nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={TABLE_HEADERS.length} style={{ textAlign: "center", color: subtext, padding: "48px", fontSize: "14px" }}>
                          No alumni found
                        </td>
                      </tr>
                    ) : filtered.map((a, i) => {
                      const st = statusStyle[a.alumni_profile?.status] || { bg: isDark ? "#1e293b" : "#f1f5f9", color: "#64748b" }
                      const isDeleting = deletingId === a.id
                      return (
                        <tr key={a.id}
                          style={{ transition: "background 0.1s", opacity: isDeleting ? 0.5 : 1 }}
                          onMouseEnter={e => e.currentTarget.style.background = isDark ? "#0f172a" : "#f8fafc"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          {/* # */}
                          <td style={td(border)}><span style={{ color: subtext, fontSize: "13px" }}>{i + 1}</span></td>

                          {/* Name */}
                          <td style={td(border)}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <Avatar name={a.name} photo={a.alumni_profile?.photo} size={32} fontSize={13} />
                              <span style={{ fontWeight: "600", color: text, fontSize: "14px", whiteSpace: "nowrap" }}>{a.name}</span>
                            </div>
                          </td>

                          {/* Email */}
                          <td style={td(border)}><span style={{ color: subtext, fontSize: "13px" }}>{a.email}</span></td>

                          {/* Batch */}
                          <td style={td(border)}><span style={{ color: text, fontSize: "14px" }}>{a.alumni_profile?.batch_year || "—"}</span></td>

                          {/* Job Title */}
                          <td style={td(border)}><span style={{ color: text, fontSize: "14px" }}>{a.alumni_profile?.current_job || "—"}</span></td>

                          {/* Company */}
                          <td style={td(border)}><span style={{ color: text, fontSize: "14px" }}>{a.alumni_profile?.company || "—"}</span></td>

                          {/* Status */}
                          <td style={td(border)}>
                            <span style={{
                              padding: "3px 10px", borderRadius: "20px",
                              fontSize: "12px", fontWeight: "600",
                              background: st.bg, color: st.color,
                              textTransform: "capitalize",
                            }}>
                              {a.alumni_profile?.status || "unknown"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={td(border)}>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button
                                onClick={() => navigate(`/admin/edit/${a.id}`)}
                                style={actionBtn("#eff6ff", "#1d4ed8")}
                                onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                                onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
                              >Edit</button>
                              <button
                                onClick={() => handleDelete(a.id)}
                                disabled={isDeleting}
                                style={{ ...actionBtn("#fee2e2", "#dc2626"), opacity: isDeleting ? 0.6 : 1 }}
                                onMouseEnter={e => !isDeleting && (e.currentTarget.style.background = "#fecaca")}
                                onMouseLeave={e => !isDeleting && (e.currentTarget.style.background = "#fee2e2")}
                              >{isDeleting ? "…" : "Delete"}</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}

              {/* Row count footer */}
              {!loading && filtered.length > 0 && (
                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: `1px solid ${border}`, fontSize: "13px", color: subtext }}>
                  Showing <strong style={{ color: text }}>{filtered.length}</strong> of <strong style={{ color: text }}>{totalAlumni}</strong> alumni
                </div>
              )}
            </div>
          )}

          {/* ── Pending Tab ── */}
          {activeTab === "pending" && (
            <div style={{ padding: "64px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
              <p style={{ fontSize: "16px", fontWeight: "600", color: text, margin: "0 0 8px" }}>No pending approvals</p>
              <p style={{ fontSize: "14px", color: subtext, margin: 0 }}>New registrations will appear here for review</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

// ── small style helpers ──────────────────────────────────────────────────────
const td = (border) => ({
  padding: "13px 12px",
  borderBottom: `1px solid ${border}`,
  verticalAlign: "middle",
})

const actionBtn = (bg, color) => ({
  padding: "5px 12px",
  background: bg,
  color,
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  transition: "background 0.15s",
  whiteSpace: "nowrap",
})

export default AdminPanel