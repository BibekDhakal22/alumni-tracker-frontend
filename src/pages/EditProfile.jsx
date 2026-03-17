import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

function EditProfile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const profile = user?.alumni_profile

  const [formData, setFormData] = useState({
    batch_year: profile?.batch_year || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    current_job: profile?.current_job || "",
    company: profile?.company || "",
    industry: profile?.industry || "",
    linkedin: profile?.linkedin || "",
    status: profile?.status || "unemployed",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      await api.put("/profile/update", formData)
      setSuccess("Profile updated successfully!")
      const updatedUser = {
        ...user,
        alumni_profile: { ...profile, ...formData }
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setTimeout(() => navigate("/dashboard"), 1500)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => { await logout(); navigate("/") }

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
            { icon: "◎", label: "Edit Profile", path: "/profile/edit", active: true },
            { icon: "◈", label: "Job Board", path: "/jobs" },
            { icon: "◉", label: "Analytics", path: "/analytics" },
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
        <header style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Edit Profile</h1>
            <p style={styles.pageSubtitle}>Update your personal and employment information</p>
          </div>
          <button onClick={() => navigate("/dashboard")} style={styles.backBtn}
            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            ← Back to Dashboard
          </button>
        </header>

        <div style={styles.contentGrid}>
          {/* Profile Card */}
          <div style={styles.profileCard}>
            <div style={styles.avatarLarge}>{user?.name?.charAt(0)}</div>
            <h3 style={styles.profileName}>{user?.name}</h3>
            <p style={styles.profileEmail}>{user?.email}</p>
            <div style={styles.profileBatch}>
              Batch {profile?.batch_year || "Not set"}
            </div>
            <div style={styles.profileDivider} />
            <div style={styles.profileStats}>
              <div style={styles.profileStat}>
                <span style={styles.profileStatValue}>{profile?.status || "—"}</span>
                <span style={styles.profileStatLabel}>Status</span>
              </div>
              <div style={styles.profileStatDivider} />
              <div style={styles.profileStat}>
                <span style={styles.profileStatValue}>{profile?.industry || "—"}</span>
                <span style={styles.profileStatLabel}>Industry</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={styles.formCard}>
            {success && (
              <div style={styles.successBox}>✓ {success}</div>
            )}
            {error && (
              <div style={styles.errorBox}>⚠ {error}</div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Personal Info */}
              <div style={styles.sectionHeader}>
                <div style={styles.sectionDot} />
                <h3 style={styles.sectionTitle}>Personal Information</h3>
              </div>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Batch Year</label>
                  <select name="batch_year" style={styles.input}
                    value={formData.batch_year} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select batch year</option>
                    {Array.from({ length: 15 }, (_, i) => 2010 + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input type="text" name="phone" style={styles.input}
                    placeholder="98XXXXXXXX" value={formData.phone} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>Address</label>
                  <input type="text" name="address" style={styles.input}
                    placeholder="Kathmandu, Nepal" value={formData.address} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                  <label style={styles.label}>LinkedIn Profile URL</label>
                  <input type="text" name="linkedin" style={styles.input}
                    placeholder="linkedin.com/in/yourname" value={formData.linkedin} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* Employment Info */}
              <div style={{ ...styles.sectionHeader, marginTop: '24px' }}>
                <div style={{ ...styles.sectionDot, background: '#16a34a' }} />
                <h3 style={styles.sectionTitle}>Employment Details</h3>
              </div>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Current Job Title</label>
                  <input type="text" name="current_job" style={styles.input}
                    placeholder="Software Developer" value={formData.current_job} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Company Name</label>
                  <input type="text" name="company" style={styles.input}
                    placeholder="Tech Nepal Pvt. Ltd." value={formData.company} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Industry</label>
                  <select name="industry" style={styles.input}
                    value={formData.industry} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select industry</option>
                    <option value="IT/Software">IT / Software</option>
                    <option value="Banking/Finance">Banking / Finance</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Government">Government</option>
                    <option value="NGO/INGO">NGO / INGO</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Employment Status</label>
                  <select name="status" style={styles.input}
                    value={formData.status} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="employed">Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="studying">Studying</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div style={styles.btnRow}>
                <button type="submit" disabled={loading} style={{
                  ...styles.saveBtn,
                  opacity: loading ? 0.8 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.background = '#1e40af')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.background = '#1d4ed8')}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => navigate("/dashboard")} style={styles.cancelBtn}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
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
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  pageSubtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  backBtn: {
    padding: '9px 16px', background: 'white', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151',
    fontWeight: '500', transition: 'background 0.15s',
  },
  contentGrid: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' },
  profileCard: {
    background: 'white', borderRadius: '16px', padding: '28px', textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
  },
  avatarLarge: {
    width: '80px', height: '80px', borderRadius: '50%', background: '#1d4ed8',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '32px', margin: '0 auto 16px',
  },
  profileName: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' },
  profileEmail: { fontSize: '13px', color: '#64748b', margin: '0 0 12px' },
  profileBatch: {
    display: 'inline-block', background: '#dbeafe', color: '#1d4ed8',
    padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
  },
  profileDivider: { height: '1px', background: '#f1f5f9', margin: '20px 0' },
  profileStats: { display: 'flex', justifyContent: 'center', gap: '16px' },
  profileStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  profileStatValue: { fontSize: '13px', fontWeight: '600', color: '#334155', textTransform: 'capitalize' },
  profileStatLabel: { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  profileStatDivider: { width: '1px', background: '#e2e8f0' },
  formCard: {
    background: 'white', borderRadius: '16px', padding: '28px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
  },
  successBox: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d',
    padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px',
  },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px',
  },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
  sectionDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#1d4ed8', flexShrink: 0 },
  sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGroup: {},
  label: {
    display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  input: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', color: '#0f172a', background: '#f8fafc',
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
    fontFamily: 'sans-serif',
  },
  btnRow: { display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
  saveBtn: {
    flex: 1, padding: '12px', background: '#1d4ed8', color: 'white', border: 'none',
    borderRadius: '10px', fontSize: '15px', fontWeight: '600', transition: 'background 0.2s',
  },
  cancelBtn: {
    flex: 1, padding: '12px', background: 'white', color: '#374151',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s',
  },
}

export default EditProfile