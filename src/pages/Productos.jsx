import { useState, useRef, useEffect } from 'react'
import Swal from 'sweetalert2'
import '../styles/Productos.css'

const CATEGORIAS = [
  'Fundas y estuches',
  'Cargadores',
  'Auriculares',
  'Protectores de pantalla',
  'Cables',
  'Baterías',
  'Memorias y almacenamiento',
]

const PRODUCTOS_INICIALES = [
  { id: 1,  nombre: 'Funda silicona iPhone 12',     categoria: 'Fundas y estuches',         stock: 15, stockMinimo: 5,  precio: 3500  },
  { id: 2,  nombre: 'Funda silicona Samsung A54',   categoria: 'Fundas y estuches',         stock: 3,  stockMinimo: 5,  precio: 3200  },
  { id: 3,  nombre: 'Cargador USB-C 20W',           categoria: 'Cargadores',                stock: 12, stockMinimo: 4,  precio: 8500  },
  { id: 4,  nombre: 'Cargador inalámbrico 15W',     categoria: 'Cargadores',                stock: 2,  stockMinimo: 3,  precio: 12000 },
  { id: 5,  nombre: 'Auriculares in-ear genéricos', categoria: 'Auriculares',               stock: 7,  stockMinimo: 3,  precio: 4500  },
  { id: 6,  nombre: 'Vidrio templado Samsung A32',  categoria: 'Protectores de pantalla',   stock: 10, stockMinimo: 6,  precio: 1800  },
  { id: 7,  nombre: 'Vidrio templado iPhone 13',    categoria: 'Protectores de pantalla',   stock: 5,  stockMinimo: 6,  precio: 2200  },
  { id: 8,  nombre: 'Cable USB-C 1m',               categoria: 'Cables',                    stock: 25, stockMinimo: 8,  precio: 2000  },
  { id: 9,  nombre: 'Batería iPhone 11',            categoria: 'Baterías',                  stock: 4,  stockMinimo: 3,  precio: 9000  },
  { id: 10, nombre: 'MicroSD 64GB',                 categoria: 'Memorias y almacenamiento', stock: 0,  stockMinimo: 4,  precio: 6500  },
]

const FORM_VACIO   = { nombre: '', categoria: CATEGORIAS[0], stock: '', stockMinimo: '', precio: '' }
const AJUSTE_VACIO = { tipo: 'entrada', cantidad: '', nota: '' }

function cargarProductos() {
  const guardados = localStorage.getItem('productos_stock')
  if (guardados) return JSON.parse(guardados)
  localStorage.setItem('productos_stock', JSON.stringify(PRODUCTOS_INICIALES))
  return PRODUCTOS_INICIALES
}

function registrarMovimiento(producto, tipo, cantidad, nota) {
  const guardados = JSON.parse(localStorage.getItem('movimientos_stock') || '[]')
  const nuevoId = guardados.length ? Math.max(...guardados.map((m) => m.id)) + 1 : 1
  const hoy = new Date().toISOString().split('T')[0]
  localStorage.setItem('movimientos_stock', JSON.stringify([
    { id: nuevoId, producto: producto.nombre, categoria: producto.categoria, tipo, cantidad: Number(cantidad), fecha: hoy, nota: nota || '' },
    ...guardados,
  ]))
}

function estadoStock(stock, stockMinimo) {
  if (stock === 0) return 'sin-stock'
  if (stock <= stockMinimo) return 'bajo'
  return 'ok'
}

export default function Productos() {
  const [productos, setProductos]           = useState(cargarProductos)
  const [busqueda, setBusqueda]             = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [modalAbierto, setModalAbierto]     = useState(false)
  const [modalAjuste, setModalAjuste]       = useState(false)
  const [productoAjuste, setProductoAjuste] = useState(null)
  const [form, setForm]                     = useState(FORM_VACIO)
  const [ajuste, setAjuste]                 = useState(AJUSTE_VACIO)
  const [editandoId, setEditandoId]         = useState(null)

  // Select categoría — modal
  const [selectAbierto, setSelectAbierto] = useState(false)
  const [posSelect, setPosSelect]         = useState({ top: 0, left: 0, width: 0 })
  const refSelect                         = useRef(null)

  // Ordenamiento
  const [ordenColumna, setOrdenColumna]       = useState(null)
  const [ordenDireccion, setOrdenDireccion]   = useState('asc')

  // Select categoría — filtro
  const [filtroSelectAbierto, setFiltroSelectAbierto] = useState(false)
  const [posFiltroSelect, setPosFiltroSelect]         = useState({ top: 0, left: 0, width: 0 })
  const refFiltroSelect                               = useRef(null)

  useEffect(() => {
    localStorage.setItem('productos_stock', JSON.stringify(productos))
  }, [productos])

  // Resumen
  const totalProductos = productos.length
  const conStockBajo   = productos.filter((p) => p.stock > 0 && p.stock <= p.stockMinimo).length
  const sinStock       = productos.filter((p) => p.stock === 0).length

  function toggleOrden(columna) {
    if (ordenColumna === columna) {
      setOrdenDireccion((d) => d === 'asc' ? 'desc' : 'asc')
    } else {
      setOrdenColumna(columna)
      setOrdenDireccion('asc')
    }
  }

  const productosVisibles = productos
    .filter((p) => {
      const coincideBusqueda  = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const coincideCategoria = filtroCategoria === 'todas' || p.categoria === filtroCategoria
      return coincideBusqueda && coincideCategoria
    })
    .sort((a, b) => {
      if (!ordenColumna) return 0
      const va = a[ordenColumna]
      const vb = b[ordenColumna]
      if (typeof va === 'string') return ordenDireccion === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return ordenDireccion === 'asc' ? va - vb : vb - va
    })

  function abrirModalNuevo() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setModalAbierto(true)
  }

  function abrirModalEdicion(producto) {
    setForm({ nombre: producto.nombre, categoria: producto.categoria, stock: producto.stock, stockMinimo: producto.stockMinimo, precio: producto.precio })
    setEditandoId(producto.id)
    setModalAbierto(true)
  }

  function cerrarModal() {
    setModalAbierto(false)
    setForm(FORM_VACIO)
    setEditandoId(null)
    setSelectAbierto(false)
  }

  function abrirModalAjuste(producto) {
    setProductoAjuste(producto)
    setAjuste(AJUSTE_VACIO)
    setModalAjuste(true)
  }

  function cerrarModalAjuste() {
    setModalAjuste(false)
    setProductoAjuste(null)
    setAjuste(AJUSTE_VACIO)
  }

  function guardarProducto(e) {
    e.preventDefault()
    const datos = { ...form, stock: Number(form.stock), stockMinimo: Number(form.stockMinimo), precio: Number(form.precio) }
    if (editandoId) {
      setProductos((prev) => prev.map((p) => p.id === editandoId ? { ...p, ...datos } : p))
    } else {
      const nuevoId      = productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1
      const nuevoProducto = { id: nuevoId, ...datos }
      setProductos((prev) => [...prev, nuevoProducto])
      if (Number(form.stock) > 0) registrarMovimiento(nuevoProducto, 'entrada', form.stock, 'Carga inicial')
    }
    cerrarModal()
  }

  function confirmarAjuste(e) {
    e.preventDefault()
    const cantidad   = Number(ajuste.cantidad)
    const nuevoStock = ajuste.tipo === 'entrada' ? productoAjuste.stock + cantidad : productoAjuste.stock - cantidad
    if (nuevoStock < 0) {
      Swal.fire({ title: 'Stock insuficiente', text: `No podés sacar ${cantidad} unidades. Stock actual: ${productoAjuste.stock}.`, icon: 'error', confirmButtonColor: '#1d4ed8' })
      return
    }
    setProductos((prev) => prev.map((p) => p.id === productoAjuste.id ? { ...p, stock: nuevoStock } : p))
    registrarMovimiento(productoAjuste, ajuste.tipo, cantidad, ajuste.nota)
    cerrarModalAjuste()
  }

  function eliminarProducto(producto) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `"${producto.nombre}" se eliminará permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setProductos((prev) => prev.filter((p) => p.id !== producto.id))
        Swal.fire({ title: 'Eliminado', text: 'El producto fue eliminado correctamente.', icon: 'success', confirmButtonColor: '#1d4ed8', timer: 1800, showConfirmButton: false })
      }
    })
  }

  function toggleSelectModal() {
    if (!selectAbierto && refSelect.current) {
      const rect = refSelect.current.getBoundingClientRect()
      setPosSelect({ top: rect.bottom + 6, left: rect.left, width: rect.width })
    }
    setSelectAbierto((v) => !v)
  }

  function toggleFiltroSelect() {
    if (!filtroSelectAbierto && refFiltroSelect.current) {
      const rect = refFiltroSelect.current.getBoundingClientRect()
      setPosFiltroSelect({ top: rect.bottom + 6, left: rect.left, width: rect.width })
    }
    setFiltroSelectAbierto((v) => !v)
  }

  const etiquetaFiltro = filtroCategoria === 'todas' ? 'Todas las categorías' : filtroCategoria

  return (
    <div className="paginaProductos">

      {/* Tarjetas de resumen */}
      <div className="resumen">
        <div className="tarjetaResumen tarjeta-azul">
          <div className="tarjetaResumenIcono">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="tarjetaResumenInfo">
            <p className="tarjetaResumenTitulo">Total productos</p>
            <p className="tarjetaResumenValor">{totalProductos}</p>
          </div>
        </div>
        <div className="tarjetaResumen tarjeta-naranja">
          <div className="tarjetaResumenIcono">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="tarjetaResumenInfo">
            <p className="tarjetaResumenTitulo">Stock bajo</p>
            <p className="tarjetaResumenValor">{conStockBajo}</p>
          </div>
        </div>
        <div className="tarjetaResumen tarjeta-rojo">
          <div className="tarjetaResumenIcono">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className="tarjetaResumenInfo">
            <p className="tarjetaResumenTitulo">Sin stock</p>
            <p className="tarjetaResumenValor">{sinStock}</p>
          </div>
        </div>
      </div>

      {/* Barra acciones */}
      <div className="barraAcciones">
        <div className="filtros">
          <div className="buscador">
            <svg width="16" height="30" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar producto…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="inputBusqueda"
            />
          </div>
          <div
            className="filtroCategoria"
            ref={refFiltroSelect}
            onClick={toggleFiltroSelect}
          >
            <span>{etiquetaFiltro}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {filtroSelectAbierto && (
              <>
                <div className="selectOverlay" onClick={(e) => { e.stopPropagation(); setFiltroSelectAbierto(false) }} />
                <div className="selectOpciones"
                  style={{ position: 'fixed', top: posFiltroSelect.top, left: posFiltroSelect.left, width: Math.max(posFiltroSelect.width, 220) }}>
                  <div
                    className={`selectOpcion ${filtroCategoria === 'todas' ? 'selectOpcionActiva' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setFiltroCategoria('todas'); setFiltroSelectAbierto(false) }}
                  >
                    Todas las categorías
                  </div>
                  {CATEGORIAS.map((cat) => (
                    <div key={cat}
                      className={`selectOpcion ${filtroCategoria === cat ? 'selectOpcionActiva' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setFiltroCategoria(cat); setFiltroSelectAbierto(false) }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <button className="botonAgregar" onClick={abrirModalNuevo}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo producto
        </button>
      </div>

      {/* Tabla — desktop */}
      <div className="contenedorTabla">
        <table className="tabla">
          <thead>
            <tr>
              {[
                { label: 'Producto',   clave: 'nombre'      },
                { label: 'Categoría',  clave: 'categoria'   },
                { label: 'Stock',      clave: 'stock'       },
                { label: 'Stock mín.', clave: 'stockMinimo' },
                { label: 'Precio',     clave: 'precio'      },
              ].map(({ label, clave }) => (
                <th key={clave} className="thOrdenable" onClick={() => toggleOrden(clave)}>
                  <span className="thContenido">
                    {label}
                    <span className="iconoOrden">
                      {ordenColumna === clave ? (
                        ordenDireccion === 'asc' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 18 12 22 8 18" />
                          <polyline points="16 6 12 2 8 6" />
                        </svg>
                      )}
                    </span>
                  </span>
                </th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosVisibles.length === 0 ? (
              <tr>
                <td colSpan="6" className="sinResultados">No hay productos para mostrar</td>
              </tr>
            ) : (
              productosVisibles.map((prod) => {
                const estado = estadoStock(prod.stock, prod.stockMinimo)
                return (
                  <tr key={prod.id}>
                    <td className="nombreProducto">{prod.nombre}</td>
                    <td className="categoriaTabla">{prod.categoria}</td>
                    <td><span className={`stockValor stock-${estado}`}>{prod.stock}</span></td>
                    <td className="stockMinTabla">{prod.stockMinimo}</td>
                    <td className="precioTabla">${prod.precio.toLocaleString('es-AR')}</td>
                    <td>
                      <div className="acciones">
                        <button className="botonAjuste" onClick={() => abrirModalAjuste(prod)} title="Ajustar stock">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="17 11 12 6 7 11" />
                            <polyline points="17 18 12 13 7 18" />
                          </svg>
                        </button>
                        <button className="botonEditar" onClick={() => abrirModalEdicion(prod)} title="Editar">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button className="botonEliminar" onClick={() => eliminarProducto(prod)} title="Eliminar">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" /><path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
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
        {productosVisibles.length === 0 ? (
          <p className="sinResultados">No hay productos para mostrar</p>
        ) : (
          productosVisibles.map((prod) => {
            const estado = estadoStock(prod.stock, prod.stockMinimo)
            return (
              <div key={prod.id} className="card">
                <div className="cardEncabezado">
                  <p className="nombreProducto">{prod.nombre}</p>
                  <span className={`stockValor stock-${estado}`}>{prod.stock} uds.</span>
                </div>
                <p className="categoriaCard">{prod.categoria}</p>
                <div className="cardFila">
                  <span className="cardPrecio">${prod.precio.toLocaleString('es-AR')}</span>
                  <span className="cardStockMin">Mín: {prod.stockMinimo}</span>
                </div>
                <div className="cardAcciones">
                  <button className="botonAjuste botonAjusteCard" onClick={() => abrirModalAjuste(prod)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="17 11 12 6 7 11" />
                      <polyline points="17 18 12 13 7 18" />
                    </svg>
                    Ajustar stock
                  </button>
                  <button className="botonEditar" onClick={() => abrirModalEdicion(prod)} title="Editar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className="botonEliminar" onClick={() => eliminarProducto(prod)} title="Eliminar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <p className="totalProductos">{productosVisibles.length} producto{productosVisibles.length !== 1 ? 's' : ''}</p>

      {/* Modal agregar / editar */}
      {modalAbierto && (
        <div className="overlayModal" onClick={cerrarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalEncabezado">
              <h3 className="modalTitulo">{editandoId ? 'Editar producto' : 'Nuevo producto'}</h3>
              <button className="modalCerrar" onClick={cerrarModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form className="modalForm" onSubmit={guardarProducto}>
              <div className="campoModal">
                <label>Nombre</label>
                <input name="nombre" value={form.nombre} onChange={(e) => setForm(p => ({ ...p, nombre: e.target.value }))}
                  placeholder="Ej: Funda silicona iPhone 12" required />
              </div>
              <div className="campoModal">
                <label>Categoría</label>
                <div className="selectCustom" ref={refSelect} onClick={toggleSelectModal}>
                  <span>{form.categoria}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  {selectAbierto && (
                    <>
                      <div className="selectOverlay" onClick={(e) => { e.stopPropagation(); setSelectAbierto(false) }} />
                      <div className="selectOpciones"
                        style={{ position: 'fixed', top: posSelect.top, left: posSelect.left, width: posSelect.width }}>
                        {CATEGORIAS.map((cat) => (
                          <div key={cat}
                            className={`selectOpcion ${form.categoria === cat ? 'selectOpcionActiva' : ''}`}
                            onClick={(ev) => { ev.stopPropagation(); setForm((p) => ({ ...p, categoria: cat })); setSelectAbierto(false) }}>
                            {cat}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="filaTres">
                <div className="campoModal">
                  <label>{editandoId ? 'Stock actual' : 'Stock inicial'}</label>
                  <input name="stock" type="number" min="0" value={form.stock}
                    onChange={(e) => setForm(p => ({ ...p, stock: e.target.value }))} placeholder="0" required />
                </div>
                <div className="campoModal">
                  <label>Stock mínimo</label>
                  <input name="stockMinimo" type="number" min="0" value={form.stockMinimo}
                    onChange={(e) => setForm(p => ({ ...p, stockMinimo: e.target.value }))} placeholder="0" required />
                </div>
                <div className="campoModal">
                  <label>Precio</label>
                  <input name="precio" type="number" min="0" value={form.precio}
                    onChange={(e) => setForm(p => ({ ...p, precio: e.target.value }))} placeholder="0" required />
                </div>
              </div>
              <div className="modalAcciones">
                <button type="button" className="botonCancelar" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="botonGuardar">
                  {editandoId ? 'Guardar cambios' : 'Agregar producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal ajustar stock */}
      {modalAjuste && productoAjuste && (
        <div className="overlayModal" onClick={cerrarModalAjuste}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalEncabezado">
              <div>
                <h3 className="modalTitulo">Ajustar stock</h3>
                <p className="modalSubtitulo">{productoAjuste.nombre}</p>
              </div>
              <button className="modalCerrar" onClick={cerrarModalAjuste}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form className="modalForm" onSubmit={confirmarAjuste}>
              <div className="stockActualInfo">
                <span className="stockActualLabel">Stock actual</span>
                <span className={`stockActualValor stock-${estadoStock(productoAjuste.stock, productoAjuste.stockMinimo)}`}>
                  {productoAjuste.stock} unidades
                </span>
              </div>
              <div className="campoModal">
                <label>Tipo</label>
                <div className="toggleTipo">
                  <button type="button"
                    className={`toggleBtn ${ajuste.tipo === 'entrada' ? 'toggleActivo-entrada' : ''}`}
                    onClick={() => setAjuste((p) => ({ ...p, tipo: 'entrada' }))}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                    </svg>
                    Entrada
                  </button>
                  <button type="button"
                    className={`toggleBtn ${ajuste.tipo === 'salida' ? 'toggleActivo-salida' : ''}`}
                    onClick={() => setAjuste((p) => ({ ...p, tipo: 'salida' }))}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                    </svg>
                    Salida
                  </button>
                </div>
              </div>
              <div className="campoModal">
                <label>Cantidad</label>
                <input name="cantidad" type="number" min="1" value={ajuste.cantidad}
                  onChange={(e) => setAjuste(p => ({ ...p, cantidad: e.target.value }))} placeholder="Ej: 10" required />
              </div>
              <div className="campoModal">
                <label>Nota <span className="labelOpcional">(opcional)</span></label>
                <textarea name="nota" value={ajuste.nota}
                  onChange={(e) => setAjuste(p => ({ ...p, nota: e.target.value }))}
                  placeholder="Ej: Compra a proveedor, venta mostrador…" rows="2" />
              </div>
              <div className="modalAcciones">
                <button type="button" className="botonCancelar" onClick={cerrarModalAjuste}>Cancelar</button>
                <button type="submit" className="botonGuardar">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
