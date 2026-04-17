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
    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data)
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread')
      setUnreadCount(res.data.count)
    } catch (err) {
      console.error('Failed to fetch unread count', err)
    }
  }

  const handleOpen = async () => {
    setShowPanel(!showPanel)
    if (!showPanel) {
      await fetchNotifications()
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications(notifications.filter(n => n.id !== id))
    } catch (err) {
      console.error('Failed to delete notification', err)
    }
  }

  const typeStyles = {
    mentorship: { bg: '#ede9fe', color: '#7c3aed', icon: '🤝' },
    success:    { bg: '#dcfce7', color: '#15803d', icon: '✅' },
    warning:    { bg: '#fef3c7', color: '#d97706', icon: '⚠️' },
    job:        { bg: '#dbeafe', color: '#1d4ed8', icon: '💼' },
    event:      { bg: '#fce7f3', color: '#db2777', icon: '🗓' },
    info:       { bg: '#f1f5f9', color: '#64748b', icon: 'ℹ️' },
  }

  const card = isDark ? '#1e293b' : 'white'
  const text = isDark ? '#f1f5f9' : '#0f172a'
  const subtext = isDark ? '#94a3b8' : '#64748b'
  const border = isDark ? '#334155' : '#e2e8f0'
  const hoverBg = isDark ? '#0f172a' : '#f8fafc'

  return (
    <div style={{ position: 'relative' }} ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        style={{
          position: 'relative', background: isDark ? '#1e293b' : '#f1f5f9',
          border: `1px solid ${border}`, borderRadius: '10px',
          width: '40px', height: '40px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', transition: 'all 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#334155' : '#e2e8f0'}
        onMouseLeave={e => e.currentTarget.style.background = isDark ? '#1e293b' : '#f1f5f9'}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#dc2626', color: 'white', borderRadius: '50%',
            width: '18px', height: '18px', fontSize: '11px', fontWeight: '700',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${isDark ? '#0f172a' : 'white'}`,
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div style={{
          position: 'absolute', top: '48px', right: 0,
          width: '360px', background: card,
          borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: `1px solid ${border}`, zIndex: 1000, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: text, margin: 0 }}>Notifications</h3>
              {unreadCount > 0 && (
                <p style={{ fontSize: '12px', color: subtext, margin: 0 }}>{unreadCount} unread</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead}
                style={{ fontSize: '12px', color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >Mark all read</button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔔</div>
                <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => {
                const ts = typeStyles[n.type] || typeStyles.info
                return (
                  <div key={n.id}
                    onClick={() => {
                      if (!n.is_read) handleMarkRead(n.id)
                      if (n.link) { navigate(n.link); setShowPanel(false) }
                    }}
                    style={{
                      display: 'flex', gap: '12px', padding: '14px 20px',
                      borderBottom: `1px solid ${border}`, cursor: 'pointer',
                      background: n.is_read ? 'transparent' : (isDark ? '#1e293b' : '#f8fafc'),
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                    onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'transparent' : (isDark ? '#1e293b' : '#f8fafc')}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: ts.bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '16px', flexShrink: 0,
                    }}>
                      {ts.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <p style={{ fontSize: '13px', fontWeight: n.is_read ? '500' : '700', color: text, margin: '0 0 2px', lineHeight: '1.4' }}>
                          {n.title}
                        </p>
                        {!n.is_read && (
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1d4ed8', flexShrink: 0, marginTop: '4px', marginLeft: '8px' }} />
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: subtext, margin: '0 0 4px', lineHeight: '1.4' }}>{n.message}</p>
                      <p style={{ fontSize: '11px', color: isDark ? '#475569' : '#94a3b8', margin: 0 }}>
                        {new Date(n.created_at).toLocaleDateString()} · {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      onClick={e => handleDelete(n.id, e)}
                      style={{ background: 'none', border: 'none', color: subtext, cursor: 'pointer', fontSize: '14px', padding: '0 0 0 4px', flexShrink: 0 }}
                    >✕</button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell