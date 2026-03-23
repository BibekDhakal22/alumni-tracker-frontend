function Avatar({ name, photo, size = 40, fontSize = 16 }) {
  const colors = [
    '#1d4ed8', '#7c3aed', '#0891b2', '#15803d',
    '#d97706', '#dc2626', '#db2777', '#0d9488'
  ]
  const color = colors[name?.charCodeAt(0) % colors.length] || '#1d4ed8'
  const apiBase = "http://127.0.0.1:8000/storage/"

  if (photo) {
    return (
      <img
        src={apiBase + photo}
        alt={name}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', flexShrink: 0,
        }}
        onError={e => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />
    )
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: '700', fontSize: fontSize, flexShrink: 0,
    }}>
      {name?.charAt(0)?.toUpperCase()}
    </div>
  )
}

export default Avatar