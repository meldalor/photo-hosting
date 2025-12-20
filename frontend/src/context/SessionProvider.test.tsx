import { renderHook, act, waitFor } from '@testing-library/react'

import { useSession } from './SessionContext'
import { SessionProvider } from './SessionProvider'
import { authService } from '../services/authService'
import { sessionService } from '../services/sessionService'

jest.mock('../services/authService')
jest.mock('../services/sessionService')

describe('SessionProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(sessionService.getSession as jest.Mock).mockReturnValue(null)
  })

  test('initializes with no session', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    )

    const { result } = renderHook(() => useSession(), { wrapper })

    expect(result.current.session).toBeNull()
  })

  test('loads saved session on mount', async () => {
    const savedSession = { userId: 1, email: 'test@example.com' }

    ;(sessionService.getSession as jest.Mock).mockReturnValue(savedSession)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    )

    const { result } = renderHook(() => useSession(), { wrapper })

    await waitFor(() => {
      expect(result.current.session).toEqual(savedSession)
    })
  })

  test('login successfully updates session', async () => {
    const user = { id: 1, email: 'test@example.com', passwordHash: 'hash', createdAt: new Date() }

    ;(authService.login as jest.Mock).mockResolvedValue(user)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    )

    const { result } = renderHook(() => useSession(), { wrapper })

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    expect(result.current.session).toEqual({ userId: 1, email: 'test@example.com' })
    expect(sessionService.saveSession).toHaveBeenCalledWith({ userId: 1, email: 'test@example.com' })
  })

  test('login throws error on invalid credentials', async () => {
    ;(authService.login as jest.Mock).mockResolvedValue(null)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    )

    const { result } = renderHook(() => useSession(), { wrapper })

    await expect(
      act(async () => {
        await result.current.login('test@example.com', 'wrongpassword')
      })
    ).rejects.toThrow('Неверный email или пароль')
  })

  test('logout clears session', async () => {
    const savedSession = { userId: 1, email: 'test@example.com' }

    ;(sessionService.getSession as jest.Mock).mockReturnValue(savedSession)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    )

    const { result } = renderHook(() => useSession(), { wrapper })

    await waitFor(() => {
      expect(result.current.session).toEqual(savedSession)
    })

    act(() => {
      result.current.logout()
    })

    expect(result.current.session).toBeNull()
    expect(sessionService.clearSession).toHaveBeenCalled()
  })

  test('register successfully creates session', async () => {
    const user = { id: 1, email: 'new@example.com', passwordHash: 'hash', createdAt: new Date() }

    ;(authService.register as jest.Mock).mockResolvedValue(user)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    )

    const { result } = renderHook(() => useSession(), { wrapper })

    await act(async () => {
      await result.current.register('new@example.com', 'password')
    })

    expect(result.current.session).toEqual({ userId: 1, email: 'new@example.com' })
    expect(sessionService.saveSession).toHaveBeenCalledWith({ userId: 1, email: 'new@example.com' })
  })

  test('register throws error when id is missing', async () => {
    ;(authService.register as jest.Mock).mockResolvedValue({ email: 'test@example.com', passwordHash: 'hash' })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionProvider>{children}</SessionProvider>
    )

    const { result } = renderHook(() => useSession(), { wrapper })

    await expect(
      act(async () => {
        await result.current.register('test@example.com', 'password')
      })
    ).rejects.toThrow('Ошибка регистрации')
  })
})
