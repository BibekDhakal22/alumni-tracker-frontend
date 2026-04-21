import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import NotificationBell from "./NotificationBell"
import Avatar from "./Avatar"

function Sidebar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const navItems = [
    { icon: "▦",  emoji: "🏠", label: "Dashboard",     path: "/dashboard" },
    { icon: "✎",  emoji: "👤", label: "Edit Profile",  path: "/profile/edit" },
    { icon: "👥", emoji: "👥", label: "Alumni Gallery", path: "/gallery" },
    { icon: "💼", emoji: "💼", label: "Job Board",      path: "/jobs" },
    { icon: "📅", emoji: "📅", label: "Events",         path: "/events" },
    { icon: "🤝", emoji: "🤝", label: "Mentorship",     path: "/mentorship" },
    { icon: "📊", emoji: "📊", label: "Analytics",      path: "/analytics" },
    ...(user?.role === "admin"
      ? [{ icon: "⚙️", emoji: "⚙️", label: "Admin Panel", path: "/admin" }]
      : []),
  ]

  // Use SVG-like clean icons via text for Dashboard and Edit Profile
  const getIcon = (path) => {
    const map = {
      "/dashboard":    <DashIcon />,
      "/profile/edit": <PersonIcon />,
      "/gallery":      "👥",
      "/jobs":         "💼",
      "/events":       "📅",
      "/mentorship":   "🤝",
      "/analytics":    "📊",
      "/admin":        "⚙️",
    }
    return map[path] ?? "•"
  }

  return (
    <aside style={{
      width: "240px",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0, left: 0,
      height: "100vh",
      zIndex: 10,
      background: isDark
        ? "linear-gradient(180deg, #0f172a 0%, #0f172a 100%)"
        : "linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)",
      borderRight: isDark ? "1px solid #1e293b" : "none",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    }}>

      {/* ── Logo ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "20px 16px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width: "34px", height: "34px", background: "#2563eb",
          borderRadius: "9px", display: "flex", alignItems: "center",
          justifyContent: "center", color: "white", fontWeight: "800",
          fontSize: "13px", flexShrink: 0, letterSpacing: "0.5px",
          boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
        }}>AT</div>
        <div>
          <div style={{ color: "white", fontWeight: "700", fontSize: "14px", lineHeight: 1.2 }}>Alumni Tracker</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "10.5px", marginTop: "2px" }}>Tribhuvan University</div>
        </div>
      </div>

      {/* ── Nav Items ── */}
      <nav style={{
        flex: 1, padding: "10px 10px 0",
        display: "flex", flexDirection: "column", gap: "2px",
        overflowY: "auto",
        // hide scrollbar
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
        {navItems.map(item => {
          const active = location.hash === `#${item.path}` ||
                         location.pathname === item.path
          return (
            <button key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 12px", borderRadius: "9px", border: "none",
                background: active
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                color: active ? "white" : "rgba(255,255,255,0.62)",
                cursor: "pointer", fontSize: "13.5px", fontWeight: active ? "600" : "500",
                transition: "all 0.15s", textAlign: "left", width: "100%",
                boxShadow: active ? "inset 0 0 0 1px rgba(255,255,255,0.12)" : "none",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)"
                  e.currentTarget.style.color = "white"
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "rgba(255,255,255,0.62)"
                }
              }}
            >
              {/* Active indicator bar */}
              {active && (
                <div style={{
                  position: "absolute", left: "10px",
                  width: "3px", height: "20px",
                  background: "white", borderRadius: "2px",
                  opacity: 0.7,
                }} />
              )}
              <span style={{ fontSize: "15px", width: "18px", textAlign: "center", flexShrink: 0 }}>
                {item.emoji}
              </span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>

        {/* Notifications row — compact */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "6px 10px 10px",
        }}>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "11.5px", fontWeight: "500", letterSpacing: "0.3px" }}>
            Notifications
          </span>
          {/* Wrap bell so it blends with sidebar */}
          <div style={{ transform: "scale(0.85)", transformOrigin: "right center" }}>
            <NotificationBell />
          </div>
        </div>

        {/* Dark Mode Toggle — slim */}
        <button onClick={toggleTheme} style={{
          display: "flex", alignItems: "center", gap: "9px", width: "100%",
          padding: "8px 12px", border: "none", borderRadius: "9px",
          background: "rgba(255,255,255,0.07)",
          color: "rgba(255,255,255,0.75)", cursor: "pointer", fontSize: "13px",
          fontWeight: "500", transition: "all 0.15s", marginBottom: "6px",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.13)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
        >
          <span style={{ fontSize: "14px" }}>{isDark ? "☀️" : "🌙"}</span>
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* User row */}
        <div style={{
          display: "flex", alignItems: "center", gap: "9px",
          padding: "8px 12px", borderRadius: "9px",
          background: "rgba(255,255,255,0.05)", marginBottom: "4px",
        }}>
          <Avatar name={user?.name} photo={user?.alumni_profile?.photo} size={28} fontSize={11} />
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "white", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name}
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "10.5px", textTransform: "capitalize" }}>
              {user?.role}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          display: "flex", alignItems: "center", gap: "9px",
          padding: "8px 12px", border: "none", background: "transparent",
          color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "13px",
          transition: "all 0.15s", width: "100%", borderRadius: "9px",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)" }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)" }}
        >
          <span style={{ fontSize: "14px", width: "18px", textAlign: "center" }}>↩</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

// Tiny inline SVG icons for Dashboard & Profile (cleaner than unicode symbols)
const DashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
    <rect x="0" y="0" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
    <rect x="8" y="0" width="7" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
    <rect x="0" y="8" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9"/>
    <rect x="9" y="8" width="6" height="7" rx="1.5" fill="currentColor" opacity="0.9"/>
  </svg>
)

const PersonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="7.5" cy="4.5" r="3" fill="currentColor" opacity="0.9"/>
    <path d="M1.5 13.5C1.5 10.5 4 8 7.5 8s6 2.5 6 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
  </svg>
)

export default Sidebar