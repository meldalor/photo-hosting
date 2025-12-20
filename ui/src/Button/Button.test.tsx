import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { Button } from './Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders with different button types', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>)

    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit')

    rerender(<Button type="reset">Reset</Button>)
    expect(screen.getByText('Reset')).toHaveAttribute('type', 'reset')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="filled">Filled</Button>)

    expect(screen.getByText('Filled')).toHaveClass('md3-button--filled')

    rerender(<Button variant="outlined">Outlined</Button>)
    expect(screen.getByText('Outlined')).toHaveClass('md3-button--outlined')

    rerender(<Button variant="text">Text</Button>)
    expect(screen.getByText('Text')).toHaveClass('md3-button--text')

    rerender(<Button variant="elevated">Elevated</Button>)
    expect(screen.getByText('Elevated')).toHaveClass('md3-button--elevated')

    rerender(<Button variant="tonal">Tonal</Button>)
    expect(screen.getByText('Tonal')).toHaveClass('md3-button--tonal')
  })

  it('supports legacy variant prop for backward compatibility', () => {
    const { rerender } = render(<Button legacyVariant="primary">Primary</Button>)

    expect(screen.getByText('Primary')).toHaveClass('md3-button--filled')

    rerender(<Button legacyVariant="secondary">Secondary</Button>)
    expect(screen.getByText('Secondary')).toHaveClass('md3-button--outlined')

    rerender(<Button legacyVariant="danger">Danger</Button>)
    expect(screen.getByText('Danger')).toHaveClass('md3-button--filled')
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick} disabled>Disabled</Button>)

    await user.click(screen.getByText('Disabled'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
