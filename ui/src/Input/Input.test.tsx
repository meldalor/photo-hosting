import { render, screen } from '@testing-library/react'

import { Input } from './Input'

describe('Input', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })
})
