import { render, screen } from '@testing-library/react'

import { PhotoCard } from './PhotoCard'

describe('PhotoCard', () => {
  const mockProps = {
    title: 'Test Photo',
    description: 'This is a test description',
    author: 'John Doe',
    uploadDate: '2025-01-15',
  }

  test('renders all required fields', () => {
    render(<PhotoCard {...mockProps} />)

    expect(screen.getByText('Test Photo')).toBeInTheDocument()
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
    expect(screen.getByText('Автор: John Doe')).toBeInTheDocument()
    expect(screen.getByText('Дата: 2025-01-15')).toBeInTheDocument()
  })

  test('renders image when imageUrl is provided', () => {
    const propsWithImage = {
      ...mockProps,
      imageUrl: 'https://example.com/image.jpg',
    }

    render(<PhotoCard {...propsWithImage} />)

    const image = screen.getByAltText('Test Photo')

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  test('does not render image when imageUrl is not provided', () => {
    render(<PhotoCard {...mockProps} />)

    const image = screen.queryByRole('img')

    expect(image).not.toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(
      <PhotoCard {...mockProps} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('photo-card')
    expect(container.firstChild).toHaveClass('custom-class')
  })

  test('renders without custom className', () => {
    const { container } = render(<PhotoCard {...mockProps} />)

    expect(container.firstChild).toHaveClass('photo-card')
  })

  test('renders all meta information correctly', () => {
    render(<PhotoCard {...mockProps} />)

    const authorElement = screen.getByText(/Автор:/)
    const dateElement = screen.getByText(/Дата:/)

    expect(authorElement).toBeInTheDocument()
    expect(dateElement).toBeInTheDocument()
  })

  test('renders with different data', () => {
    const differentProps = {
      title: 'Mountain View',
      description: 'Beautiful mountain landscape',
      author: 'Jane Smith',
      uploadDate: '2025-11-17',
      imageUrl: 'https://example.com/mountain.jpg',
    }

    render(<PhotoCard {...differentProps} />)

    expect(screen.getByText('Mountain View')).toBeInTheDocument()
    expect(screen.getByText('Beautiful mountain landscape')).toBeInTheDocument()
    expect(screen.getByText('Автор: Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Дата: 2025-11-17')).toBeInTheDocument()
  })
})
