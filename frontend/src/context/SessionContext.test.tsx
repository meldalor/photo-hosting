import { renderHook } from '@testing-library/react'

import { useSession, SessionContext } from './SessionContext'

describe('SessionContext', () => {
  test('useSession throws error when used outside provider', () => {
    expect(() => {
      renderHook(() => useSession())
    }).toThrow('useSession должен использоваться внутри SessionProvider')
  })

  test('useSession returns context when used within provider', () => {
    const mockContextValue = {
      session: { userId: 1, email: 'test@example.com' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SessionContext.Provider value={mockContextValue}>
        {children}
      </SessionContext.Provider>
    )

    const { result } = renderHook(() => useSession(), { wrapper })

    expect(result.current).toEqual(mockContextValue)
  })
})
