import '../../styles/SeccionEnConstruccion.css'

export default function SeccionEnConstruccion({ titulo, descripcion }) {
  return (
    <div className="placeholder">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3 className="titulo">{titulo}</h3>
      <p className="descripcion">{descripcion}</p>
    </div>
  )
}
