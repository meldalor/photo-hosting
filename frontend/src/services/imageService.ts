import { imagesApi } from '../api/images.api'
import { Image } from '../types'

export const imageService = {
  async uploadImage(file: File, isPublic: boolean = false, filename?: string): Promise<Image> {
    const formData = new FormData()

    formData.append('image', file)
    formData.append('isPublic', String(isPublic))

    if (filename) {
      formData.append('filename', filename)
    }

    return await imagesApi.upload(formData)
  },

  async getMyImages(isPublic?: boolean): Promise<Image[]> {
    return await imagesApi.getMyImages(isPublic)
  },

  async getImageById(id: string): Promise<Image> {
    return await imagesApi.getById(id)
  },

  async updateImage(id: string, updates: { filename?: string; isPublic?: boolean }): Promise<Image> {
    return await imagesApi.update(id, updates)
  },

  async togglePublic(id: string, isPublic: boolean): Promise<Image> {
    return await imagesApi.update(id, { isPublic })
  },

  async cropImage(id: string, cropData: { x: number; y: number; width: number; height: number }): Promise<Image> {
    return await imagesApi.crop(id, cropData)
  },

  async deleteImage(id: string): Promise<void> {
    return await imagesApi.delete(id)
  },

  getImageUrl(id: string, variant: 'thumbnail' | 'medium' | 'original' = 'medium'): string {
    return imagesApi.getDownloadUrl(id, variant)
  },

  async downloadImageBlob(id: string, variant: 'thumbnail' | 'medium' | 'original' = 'medium'): Promise<string> {
    const blob = await imagesApi.downloadImage(id, variant)

    return URL.createObjectURL(blob)
  },

  async searchPublicImage(imageId: string): Promise<Image> {
    return await imagesApi.searchPublic(imageId)
  }
}
