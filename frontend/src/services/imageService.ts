import { db } from '../db'

import type { Image } from '../db/types'

export const imageService = {
  async uploadImage(userId: number, file: File): Promise<number | undefined> {
    const image: Image = {
      userId,
      file,
      filename: file.name,
      createdAt: new Date()
    }

    return await db.images.add(image)
  },

  async getImagesByUser(userId: number): Promise<Image[]> {
    return await db.images.where('userId').equals(userId).toArray()
  },

  async deleteImage(imageId: number): Promise<void> {
    await db.images.delete(imageId)
  }
}
