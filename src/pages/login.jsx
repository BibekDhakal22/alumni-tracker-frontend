import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    setLoading(true)
    setError("")
    try {
      const user = await login(email, password)
      if (user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      setError("Invalid email or password")
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
            Connecting graduates, building futures
          </p>
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>500+</span>
              <span style={styles.statLabel}>Alumni</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>50+</span>
              <span style={styles.statLabel}>Companies</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <span style={styles.statNumber}>10+</span>
              <span style={styles.statLabel}>Batches</span>
            </div>
          </div>
          <div style={styles.decorCircle1} />
          <div style={styles.decorCircle2} />
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSubtitle}>Sign in to your alumni account</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                style={styles.input}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#1d4ed8'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
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
              {loading ? (
                <span style={styles.loadingText}>
                  <span style={styles.spinner} /> Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>New to Alumni Tracker?</span>
            <span style={styles.dividerLine} />
          </div>

          <button
            style={styles.registerBtn}
            onClick={() => navigate("/register")}
            onMouseEnter={e => e.target.style.background = '#eff6ff'}
            onMouseLeave={e => e.target.style.background = 'white'}
          >
            Create an Account
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
    width: '45%',
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
    width: '64px',
    height: '64px',
    background: 'rgba(255,255,255,0.15)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '24px',
    backdropFilter: 'blur(10px)',
  },
  brandName: {
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
    color: 'white',
  },
  brandTagline: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.75)',
    margin: '0 0 48px 0',
    lineHeight: '1.6',
    fontFamily: '"Georgia", serif',
    fontStyle: 'italic',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '20px 24px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: 'sans-serif',
  },
  statDivider: {
    width: '1px',
    height: '36px',
    background: 'rgba(255,255,255,0.2)',
  },
  decorCircle1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.08)',
    top: '-100px',
    right: '-150px',
    zIndex: 1,
  },
  decorCircle2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.06)',
    bottom: '-80px',
    left: '-80px',
    zIndex: 1,
  },
  rightPanel: {
    flex: 1,
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
  },
  formCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '48px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    border: '1px solid #e2e8f0',
  },
  formHeader: {
    marginBottom: '32px',
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  formSubtitle: {
    fontSize: '15px',
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
  errorIcon: {
    fontSize: '16px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    fontFamily: 'sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: '#1d4ed8',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginTop: '8px',
    fontFamily: 'sans-serif',
    letterSpacing: '0.3px',
  },
  loadingText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#e2e8f0',
  },
  dividerText: {
    fontSize: '13px',
    color: '#94a3b8',
    whiteSpace: 'nowrap',
    fontFamily: 'sans-serif',
  },
  registerBtn: {
    width: '100%',
    padding: '13px',
    background: 'white',
    color: '#1d4ed8',
    border: '1.5px solid #1d4ed8',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontFamily: 'sans-serif',
  },
  footer: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '24px',
    marginBottom: 0,
    fontFamily: 'sans-serif',
  },
}

export default Login