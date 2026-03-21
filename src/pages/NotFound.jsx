import { useNavigate } from "react-router-dom"

function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.code}>404</div>
        <h1 style={styles.title}>Page Not Found</h1>
        <p style={styles.desc}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div style={styles.btns}>
          <button style={styles.homeBtn} onClick={() => navigate('/')}>
            ← Go Home
          </button>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh', background: '#f1f5f9', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif',
  },
  card: {
    background: 'white', borderRadius: '24px', padding: '64px 48px',
    textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0', maxWidth: '440px', width: '100%',
  },
  code: {
    fontSize: '96px', fontWeight: '800', color: '#dbeafe',
    lineHeight: '1', marginBottom: '16px', letterSpacing: '-4px',
  },
  title: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px' },
  desc: { fontSize: '15px', color: '#64748b', margin: '0 0 32px', lineHeight: '1.6' },
  btns: { display: 'flex', gap: '12px', justifyContent: 'center' },
  homeBtn: {
    padding: '12px 24px', background: '#1d4ed8', color: 'white',
    border: 'none', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer',
  },
  backBtn: {
    padding: '12px 24px', background: 'white', color: '#374151',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer',
  },
}

export default NotFound
