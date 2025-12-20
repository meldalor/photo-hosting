import { Session } from '../types'

const TOKEN_KEY = 'token'

function decodeToken(token: string): Session | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    const payload = JSON.parse(jsonPayload)

    return {
      userId: payload.userId,
      email: payload.email
    }
  } catch {
    return null
  }
}

export const sessionService = {
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getSession(): Session | null {
    const token = this.getToken()

    if (!token) {
      return null
    }

    return decodeToken(token)
  },

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY)
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}
