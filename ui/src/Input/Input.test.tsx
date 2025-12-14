import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { Input } from './Input'

describe('Input', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()

    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')

    await user.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('renders with different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />)

    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Password" />)
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')
  })

  it('renders with name attribute', () => {
    render(<Input name="username" placeholder="Username" />)
    expect(screen.getByPlaceholderText('Username')).toHaveAttribute('name', 'username')
  })

  it('can be required', () => {
    render(<Input required placeholder="Required field" />)
    expect(screen.getByPlaceholderText('Required field')).toBeRequired()
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled field" />)
    expect(screen.getByPlaceholderText('Disabled field')).toBeDisabled()
  })

  it('renders with controlled value', () => {
    render(<Input value="controlled value" onChange={() => {}} />)
    expect(screen.getByDisplayValue('controlled value')).toBeInTheDocument()
  })
})
