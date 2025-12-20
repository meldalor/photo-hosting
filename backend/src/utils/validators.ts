export const validators = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isValidPassword(password: string): boolean {
    return password.length >= 6
  },

  isValidImageFile(mimetype: string): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    return validTypes.includes(mimetype)
  },

  isValidImageSize(size: number, maxSize: number): boolean {
    return size <= maxSize
  }
}
