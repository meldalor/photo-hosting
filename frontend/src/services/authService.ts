import { db } from '../db'

import type { User } from '../db/types'

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    console.log('Auth service login stub', email, password)

    return null
  },

  async register(email: string, password: string): Promise<User> {
    console.log('Auth service register stub', email, password)
    const user: User = {
      email,
      passwordHash: password,
      createdAt: new Date()
    }

    return user
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await db.users.where('email').equals(email).first()
  }
}
