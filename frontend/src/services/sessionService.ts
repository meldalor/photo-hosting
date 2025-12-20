interface Session {
  userId: number
  email: string
}

const SESSION_KEY = 'session'

export const sessionService = {
  saveSession(session: Session): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  },

  getSession(): Session | null {
    const data = localStorage.getItem(SESSION_KEY)

    return data ? JSON.parse(data) : null
  },

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY)
  }
}
