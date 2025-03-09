import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const PublicRoute = () => {
  const { user } = useAuth()
  return user ? <Navigate to="/conversation" replace /> : <Outlet />
}

const PrivateRoute = () => {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export { PublicRoute, PrivateRoute }
