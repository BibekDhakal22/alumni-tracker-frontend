import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", batch_year: "", phone: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password || !formData.batch_year) {
      setError("Please fill in all required fields")
      return
    }
    setLoading(true)
    setError("")
    try {
      await register(formData)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.logoMark}>AT</div>
          <h1 style={styles.brandName}>Alumni Tracker</h1>
          <p style={styles.brandTagline}>
            Join thousands of graduates staying connected
          </p>
          <div style={styles.featureList}>
            {[
              { icon: "◆", text: "Update your career profile" },
              { icon: "◆", text: "Browse job opportunities" },
              { icon: "◆", text: "Connect with batchmates" },
              { icon: "◆", text: "Track alumni achievements" },
            ].map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
          <div style={styles.decorCircle1} />
          <div style={styles.decorCircle2} />
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create Account</h2>
            <p style={styles.formSubtitle}>Join the alumni network today</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div style={styles.row}>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  style={styles.input}
                  placeholder="Bibek Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>Batch Year *</label>
                <select
                  name="batch_year"
                  style={styles.input}
                  value={formData.batch_year}
                  onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 15 }, (_, i) => 2010 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                style={styles.input}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={styles.row}>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>Password *</label>
                <input
                  type="password"
                  name="password"
                  style={styles.input}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  style={styles.input}
                  placeholder="98XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={e => !loading && (e.target.style.background = '#1e40af')}
              onMouseLeave={e => !loading && (e.target.style.background = '#1d4ed8')}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>Already have an account?</span>
            <span style={styles.dividerLine} />
          </div>

          <button
            style={styles.loginBtn}
           onClick={() => navigate("/login")}
            onMouseEnter={e => e.target.style.background = '#eff6ff'}
            onMouseLeave={e => e.target.style.background = 'white'}
          >
            Sign In Instead
          </button>

          <p style={styles.footer}>
            Tribhuvan University — BCA Department
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '"Georgia", serif',
  },
  leftPanel: {
    width: '42%',
    background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContent: {
    position: 'relative',
    zIndex: 2,
    padding: '48px',
    color: 'white',
  },
  logoMark: {
    width: '56px',
    height: '56px',
    background: 'rgba(255,255,255,0.15)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '24px',
  },
  brandName: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 10px 0',
    color: 'white',
  },
  brandTagline: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.75)',
    margin: '0 0 40px 0',
    fontStyle: 'italic',
    lineHeight: '1.6',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  featureIcon: {
    fontSize: '8px',
    color: '#93c5fd',
  },
  featureText: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'sans-serif',
  },
  decorCircle1: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.08)',
    top: '-80px',
    right: '-120px',
    zIndex: 1,
  },
  decorCircle2: {
    position: 'absolute',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.06)',
    bottom: '-60px',
    left: '-60px',
    zIndex: 1,
  },
  rightPanel: {
    flex: 1,
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
  },
  formCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
  },
  formHeader: {
    marginBottom: '28px',
  },
  formTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px',
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    fontFamily: 'sans-serif',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'sans-serif',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
    fontFamily: 'sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    background: '#1d4ed8',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginTop: '4px',
    fontFamily: 'sans-serif',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#e2e8f0',
  },
  dividerText: {
    fontSize: '12px',
    color: '#94a3b8',
    whiteSpace: 'nowrap',
    fontFamily: 'sans-serif',
  },
  loginBtn: {
    width: '100%',
    padding: '12px',
    background: 'white',
    color: '#1d4ed8',
    border: '1.5px solid #1d4ed8',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontFamily: 'sans-serif',
  },
  footer: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '20px',
    marginBottom: 0,
    fontFamily: 'sans-serif',
  },
}

export default Register