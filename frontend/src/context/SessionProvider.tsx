import { useState, useEffect } from 'react'

import { SessionContext } from './SessionContext'
import { authService } from '../services/authService'
import { sessionService } from '../services/sessionService'

interface Session {
  userId: number
  email: string
}

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
    const user = await authService.login(email, password)

    if (!user || !user.id) {
      throw new Error('Неверный email или пароль')
    }

    const newSession: Session = {
      userId: user.id,
      email: user.email
    }

    setSession(newSession)
    sessionService.saveSession(newSession)
  }

  const logout = () => {
    setSession(null)
    sessionService.clearSession()
  }

  const register = async (email: string, password: string) => {
    const user = await authService.register(email, password)

    if (!user.id) {
      throw new Error('Ошибка регистрации')
    }

    const newSession: Session = {
      userId: user.id,
      email: user.email
    }

    setSession(newSession)
    sessionService.saveSession(newSession)
  }

  return (
    <SessionContext.Provider value={{ session, loading, login, logout, register }}>
      {children}
    </SessionContext.Provider>
  )
}
