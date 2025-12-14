import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { PhotoDetail } from './PhotoDetail'
import { SessionProvider } from '../../context/SessionProvider'
import { imageService } from '../../services/imageService'
import { sessionService } from '../../services/sessionService'
import '@testing-library/jest-dom'

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn()
}))

jest.mock('../../services/imageService', () => ({
  imageService: {
    getImageById: jest.fn()
  }
}))

jest.mock('../../services/sessionService', () => ({
  sessionService: {
    getSession: jest.fn(),
    saveSession: jest.fn(),
    clearSession: jest.fn()
  }
}))

const mockNavigate = jest.fn()
const mockUseParams = jest.requireMock('react-router-dom').useParams

describe('PhotoDetail', () => {
  const mockSession = {
    userId: 1,
    email: 'test@example.com'
  }

  const mockImage = {
    id: 1,
    userId: 1,
    file: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
    filename: 'test.jpg',
    fileSize: 1024 * 1024,
    width: 1920,
    height: 1080,
    createdAt: new Date('2024-01-01')
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.requireMock('react-router-dom').useNavigate.mockReturnValue(mockNavigate)
    ;(sessionService.getSession as jest.Mock).mockReturnValue(mockSession)
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = jest.fn()
  })

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <SessionProvider>
          {component}
        </SessionProvider>
      </BrowserRouter>
    )
  }

  test('displays loader while loading', () => {
    mockUseParams.mockReturnValue({ id: '1' })
    ;(imageService.getImageById as jest.Mock).mockImplementation(() => new Promise(() => {}))

    const { container } = renderWithProviders(<PhotoDetail />)

    expect(container.querySelector('.loader')).toBeInTheDocument()
  })

  test('displays error when image ID is missing', async () => {
    mockUseParams.mockReturnValue({})
    ;(imageService.getImageById as jest.Mock).mockResolvedValue(mockImage)

    renderWithProviders(<PhotoDetail />)

    await waitFor(() => {
      expect(screen.getByText('Missing image ID or session')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('displays error when image not found', async () => {
    mockUseParams.mockReturnValue({ id: '1' })
    ;(imageService.getImageById as jest.Mock).mockResolvedValue(undefined)

    renderWithProviders(<PhotoDetail />)

    await waitFor(() => {
      expect(screen.getByText('Image not found')).toBeInTheDocument()
    })
  })

  test('displays error when user does not have permission', async () => {
    mockUseParams.mockReturnValue({ id: '1' })
    const unauthorizedImage = { ...mockImage, userId: 2 }

    ;(imageService.getImageById as jest.Mock).mockResolvedValue(unauthorizedImage)

    renderWithProviders(<PhotoDetail />)

    await waitFor(() => {
      expect(screen.getByText('You do not have permission to view this image')).toBeInTheDocument()
    })
  })

  test('displays image and metadata when loaded successfully', async () => {
    mockUseParams.mockReturnValue({ id: '1' })
    ;(imageService.getImageById as jest.Mock).mockResolvedValue(mockImage)

    renderWithProviders(<PhotoDetail />)

    await waitFor(() => {
      expect(screen.getByAltText('test.jpg')).toBeInTheDocument()
    }, { timeout: 3000 })

    expect(screen.getByText('test.jpg')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('1920 × 1080 px')).toBeInTheDocument()
    expect(screen.getByText('1.00 MB')).toBeInTheDocument()
  })

  test('handles error during image loading', async () => {
    mockUseParams.mockReturnValue({ id: '1' })
    ;(imageService.getImageById as jest.Mock).mockRejectedValue(new Error('Network error'))

    renderWithProviders(<PhotoDetail />)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  test('navigates back to gallery when back button is clicked', async () => {
    mockUseParams.mockReturnValue({ id: '1' })
    ;(imageService.getImageById as jest.Mock).mockResolvedValue(mockImage)

    renderWithProviders(<PhotoDetail />)

    await waitFor(() => {
      expect(screen.getByAltText('test.jpg')).toBeInTheDocument()
    }, { timeout: 3000 })

    const backButton = screen.getAllByText('Назад в галерею')[0]

    backButton.click()

    expect(mockNavigate).toHaveBeenCalledWith('/gallery')
  })

  test('revokes object URL on cleanup', async () => {
    mockUseParams.mockReturnValue({ id: '1' })
    ;(imageService.getImageById as jest.Mock).mockResolvedValue(mockImage)

    const { unmount } = renderWithProviders(<PhotoDetail />)

    await waitFor(() => {
      expect(screen.getByAltText('test.jpg')).toBeInTheDocument()
    }, { timeout: 3000 })

    unmount()

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })
})
