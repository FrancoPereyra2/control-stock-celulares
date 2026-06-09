import { useState, useRef } from 'react'
import Swal from 'sweetalert2'
import '../styles/Equipos.css'

const ESTADOS = [
  { valor: 'ingresado',   etiqueta: 'Ingresado',        color: 'azul'     },
  { valor: 'en_proceso',  etiqueta: 'En proceso',        color: 'naranja'  },
  { valor: 'terminado',   etiqueta: 'Listo para retirar', color: 'verde'   },
]

const EQUIPOS_INICIALES = [
  { id: 1, cliente: 'Juan García',    telefono: '11-4523-9871', equipo: 'iPhone 12 64GB',         problema: 'Pantalla rota',              fechaIngreso: '2026-06-01', estado: 'ingresado',  precio: 18000 },
  { id: 2, cliente: 'María López',    telefono: '11-3389-4402', equipo: 'Samsung Galaxy A32',      problema: 'No enciende',                fechaIngreso: '2026-06-02', estado: 'en_proceso', precio: 9500  },
  { id: 3, cliente: 'Carlos Ruiz',    telefono: '11-6671-0034', equipo: 'Motorola G82',            problema: 'Batería hinchada',           fechaIngreso: '2026-06-03', estado: 'en_proceso', precio: 12000 },
  { id: 4, cliente: 'Laura Méndez',   telefono: '11-2218-7760', equipo: 'Xiaomi Redmi Note 10',   problema: 'Cámara trasera no funciona', fechaIngreso: '2026-06-04', estado: 'terminado',  precio: 7000  },
  { id: 5, cliente: 'Pedro Sánchez',  telefono: '11-9940-5513', equipo: 'iPhone 11 128GB',        problema: 'Auricular no suena',         fechaIngreso: '2026-06-05', estado: 'ingresado',  precio: 11000 },
]

const FORM_VACIO = {
  cliente: '', telefono: '', equipo: '', problema: '', estado: 'ingresado', precio: '',
}

const SIGUIENTE_ESTADO = { ingresado: 'en_proceso', en_proceso: 'terminado', terminado: 'retirado' }

const ETIQUETA_SIGUIENTE = {
  ingresado:  'Iniciar reparación',
  en_proceso: 'Marcar como listo',
  terminado:  'Marcar como retirado',
}

export default function Equipos() {
  const [equipos, setEquipos] = useState(EQUIPOS_INICIALES)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [selectAbierto, setSelectAbierto] = useState(false)
  const [posSelect, setPosSelect] = useState({ top: 0, left: 0, width: 0 })
  const refSelect = useRef(null)

  const equiposVisibles = equipos.filter((e) => {
    if (e.estado === 'retirado') return false
    const coincideBusqueda =
      e.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.equipo.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEstado = filtroEstado === 'todos' || e.estado === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  function abrirModalNuevo() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setModalAbierto(true)
  }

  function abrirModalEdicion(equipo) {
    setForm({
      cliente:      equipo.cliente,
      telefono:     equipo.telefono,
      equipo:       equipo.equipo,
      problema:     equipo.problema,
      estado:       equipo.estado,
      precio:       equipo.precio,
    })
    setEditandoId(equipo.id)
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

  function guardarEquipo(e) {
    e.preventDefault()
    const datos = { ...form, precio: Number(form.precio) }
    if (editandoId) {
      setEquipos((prev) => prev.map((eq) => eq.id === editandoId ? { ...eq, ...datos } : eq))
    } else {
      const nuevoId = Math.max(...equipos.map((eq) => eq.id)) + 1
      const hoy = new Date().toISOString().split('T')[0]
      setEquipos((prev) => [...prev, { id: nuevoId, fechaIngreso: hoy, ...datos }])
    }
    cerrarModal()
  }

  function avanzarEstado(equipo) {
    const siguiente = SIGUIENTE_ESTADO[equipo.estado]

    if (siguiente === 'retirado') {
      Swal.fire({
        title: '¿El equipo fue retirado?',
        text: `Se registrará que "${equipo.equipo}" de ${equipo.cliente} fue retirado y dejará de aparecer en la lista.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, fue retirado',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          setEquipos((prev) =>
            prev.map((eq) => eq.id === equipo.id ? { ...eq, estado: 'retirado' } : eq)
          )
          Swal.fire({
            title: '¡Listo!',
            text: 'El equipo fue marcado como retirado.',
            icon: 'success',
            confirmButtonColor: '#1d4ed8',
            timer: 1800,
            showConfirmButton: false,
          })
        }
      })
      return
    }

    setEquipos((prev) =>
      prev.map((eq) => eq.id === equipo.id ? { ...eq, estado: siguiente } : eq)
    )
  }

  function toggleSelect() {
    if (!selectAbierto && refSelect.current) {
      const rect = refSelect.current.getBoundingClientRect()
      setPosSelect({ top: rect.bottom + 6, left: rect.left, width: rect.width })
    }
    setSelectAbierto((v) => !v)
  }

  function infoEstado(valor) {
    return ESTADOS.find((e) => e.valor === valor) ?? ESTADOS[0]
  }

  function formatearFecha(fecha) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
    })
  }

  return (
    <div className="paginaEquipos">

      <div className="barraAcciones">
        <div className="filtros">
          <div className="buscador">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar cliente o equipo…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="inputBusqueda"
            />
          </div>
          <div className="filtrosEstado">
            <button
              className={`chipFiltro ${filtroEstado === 'todos' ? 'chipFiltroActivo' : ''}`}
              onClick={() => setFiltroEstado('todos')}
            >
              Todos
            </button>
            {ESTADOS.map((e) => (
              <button
                key={e.valor}
                className={`chipFiltro chipFiltro-${e.color} ${filtroEstado === e.valor ? 'chipFiltroActivo' : ''}`}
                onClick={() => setFiltroEstado(e.valor)}
              >
                {e.etiqueta}
              </button>
            ))}
          </div>
        </div>
        <button className="botonAgregar" onClick={abrirModalNuevo}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo equipo
        </button>
      </div>

      <div className="contenedorTabla">
        <table className="tabla">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Equipo</th>
              <th>Problema</th>
              <th>Ingreso</th>
              <th>Estado</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {equiposVisibles.length === 0 ? (
              <tr>
                <td colSpan="7" className="sinResultados">No hay equipos para mostrar</td>
              </tr>
            ) : (
              equiposVisibles.map((eq) => {
                const estado = infoEstado(eq.estado)
                return (
                  <tr key={eq.id}>
                    <td>
                      <p className="nombreCliente">{eq.cliente}</p>
                      <p className="telefonoCliente">{eq.telefono}</p>
                    </td>
                    <td className="nombreEquipo">{eq.equipo}</td>
                    <td className="problemaEquipo">{eq.problema}</td>
                    <td className="fechaTabla">{formatearFecha(eq.fechaIngreso)}</td>
                    <td>
                      <span className={`chipEstado chipEstado-${estado.color}`}>
                        {estado.etiqueta}
                      </span>
                    </td>
                    <td className="precioTabla">
                      ${eq.precio.toLocaleString('es-AR')}
                    </td>
                    <td>
                      <div className="acciones">
                        <button
                          className={`botonAvanzar botonAvanzar-${estado.color}`}
                          onClick={() => avanzarEstado(eq)}
                          title={ETIQUETA_SIGUIENTE[eq.estado]}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                        <button className="botonEditar" onClick={() => abrirModalEdicion(eq)} title="Editar">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

      {/* Vista en cards — solo mobile */}
      <div className="listaCards">
        {equiposVisibles.length === 0 ? (
          <p className="sinResultados">No hay equipos para mostrar</p>
        ) : (
          equiposVisibles.map((eq) => {
            const estado = infoEstado(eq.estado)
            return (
              <div key={eq.id} className="card">
                <div className="cardFila">
                  <span className={`chipEstado chipEstado-${estado.color}`}>{estado.etiqueta}</span>
                  <span className="cardPrecio">${eq.precio.toLocaleString('es-AR')}</span>
                </div>
                <p className="cardEquipo">{eq.equipo}</p>
                <p className="cardCliente">{eq.cliente} · {eq.telefono}</p>
                <p className="cardProblema">{eq.problema}</p>
                <div className="cardPie">
                  <span className="cardFecha">{formatearFecha(eq.fechaIngreso)}</span>
                  <div className="acciones">
                    <button
                      className={`botonAvanzar botonAvanzar-${estado.color}`}
                      onClick={() => avanzarEstado(eq)}
                      title={ETIQUETA_SIGUIENTE[eq.estado]}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                    <button className="botonEditar" onClick={() => abrirModalEdicion(eq)} title="Editar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <p className="totalEquipos">{equiposVisibles.length} equipo{equiposVisibles.length !== 1 ? 's' : ''}</p>

      {modalAbierto && (
        <div className="overlayModal" onClick={cerrarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalEncabezado">
              <h3 className="modalTitulo">{editandoId ? 'Editar equipo' : 'Nuevo equipo'}</h3>
              <button className="modalCerrar" onClick={cerrarModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form className="modalForm" onSubmit={guardarEquipo}>
              <div className="filaDos">
                <div className="campoModal">
                  <label>Cliente</label>
                  <input name="cliente" value={form.cliente} onChange={manejarCambio}
                    placeholder="Nombre del cliente" required />
                </div>
                <div className="campoModal">
                  <label>Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={manejarCambio}
                    placeholder="Ej: 11-4523-9871" />
                </div>
              </div>

              <div className="campoModal">
                <label>Equipo</label>
                <input name="equipo" value={form.equipo} onChange={manejarCambio}
                  placeholder="Ej: iPhone 12 64GB" required />
              </div>

              <div className="campoModal">
                <label>Problema</label>
                <textarea name="problema" value={form.problema} onChange={manejarCambio}
                  placeholder="Describí el problema…" rows="3" required />
              </div>

              <div className="filaDos">
                <div className="campoModal">
                  <label>Estado</label>
                  <div className="selectCustom" ref={refSelect} onClick={toggleSelect}>
                    <span>{ESTADOS.find((e) => e.valor === form.estado)?.etiqueta}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                    {selectAbierto && (
                      <>
                        <div className="selectOverlay" onClick={(e) => { e.stopPropagation(); setSelectAbierto(false) }} />
                        <div
                          className="selectOpciones"
                          style={{ position: 'fixed', top: posSelect.top, left: posSelect.left, width: posSelect.width }}
                        >
                          {ESTADOS.map((e) => (
                            <div
                              key={e.valor}
                              className={`selectOpcion ${form.estado === e.valor ? 'selectOpcionActiva' : ''}`}
                              onClick={(ev) => { ev.stopPropagation(); setForm((prev) => ({ ...prev, estado: e.valor })); setSelectAbierto(false) }}
                            >
                              {e.etiqueta}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="campoModal">
                  <label>Precio</label>
                  <input name="precio" type="number" min="0" value={form.precio}
                    onChange={manejarCambio} placeholder="Ej: 15000" required />
                </div>
              </div>

              <div className="modalAcciones">
                <button type="button" className="botonCancelar" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="botonGuardar">
                  {editandoId ? 'Guardar cambios' : 'Agregar equipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
