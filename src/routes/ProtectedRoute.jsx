import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLE_HOME } from '../utils/constants'

export default function ProtectedRoute({ allowedRoles }) {
  const { usuario, estaAutenticado } = useAuth()
  const location = useLocation()

  if (!estaAutenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(usuario.perfil)) {
    return <Navigate to={ROLE_HOME[usuario.perfil] || '/login'} replace />
  }

  return <Outlet />
}
