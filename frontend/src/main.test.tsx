import { StrictMode } from 'react'

const mockRender = jest.fn()
const mockCreateRoot = jest.fn(() => ({
  render: mockRender,
  unmount: jest.fn(),
}))

jest.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}))

describe('main.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = '<div id="root"></div>'
  })

  it('should render App component in StrictMode', async () => {
    const { default: App } = await import('./App')

    await import('./main.tsx')

    const rootElement = document.getElementById('root')

    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement)

    expect(mockRender).toHaveBeenCalledTimes(1)

    const renderCall = mockRender.mock.calls[0][0]

    expect(renderCall.type).toBe(StrictMode)
    expect(renderCall.props.children.type).toBe(App)
  })
})
