import { Navigate } from 'react-router-dom'

import { useSession } from '../context/SessionContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session } = useSession()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
