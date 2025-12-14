import { StrictMode } from 'react'

import * as ReactDOM from 'react-dom/client'

import App from './App'

describe('main.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = '<div id="root"></div>'
  })

  it('should render App component in StrictMode', async () => {
    const mockRender = jest.fn()
    const mockCreateRoot = jest.fn(() => ({
      render: mockRender,
      unmount: jest.fn(),
    }))

    jest.spyOn(ReactDOM, 'createRoot').mockImplementation(mockCreateRoot)

    await import('./main.tsx')

    const rootElement = document.getElementById('root')

    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement)

    expect(mockRender).toHaveBeenCalledTimes(1)

    const renderCall = mockRender.mock.calls[0][0]

    expect(renderCall.type).toBe(StrictMode)
    expect(renderCall.props.children.type).toBe(App)
  })
})
