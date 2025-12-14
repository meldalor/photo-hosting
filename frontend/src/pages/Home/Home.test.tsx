import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { Home } from './Home'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders page title', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    expect(screen.getByText('Фото Хостинг')).toBeInTheDocument()
  })

  test('renders Login and Register buttons', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    expect(screen.getByText('Вход')).toBeInTheDocument()
    expect(screen.getByText('Регистрация')).toBeInTheDocument()
  })

  test('navigates to login page when Login button clicked', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    const loginButton = screen.getByText('Вход')

    fireEvent.click(loginButton)

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  test('navigates to register page when Register button clicked', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    const registerButton = screen.getByText('Регистрация')

    fireEvent.click(registerButton)

    expect(mockNavigate).toHaveBeenCalledWith('/register')
  })
})
