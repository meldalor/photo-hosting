import { authApi } from '../api/auth.api'
import { User } from '../types'

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await authApi.login(email, password)

    localStorage.setItem('token', response.token)

    return response
  },

  async register(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await authApi.register(email, password)

    localStorage.setItem('token', response.token)

    return response
  },

  async getCurrentUser(): Promise<User> {
    return await authApi.getMe()
  },

  logout(): void {
    localStorage.removeItem('token')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}
