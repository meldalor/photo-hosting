import { render, screen } from '@testing-library/react'

import { Gallery } from './Gallery'

describe('Gallery', () => {
  test('renders children', () => {
    render(
      <Gallery>
        <div>Child 1</div>
        <div>Child 2</div>
      </Gallery>
    )

    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  test('applies default className', () => {
    const { container } = render(
      <Gallery>
        <div>Test</div>
      </Gallery>
    )

    expect(container.firstChild).toHaveClass('gallery')
  })

  test('applies custom className', () => {
    const { container } = render(
      <Gallery className="custom-gallery">
        <div>Test</div>
      </Gallery>
    )

    expect(container.firstChild).toHaveClass('gallery')
    expect(container.firstChild).toHaveClass('custom-gallery')
  })

  test('renders without custom className', () => {
    const { container } = render(
      <Gallery>
        <div>Test</div>
      </Gallery>
    )

    expect(container.firstChild).toHaveClass('gallery')
  })

  test('renders multiple children correctly', () => {
    render(
      <Gallery>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
      </Gallery>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
    expect(screen.getByText('Item 4')).toBeInTheDocument()
  })

  test('renders with complex children', () => {
    render(
      <Gallery>
        <div>
          <h3>Title</h3>
          <p>Description</p>
        </div>
      </Gallery>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })
})
