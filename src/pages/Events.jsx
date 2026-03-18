import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function Events() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [filterType, setFilterType] = useState("")
  const [formData, setFormData] = useState({
    title: "", description: "", location: "",
    event_date: "", type: "reunion",
    max_attendees: "", contact_email: "",
  })

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events")
      setEvents(response.data)
    } catch (err) {
      console.error("Failed to fetch events", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await api.post("/events", formData)
      setEvents([...events, response.data].sort((a, b) =>
        new Date(a.event_date) - new Date(b.event_date)
      ))
      setShowForm(false)
      setSuccess("Event created successfully!")
      setFormData({ title: "", description: "", location: "", event_date: "", type: "reunion", max_attendees: "", contact_email: "" })
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Failed to create event", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return
    try {
      await api.delete(`/events/${id}`)
      setEvents(events.filter(e => e.id !== id))
    } catch (err) {
      alert("Failed to delete event")
    }
  }

  const handleLogout = async () => { await logout(); navigate("/") }

  const filtered = filterType ? events.filter(e => e.type === filterType) : events

  const typeStyles = {
    reunion:    { bg: '#dbeafe', color: '#1d4ed8' },
    seminar:    { bg: '#faf5ff', color: '#7c3aed' },
    workshop:   { bg: '#dcfce7', color: '#15803d' },
    networking: { bg: '#fef3c7', color: '#d97706' },
    other:      { bg: '#f1f5f9', color: '#64748b' },
  }

  const isUpcoming = (date) => new Date(date) >= new Date()

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
            { icon: "🗓", label: "Events", path: "/events", active: true },
            { icon: "◉", label: "Analytics", path: "/analytics" },
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
            <h1 style={styles.pageTitle}>Alumni Events</h1>
            <p style={styles.pageSubtitle}>Reunions, seminars and networking events for alumni</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ ...styles.postBtn, background: showForm ? '#64748b' : '#1d4ed8' }}
          >
            {showForm ? "✕ Cancel" : "+ Create Event"}
          </button>
        </header>

        {/* Success */}
        {success && (
          <div style={styles.successBox}>✓ {success}</div>
        )}

        {/* Create Event Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Create New Event</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Event Title *</label>
                  <input type="text" name="title" required style={styles.formInput}
                    placeholder="Annual Alumni Reunion 2026"
                    value={formData.title} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Event Type *</label>
                  <select name="type" style={styles.formInput} value={formData.type} onChange={handleChange}>
                    <option value="reunion">Reunion</option>
                    <option value="seminar">Seminar</option>
                    <option value="workshop">Workshop</option>
                    <option value="networking">Networking</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Location *</label>
                  <input type="text" name="location" required style={styles.formInput}
                    placeholder="TU Campus, Kirtipur"
                    value={formData.location} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Event Date & Time *</label>
                  <input type="datetime-local" name="event_date" required style={styles.formInput}
                    value={formData.event_date} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Max Attendees</label>
                  <input type="number" name="max_attendees" style={styles.formInput}
                    placeholder="100"
                    value={formData.max_attendees} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Contact Email</label>
                  <input type="email" name="contact_email" style={styles.formInput}
                    placeholder="events@alumni.com"
                    value={formData.contact_email} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.formLabel}>Description *</label>
                  <textarea name="description" required rows={3} style={{ ...styles.formInput, resize: 'vertical' }}
                    placeholder="Describe the event, agenda, and what to expect..."
                    value={formData.description} onChange={handleChange}
                  />
                </div>
              </div>
              <button type="submit" disabled={submitting} style={styles.submitBtn}
                onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
                onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
              >
                {submitting ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>
        )}

        {/* Filter Pills */}
        <div style={styles.filterRow}>
          {["", "reunion", "seminar", "workshop", "networking", "other"].map(type => (
            <button key={type} onClick={() => setFilterType(type)}
              style={{
                ...styles.pill,
                background: filterType === type ? '#1d4ed8' : 'white',
                color: filterType === type ? 'white' : '#64748b',
                border: filterType === type ? '1.5px solid #1d4ed8' : '1.5px solid #e2e8f0',
              }}
            >
              {type === "" ? "All Events" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
          <span style={styles.eventCount}>{filtered.length} {filtered.length === 1 ? 'event' : 'events'}</span>
        </div>

        {/* Events Grid */}
        {loading ? (
          <p style={styles.emptyText}>Loading events...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🗓</div>
            <p style={styles.emptyTitle}>No events yet</p>
            <p style={styles.emptyDesc}>Create the first alumni event!</p>
          </div>
        ) : (
          <div style={styles.eventsGrid}>
            {filtered.map(event => {
              const ts = typeStyles[event.type] || typeStyles.other
              const upcoming = isUpcoming(event.event_date)
              const eventDate = new Date(event.event_date)
              return (
                <div key={event.id} style={{
                  ...styles.eventCard,
                  opacity: upcoming ? 1 : 0.7,
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                >
                  {/* Date Badge */}
                  <div style={styles.dateBadge}>
                    <div style={styles.dateMonth}>
                      {eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                    </div>
                    <div style={styles.dateDay}>{eventDate.getDate()}</div>
                    <div style={styles.dateYear}>{eventDate.getFullYear()}</div>
                  </div>

                  {/* Event Info */}
                  <div style={styles.eventInfo}>
                    <div style={styles.eventTopRow}>
                      <h3 style={styles.eventTitle}>{event.title}</h3>
                      <div style={styles.eventBadges}>
                        <span style={{ ...styles.typeBadge, background: ts.bg, color: ts.color }}>
                          {event.type}
                        </span>
                        {upcoming ? (
                          <span style={styles.upcomingBadge}>Upcoming</span>
                        ) : (
                          <span style={styles.pastBadge}>Past</span>
                        )}
                      </div>
                    </div>

                    <div style={styles.eventMeta}>
                      <span style={styles.metaItem}>📍 {event.location}</span>
                      <span style={styles.metaItem}>
                        🕐 {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {event.max_attendees && (
                        <span style={styles.metaItem}>👥 Max {event.max_attendees} attendees</span>
                      )}
                    </div>

                    <p style={styles.eventDesc}>{event.description}</p>

                    <div style={styles.eventFooter}>
                      <div style={styles.organizerInfo}>
                        <div style={styles.organizerAvatar}>
                          {event.created_by?.name?.charAt(0)}
                        </div>
                        <span style={styles.organizerName}>
                          Organized by {event.created_by?.name}
                        </span>
                      </div>
                      <div style={styles.eventActions}>
                        {event.contact_email && (
                          <a href={"mailto:" + event.contact_email} style={styles.registerBtn}>
                            Register
                          </a>
                        )}
                        {(user?.role === "admin" || user?.id === event.created_by?.id) && (
                          <button onClick={() => handleDelete(event.id)} style={styles.deleteBtn}>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  pageSubtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  postBtn: {
    color: 'white', border: 'none', padding: '11px 20px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },
  successBox: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d',
    padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px',
  },
  formCard: {
    background: 'white', borderRadius: '16px', padding: '28px',
    marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
  },
  formTitle: { fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGroup: { marginBottom: '4px' },
  formLabel: {
    display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  formInput: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    background: '#f8fafc', transition: 'border-color 0.2s', fontFamily: 'sans-serif',
  },
  submitBtn: {
    marginTop: '16px', padding: '12px 24px', background: '#1d4ed8', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', transition: 'background 0.2s',
  },
  filterRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  pill: {
    padding: '7px 16px', borderRadius: '20px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600', transition: 'all 0.15s',
  },
  eventCount: { marginLeft: 'auto', fontSize: '13px', color: '#94a3b8', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#94a3b8', padding: '48px' },
  emptyState: { background: 'white', borderRadius: '16px', padding: '64px', textAlign: 'center' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { fontSize: '16px', fontWeight: '600', color: '#334155', margin: '0 0 8px' },
  emptyDesc: { fontSize: '14px', color: '#94a3b8', margin: 0 },
  eventsGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  eventCard: {
    background: 'white', borderRadius: '16px', padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s',
    border: '1px solid #f1f5f9', display: 'flex', gap: '20px',
  },
  dateBadge: {
    background: '#1e3a8a', borderRadius: '12px', padding: '12px 16px',
    textAlign: 'center', flexShrink: 0, minWidth: '64px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  },
  dateMonth: { color: '#93c5fd', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },
  dateDay: { color: 'white', fontSize: '28px', fontWeight: '700', lineHeight: '1' },
  dateYear: { color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '2px' },
  eventInfo: { flex: 1 },
  eventTopRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  eventTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 },
  eventBadges: { display: 'flex', gap: '8px', flexShrink: 0 },
  typeBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  upcomingBadge: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
    background: '#dcfce7', color: '#15803d',
  },
  pastBadge: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
    background: '#f1f5f9', color: '#94a3b8',
  },
  eventMeta: { display: 'flex', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' },
  metaItem: { fontSize: '13px', color: '#64748b' },
  eventDesc: {
    fontSize: '14px', color: '#475569', lineHeight: '1.6',
    margin: '0 0 14px', display: '-webkit-box',
    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  eventFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '12px', borderTop: '1px solid #f1f5f9',
  },
  organizerInfo: { display: 'flex', alignItems: 'center', gap: '8px' },
  organizerAvatar: {
    width: '28px', height: '28px', borderRadius: '50%', background: '#dbeafe',
    color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '12px',
  },
  organizerName: { fontSize: '13px', color: '#94a3b8' },
  eventActions: { display: 'flex', gap: '8px' },
  registerBtn: {
    padding: '7px 16px', background: '#1d4ed8', color: 'white',
    borderRadius: '8px', fontSize: '13px', fontWeight: '600',
    textDecoration: 'none', transition: 'background 0.2s',
  },
  deleteBtn: {
    padding: '7px 12px', background: 'transparent', color: '#dc2626',
    border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer',
  },
}

export default Events