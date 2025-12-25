import { Request, Response } from 'express'
import { AuthRequest } from '../types'
import { AuthService } from '../services/authService'

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' })
      }

      const { user, token } = await AuthService.register(email, password)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = user

      return res.status(201).json({
        user: userWithoutPassword,
        token
      })
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' })
      }

      const { user, token } = await AuthService.login(email, password)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = user

      return res.status(200).json({
        user: userWithoutPassword,
        token
      })
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message })
    }
  }

  static async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const user = AuthService.getUserById(req.user.userId)

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' })
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = user

      return res.status(200).json(userWithoutPassword)
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }
}
