import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"
import Sidebar from "../components/Sidebar"

function Events() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDark } = useTheme()
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

  const filtered = filterType ? events.filter(e => e.type === filterType) : events

  const typeStyles = {
    reunion:    { bg: '#dbeafe', color: '#1d4ed8' },
    seminar:    { bg: '#faf5ff', color: '#7c3aed' },
    workshop:   { bg: '#dcfce7', color: '#15803d' },
    networking: { bg: '#fef3c7', color: '#d97706' },
    other:      { bg: '#f1f5f9', color: '#64748b' },
  }

  const isUpcoming = (date) => new Date(date) >= new Date()

  const bg = isDark ? '#0f172a' : '#f1f5f9'
  const card = isDark ? '#1e293b' : 'white'
  const text = isDark ? '#f1f5f9' : '#0f172a'
  const subtext = isDark ? '#94a3b8' : '#64748b'
  const border = isDark ? '#334155' : '#f1f5f9'
  const inputBg = isDark ? '#0f172a' : '#f8fafc'
  const inputBorder = isDark ? '#334155' : '#e2e8f0'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: 'sans-serif' }}>
      <Sidebar />

      <main style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Alumni Events</h1>
            <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Reunions, seminars and networking events for alumni</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ background: showForm ? '#64748b' : '#1d4ed8', color: 'white', border: 'none', padding: '11px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
          >
            {showForm ? "✕ Cancel" : "+ Create Event"}
          </button>
        </header>

        {/* Success */}
        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>
            ✓ {success}
          </div>
        )}

        {/* Create Event Form */}
        {showForm && (
          <div style={{ background: card, borderRadius: '16px', padding: '28px', marginBottom: '24px', border: `1px solid ${border}` }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: text, margin: '0 0 20px' }}>Create New Event</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { name: 'title', label: 'Event Title *', placeholder: 'Annual Alumni Reunion 2026', type: 'text', required: true },
                  { name: 'location', label: 'Location *', placeholder: 'TU Campus, Kirtipur', type: 'text', required: true },
                  { name: 'event_date', label: 'Event Date & Time *', placeholder: '', type: 'datetime-local', required: true },
                  { name: 'max_attendees', label: 'Max Attendees', placeholder: '100', type: 'number' },
                  { name: 'contact_email', label: 'Contact Email', placeholder: 'events@alumni.com', type: 'email' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: subtext, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                    <input type={f.type} name={f.name} required={f.required}
                      style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: inputBg, color: text, fontFamily: 'sans-serif' }}
                      placeholder={f.placeholder} value={formData[f.name]} onChange={handleChange}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: subtext, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event Type *</label>
                  <select name="type" style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', background: inputBg, color: text }} value={formData.type} onChange={handleChange}>
                    <option value="reunion">Reunion</option>
                    <option value="seminar">Seminar</option>
                    <option value="workshop">Workshop</option>
                    <option value="networking">Networking</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: subtext, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description *</label>
                <textarea name="description" required rows={3}
                  style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: inputBg, color: text, resize: 'vertical', fontFamily: 'sans-serif' }}
                  placeholder="Describe the event..." value={formData.description} onChange={handleChange}
                />
              </div>
              <button type="submit" disabled={submitting}
                style={{ marginTop: '16px', padding: '12px 24px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                {submitting ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>
        )}

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {["", "reunion", "seminar", "workshop", "networking", "other"].map(type => (
            <button key={type} onClick={() => setFilterType(type)}
              style={{
                padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                background: filterType === type ? '#1d4ed8' : card,
                color: filterType === type ? 'white' : subtext,
                border: filterType === type ? '1.5px solid #1d4ed8' : `1.5px solid ${inputBorder}`,
              }}
            >
              {type === "" ? "All Events" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: subtext }}>{filtered.length} {filtered.length === 1 ? 'event' : 'events'}</span>
        </div>

        {/* Events */}
        {loading ? (
          <p style={{ textAlign: 'center', color: subtext, padding: '48px' }}>Loading events...</p>
        ) : filtered.length === 0 ? (
          <div style={{ background: card, borderRadius: '16px', padding: '64px', textAlign: 'center', border: `1px solid ${border}` }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗓</div>
            <p style={{ fontSize: '16px', fontWeight: '600', color: text, margin: '0 0 8px' }}>No events yet</p>
            <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Create the first alumni event!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(event => {
              const ts = typeStyles[event.type] || typeStyles.other
              const upcoming = isUpcoming(event.event_date)
              const eventDate = new Date(event.event_date)
              return (
                <div key={event.id} style={{ background: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}`, display: 'flex', gap: '20px', opacity: upcoming ? 1 : 0.7 }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* Date Badge */}
                  <div style={{ background: '#1e3a8a', borderRadius: '12px', padding: '12px 16px', textAlign: 'center', flexShrink: 0, minWidth: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color: '#93c5fd', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>
                      {eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                    </div>
                    <div style={{ color: 'white', fontSize: '28px', fontWeight: '700', lineHeight: '1' }}>{eventDate.getDate()}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '2px' }}>{eventDate.getFullYear()}</div>
                  </div>

                  {/* Event Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: text, margin: 0 }}>{event.title}</h3>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: ts.bg, color: ts.color }}>{event.type}</span>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: upcoming ? '#dcfce7' : '#f1f5f9', color: upcoming ? '#15803d' : '#94a3b8' }}>
                          {upcoming ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', color: subtext }}>📍 {event.location}</span>
                      <span style={{ fontSize: '13px', color: subtext }}>🕐 {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {event.max_attendees && <span style={{ fontSize: '13px', color: subtext }}>👥 Max {event.max_attendees}</span>}
                    </div>
                    <p style={{ fontSize: '14px', color: subtext, lineHeight: '1.6', margin: '0 0 14px' }}>{event.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>
                          {event.created_by?.name?.charAt(0)}
                        </div>
                        <span style={{ fontSize: '13px', color: subtext }}>Organized by {event.created_by?.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {event.contact_email && (
                          <a href={"mailto:" + event.contact_email}
                            style={{ padding: '7px 16px', background: '#1d4ed8', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}
                          >Register</a>
                        )}
                        {(user?.role === "admin" || user?.id === event.created_by?.id) && (
                          <button onClick={() => handleDelete(event.id)}
                            style={{ padding: '7px 12px', background: 'transparent', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                          >Delete</button>
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

export default Events