import { useState } from 'react'
import Swal from 'sweetalert2'
import '../styles/Categorias.css'

const CATEGORIAS_INICIALES = [
  { id: 1, nombre: 'Fundas y estuches',          descripcion: 'Fundas de silicona, cuero y rígidas para distintos modelos', cantidadProductos: 24 },
  { id: 2, nombre: 'Cargadores',                  descripcion: 'Cargadores originales y compatibles de distintas potencias',  cantidadProductos: 12 },
  { id: 3, nombre: 'Auriculares',                 descripcion: 'Auriculares con cable, inalámbricos y manos libres',          cantidadProductos: 9  },
  { id: 4, nombre: 'Protectores de pantalla',     descripcion: 'Vidrios templados y láminas protectoras',                    cantidadProductos: 18 },
  { id: 5, nombre: 'Cables',                      descripcion: 'Cables USB-C, Lightning y Micro-USB',                        cantidadProductos: 15 },
  { id: 6, nombre: 'Baterías',                    descripcion: 'Baterías de repuesto para distintos modelos',                cantidadProductos: 7  },
  { id: 7, nombre: 'Memorias y almacenamiento',   descripcion: 'Tarjetas microSD y memorias USB',                            cantidadProductos: 5  },
]

const FORM_VACIO = { nombre: '', descripcion: '' }

export default function Categorias() {
  const [categorias, setCategorias] = useState(CATEGORIAS_INICIALES)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)

  const categoriasVisibles = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  function abrirModalNuevo() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setModalAbierto(true)
  }

  function abrirModalEdicion(categoria) {
    setForm({ nombre: categoria.nombre, descripcion: categoria.descripcion })
    setEditandoId(categoria.id)
    setModalAbierto(true)
  }

  function cerrarModal() {
    setModalAbierto(false)
    setForm(FORM_VACIO)
    setEditandoId(null)
  }

  function manejarCambio(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function guardarCategoria(e) {
    e.preventDefault()
    if (editandoId) {
      setCategorias((prev) =>
        prev.map((c) => c.id === editandoId ? { ...c, ...form } : c)
      )
    } else {
      const nuevoId = categorias.length ? Math.max(...categorias.map((c) => c.id)) + 1 : 1
      setCategorias((prev) => [...prev, { id: nuevoId, cantidadProductos: 0, ...form }])
    }
    cerrarModal()
  }

  function eliminarCategoria(categoria) {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: `"${categoria.nombre}" se eliminará permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        setCategorias((prev) => prev.filter((c) => c.id !== categoria.id))
        Swal.fire({
          title: 'Eliminada',
          text: 'La categoría fue eliminada correctamente.',
          icon: 'success',
          confirmButtonColor: '#1d4ed8',
          timer: 1800,
          showConfirmButton: false,
        })
      }
    })
  }

  return (
    <div className="paginaCategorias">

      <div className="barraAcciones">
        <div className="buscador">
          <svg width="16" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar categoría…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="inputBusqueda"
          />
        </div>
        <button className="botonAgregar" onClick={abrirModalNuevo}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva categoría
        </button>
      </div>

      {/* Tabla — desktop */}
      <div className="contenedorTabla">
        <table className="tabla">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasVisibles.length === 0 ? (
              <tr>
                <td colSpan="3" className="sinResultados">No hay categorías para mostrar</td>
              </tr>
            ) : (
              categoriasVisibles.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <p className="nombreCategoria">{cat.nombre}</p>
                    <p className="descripcionCategoria">{cat.descripcion}</p>
                  </td>
                  <td>
                    <span className="badgeProductos">{cat.cantidadProductos} productos</span>
                  </td>
                  <td>
                    <div className="acciones">
                      <button className="botonEditar" onClick={() => abrirModalEdicion(cat)} title="Editar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className="botonEliminar" onClick={() => eliminarCategoria(cat)} title="Eliminar">
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="listaCards">
        {categoriasVisibles.length === 0 ? (
          <p className="sinResultados">No hay categorías para mostrar</p>
        ) : (
          categoriasVisibles.map((cat) => (
            <div key={cat.id} className="card">
              <div className="cardEncabezado">
                <p className="nombreCategoria">{cat.nombre}</p>
                <span className="badgeProductos">{cat.cantidadProductos} productos</span>
              </div>
              <p className="descripcionCategoria">{cat.descripcion}</p>
              <div className="cardAcciones">
                <button className="botonEditar" onClick={() => abrirModalEdicion(cat)} title="Editar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className="botonEliminar" onClick={() => eliminarCategoria(cat)} title="Eliminar">
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
          ))
        )}
      </div>

      <p className="totalCategorias">{categoriasVisibles.length} categoría{categoriasVisibles.length !== 1 ? 's' : ''}</p>

      {modalAbierto && (
        <div className="overlayModal" onClick={cerrarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalEncabezado">
              <h3 className="modalTitulo">{editandoId ? 'Editar categoría' : 'Nueva categoría'}</h3>
              <button className="modalCerrar" onClick={cerrarModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form className="modalForm" onSubmit={guardarCategoria}>
              <div className="campoModal">
                <label>Nombre</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Fundas y estuches"
                  required
                />
              </div>
              <div className="campoModal">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={manejarCambio}
                  placeholder="Breve descripción de la categoría…"
                  rows="3"
                />
              </div>
              <div className="modalAcciones">
                <button type="button" className="botonCancelar" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="botonGuardar">
                  {editandoId ? 'Guardar cambios' : 'Agregar categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
