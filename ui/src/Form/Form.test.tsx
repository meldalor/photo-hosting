import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

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

  it('calls onSubmit when form is submitted', async () => {
    const handleSubmit = jest.fn((e) => e.preventDefault())
    const user = userEvent.setup()

    render(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>
    )

    await user.click(screen.getByText('Submit'))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders multiple children', () => {
    render(
      <Form onSubmit={() => {}}>
        <input placeholder="Field 1" />
        <input placeholder="Field 2" />
        <button>Submit</button>
      </Form>
    )

    expect(screen.getByPlaceholderText('Field 1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Field 2')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })
})
