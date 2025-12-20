import { render, screen } from '@testing-library/react'

import { Form } from './Form'

describe('Form', () => {
  it('renders form with children', () => {
    render(
      <Form onSubmit={() => {}}>
        <div>Form content</div>
      </Form>
    )
    expect(screen.getByText('Form content')).toBeInTheDocument()
  })
})
