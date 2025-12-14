import { authService } from './authService'
import { db } from '../db'
import { crypto } from '../utils/crypto'

jest.mock('../db', () => ({
  db: {
    users: {
      add: jest.fn(),
      where: jest.fn()
    }
  }
}))

jest.mock('../utils/crypto', () => ({
  crypto: {
    hashPassword: jest.fn(),
    verifyPassword: jest.fn()
  }
}))

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    test('returns user on successful login', async () => {
      const mockUser = { id: 1, email: 'test@example.com', passwordHash: 'hash123', createdAt: new Date() }

      ;(db.users.where as jest.Mock).mockReturnValue({
        equals: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(mockUser)
        })
      })
      ;(crypto.verifyPassword as jest.Mock).mockResolvedValue(true)

      const result = await authService.login('test@example.com', 'password123')

      expect(result).toEqual(mockUser)
    })

    test('returns null when user not found', async () => {
      ;(db.users.where as jest.Mock).mockReturnValue({
        equals: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(undefined)
        })
      })

      const result = await authService.login('test@example.com', 'password123')

      expect(result).toBeNull()
    })

    test('returns null when password is invalid', async () => {
      const mockUser = { id: 1, email: 'test@example.com', passwordHash: 'hash123', createdAt: new Date() }

      ;(db.users.where as jest.Mock).mockReturnValue({
        equals: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(mockUser)
        })
      })
      ;(crypto.verifyPassword as jest.Mock).mockResolvedValue(false)

      const result = await authService.login('test@example.com', 'wrongpassword')

      expect(result).toBeNull()
    })
  })

  describe('register', () => {
    test('creates new user successfully', async () => {
      ;(db.users.where as jest.Mock).mockReturnValue({
        equals: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(undefined)
        })
      })
      ;(crypto.hashPassword as jest.Mock).mockResolvedValue('hashedPassword')
      ;(db.users.add as jest.Mock).mockResolvedValue(1)

      const result = await authService.register('test@example.com', 'password123')

      expect(result).toMatchObject({
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        id: 1
      })
      expect(db.users.add).toHaveBeenCalled()
    })

    test('throws error when user already exists', async () => {
      const existingUser = { id: 1, email: 'test@example.com', passwordHash: 'hash123', createdAt: new Date() }

      ;(db.users.where as jest.Mock).mockReturnValue({
        equals: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(existingUser)
        })
      })

      await expect(authService.register('test@example.com', 'password123'))
        .rejects.toThrow('Пользователь с таким email уже существует')
    })
  })

  describe('getUserByEmail', () => {
    test('returns user when found', async () => {
      const mockUser = { id: 1, email: 'test@example.com', passwordHash: 'hash123', createdAt: new Date() }

      ;(db.users.where as jest.Mock).mockReturnValue({
        equals: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(mockUser)
        })
      })

      const result = await authService.getUserByEmail('test@example.com')

      expect(result).toEqual(mockUser)
    })

    test('returns undefined when user not found', async () => {
      ;(db.users.where as jest.Mock).mockReturnValue({
        equals: jest.fn().mockReturnValue({
          first: jest.fn().mockResolvedValue(undefined)
        })
      })

      const result = await authService.getUserByEmail('notfound@example.com')

      expect(result).toBeUndefined()
    })
  })
})
