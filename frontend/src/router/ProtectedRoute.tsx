import { Navigate } from 'react-router-dom'

import { Loader } from '../components/Loader/Loader'
import { useSession } from '../context/SessionContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, loading } = useSession()

  if (loading) {
    return <Loader />
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
