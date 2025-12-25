import { useState, useEffect } from 'react'

import { SessionContext } from './SessionContext'
import { authService } from '../services/authService'
import { sessionService } from '../services/sessionService'
import { Session } from '../types'

interface SessionProviderProps {
  children: React.ReactNode
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [session, setSession] = useState<Session | null>(() => {
    return sessionService.getSession()
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password)

    const newSession: Session = {
      userId: user.id,
      email: user.email
    }

    setSession(newSession)
    sessionService.saveToken(token)
  }

  const logout = () => {
    setSession(null)
    authService.logout()
    sessionService.clearSession()
  }

  const register = async (email: string, password: string) => {
    const { user, token } = await authService.register(email, password)

    const newSession: Session = {
      userId: user.id,
      email: user.email
    }

    setSession(newSession)
    sessionService.saveToken(token)
  }

  return (
    <SessionContext.Provider value={{ session, loading, login, logout, register }}>
      {children}
    </SessionContext.Provider>
  )
}
