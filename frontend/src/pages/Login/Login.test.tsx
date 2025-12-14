import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { Login } from './Login'
import { SessionContext } from '../../context/SessionContext'

const mockNavigate = jest.fn()
const mockLogin = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockContextValue = {
    session: null,
    loading: false,
    login: mockLogin,
    logout: jest.fn(),
    register: jest.fn()
  }

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Login />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByRole('heading', { name: 'Вход' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Электронная почта')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument()
  })

  test('handles successful login', async () => {
    mockLogin.mockResolvedValue(undefined)

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Login />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByRole('button', { name: 'Вход' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockNavigate).toHaveBeenCalledWith('/gallery')
    })
  })

  test('displays error on failed login', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Login />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByRole('button', { name: 'Вход' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  test('shows loading state during login', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Login />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByRole('button', { name: 'Вход' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Вход...')).toBeInTheDocument()
    })
  })

  test('renders register link', () => {
    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Login />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument()
  })
})
