import { crypto } from './crypto'

describe('crypto', () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        subtle: {
          digest: jest.fn((_algorithm, data) => {
            const encoder = new TextDecoder()
            const password = encoder.decode(data)
            const hashValue = password.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
            const hash = new Uint8Array([hashValue & 0xFF, (hashValue >> 8) & 0xFF, (hashValue >> 16) & 0xFF, (hashValue >> 24) & 0xFF])

            return Promise.resolve(hash.buffer)
          })
        }
      }
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('hashPassword', () => {
    test('hashes password to hex string', async () => {
      const result = await crypto.hashPassword('testpassword')

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    test('calls crypto.subtle.digest with correct parameters', async () => {
      await crypto.hashPassword('test')
      const calls = (globalThis.crypto.subtle.digest as jest.Mock).mock.calls

      expect(calls.length).toBeGreaterThan(0)
      expect(calls[0][0]).toBe('SHA-256')
      expect(calls[0][1].constructor.name).toBe('Uint8Array')
    })
  })

  describe('verifyPassword', () => {
    test('returns true for matching password and hash', async () => {
      const password = 'testpassword'
      const hash = await crypto.hashPassword(password)
      const result = await crypto.verifyPassword(password, hash)

      expect(result).toBe(true)
    })

    test('returns false for non-matching password and hash', async () => {
      const hash = await crypto.hashPassword('password1')
      const result = await crypto.verifyPassword('password2', hash)

      expect(result).toBe(false)
    })
  })
})
