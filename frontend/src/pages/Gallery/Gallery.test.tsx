import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { Gallery } from './Gallery'
import { SessionContext } from '../../context/SessionContext'
import { imageService } from '../../services/imageService'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/gallery' })
}))

jest.mock('../../services/imageService', () => ({
  imageService: {
    getImagesByUser: jest.fn(),
    deleteImage: jest.fn()
  }
}))

describe('Gallery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
    global.confirm = jest.fn()
  })

  const mockContextValue = {
    session: { userId: 1, email: 'test@example.com' },
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn()
  }

  test('renders gallery page', async () => {
    ;(imageService.getImagesByUser as jest.Mock).mockResolvedValue([])

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByText('Моя Галерея')).toBeInTheDocument()

    await waitFor(() => {
      expect(imageService.getImagesByUser).toHaveBeenCalled()
    })
  })

  test('shows loading state', () => {
    ;(imageService.getImagesByUser as jest.Mock).mockImplementation(() => new Promise(() => {}))

    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(container.querySelector('.loader')).toBeInTheDocument()
  })

  test('displays empty state when no images', async () => {
    ;(imageService.getImagesByUser as jest.Mock).mockResolvedValue([])

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/У вас пока нет изображений/)).toBeInTheDocument()
    })
  })

  test('displays images when available', async () => {
    const mockImages = [
      {
        id: 1,
        userId: 1,
        file: new File([''], 'test1.jpg', { type: 'image/jpeg' }),
        filename: 'test1.jpg',
        fileSize: 1024,
        width: 1920,
        height: 1080,
        createdAt: new Date()
      },
      {
        id: 2,
        userId: 1,
        file: new File([''], 'test2.jpg', { type: 'image/jpeg' }),
        filename: 'test2.jpg',
        fileSize: 2048,
        width: 1920,
        height: 1080,
        createdAt: new Date()
      }
    ]

    ;(imageService.getImagesByUser as jest.Mock).mockResolvedValue(mockImages)

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('test1.jpg')).toBeInTheDocument()
      expect(screen.getByText('test2.jpg')).toBeInTheDocument()
    })
  })

  test('handles image deletion with confirmation', async () => {
    const mockImages = [
      {
        id: 1,
        userId: 1,
        file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        filename: 'test.jpg',
        fileSize: 1024,
        width: 1920,
        height: 1080,
        createdAt: new Date()
      }
    ]

    ;(imageService.getImagesByUser as jest.Mock).mockResolvedValue(mockImages)
    ;(global.confirm as jest.Mock).mockReturnValue(true)
    ;(imageService.deleteImage as jest.Mock).mockResolvedValue(undefined)

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Удалить')

    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(imageService.deleteImage).toHaveBeenCalledWith(1)
    })
  })

  test('does not delete image when confirmation cancelled', async () => {
    const mockImages = [
      {
        id: 1,
        userId: 1,
        file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        filename: 'test.jpg',
        fileSize: 1024,
        width: 1920,
        height: 1080,
        createdAt: new Date()
      }
    ]

    ;(imageService.getImagesByUser as jest.Mock).mockResolvedValue(mockImages)
    ;(global.confirm as jest.Mock).mockReturnValue(false)

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Удалить')

    fireEvent.click(deleteButtons[0])

    expect(imageService.deleteImage).not.toHaveBeenCalled()
  })

  test('does not load images when no session', async () => {
    const mockContextValueNoSession = {
      session: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    }

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValueNoSession}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(imageService.getImagesByUser).not.toHaveBeenCalled()
    })
  })

  test('handles error when loading images', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(imageService.getImagesByUser as jest.Mock).mockRejectedValue(new Error('Load failed'))

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Failed to load images:', expect.any(Error))
    })

    consoleError.mockRestore()
  })

  test('handles error when deleting image', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    const mockImages = [
      {
        id: 1,
        userId: 1,
        file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        filename: 'test.jpg',
        fileSize: 1024,
        width: 1920,
        height: 1080,
        createdAt: new Date()
      }
    ]

    ;(imageService.getImagesByUser as jest.Mock).mockResolvedValue(mockImages)
    ;(global.confirm as jest.Mock).mockReturnValue(true)
    ;(imageService.deleteImage as jest.Mock).mockRejectedValue(new Error('Delete failed'))

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Удалить')

    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Failed to delete image:', expect.any(Error))
    })

    consoleError.mockRestore()
  })

  test('does not delete image when id is undefined', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    const mockImages = [
      {
        id: undefined,
        userId: 1,
        file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        filename: 'test.jpg',
        fileSize: 1024,
        width: 1920,
        height: 1080,
        createdAt: new Date()
      }
    ]

    ;(imageService.getImagesByUser as jest.Mock).mockResolvedValue(mockImages)

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Удалить')

    fireEvent.click(deleteButtons[0])

    expect(imageService.deleteImage).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })

  test('navigates to photo detail when image clicked', async () => {
    const mockImages = [
      {
        id: 1,
        userId: 1,
        file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        filename: 'test.jpg',
        fileSize: 1024,
        width: 1920,
        height: 1080,
        createdAt: new Date()
      }
    ]

    ;(imageService.getImagesByUser as jest.Mock).mockResolvedValue(mockImages)

    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Gallery />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument()
    })

    const imageCards = screen.getAllByRole('img')

    fireEvent.click(imageCards[0])

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/photo/1')
    })
  })
})
