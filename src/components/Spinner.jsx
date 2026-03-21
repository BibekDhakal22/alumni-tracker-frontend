function Spinner({ text = "Loading..." }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner} />
      <p style={styles.text}>{text}</p>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '48px', gap: '16px',
  },
  spinner: {
    width: '40px', height: '40px', border: '3px solid #e2e8f0',
    borderTopColor: '#1d4ed8', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: { fontSize: '14px', color: '#94a3b8', margin: 0 },
}

export default Spinner