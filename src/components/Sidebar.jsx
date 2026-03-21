import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

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
    { icon: "◈", label: "Job Board", path: "/jobs" },
    { icon: "🗓", label: "Events", path: "/events" },
    { icon: "🤝", label: "Mentorship", path: "/mentorship" },
    { icon: "◉", label: "Analytics", path: "/analytics" },
    ...(user?.role === "admin" ? [{ icon: "⊛", label: "Admin Panel", path: "/admin" }] : []),
  ]

  const isActive = (path) => location.pathname === path || location.hash === `#${path}`

  return (
    <aside style={{
      ...styles.sidebar,
      background: isDark ? '#0f172a' : '#1e3a8a',
      borderRight: isDark ? '1px solid #1e293b' : 'none',
    }}>
      {/* Logo */}
      <div style={styles.sidebarLogo}>
        <div style={styles.logoMark}>AT</div>
        <div>
          <div style={styles.logoText}>Alumni Tracker</div>
          <div style={styles.logoSub}>Tribhuvan University</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={styles.sidebarNav}>
        {navItems.map(item => {
          const active = location.hash === `#${item.path}`
          return (
            <button key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                ...(active ? styles.navItemActive : {}),
              }}
              onMouseEnter={e => !active && (e.currentTarget.style.background = isDark ? '#1e293b' : '#1e3a8a')}
              onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div style={styles.bottomSection}>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            ...styles.themeToggle,
            background: isDark ? '#1e293b' : 'rgba(255,255,255,0.1)',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <span style={styles.themeIcon}>{isDark ? "☀️" : "🌙"}</span>
          <span style={styles.themeLabel}>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* User Info */}
        <div style={styles.userInfo}>
          <div style={styles.userAvatar}>{user?.name?.charAt(0)}</div>
          <div style={styles.userDetails}>
            <div style={styles.userName}>{user?.name}</div>
            <div style={styles.userRole}>{user?.role}</div>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={styles.logoutBtn}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? '#1e293b' : '#1e3a8a'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={styles.navIcon}>→</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '240px', display: 'flex', flexDirection: 'column',
    padding: '24px 0', position: 'fixed', top: 0, left: 0,
    height: '100vh', zIndex: 10, transition: 'background 0.3s',
  },
  sidebarLogo: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '16px',
  },
  logoMark: {
    width: '36px', height: '36px', background: '#2563eb', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700', fontSize: '14px', flexShrink: 0,
  },
  logoText: { color: 'white', fontWeight: '700', fontSize: '15px' },
  logoSub: { color: 'rgba(255,255,255,0.5)', fontSize: '11px' },
  sidebarNav: { flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
    borderRadius: '10px', border: 'none', background: 'transparent',
    color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px',
    fontWeight: '500', transition: 'all 0.15s', textAlign: 'left', width: '100%',
  },
  navItemActive: { background: '#2563eb', color: 'white' },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  bottomSection: {
    padding: '0 12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px',
  },
  themeToggle: {
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
    padding: '10px 12px', border: 'none', borderRadius: '10px',
    color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '13px',
    fontWeight: '500', transition: 'all 0.15s', marginBottom: '8px',
  },
  themeIcon: { fontSize: '16px' },
  themeLabel: { fontSize: '13px' },
  userInfo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', marginBottom: '4px',
  },
  userAvatar: {
    width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '13px', flexShrink: 0,
  },
  userDetails: {},
  userName: { color: 'white', fontSize: '13px', fontWeight: '600' },
  userRole: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'capitalize' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
    border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer', fontSize: '14px', transition: 'all 0.15s', width: '100%',
    borderRadius: '10px',
  },
}

export default Sidebar