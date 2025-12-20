import { db } from '../db'
import { crypto } from '../utils/crypto'

import type { User } from '../db/types'

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email)

    if (!user) {
      return null
    }

    const isPasswordValid = await crypto.verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return null
    }

    return user
  },

  async register(email: string, password: string): Promise<User> {
    const existingUser = await this.getUserByEmail(email)

    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует')
    }

    const passwordHash = await crypto.hashPassword(password)
    const user: User = {
      email,
      passwordHash,
      createdAt: new Date()
    }

    const id = await db.users.add(user)

    return { ...user, id: id as number }
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await db.users.where('email').equals(email).first()
  }
}
