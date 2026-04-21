import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"

function NotificationBell() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showPanel, setShowPanel] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications")
      setNotifications(res.data)
    } catch {}
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread")
      setUnreadCount(res.data.count)
    } catch {}
  }

  const handleOpen = async () => {
    setShowPanel(prev => !prev)
    if (!showPanel) await fetchNotifications()
  }

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {}
  }

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all")
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch {}
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch {}
  }

  const typeStyles = {
    mentorship: { bg: "#ede9fe", color: "#7c3aed", icon: "🤝" },
    success:    { bg: "#dcfce7", color: "#15803d", icon: "✅" },
    warning:    { bg: "#fef3c7", color: "#d97706", icon: "⚠️" },
    job:        { bg: "#dbeafe", color: "#1d4ed8", icon: "💼" },
    event:      { bg: "#fce7f3", color: "#db2777", icon: "🗓" },
    info:       { bg: "#f1f5f9", color: "#64748b", icon: "ℹ️" },
  }

  // Panel uses its own theme (not sidebar colors)
  const card    = isDark ? "#1e293b" : "white"
  const text    = isDark ? "#f1f5f9" : "#0f172a"
  const subtext = isDark ? "#94a3b8" : "#64748b"
  const border  = isDark ? "#334155" : "#e2e8f0"
  const hoverBg = isDark ? "#0f172a" : "#f8fafc"

  return (
    <div style={{ position: "relative" }} ref={panelRef}>

      {/* ── Bell Button — transparent, blends into sidebar ── */}
      <button
        onClick={handleOpen}
        title="Notifications"
        style={{
          position: "relative",
          background: showPanel ? "rgba(255,255,255,0.15)" : "transparent",
          border: "none",
          borderRadius: "8px",
          width: "32px", height: "32px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px",
          transition: "background 0.15s",
          padding: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
        onMouseLeave={e => e.currentTarget.style.background = showPanel ? "rgba(255,255,255,0.15)" : "transparent"}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: "-3px", right: "-3px",
            background: "#ef4444", color: "white", borderRadius: "50%",
            width: "16px", height: "16px", fontSize: "10px", fontWeight: "700",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1.5px solid transparent",
            lineHeight: 1,
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Notification Panel ── */}
      {showPanel && (
        <div style={{
          position: "absolute",
          bottom: "40px",
          left: "0",
          width: "360px",
          background: card,
          borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          border: `1px solid ${border}`,
          zIndex: 1000,
          overflow: "hidden",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 18px", borderBottom: `1px solid ${border}`,
          }}>
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: text, margin: 0 }}>Notifications</h3>
              {unreadCount > 0 && (
                <p style={{ fontSize: "11px", color: subtext, margin: "1px 0 0" }}>{unreadCount} unread</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{
                fontSize: "12px", color: "#1d4ed8", background: "none",
                border: "none", cursor: "pointer", fontWeight: "600",
              }}>Mark all read</button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: "380px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔔</div>
                <p style={{ fontSize: "13px", color: subtext, margin: 0 }}>No notifications yet</p>
              </div>
            ) : notifications.map(n => {
              const ts = typeStyles[n.type] || typeStyles.info
              return (
                <div key={n.id}
                  onClick={() => {
                    if (!n.is_read) handleMarkRead(n.id)
                    if (n.link) { navigate(n.link); setShowPanel(false) }
                  }}
                  style={{
                    display: "flex", gap: "11px", padding: "12px 18px",
                    borderBottom: `1px solid ${border}`, cursor: "pointer",
                    background: n.is_read ? "transparent" : (isDark ? "#1e293b" : "#f8fafc"),
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = n.is_read ? "transparent" : (isDark ? "#1e293b" : "#f8fafc")}
                >
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "9px",
                    background: ts.bg, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "15px", flexShrink: 0,
                  }}>{ts.icon}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <p style={{ fontSize: "13px", fontWeight: n.is_read ? "500" : "700", color: text, margin: "0 0 2px", lineHeight: "1.4" }}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#1d4ed8", flexShrink: 0, marginTop: "4px", marginLeft: "8px" }} />
                      )}
                    </div>
                    <p style={{ fontSize: "12px", color: subtext, margin: "0 0 3px", lineHeight: "1.4" }}>{n.message}</p>
                    <p style={{ fontSize: "11px", color: isDark ? "#475569" : "#94a3b8", margin: 0 }}>
                      {new Date(n.created_at).toLocaleDateString()} · {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  <button onClick={e => handleDelete(n.id, e)} style={{
                    background: "none", border: "none", color: subtext,
                    cursor: "pointer", fontSize: "13px", padding: "0 0 0 4px", flexShrink: 0,
                    opacity: 0.6, transition: "opacity 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}
                  >✕</button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell