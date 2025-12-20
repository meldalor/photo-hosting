import { sessionService } from './sessionService'

describe('sessionService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveSession', () => {
    test('saves session to localStorage', () => {
      const session = { userId: 1, email: 'test@example.com' }

      sessionService.saveSession(session)

      const stored = localStorage.getItem('session')

      expect(stored).toBe(JSON.stringify(session))
    })
  })

  describe('getSession', () => {
    test('returns session from localStorage', () => {
      const session = { userId: 1, email: 'test@example.com' }

      localStorage.setItem('session', JSON.stringify(session))

      const result = sessionService.getSession()

      expect(result).toEqual(session)
    })

    test('returns null when no session exists', () => {
      const result = sessionService.getSession()

      expect(result).toBeNull()
    })
  })

  describe('clearSession', () => {
    test('removes session from localStorage', () => {
      localStorage.setItem('session', JSON.stringify({ userId: 1, email: 'test@example.com' }))

      sessionService.clearSession()

      expect(localStorage.getItem('session')).toBeNull()
    })
  })
})
