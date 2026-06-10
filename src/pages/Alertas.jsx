import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Alertas.css'

function cargarProductosConAlerta() {
  const guardados = localStorage.getItem('productos_stock')
  const productos = guardados ? JSON.parse(guardados) : []
  return productos.filter((p) => p.stock <= p.stockMinimo)
}

export default function Alertas() {
  const navegar = useNavigate()
  const [alertas]     = useState(cargarProductosConAlerta)
  const [filtro, setFiltro] = useState('todos')

  const sinStock  = alertas.filter((p) => p.stock === 0)
  const stockBajo = alertas.filter((p) => p.stock > 0 && p.stock <= p.stockMinimo)

  const alertasVisibles = alertas.filter((p) => {
    if (filtro === 'sin-stock') return p.stock === 0
    if (filtro === 'bajo')      return p.stock > 0 && p.stock <= p.stockMinimo
    return true
  })

  function nivelAlerta(producto) {
    return producto.stock === 0 ? 'sin-stock' : 'bajo'
  }

  function faltante(producto) {
    return Math.max(0, producto.stockMinimo - producto.stock)
  }

  if (alertas.length === 0) {
    return (
      <div className="paginaAlertas">
        <div className="sinAlertas">
          <div className="sinAlertasIcono">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="sinAlertasTitulo">Todo en orden</h3>
          <p className="sinAlertasDesc">No hay productos con stock bajo ni agotado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="paginaAlertas">

      {/* Tarjetas de resumen */}
      <div className="resumenAlertas">
        <div className="tarjetaAlerta tarjeta-rojo">
          <div className="tarjetaAlertaIcono">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className="tarjetaAlertaInfo">
            <p className="tarjetaAlertaTitulo">Sin stock</p>
            <p className="tarjetaAlertaValor">{sinStock.length}</p>
          </div>
        </div>
        <div className="tarjetaAlerta tarjeta-naranja">
          <div className="tarjetaAlertaIcono">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="tarjetaAlertaInfo">
            <p className="tarjetaAlertaTitulo">Stock bajo</p>
            <p className="tarjetaAlertaValor">{stockBajo.length}</p>
          </div>
        </div>
        <div className="tarjetaAlerta tarjeta-gris">
          <div className="tarjetaAlertaIcono">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="tarjetaAlertaInfo">
            <p className="tarjetaAlertaTitulo">Total alertas</p>
            <p className="tarjetaAlertaValor">{alertas.length}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="barraFiltros">
        <div className="chipsFiltro">
          {[
            { valor: 'todos',     etiqueta: 'Todas' },
            { valor: 'sin-stock', etiqueta: 'Sin stock' },
            { valor: 'bajo',      etiqueta: 'Stock bajo' },
          ].map((f) => (
            <button
              key={f.valor}
              className={`chipFiltro ${filtro === f.valor ? 'chipFiltroActivo' : ''}`}
              onClick={() => setFiltro(f.valor)}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>
        <button className="botonIrProductos" onClick={() => navegar('/productos')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          Ir a Productos
        </button>
      </div>

      {/* Tabla — desktop */}
      <div className="contenedorTabla">
        <table className="tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock actual</th>
              <th>Stock mínimo</th>
              <th>Faltan</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {alertasVisibles.length === 0 ? (
              <tr>
                <td colSpan="6" className="sinResultados">No hay alertas en este filtro</td>
              </tr>
            ) : (
              alertasVisibles.map((prod) => {
                const nivel = nivelAlerta(prod)
                return (
                  <tr key={prod.id}>
                    <td className="nombreProducto">{prod.nombre}</td>
                    <td className="categoriaTabla">{prod.categoria}</td>
                    <td>
                      <span className={`badgeStock badge-${nivel}`}>{prod.stock}</span>
                    </td>
                    <td className="stockMinTabla">{prod.stockMinimo}</td>
                    <td className="faltanTabla">
                      {faltante(prod) > 0 ? `+${faltante(prod)}` : '—'}
                    </td>
                    <td>
                      <span className={`chipNivel chipNivel-${nivel}`}>
                        {nivel === 'sin-stock' ? 'Sin stock' : 'Stock bajo'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="listaCards">
        {alertasVisibles.length === 0 ? (
          <p className="sinResultados">No hay alertas en este filtro</p>
        ) : (
          alertasVisibles.map((prod) => {
            const nivel = nivelAlerta(prod)
            return (
              <div key={prod.id} className={`card card-${nivel}`}>
                <div className="cardEncabezado">
                  <p className="nombreProducto">{prod.nombre}</p>
                  <span className={`chipNivel chipNivel-${nivel}`}>
                    {nivel === 'sin-stock' ? 'Sin stock' : 'Stock bajo'}
                  </span>
                </div>
                <p className="categoriaCard">{prod.categoria}</p>
                <div className="cardStocks">
                  <div className="cardStockItem">
                    <span className="cardStockLabel">Actual</span>
                    <span className={`badgeStock badge-${nivel}`}>{prod.stock}</span>
                  </div>
                  <div className="cardStockItem">
                    <span className="cardStockLabel">Mínimo</span>
                    <span className="cardStockValor">{prod.stockMinimo}</span>
                  </div>
                  {faltante(prod) > 0 && (
                    <div className="cardStockItem">
                      <span className="cardStockLabel">Faltan</span>
                      <span className="cardStockFaltan">+{faltante(prod)}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <p className="totalAlertas">{alertasVisibles.length} alerta{alertasVisibles.length !== 1 ? 's' : ''}</p>
    </div>
  )
}
