import { createContext, useContext } from 'react'

interface Session {
  userId: number
  email: string
}

interface SessionContextType {
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string) => Promise<void>
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession должен использоваться внутри SessionProvider')
  }

  return context
}
