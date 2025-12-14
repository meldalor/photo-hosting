import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { Header } from './Header'
import { SessionContext } from '../../context/SessionContext'

const mockNavigate = jest.fn()
const mockLogout = jest.fn()
let mockLocation = { pathname: '/gallery' }

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation
}))

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocation = { pathname: '/gallery' }
  })

  test('renders header title', () => {
    const mockContextValue = {
      session: null,
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      register: jest.fn()
    }

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Header />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByText('Фото Галерея')).toBeInTheDocument()
  })

  test('does not render navigation when no session', () => {
    const mockContextValue = {
      session: null,
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      register: jest.fn()
    }

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Header />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.queryByText('Галерея')).not.toBeInTheDocument()
    expect(screen.queryByText('Загрузить')).not.toBeInTheDocument()
  })

  test('renders navigation when session exists', () => {
    const mockContextValue = {
      session: { userId: 1, email: 'test@example.com' },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      register: jest.fn()
    }

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Header />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByText('Галерея')).toBeInTheDocument()
    expect(screen.getByText('Загрузить')).toBeInTheDocument()
    expect(screen.getByText('Пользователь: test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Выход')).toBeInTheDocument()
  })

  test('calls navigate when Gallery button clicked', () => {
    mockLocation = { pathname: '/upload' }

    const mockContextValue = {
      session: { userId: 1, email: 'test@example.com' },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      register: jest.fn()
    }

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Header />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const galleryButton = screen.getByText('Галерея')

    fireEvent.click(galleryButton)

    expect(mockNavigate).toHaveBeenCalledWith('/gallery')
  })

  test('calls navigate when Upload button clicked', () => {
    mockLocation = { pathname: '/gallery' }

    const mockContextValue = {
      session: { userId: 1, email: 'test@example.com' },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      register: jest.fn()
    }

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Header />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const uploadButton = screen.getByText('Загрузить')

    fireEvent.click(uploadButton)

    expect(mockNavigate).toHaveBeenCalledWith('/upload')
  })

  test('calls logout when Logout button clicked', () => {
    const mockContextValue = {
      session: { userId: 1, email: 'test@example.com' },
      loading: false,
      login: jest.fn(),
      logout: mockLogout,
      register: jest.fn()
    }

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Header />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const logoutButton = screen.getByText('Выход')

    fireEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalled()
  })
})
