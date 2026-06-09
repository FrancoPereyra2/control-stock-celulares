import { useState, useEffect } from 'react'
import '../styles/Movimientos.css'

const MOVIMIENTOS_INICIALES = [
  { id: 1,  producto: 'Funda silicona iPhone 12',      categoria: 'Fundas y estuches',         tipo: 'entrada', cantidad: 20, fecha: '2026-06-01', nota: 'Carga inicial' },
  { id: 2,  producto: 'Cargador USB-C 20W',            categoria: 'Cargadores',                tipo: 'entrada', cantidad: 15, fecha: '2026-06-01', nota: 'Carga inicial' },
  { id: 3,  producto: 'Vidrio templado Samsung A32',   categoria: 'Protectores de pantalla',   tipo: 'salida',  cantidad: 3,  fecha: '2026-06-02', nota: 'Venta mostrador' },
  { id: 4,  producto: 'Cable USB-C 1m',                categoria: 'Cables',                    tipo: 'entrada', cantidad: 30, fecha: '2026-06-02', nota: 'Carga inicial' },
  { id: 5,  producto: 'Auriculares in-ear genéricos',  categoria: 'Auriculares',               tipo: 'salida',  cantidad: 2,  fecha: '2026-06-03', nota: '' },
  { id: 6,  producto: 'Batería iPhone 11',             categoria: 'Baterías',                  tipo: 'entrada', cantidad: 8,  fecha: '2026-06-03', nota: 'Carga inicial' },
  { id: 7,  producto: 'Funda silicona Samsung A54',    categoria: 'Fundas y estuches',         tipo: 'salida',  cantidad: 5,  fecha: '2026-06-04', nota: 'Venta mostrador' },
  { id: 8,  producto: 'MicroSD 64GB',                  categoria: 'Memorias y almacenamiento', tipo: 'entrada', cantidad: 10, fecha: '2026-06-05', nota: 'Carga inicial' },
  { id: 9,  producto: 'Cargador inalámbrico 15W',      categoria: 'Cargadores',                tipo: 'salida',  cantidad: 1,  fecha: '2026-06-06', nota: '' },
  { id: 10, producto: 'Vidrio templado iPhone 13',     categoria: 'Protectores de pantalla',   tipo: 'salida',  cantidad: 4,  fecha: '2026-06-07', nota: 'Venta mostrador' },
]

function cargarMovimientos() {
  const guardados = localStorage.getItem('movimientos_stock')
  if (guardados) return JSON.parse(guardados)
  localStorage.setItem('movimientos_stock', JSON.stringify(MOVIMIENTOS_INICIALES))
  return MOVIMIENTOS_INICIALES
}

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState(cargarMovimientos)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')

  useEffect(() => {
    localStorage.setItem('movimientos_stock', JSON.stringify(movimientos))
  }, [movimientos])

  const movimientosVisibles = movimientos.filter((m) => {
    const coincideBusqueda =
      m.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.categoria.toLowerCase().includes(busqueda.toLowerCase())
    const coincideTipo = filtroTipo === 'todos' || m.tipo === filtroTipo
    return coincideBusqueda && coincideTipo
  })

  function formatearFecha(fecha) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
    })
  }

  return (
    <div className="paginaMovimientos">

      <div className="barraAcciones">
        <div className="filtrosMovimientos">
          <div className="buscador">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar producto o categoría…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="inputBusqueda"
            />
          </div>
          <div className="chipsFiltro">
            {[
              { valor: 'todos',   etiqueta: 'Todos'    },
              { valor: 'entrada', etiqueta: 'Entradas' },
              { valor: 'salida',  etiqueta: 'Salidas'  },
            ].map((f) => (
              <button
                key={f.valor}
                className={`chipFiltro ${filtroTipo === f.valor ? 'chipFiltroActivo' : ''}`}
                onClick={() => setFiltroTipo(f.valor)}
              >
                {f.etiqueta}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla — desktop */}
      <div className="contenedorTabla">
        <table className="tabla">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            {movimientosVisibles.length === 0 ? (
              <tr>
                <td colSpan="6" className="sinResultados">No hay movimientos para mostrar</td>
              </tr>
            ) : (
              movimientosVisibles.map((mov) => (
                <tr key={mov.id}>
                  <td>
                    <span className={`chipTipo chipTipo-${mov.tipo}`}>
                      {mov.tipo === 'entrada' ? (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="19" x2="12" y2="5" />
                          <polyline points="5 12 12 5 19 12" />
                        </svg>
                      ) : (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <polyline points="19 12 12 19 5 12" />
                        </svg>
                      )}
                      {mov.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                    </span>
                  </td>
                  <td className="nombreProducto">{mov.producto}</td>
                  <td className="categoriaTabla">{mov.categoria}</td>
                  <td>
                    <span className={`cantidadTabla cantidad-${mov.tipo}`}>
                      {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                    </span>
                  </td>
                  <td className="fechaTabla">{formatearFecha(mov.fecha)}</td>
                  <td className="notaTabla">{mov.nota || <span className="sinNota">—</span>}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="listaCards">
        {movimientosVisibles.length === 0 ? (
          <p className="sinResultados">No hay movimientos para mostrar</p>
        ) : (
          movimientosVisibles.map((mov) => (
            <div key={mov.id} className="card">
              <div className="cardFila">
                <span className={`chipTipo chipTipo-${mov.tipo}`}>
                  {mov.tipo === 'entrada' ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  )}
                  {mov.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                </span>
                <span className={`cantidadTabla cantidad-${mov.tipo}`}>
                  {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                </span>
              </div>
              <p className="nombreProducto">{mov.producto}</p>
              <p className="categoriaCard">{mov.categoria}</p>
              {mov.nota && <p className="notaCard">{mov.nota}</p>}
              <div className="cardPie">
                <span className="fechaTabla">{formatearFecha(mov.fecha)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="totalMovimientos">
        {movimientosVisibles.length} movimiento{movimientosVisibles.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
