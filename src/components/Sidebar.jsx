import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import NotificationBell from "./NotificationBell"
import Avatar from "./Avatar"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const navItems = [
    { icon: "⊞", label: "Dashboard", path: "/dashboard" },
    { icon: "◎", label: "Edit Profile", path: "/profile/edit" },
    { icon: "👥", label: "Alumni Gallery", path: "/gallery" },
    { icon: "◈", label: "Job Board", path: "/jobs" },
    { icon: "🗓", label: "Events", path: "/events" },
    { icon: "🤝", label: "Mentorship", path: "/mentorship" },
    { icon: "◉", label: "Analytics", path: "/analytics" },
    ...(user?.role === "admin" ? [{ icon: "⊛", label: "Admin Panel", path: "/admin" }] : []),
  ]

  return (
    <aside style={{
      width: '240px', display: 'flex', flexDirection: 'column',
      padding: '24px 0', position: 'fixed', top: 0, left: 0,
      height: '100vh', zIndex: 10, transition: 'background 0.3s',
      background: isDark ? '#0f172a' : '#1e3a8a',
      borderRight: isDark ? '1px solid #1e293b' : 'none',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '0 20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '36px', height: '36px', background: '#2563eb',
          borderRadius: '10px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'white', fontWeight: '700',
          fontSize: '14px', flexShrink: 0,
        }}>AT</div>
        <div>
          <div style={{ color: 'white', fontWeight: '700', fontSize: '15px' }}>Alumni Tracker</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Tribhuvan University</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = location.hash === `#${item.path}`
          return (
            <button key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '10px', border: 'none',
                background: active ? '#2563eb' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontSize: '14px', fontWeight: '500',
                transition: 'all 0.15s', textAlign: 'left', width: '100%',
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = isDark ? '#1e293b' : '#1e3a8a')}
              onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Notification Bell Row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', marginBottom: '8px',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Notifications</span>
          <NotificationBell />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
            padding: '10px 12px', border: 'none', borderRadius: '10px',
            background: isDark ? '#1e293b' : 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '13px',
            fontWeight: '500', transition: 'all 0.15s', marginBottom: '8px',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <span style={{ fontSize: '16px' }}>{isDark ? "☀️" : "🌙"}</span>
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* User Info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', marginBottom: '4px',
        }}>
          <Avatar
            name={user?.name}
            photo={user?.alumni_profile?.photo}
            size={32}
            fontSize={13}
          />
          <div>
            <div style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{user?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
            border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer', fontSize: '14px', transition: 'all 0.15s',
            width: '100%', borderRadius: '10px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e293b' : '#1e3a8a'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>→</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar