import { imageService } from './imageService'
import { db } from '../db'

jest.mock('../db', () => ({
  db: {
    images: {
      add: jest.fn(),
      where: jest.fn(),
      delete: jest.fn(),
      get: jest.fn()
    }
  }
}))

describe('imageService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(imageService, 'getImageDimensions').mockResolvedValue({ width: 1920, height: 1080 })
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = jest.fn()
  })

  describe('uploadImage', () => {
    test('uploads image successfully', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

      ;(db.images.add as jest.Mock).mockResolvedValue(1)

      const result = await imageService.uploadImage(1, file)

      expect(result).toBe(1)
      expect(db.images.add).toHaveBeenCalledWith({
        userId: 1,
        file,
        filename: 'test.jpg',
        fileSize: file.size,
        width: 1920,
        height: 1080,
        createdAt: expect.any(Date)
      })
    })
  })

  describe('getImagesByUser', () => {
    test('returns images for user', async () => {
      const mockImages = [
        { id: 1, userId: 1, file: new File([''], 'test1.jpg'), filename: 'test1.jpg', createdAt: new Date() },
        { id: 2, userId: 1, file: new File([''], 'test2.jpg'), filename: 'test2.jpg', createdAt: new Date() }
      ]

      ;(db.images.where as jest.Mock).mockReturnValue({
        equals: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockImages)
        })
      })

      const result = await imageService.getImagesByUser(1)

      expect(result).toEqual(mockImages)
      expect(db.images.where).toHaveBeenCalledWith('userId')
    })
  })

  describe('deleteImage', () => {
    test('deletes image by id', async () => {
      ;(db.images.delete as jest.Mock).mockResolvedValue(undefined)

      await imageService.deleteImage(1)

      expect(db.images.delete).toHaveBeenCalledWith(1)
    })
  })

  describe('getImageById', () => {
    test('returns image by id', async () => {
      const mockImage = { id: 1, userId: 1, file: new File([''], 'test.jpg'), filename: 'test.jpg', createdAt: new Date() }

      ;(db.images.get as jest.Mock) = jest.fn().mockResolvedValue(mockImage)

      const result = await imageService.getImageById(1)

      expect(result).toEqual(mockImage)
      expect(db.images.get).toHaveBeenCalledWith(1)
    })

    test('returns undefined when image not found', async () => {
      ;(db.images.get as jest.Mock) = jest.fn().mockResolvedValue(undefined)

      const result = await imageService.getImageById(999)

      expect(result).toBeUndefined()
    })
  })
})
