import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'

const CREDENCIALES = { usuario: 'admin', contrasena: 'admin123' }

export default function Login() {
  const navegar = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')
    setCargando(true)

    setTimeout(() => {
      if (
        usuario === CREDENCIALES.usuario &&
        contrasena === CREDENCIALES.contrasena
      ) {
        localStorage.setItem(
          'sesion_admin',
          JSON.stringify({ usuario, rol: 'administrador' })
        )
        navegar('/panel', { replace: true })
      } else {
        setError('Usuario o contraseña incorrectos.')
        setCargando(false)
      }
    }, 400)
  }

  return (
    <div className="pagina">
      <aside className="panelIzquierdo">
        <div className="circuloGrande" />
        <div className="circuloChico" />
        <div className="contenidoMarca">
          <div className="logoContenedor">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <h1 className="marcaTitulo">Stock Celulares</h1>
          <p className="marcaSubtitulo">
            Gestión de inventario para<br />tu negocio de celulares
          </p>
          <ul className="listaCaracteristicas">
            <li className="caracteristica">
              <span className="punto" />
              Control de stock en tiempo real
            </li>
            <li className="caracteristica">
              <span className="punto" />
              Gestión de productos y categorías
            </li>
            <li className="caracteristica">
              <span className="punto" />
              Alertas automáticas de stock bajo
            </li>
          </ul>
        </div>
      </aside>

      <section className="panelDerecho">
        <div className="contenedorFormulario">
          <div className="encabezadoForm">
            <h2 className="tituloForm">Bienvenido</h2>
            <p className="subtituloForm">
              Ingresá tus datos para acceder
            </p>
          </div>

          <form className="formulario" onSubmit={manejarEnvio}>
            <div className="campo">
              <label className="etiqueta" htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                type="text"
                className="entrada"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresá tu usuario"
                required
                autoComplete="username"
              />
            </div>

            <div className="campo">
              <label className="etiqueta" htmlFor="contrasena">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                className="entrada"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Ingresá tu contraseña"
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="boton" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar al panel'}
            </button>
          </form>

          <div className="ayuda">
            Credenciales de prueba:&nbsp;
            <strong>admin</strong> / <strong>admin123</strong>
          </div>
        </div>
      </section>
    </div>
  )
}
