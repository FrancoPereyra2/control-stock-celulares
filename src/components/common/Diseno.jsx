import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import '../../styles/Diseno.css'

const ENLACES = [
  {
    ruta: '/panel',
    etiqueta: 'Panel Principal',
    etiquetaCorta: 'Panel',
    icono: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    ruta: '/productos',
    etiqueta: 'Productos',
    etiquetaCorta: 'Productos',
    icono: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    ruta: '/categorias',
    etiqueta: 'Categorías',
    etiquetaCorta: 'Categorías',
    icono: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    ruta: '/movimientos',
    etiqueta: 'Movimientos',
    etiquetaCorta: 'Movimientos',
    icono: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    ruta: '/alertas',
    etiqueta: 'Alertas',
    etiquetaCorta: 'Alertas',
    icono: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
]

const TITULOS = {
  '/panel':       'Panel Principal',
  '/productos':   'Gestión de Productos',
  '/categorias':  'Gestión de Categorías',
  '/movimientos': 'Movimientos de Stock',
  '/alertas':     'Alertas de Stock',
}

export default function Diseno() {
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const sesion = localStorage.getItem('sesion_admin')
  const [administrador] = useState(sesion ? JSON.parse(sesion) : null)

  function cerrarSesion() {
    localStorage.removeItem('sesion_admin')
    navegar('/login', { replace: true })
  }

  return (
    <div className="contenedor">
      {/* Sidebar — solo desktop */}
      <aside className="barra">
        <div className="encabezado">
          <div className="logoIcono">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <span className="logoTexto">Stock Celulares</span>
        </div>

        <nav className="navegacion">
          {ENLACES.map(({ ruta, etiqueta, icono }) => (
            <NavLink
              key={ruta}
              to={ruta}
              className={({ isActive }) => isActive ? 'enlace activo' : 'enlace'}
            >
              {icono}
              <span>{etiqueta}</span>
            </NavLink>
          ))}
        </nav>

        <div className="seccionAdmin">
          {administrador && (
            <div className="infoAdmin">
              <div className="avatar">
                {administrador.usuario.charAt(0).toUpperCase()}
              </div>
              <div className="datosAdmin">
                <p className="nombreAdmin">{administrador.usuario}</p>
                <p className="rolAdmin">Administrador</p>
              </div>
            </div>
          )}
          <button className="botonSalir" onClick={cerrarSesion}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div className="areaContenido">
        <header className="topbar">
          <div className="topbarIzquierda">
            <div className="topbarLogoMobile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <h2 className="topbarTitulo">{TITULOS[pathname] ?? 'Panel'}</h2>
          </div>
          <div className="topbarDerecha">
            <span className="topbarFecha">
              {new Date().toLocaleDateString('es-AR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
            <button className="botonSalirMobile" onClick={cerrarSesion} title="Cerrar sesión">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </header>

        <main className="principal">
          <Outlet />
        </main>
      </div>

      {/* Nav inferior — solo mobile */}
      <nav className="navInferior">
        {ENLACES.map(({ ruta, etiquetaCorta, icono }) => (
          <NavLink
            key={ruta}
            to={ruta}
            className={({ isActive }) => isActive ? 'navItem navItemActivo' : 'navItem'}
          >
            {icono}
            <span>{etiquetaCorta}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
