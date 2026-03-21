import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import api from "../services/api"
import Sidebar from "../components/Sidebar"

function Mentorship() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDark } = useTheme()
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

  useEffect(() => { fetchData() }, [])

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
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: text, margin: '0 0 4px' }}>Mentorship</h1>
            <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Connect with experienced alumni for guidance and career advice</p>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { num: mentors.length, label: 'Mentors' },
              { num: myRequests.filter(r => r.status === 'accepted').length, label: 'Active' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: '700', color: '#1d4ed8' }}>{s.num}</span>
                <span style={{ fontSize: '12px', color: subtext, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Messages */}
        {success && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>✓ {success}</div>}
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>⚠ {error}</div>}

        {/* Request Form Modal */}
        {showRequestForm && selectedMentor && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setShowRequestForm(false)}
          >
            <div style={{ background: card, borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: text, margin: 0 }}>Request Mentorship</h3>
                <button onClick={() => setShowRequestForm(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: subtext }}>✕</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: isDark ? '#0f172a' : '#f8fafc', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1d4ed8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>
                  {selectedMentor.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: text }}>{selectedMentor.name}</div>
                  <div style={{ fontSize: '13px', color: subtext }}>{selectedMentor.alumni_profile?.current_job} at {selectedMentor.alumni_profile?.company}</div>
                </div>
              </div>
              <form onSubmit={handleRequest}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: subtext, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Topic *</label>
                  <input type="text" required
                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: inputBg, color: text, fontFamily: 'sans-serif' }}
                    placeholder="e.g. Career guidance, Interview preparation"
                    value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: subtext, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message *</label>
                  <textarea required rows={4}
                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: inputBg, color: text, resize: 'vertical', fontFamily: 'sans-serif' }}
                    placeholder="Introduce yourself and explain what you'd like to learn..."
                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" disabled={submitting}
                    style={{ flex: 1, padding: '12px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                  >{submitting ? "Sending..." : "Send Request"}</button>
                  <button type="button" onClick={() => setShowRequestForm(false)}
                    style={{ flex: 1, padding: '12px', background: isDark ? '#334155' : 'white', color: text, border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                  >Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${border}`, marginBottom: '24px' }}>
          {[
            { key: "find", label: "Find a Mentor" },
            { key: "sent", label: `My Requests (${myRequests.length})` },
            { key: "received", label: `Received (${receivedRequests.length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: '12px 20px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: activeTab === tab.key ? '#1d4ed8' : subtext, borderBottom: activeTab === tab.key ? '2px solid #1d4ed8' : '2px solid transparent', transition: 'all 0.15s' }}
            >{tab.label}</button>
          ))}
        </div>

        {/* Find Mentor Tab */}
        {activeTab === "find" && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative', maxWidth: '400px' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔍</span>
                <input type="text" placeholder="Search by name, company or industry..."
                  style={{ width: '100%', padding: '10px 12px 10px 38px', border: `1.5px solid ${inputBorder}`, borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: card, color: text }}
                  value={search} onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            {loading ? (
              <p style={{ textAlign: 'center', color: subtext, padding: '48px' }}>Loading mentors...</p>
            ) : filteredMentors.length === 0 ? (
              <div style={{ background: card, borderRadius: '16px', padding: '64px', textAlign: 'center', border: `1px solid ${border}` }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: text, margin: '0 0 8px' }}>No mentors available yet</p>
                <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Employed alumni will appear here as mentors</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {filteredMentors.map(mentor => (
                  <div key={mentor.id} style={{ background: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}`, transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1d4ed8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '22px', flexShrink: 0 }}>
                        {mentor.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: text, margin: '0 0 4px' }}>{mentor.name}</h3>
                        <p style={{ fontSize: '13px', color: subtext, margin: '0 0 2px' }}>{mentor.alumni_profile?.current_job || "Professional"}</p>
                        <p style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: '600', margin: 0 }}>{mentor.alumni_profile?.company || "—"}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {mentor.alumni_profile?.industry && (
                        <span style={{ background: isDark ? '#1e3a8a' : '#f1f5f9', color: isDark ? '#93c5fd' : '#64748b', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{mentor.alumni_profile.industry}</span>
                      )}
                      <span style={{ background: isDark ? '#1e3a8a' : '#f1f5f9', color: isDark ? '#93c5fd' : '#64748b', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>Batch {mentor.alumni_profile?.batch_year}</span>
                    </div>
                    <button
                      style={{ width: '100%', padding: '10px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                      onClick={() => { setSelectedMentor(mentor); setShowRequestForm(true) }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1e40af'}
                      onMouseLeave={e => e.currentTarget.style.background = '#1d4ed8'}
                    >Request Mentorship</button>
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
              <div style={{ background: card, borderRadius: '16px', padding: '64px', textAlign: 'center', border: `1px solid ${border}` }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📨</div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: text, margin: '0 0 8px' }}>No requests sent yet</p>
                <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>Find a mentor and send your first request!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myRequests.map(req => {
                  const ss = statusStyles[req.status]
                  return (
                    <div key={req.id} style={{ background: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                            {req.mentor?.name?.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: text }}>{req.mentor?.name}</div>
                            <div style={{ fontSize: '13px', color: subtext }}>{req.mentor?.alumni_profile?.current_job} at {req.mentor?.alumni_profile?.company}</div>
                          </div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: ss.bg, color: ss.color }}>{req.status}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: text, marginBottom: '8px', fontWeight: '500' }}>
                        <span style={{ color: subtext, fontWeight: '400' }}>Topic: </span>{req.topic}
                      </div>
                      <p style={{ fontSize: '14px', color: subtext, lineHeight: '1.6', margin: '0 0 12px' }}>{req.message}</p>
                      {req.response && (
                        <div style={{ background: isDark ? '#14532d' : '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#15803d', textTransform: 'uppercase' }}>Mentor's Response:</span>
                          <p style={{ fontSize: '14px', color: isDark ? '#86efac' : '#334155', margin: '6px 0 0' }}>{req.response}</p>
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: subtext }}>Sent on {new Date(req.created_at).toLocaleDateString()}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Received Tab */}
        {activeTab === "received" && (
          <div>
            {receivedRequests.length === 0 ? (
              <div style={{ background: card, borderRadius: '16px', padding: '64px', textAlign: 'center', border: `1px solid ${border}` }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: text, margin: '0 0 8px' }}>No requests received yet</p>
                <p style={{ fontSize: '14px', color: subtext, margin: 0 }}>When alumni request your mentorship they'll appear here</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {receivedRequests.map(req => {
                  const ss = statusStyles[req.status]
                  return (
                    <div key={req.id} style={{ background: card, borderRadius: '16px', padding: '24px', border: `1px solid ${border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                            {req.student?.name?.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: text }}>{req.student?.name}</div>
                            <div style={{ fontSize: '13px', color: subtext }}>{req.student?.email}</div>
                          </div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: ss.bg, color: ss.color }}>{req.status}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: text, marginBottom: '8px', fontWeight: '500' }}>
                        <span style={{ color: subtext, fontWeight: '400' }}>Topic: </span>{req.topic}
                      </div>
                      <p style={{ fontSize: '14px', color: subtext, lineHeight: '1.6', margin: '0 0 12px' }}>{req.message}</p>
                      {req.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                          <button onClick={() => handleRespond(req.id, 'accepted', 'Happy to mentor you!')}
                            style={{ padding: '8px 20px', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                          >✓ Accept</button>
                          <button onClick={() => handleRespond(req.id, 'rejected', 'Sorry, I am not available at this time.')}
                            style={{ padding: '8px 20px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                          >✕ Decline</button>
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: subtext }}>Received on {new Date(req.created_at).toLocaleDateString()}</div>
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

export default Mentorship