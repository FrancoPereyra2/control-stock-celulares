import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Diseno from './components/common/Diseno'
import PanelPrincipal from './pages/PanelPrincipal'
import Productos from './pages/Productos'
import Categorias from './pages/Categorias'
import Movimientos from './pages/Movimientos'
import Alertas from './pages/Alertas'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Diseno />}>
          <Route path="/panel"       element={<PanelPrincipal />} />
          <Route path="/productos"   element={<Productos />} />
          <Route path="/categorias"  element={<Categorias />} />
          <Route path="/movimientos" element={<Movimientos />} />
          <Route path="/alertas"     element={<Alertas />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
