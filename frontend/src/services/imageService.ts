import { db } from '../db'

import type { Image } from '../db/types'

export const imageService = {
  async uploadImage(userId: number, file: File): Promise<number | undefined> {
    const dimensions = await this.getImageDimensions(file)

    const image: Image = {
      userId,
      file,
      filename: file.name,
      fileSize: file.size,
      width: dimensions.width,
      height: dimensions.height,
      createdAt: new Date()
    }

    return await db.images.add(image)
  },

  async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.width, height: img.height })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image'))
      }

      img.src = url
    })
  },

  async getImagesByUser(userId: number): Promise<Image[]> {
    return await db.images.where('userId').equals(userId).toArray()
  },

  async deleteImage(imageId: number): Promise<void> {
    await db.images.delete(imageId)
  },

  async getImageById(imageId: number): Promise<Image | undefined> {
    return await db.images.get(imageId)
  }
}
