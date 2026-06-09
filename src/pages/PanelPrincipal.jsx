import '../styles/PanelPrincipal.css'

const TARJETAS = [
  {
    titulo: 'Productos totales',
    valor: 48,
    detalle: '+3 esta semana',
    color: 'azul',
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    titulo: 'Stock bajo',
    valor: 7,
    detalle: 'Requieren reposición',
    color: 'rojo',
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    titulo: 'Movimientos hoy',
    valor: 12,
    detalle: '8 entradas · 4 salidas',
    color: 'verde',
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    titulo: 'Categorías',
    valor: 5,
    detalle: 'Celulares, fundas, cables…',
    color: 'violeta',
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
]

const ALERTAS_STOCK = [
  { nombre: 'Samsung Galaxy A15', categoria: 'Celulares', stock: 2, minimo: 5 },
  { nombre: 'Cable USB-C 1m', categoria: 'Cables', stock: 3, minimo: 10 },
  { nombre: 'Funda iPhone 15', categoria: 'Fundas', stock: 1, minimo: 8 },
  { nombre: 'Cargador 20W', categoria: 'Cargadores', stock: 4, minimo: 6 },
  { nombre: 'Vidrio templado Samsung', categoria: 'Accesorios', stock: 0, minimo: 5 },
]

const MOVIMIENTOS_RECIENTES = [
  { producto: 'iPhone 14 128GB', tipo: 'entrada', cantidad: 5, fecha: 'Hoy, 10:32' },
  { producto: 'Funda silicona Xiaomi', tipo: 'salida', cantidad: 2, fecha: 'Hoy, 09:15' },
  { producto: 'Cargador inalámbrico 15W', tipo: 'entrada', cantidad: 10, fecha: 'Hoy, 08:50' },
  { producto: 'Cable lightning 2m', tipo: 'salida', cantidad: 3, fecha: 'Ayer, 17:40' },
  { producto: 'Motorola G84', tipo: 'entrada', cantidad: 8, fecha: 'Ayer, 14:20' },
]

export default function PanelPrincipal() {
  return (
    <div className="panel">

      <div className="grillaTarjetas">
        {TARJETAS.map((t) => (
          <div key={t.titulo} className={`tarjeta tarjeta-${t.color}`}>
            <div className="tarjetaIcono">{t.icono}</div>
            <div className="tarjetaInfo">
              <p className="tarjetaTitulo">{t.titulo}</p>
              <p className="tarjetaValor">{t.valor}</p>
              <p className="tarjetaDetalle">{t.detalle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grillaSecundaria">

        <section className="seccion">
          <div className="seccionEncabezado">
            <h3 className="seccionTitulo">Alertas de stock bajo</h3>
            <span className="badge badgeRojo">{ALERTAS_STOCK.length} productos</span>
          </div>
          <div className="listaAlertas">
            {ALERTAS_STOCK.map((item) => (
              <div key={item.nombre} className="itemAlerta">
                <div className="itemAlertaInfo">
                  <p className="itemNombre">{item.nombre}</p>
                  <p className="itemCategoria">{item.categoria}</p>
                </div>
                <div className="itemAlertaStock">
                  <span className={`stockValor ${item.stock === 0 ? 'sinStock' : 'stockBajo'}`}>
                    {item.stock === 0 ? 'Sin stock' : `${item.stock} ud.`}
                  </span>
                  <span className="stockMinimo">mín. {item.minimo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="seccion">
          <div className="seccionEncabezado">
            <h3 className="seccionTitulo">Últimos movimientos</h3>
            <span className="badge badgeGris">Hoy</span>
          </div>
          <div className="listaMovimientos">
            {MOVIMIENTOS_RECIENTES.map((mov, i) => (
              <div key={i} className="itemMovimiento">
                <span className={`tipoIcono ${mov.tipo === 'entrada' ? 'entrada' : 'salida'}`}>
                  {mov.tipo === 'entrada' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  )}
                </span>
                <div className="movInfo">
                  <p className="movProducto">{mov.producto}</p>
                  <p className="movFecha">{mov.fecha}</p>
                </div>
                <span className={`movCantidad ${mov.tipo === 'entrada' ? 'cantEntrada' : 'cantSalida'}`}>
                  {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
