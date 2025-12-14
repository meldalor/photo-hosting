import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

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

  test('renders without description if not provided', () => {
    const propsWithoutDesc = {
      title: 'Test Photo',
      author: 'John Doe',
      uploadDate: '2025-01-15',
    }

    render(<PhotoCard {...propsWithoutDesc} />)

    expect(screen.getByText('Test Photo')).toBeInTheDocument()
    expect(screen.queryByText('This is a test description')).not.toBeInTheDocument()
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

  test('renders delete button when onDelete is provided', () => {
    const handleDelete = jest.fn()

    render(<PhotoCard {...mockProps} onDelete={handleDelete} />)

    expect(screen.getByText('Удалить')).toBeInTheDocument()
  })

  test('does not render delete button when onDelete is not provided', () => {
    render(<PhotoCard {...mockProps} />)

    expect(screen.queryByText('Удалить')).not.toBeInTheDocument()
  })

  test('calls onDelete when delete button is clicked', async () => {
    const handleDelete = jest.fn()
    const user = userEvent.setup()

    render(<PhotoCard {...mockProps} onDelete={handleDelete} />)

    await user.click(screen.getByText('Удалить'))
    expect(handleDelete).toHaveBeenCalledTimes(1)
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

  test('formats file size in bytes correctly', () => {
    const propsWithSize = {
      ...mockProps,
      fileSize: 512,
    }

    render(<PhotoCard {...propsWithSize} />)

    expect(screen.getByText(/Размер: 512 B/)).toBeInTheDocument()
  })

  test('formats file size in kilobytes correctly', () => {
    const propsWithSize = {
      ...mockProps,
      fileSize: 2048,
    }

    render(<PhotoCard {...propsWithSize} />)

    expect(screen.getByText(/Размер: 2.0 KB/)).toBeInTheDocument()
  })

  test('formats file size in megabytes correctly', () => {
    const propsWithSize = {
      ...mockProps,
      fileSize: 5 * 1024 * 1024,
    }

    render(<PhotoCard {...propsWithSize} />)

    expect(screen.getByText(/Размер: 5.0 MB/)).toBeInTheDocument()
  })

  test('renders resolution when width and height are provided', () => {
    const propsWithResolution = {
      ...mockProps,
      width: 1920,
      height: 1080,
    }

    render(<PhotoCard {...propsWithResolution} />)

    expect(screen.getByText(/Разрешение: 1920 × 1080/)).toBeInTheDocument()
  })

  test('does not render resolution when width or height are not provided', () => {
    render(<PhotoCard {...mockProps} />)

    expect(screen.queryByText(/Разрешение:/)).not.toBeInTheDocument()
  })

  test('calls onClick when image is clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    const propsWithImage = {
      ...mockProps,
      imageUrl: 'https://example.com/image.jpg',
      onClick: handleClick,
    }

    render(<PhotoCard {...propsWithImage} />)

    const image = screen.getByAltText('Test Photo')

    await user.click(image)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('sets cursor style to pointer when onClick is provided', () => {
    const handleClick = jest.fn()

    const propsWithImage = {
      ...mockProps,
      imageUrl: 'https://example.com/image.jpg',
      onClick: handleClick,
    }

    render(<PhotoCard {...propsWithImage} />)

    const image = screen.getByAltText('Test Photo')

    expect(image).toHaveStyle({ cursor: 'pointer' })
  })

  test('sets cursor style to default when onClick is not provided', () => {
    const propsWithImage = {
      ...mockProps,
      imageUrl: 'https://example.com/image.jpg',
    }

    render(<PhotoCard {...propsWithImage} />)

    const image = screen.getByAltText('Test Photo')

    expect(image).toHaveStyle({ cursor: 'default' })
  })
})
