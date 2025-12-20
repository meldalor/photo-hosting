import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from './ProtectedRoute'
import { SessionContext } from '../context/SessionContext'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>
}))

describe('ProtectedRoute', () => {
  test('redirects to login when no session', () => {
    const mockContextValue = {
      session: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    }

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByText('Navigate to /login')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  test('renders children when session exists', () => {
    const mockContextValue = {
      session: { userId: 1, email: 'test@example.com' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    }

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    expect(screen.queryByText(/Navigate to/)).not.toBeInTheDocument()
  })

  test('shows loader when loading', () => {
    const mockContextValue = {
      session: null,
      loading: true,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    }

    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(container.querySelector('.loader')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
