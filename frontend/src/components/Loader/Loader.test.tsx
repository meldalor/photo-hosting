import { render } from '@testing-library/react'

import { Loader } from './Loader'

describe('Loader', () => {
  test('renders loader component', () => {
    const { container } = render(<Loader />)

    expect(container.querySelector('.loader')).toBeInTheDocument()
    expect(container.querySelector('.spinner')).toBeInTheDocument()
  })

  test('renders a div container', () => {
    const { container } = render(<Loader />)

    expect(container.querySelector('div')).toBeInTheDocument()
  })
})
