import client from './client'

export const authApi = {
  async register(email: string, password: string) {
    const response = await client.post('/auth/register', { email, password })

    return response.data
  },

  async login(email: string, password: string) {
    const response = await client.post('/auth/login', { email, password })

    return response.data
  },

  async getMe() {
    const response = await client.get('/auth/me')

    return response.data
  }
}
