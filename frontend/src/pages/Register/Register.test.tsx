import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { Register } from './Register'
import { SessionContext } from '../../context/SessionContext'

const mockNavigate = jest.fn()
const mockRegister = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('Register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockContextValue = {
    session: null,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: mockRegister
  }

  test('renders register form', () => {
    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Register />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByRole('heading', { name: 'Регистрация' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Электронная почта')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument()
  })

  test('handles successful registration', async () => {
    mockRegister.mockResolvedValue(undefined)

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Register />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByRole('button', { name: 'Регистрация' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockNavigate).toHaveBeenCalledWith('/gallery')
    })
  })

  test('validates email format', async () => {
    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Register />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const form = screen.getByRole('button', { name: 'Регистрация' }).closest('form')!

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText('Пожалуйста, введите корректный email адрес')).toBeInTheDocument()
      expect(mockRegister).not.toHaveBeenCalled()
    })
  })

  test('validates password length', async () => {
    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Register />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const form = screen.getByRole('button', { name: 'Регистрация' }).closest('form')!

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText('Пароль должен содержать минимум 6 символов')).toBeInTheDocument()
      expect(mockRegister).not.toHaveBeenCalled()
    })
  })

  test('displays error on failed registration', async () => {
    mockRegister.mockRejectedValue(new Error('User already exists'))

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Register />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByRole('button', { name: 'Регистрация' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument()
    })
  })

  test('shows loading state during registration', async () => {
    mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Register />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const submitButton = screen.getByRole('button', { name: 'Регистрация' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Регистрация...')).toBeInTheDocument()
    })
  })

  test('renders login link', () => {
    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Register />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByText('Войти')).toBeInTheDocument()
  })
})
