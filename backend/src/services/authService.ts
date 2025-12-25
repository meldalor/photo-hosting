import { UserModel } from '../models/User'
import { crypto } from '../utils/crypto'
import { jwtUtils } from '../utils/jwt'
import { validators } from '../utils/validators'
import { User } from '../types'

export class AuthService {
  static async register(email: string, password: string): Promise<{ user: User; token: string }> {
    if (!validators.isValidEmail(email)) {
      throw new Error('Неверный формат email')
    }

    if (!validators.isValidPassword(password)) {
      throw new Error('Пароль должен содержать минимум 6 символов')
    }

    if (UserModel.exists(email)) {
      throw new Error('Пользователь с таким email уже существует')
    }

    const passwordHash = await crypto.hashPassword(password)

    const user = UserModel.create(email, passwordHash)

    const token = jwtUtils.generateToken({
      userId: user.id!,
      email: user.email
    })

    return { user, token }
  }

  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = UserModel.findByEmail(email)

    if (!user) {
      throw new Error('Неверный email или пароль')
    }

    const isPasswordValid = await crypto.verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      throw new Error('Неверный email или пароль')
    }

    const token = jwtUtils.generateToken({
      userId: user.id!,
      email: user.email
    })

    return { user, token }
  }

  static getUserById(userId: number): User | undefined {
    return UserModel.findById(userId)
  }
}
