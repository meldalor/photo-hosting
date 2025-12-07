import { useState, useEffect } from 'react'

import { SessionContext } from './SessionContext'

interface Session {
  userId: number
  email: string
}

interface SessionProviderProps {
  children: React.ReactNode
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const savedSession = localStorage.getItem('session')

    if (savedSession) {
      setSession(JSON.parse(savedSession))
    }
  }, [])

  const login = async (email: string, password: string) => {
    console.log('Login stub:', email, password)
  }

  const logout = () => {
    setSession(null)
    localStorage.removeItem('session')
  }

  const register = async (email: string, password: string) => {
    console.log('Register stub:', email, password)
  }

  return (
    <SessionContext.Provider value={{ session, login, logout, register }}>
      {children}
    </SessionContext.Provider>
  )
}
