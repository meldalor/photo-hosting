import { db } from '../config/database'
import { User } from '../types'

export class UserModel {
  static create(email: string, passwordHash: string): User {
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash)
      VALUES (?, ?)
    `)

    const result = stmt.run(email, passwordHash)

    return {
      id: result.lastInsertRowid as number,
      email,
      password_hash: passwordHash,
      created_at: new Date().toISOString()
    }
  }

  static findByEmail(email: string): User | undefined {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE email = ?
    `)

    return stmt.get(email) as User | undefined
  }

  static findById(id: number): User | undefined {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE id = ?
    `)

    return stmt.get(id) as User | undefined
  }

  static exists(email: string): boolean {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM users WHERE email = ?
    `)

    const result = stmt.get(email) as { count: number }
    return result.count > 0
  }
}
