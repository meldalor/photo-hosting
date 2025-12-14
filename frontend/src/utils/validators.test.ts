import { validators } from './validators'

describe('validators', () => {
  describe('isValidEmail', () => {
    test('returns true for valid email', () => {
      expect(validators.isValidEmail('test@example.com')).toBe(true)
      expect(validators.isValidEmail('user.name@domain.co.uk')).toBe(true)
    })

    test('returns false for invalid email', () => {
      expect(validators.isValidEmail('invalid')).toBe(false)
      expect(validators.isValidEmail('test@')).toBe(false)
      expect(validators.isValidEmail('@example.com')).toBe(false)
      expect(validators.isValidEmail('test@example')).toBe(false)
    })
  })

  describe('isValidPassword', () => {
    test('returns true for password with 6+ characters', () => {
      expect(validators.isValidPassword('123456')).toBe(true)
      expect(validators.isValidPassword('longpassword')).toBe(true)
    })

    test('returns false for password with less than 6 characters', () => {
      expect(validators.isValidPassword('12345')).toBe(false)
      expect(validators.isValidPassword('')).toBe(false)
    })
  })

  describe('isValidImageFile', () => {
    test('returns true for valid image types', () => {
      const jpegFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const pngFile = new File([''], 'test.png', { type: 'image/png' })
      const gifFile = new File([''], 'test.gif', { type: 'image/gif' })
      const webpFile = new File([''], 'test.webp', { type: 'image/webp' })

      expect(validators.isValidImageFile(jpegFile)).toBe(true)
      expect(validators.isValidImageFile(pngFile)).toBe(true)
      expect(validators.isValidImageFile(gifFile)).toBe(true)
      expect(validators.isValidImageFile(webpFile)).toBe(true)
    })

    test('returns false for invalid file types', () => {
      const txtFile = new File([''], 'test.txt', { type: 'text/plain' })
      const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' })

      expect(validators.isValidImageFile(txtFile)).toBe(false)
      expect(validators.isValidImageFile(pdfFile)).toBe(false)
    })
  })

  describe('isValidImageSize', () => {
    test('returns true for files within size limit', () => {
      const smallFile = new File(['a'.repeat(1024)], 'small.jpg', { type: 'image/jpeg' })

      expect(validators.isValidImageSize(smallFile)).toBe(true)
    })

    test('returns false for files exceeding size limit', () => {
      const largeFile = new File(['a'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })

      expect(validators.isValidImageSize(largeFile)).toBe(false)
    })

    test('respects custom maxSizeMB parameter', () => {
      const file = new File(['a'.repeat(2 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' })

      expect(validators.isValidImageSize(file, 1)).toBe(false)
      expect(validators.isValidImageSize(file, 3)).toBe(true)
    })
  })
})
