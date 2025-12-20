import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import { Upload } from './Upload'
import { SessionContext } from '../../context/SessionContext'
import { imageService } from '../../services/imageService'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/upload' })
}))

jest.mock('../../services/imageService', () => ({
  imageService: {
    uploadImage: jest.fn()
  }
}))

describe('Upload', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    class MockFileReader {
      onloadend: ((event: { target: { result: string | null } }) => void) | null = null
      result: string | null = null

      readAsDataURL() {
        this.result = 'data:image/jpeg;base64,fake'
        setTimeout(() => {
          if (this.onloadend) {
            this.onloadend({ target: { result: this.result } })
          }
        }, 0)
      }

      addEventListener() {}
      removeEventListener() {}
    }

    global.FileReader = MockFileReader as unknown as typeof FileReader
    global.URL.createObjectURL = jest.fn(() => 'blob:mock')
  })

  const mockContextValue = {
    session: { userId: 1, email: 'test@example.com' },
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn()
  }

  test('renders upload page', () => {
    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    expect(screen.getByText('Загрузка изображения')).toBeInTheDocument()
    const uploadButtons = screen.getAllByRole('button', { name: /Загрузить/i })

    expect(uploadButtons.length).toBeGreaterThan(0)
  })

  test('handles file selection', async () => {
    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByAltText('Предпросмотр')).toBeInTheDocument()
    })
  })

  test('validates invalid file type', async () => {
    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Пожалуйста, выберите корректный файл изображения/)).toBeInTheDocument()
    })
  })

  test('validates file size', async () => {
    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const largeFile = new File(['a'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [largeFile] } })

    await waitFor(() => {
      expect(screen.getByText(/Размер изображения должен быть меньше 10МБ/)).toBeInTheDocument()
    })
  })

  test('handles successful upload', async () => {
    ;(imageService.uploadImage as jest.Mock).mockResolvedValue(1)

    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByAltText('Предпросмотр')).toBeInTheDocument()
    })

    const uploadButtons = screen.getAllByRole('button', { name: /Загрузить/i })
    const uploadButton = uploadButtons.find(btn => !(btn as HTMLButtonElement).disabled)!

    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(imageService.uploadImage).toHaveBeenCalledWith(1, file)
      expect(mockNavigate).toHaveBeenCalledWith('/gallery')
    })
  })

  test('handles upload error', async () => {
    ;(imageService.uploadImage as jest.Mock).mockRejectedValue(new Error('Ошибка загрузки'))

    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByAltText('Предпросмотр')).toBeInTheDocument()
    })

    const uploadButtons = screen.getAllByRole('button', { name: /Загрузить/i })
    const uploadButton = uploadButtons.find(btn => !(btn as HTMLButtonElement).disabled)!

    fireEvent.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText('Ошибка загрузки')).toBeInTheDocument()
    })
  })

  test('disables upload button when no file selected', () => {
    render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const uploadButtons = screen.getAllByRole('button', { name: /Загрузить/i })
    const mainUploadButton = uploadButtons.find(btn => btn.textContent === 'Загрузить' && btn.getAttribute('data-variant') === 'primary')

    expect(mainUploadButton).toBeDisabled()
  })

  test('handles file deselection', async () => {
    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [] } })

    await waitFor(() => {
      expect(screen.queryByAltText('Preview')).not.toBeInTheDocument()
    })
  })

  test('does not upload when no session', async () => {
    const mockContextNoSession = {
      session: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn()
    }

    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextNoSession}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByAltText('Предпросмотр')).toBeInTheDocument()
    })

    const uploadButtons = screen.getAllByRole('button', { name: /Загрузить/i })
    const mainUploadButton = uploadButtons.find(btn => btn.textContent === 'Загрузить' && btn.getAttribute('data-variant') === 'primary')!

    fireEvent.click(mainUploadButton)

    await new Promise(resolve => setTimeout(resolve, 100))
    expect(imageService.uploadImage).not.toHaveBeenCalled()
  })

  test('shows loading state during upload', async () => {
    ;(imageService.uploadImage as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByAltText('Предпросмотр')).toBeInTheDocument()
    })

    const uploadButtons = screen.getAllByRole('button', { name: /Загрузить/i })
    const mainUploadButton = uploadButtons.find(btn => btn.textContent === 'Загрузить' && btn.getAttribute('data-variant') === 'primary')!

    fireEvent.click(mainUploadButton)

    await waitFor(() => {
      expect(screen.getByText('Загрузка...')).toBeInTheDocument()
    })
  })

  test('disables file input during upload', async () => {
    ;(imageService.uploadImage as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByAltText('Предпросмотр')).toBeInTheDocument()
    })

    const uploadButtons = screen.getAllByRole('button', { name: /Загрузить/i })
    const mainUploadButton = uploadButtons.find(btn => btn.textContent === 'Загрузить' && btn.getAttribute('data-variant') === 'primary')!

    fireEvent.click(mainUploadButton)

    await waitFor(() => {
      expect(fileInput).toBeDisabled()
    })
  })

  test('clears error on new file selection after error', async () => {
    const { container } = render(
      <BrowserRouter>
        <SessionContext.Provider value={mockContextValue}>
          <Upload />
        </SessionContext.Provider>
      </BrowserRouter>
    )

    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [invalidFile] } })

    await waitFor(() => {
      expect(screen.getByText(/Пожалуйста, выберите корректный файл изображения/)).toBeInTheDocument()
    })

    const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

    fireEvent.change(fileInput, { target: { files: [validFile] } })

    await waitFor(() => {
      expect(screen.queryByText(/Пожалуйста, выберите корректный файл изображения/)).not.toBeInTheDocument()
      expect(screen.getByAltText('Предпросмотр')).toBeInTheDocument()
    })
  })
})
