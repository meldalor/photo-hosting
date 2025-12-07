export const validators = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
  },

  isValidPassword(password: string): boolean {
    return password.length >= 6
  },

  isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    return validTypes.includes(file.type)
  },

  isValidImageSize(file: File, maxSizeMB = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    return file.size <= maxSizeBytes
  }
}
