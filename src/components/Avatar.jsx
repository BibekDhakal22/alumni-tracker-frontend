import { useState } from "react"

function Avatar({ name, photo, size = 40, fontSize = 16 }) {
  const colors = [
    '#1d4ed8', '#7c3aed', '#0891b2', '#15803d',
    '#d97706', '#dc2626', '#db2777', '#0d9488'
  ]
  const color = colors[name?.charCodeAt(0) % colors.length] || '#1d4ed8'
  const [imgError, setImgError] = useState(false)

  if (photo && !imgError) {
    return (
      <img
        src={"http://127.0.0.1:8000/storage/" + photo}
        alt={name}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', flexShrink: 0,
        }}
        onError={() => setImgError(true)}
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