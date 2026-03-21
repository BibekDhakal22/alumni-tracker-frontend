function Spinner({ fullScreen = false, message = "Loading..." }) {
  if (fullScreen) {
    return (
      <div style={styles.fullScreen}>
        <div style={styles.container}>
          <div style={styles.logoMark}>AT</div>
          <div style={styles.spinnerRing}>
            <div style={styles.ring} />
          </div>
          <p style={styles.message}>{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.inline}>
      <div style={styles.smallRing} />
    </div>
  )
}

const styles = {
  fullScreen: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: '#f8fafc', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 9999, fontFamily: 'sans-serif',
  },
  container: { textAlign: 'center' },
  logoMark: {
    width: '56px', height: '56px', background: '#1d4ed8', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700', fontSize: '20px',
    margin: '0 auto 24px',
  },
  spinnerRing: { display: 'flex', justifyContent: 'center', marginBottom: '16px' },
  ring: {
    width: '40px', height: '40px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#1d4ed8',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  message: { fontSize: '14px', color: '#64748b', margin: 0 },
  inline: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' },
  smallRing: {
    width: '24px', height: '24px',
    border: '2px solid #e2e8f0',
    borderTopColor: '#1d4ed8',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
}

export default Spinner