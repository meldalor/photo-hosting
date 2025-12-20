import { StrictMode } from 'react'

import * as ReactDOM from 'react-dom/client'

import App from './App'

describe('main.tsx', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    // Setup DOM
    document.body.innerHTML = '<div id="root"></div>'
  })

  it('should render App component in StrictMode', async () => {
    const mockRender = jest.fn()
    const mockCreateRoot = jest.fn(() => ({
      render: mockRender,
      unmount: jest.fn(),
    }))

    // Mock createRoot
    jest.spyOn(ReactDOM, 'createRoot').mockImplementation(mockCreateRoot)

    // Import and execute main.tsx
    await import('./main.tsx')

    // Verify createRoot was called with the root element
    const rootElement = document.getElementById('root')

    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement)

    // Verify render was called
    expect(mockRender).toHaveBeenCalledTimes(1)

    // Verify the rendered element contains StrictMode and App
    const renderCall = mockRender.mock.calls[0][0]

    expect(renderCall.type).toBe(StrictMode)
    expect(renderCall.props.children.type).toBe(App)
  })
})
