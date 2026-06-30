import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { token, ready } = useAuth()
  if (!ready) return null
  if (!token) return <Navigate to="/office/login" replace />
  return children
}
