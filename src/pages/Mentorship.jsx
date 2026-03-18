import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function Mentorship() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mentors, setMentors] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("find")
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ topic: "", message: "" })
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [mentorsRes, myReqRes, receivedRes] = await Promise.all([
        api.get("/mentors"),
        api.get("/mentorship/my-requests"),
        api.get("/mentorship/received"),
      ])
      setMentors(mentorsRes.data)
      setMyRequests(myReqRes.data)
      setReceivedRequests(receivedRes.data)
    } catch (err) {
      console.error("Failed to fetch mentorship data", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      await api.post("/mentorship", {
        mentor_id: selectedMentor.id,
        topic: formData.topic,
        message: formData.message,
      })
      setSuccess("Mentorship request sent successfully!")
      setShowRequestForm(false)
      setSelectedMentor(null)
      setFormData({ topic: "", message: "" })
      const myReqRes = await api.get("/mentorship/my-requests")
      setMyRequests(myReqRes.data)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request")
    } finally {
      setSubmitting(false)
    }
  }

  const handleRespond = async (id, status, response = "") => {
    try {
      await api.put(`/mentorship/${id}/respond`, { status, response })
      const receivedRes = await api.get("/mentorship/received")
      setReceivedRequests(receivedRes.data)
      setSuccess(`Request ${status} successfully!`)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      alert("Failed to respond to request")
    }
  }

  const handleLogout = async () => { await logout(); navigate("/") }

  const filteredMentors = mentors.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.alumni_profile?.company?.toLowerCase().includes(search.toLowerCase()) ||
    m.alumni_profile?.industry?.toLowerCase().includes(search.toLowerCase())
  )

  const statusStyles = {
    pending:  { bg: '#fef3c7', color: '#d97706' },
    accepted: { bg: '#dcfce7', color: '#15803d' },
    rejected: { bg: '#fee2e2', color: '#dc2626' },
  }

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
            { icon: "🗓", label: "Events", path: "/events" },
            { icon: "🤝", label: "Mentorship", path: "/mentorship", active: true },
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
            <h1 style={styles.pageTitle}>Mentorship</h1>
            <p style={styles.pageSubtitle}>Connect with experienced alumni for guidance and career advice</p>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.headerStat}>
              <span style={styles.headerStatNum}>{mentors.length}</span>
              <span style={styles.headerStatLabel}>Mentors</span>
            </div>
            <div style={styles.headerStat}>
              <span style={styles.headerStatNum}>{myRequests.filter(r => r.status === 'accepted').length}</span>
              <span style={styles.headerStatLabel}>Active</span>
            </div>
          </div>
        </header>

        {/* Messages */}
        {success && <div style={styles.successBox}>✓ {success}</div>}
        {error && <div style={styles.errorBox}>⚠ {error}</div>}

        {/* Request Form Modal */}
        {showRequestForm && selectedMentor && (
          <div style={styles.modalOverlay} onClick={() => setShowRequestForm(false)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Request Mentorship</h3>
                <button onClick={() => setShowRequestForm(false)} style={styles.closeBtn}>✕</button>
              </div>
              <div style={styles.mentorMini}>
                <div style={styles.mentorMiniAvatar}>{selectedMentor.name.charAt(0)}</div>
                <div>
                  <div style={styles.mentorMiniName}>{selectedMentor.name}</div>
                  <div style={styles.mentorMiniJob}>
                    {selectedMentor.alumni_profile?.current_job} at {selectedMentor.alumni_profile?.company}
                  </div>
                </div>
              </div>
              <form onSubmit={handleRequest}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Topic *</label>
                  <input type="text" required style={styles.formInput}
                    placeholder="e.g. Career guidance, Interview preparation, React development"
                    value={formData.topic}
                    onChange={e => setFormData({...formData, topic: e.target.value})}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Message *</label>
                  <textarea required rows={4} style={{...styles.formInput, resize: 'vertical'}}
                    placeholder="Introduce yourself and explain what you'd like to learn..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <div style={styles.modalBtns}>
                  <button type="submit" disabled={submitting} style={styles.sendBtn}>
                    {submitting ? "Sending..." : "Send Request"}
                  </button>
                  <button type="button" onClick={() => setShowRequestForm(false)} style={styles.cancelBtn}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabRow}>
          {[
            { key: "find", label: "Find a Mentor" },
            { key: "sent", label: `My Requests (${myRequests.length})` },
            { key: "received", label: `Received (${receivedRequests.length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ ...styles.tab, ...(activeTab === tab.key ? styles.tabActive : {}) }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Find Mentor Tab */}
        {activeTab === "find" && (
          <div>
            <div style={styles.searchRow}>
              <div style={styles.searchWrapper}>
                <span style={styles.searchIcon}>🔍</span>
                <input type="text" placeholder="Search by name, company or industry..."
                  style={styles.searchInput} value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            {loading ? (
              <p style={styles.emptyText}>Loading mentors...</p>
            ) : filteredMentors.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🤝</div>
                <p style={styles.emptyTitle}>No mentors available yet</p>
                <p style={styles.emptyDesc}>Employed alumni will appear here as mentors</p>
              </div>
            ) : (
              <div style={styles.mentorsGrid}>
                {filteredMentors.map(mentor => (
                  <div key={mentor.id} style={styles.mentorCard}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                  >
                    <div style={styles.mentorTop}>
                      <div style={styles.mentorAvatar}>{mentor.name.charAt(0)}</div>
                      <div style={styles.mentorInfo}>
                        <h3 style={styles.mentorName}>{mentor.name}</h3>
                        <p style={styles.mentorJob}>
                          {mentor.alumni_profile?.current_job || "Professional"}
                        </p>
                        <p style={styles.mentorCompany}>
                          {mentor.alumni_profile?.company || "—"}
                        </p>
                      </div>
                    </div>
                    <div style={styles.mentorTags}>
                      {mentor.alumni_profile?.industry && (
                        <span style={styles.tag}>{mentor.alumni_profile.industry}</span>
                      )}
                      <span style={styles.tag}>Batch {mentor.alumni_profile?.batch_year}</span>
                    </div>
                    <button
                      style={styles.requestBtn}
                      onClick={() => { setSelectedMentor(mentor); setShowRequestForm(true) }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
                      onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
                    >
                      Request Mentorship
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Requests Tab */}
        {activeTab === "sent" && (
          <div>
            {myRequests.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📨</div>
                <p style={styles.emptyTitle}>No requests sent yet</p>
                <p style={styles.emptyDesc}>Find a mentor and send your first request!</p>
              </div>
            ) : (
              <div style={styles.requestsList}>
                {myRequests.map(req => {
                  const ss = statusStyles[req.status]
                  return (
                    <div key={req.id} style={styles.requestCard}>
                      <div style={styles.requestTop}>
                        <div style={styles.requestMentor}>
                          <div style={styles.smallAvatar}>{req.mentor?.name?.charAt(0)}</div>
                          <div>
                            <div style={styles.requestMentorName}>{req.mentor?.name}</div>
                            <div style={styles.requestMentorJob}>
                              {req.mentor?.alumni_profile?.current_job} at {req.mentor?.alumni_profile?.company}
                            </div>
                          </div>
                        </div>
                        <span style={{ ...styles.statusBadge, background: ss.bg, color: ss.color }}>
                          {req.status}
                        </span>
                      </div>
                      <div style={styles.requestTopic}>
                        <span style={styles.topicLabel}>Topic:</span> {req.topic}
                      </div>
                      <p style={styles.requestMessage}>{req.message}</p>
                      {req.response && (
                        <div style={styles.responseBox}>
                          <span style={styles.responseLabel}>Mentor's response:</span>
                          <p style={styles.responseText}>{req.response}</p>
                        </div>
                      )}
                      <div style={styles.requestDate}>
                        Sent on {new Date(req.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Received Requests Tab */}
        {activeTab === "received" && (
          <div>
            {receivedRequests.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📬</div>
                <p style={styles.emptyTitle}>No requests received yet</p>
                <p style={styles.emptyDesc}>When alumni request your mentorship they'll appear here</p>
              </div>
            ) : (
              <div style={styles.requestsList}>
                {receivedRequests.map(req => {
                  const ss = statusStyles[req.status]
                  return (
                    <div key={req.id} style={styles.requestCard}>
                      <div style={styles.requestTop}>
                        <div style={styles.requestMentor}>
                          <div style={styles.smallAvatar}>{req.student?.name?.charAt(0)}</div>
                          <div>
                            <div style={styles.requestMentorName}>{req.student?.name}</div>
                            <div style={styles.requestMentorJob}>{req.student?.email}</div>
                          </div>
                        </div>
                        <span style={{ ...styles.statusBadge, background: ss.bg, color: ss.color }}>
                          {req.status}
                        </span>
                      </div>
                      <div style={styles.requestTopic}>
                        <span style={styles.topicLabel}>Topic:</span> {req.topic}
                      </div>
                      <p style={styles.requestMessage}>{req.message}</p>
                      {req.status === 'pending' && (
                        <div style={styles.respondBtns}>
                          <button
                            style={styles.acceptBtn}
                            onClick={() => handleRespond(req.id, 'accepted', 'Happy to mentor you!')}
                          >
                            ✓ Accept
                          </button>
                          <button
                            style={styles.rejectBtn}
                            onClick={() => handleRespond(req.id, 'rejected', 'Sorry, I am not available at this time.')}
                          >
                            ✕ Decline
                          </button>
                        </div>
                      )}
                      <div style={styles.requestDate}>
                        Received on {new Date(req.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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
  headerStats: { display: 'flex', gap: '24px' },
  headerStat: { textAlign: 'center' },
  headerStatNum: { display: 'block', fontSize: '24px', fontWeight: '700', color: '#1d4ed8' },
  headerStatLabel: { fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  successBox: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d',
    padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px',
  },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px',
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: 'white', borderRadius: '16px', padding: '32px',
    width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer',
    color: '#94a3b8', padding: '4px',
  },
  mentorMini: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
    background: '#f8fafc', borderRadius: '10px', marginBottom: '20px',
  },
  mentorMiniAvatar: {
    width: '40px', height: '40px', borderRadius: '50%', background: '#1d4ed8',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '16px',
  },
  mentorMiniName: { fontSize: '15px', fontWeight: '700', color: '#0f172a' },
  mentorMiniJob: { fontSize: '13px', color: '#64748b' },
  formGroup: { marginBottom: '16px' },
  formLabel: {
    display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  formInput: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    background: '#f8fafc', transition: 'border-color 0.2s', fontFamily: 'sans-serif',
  },
  modalBtns: { display: 'flex', gap: '12px', marginTop: '8px' },
  sendBtn: {
    flex: 1, padding: '12px', background: '#1d4ed8', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1, padding: '12px', background: 'white', color: '#374151',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer',
  },
  tabRow: { display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' },
  tab: {
    padding: '12px 20px', border: 'none', background: 'transparent',
    fontSize: '14px', fontWeight: '600', color: '#94a3b8', cursor: 'pointer',
    borderBottom: '2px solid transparent', transition: 'all 0.15s',
  },
  tabActive: { color: '#1d4ed8', borderBottom: '2px solid #1d4ed8' },
  searchRow: { marginBottom: '20px' },
  searchWrapper: { position: 'relative', maxWidth: '400px' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' },
  searchInput: {
    width: '100%', padding: '10px 12px 10px 38px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    background: 'white',
  },
  emptyText: { textAlign: 'center', color: '#94a3b8', padding: '48px' },
  emptyState: { background: 'white', borderRadius: '16px', padding: '64px', textAlign: 'center' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { fontSize: '16px', fontWeight: '600', color: '#334155', margin: '0 0 8px' },
  emptyDesc: { fontSize: '14px', color: '#94a3b8', margin: 0 },
  mentorsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  mentorCard: {
    background: 'white', borderRadius: '16px', padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s',
  },
  mentorTop: { display: 'flex', gap: '14px', marginBottom: '14px' },
  mentorAvatar: {
    width: '56px', height: '56px', borderRadius: '50%', background: '#1d4ed8',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '22px', flexShrink: 0,
  },
  mentorInfo: { flex: 1 },
  mentorName: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  mentorJob: { fontSize: '13px', color: '#64748b', margin: '0 0 2px' },
  mentorCompany: { fontSize: '13px', color: '#1d4ed8', fontWeight: '600', margin: 0 },
  mentorTags: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' },
  tag: {
    background: '#f1f5f9', color: '#64748b', padding: '3px 10px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '500',
  },
  requestBtn: {
    width: '100%', padding: '10px', background: '#1d4ed8', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', transition: 'background 0.2s',
  },
  requestsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  requestCard: {
    background: 'white', borderRadius: '16px', padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  requestTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  requestMentor: { display: 'flex', alignItems: 'center', gap: '12px' },
  smallAvatar: {
    width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe',
    color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px',
  },
  requestMentorName: { fontSize: '15px', fontWeight: '700', color: '#0f172a' },
  requestMentorJob: { fontSize: '13px', color: '#64748b' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  requestTopic: { fontSize: '14px', color: '#334155', marginBottom: '8px', fontWeight: '500' },
  topicLabel: { color: '#94a3b8', fontWeight: '400' },
  requestMessage: { fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 12px' },
  responseBox: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px',
    padding: '12px 16px', marginBottom: '12px',
  },
  responseLabel: { fontSize: '12px', fontWeight: '700', color: '#15803d', textTransform: 'uppercase' },
  responseText: { fontSize: '14px', color: '#334155', margin: '6px 0 0' },
  respondBtns: { display: 'flex', gap: '10px', marginBottom: '12px' },
  acceptBtn: {
    padding: '8px 20px', background: '#dcfce7', color: '#15803d',
    border: '1px solid #bbf7d0', borderRadius: '8px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600',
  },
  rejectBtn: {
    padding: '8px 20px', background: '#fee2e2', color: '#dc2626',
    border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600',
  },
  requestDate: { fontSize: '12px', color: '#94a3b8' },
}

export default Mentorship