import client from './client'

export interface Image {
  id: string
  userId: number
  filename: string
  originalFilename: string
  fileSize: number
  width: number
  height: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
  variants: ImageVariant[]
}

export interface ImageVariant {
  variantType: 'thumbnail' | 'medium' | 'original'
  filename: string
  width: number
  height: number
  fileSize: number
}

export const imagesApi = {
  async upload(formData: FormData) {
    const response = await client.post<Image>('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  async getMyImages(isPublic?: boolean) {
    const params = isPublic !== undefined ? { isPublic } : {}
    const response = await client.get<Image[]>('/images', { params })

    return response.data
  },

  async getById(id: string) {
    const response = await client.get<Image>(`/images/${id}`)

    return response.data
  },

  async update(id: string, data: { filename?: string; isPublic?: boolean }) {
    const response = await client.patch<Image>(`/images/${id}`, data)

    return response.data
  },

  async crop(id: string, cropData: { x: number; y: number; width: number; height: number }) {
    const response = await client.patch<Image>(`/images/${id}/crop`, cropData)

    return response.data
  },

  async delete(id: string) {
    await client.delete(`/images/${id}`)
  },

  getDownloadUrl(id: string, variant: 'thumbnail' | 'medium' | 'original') {
    return `/api/images/${id}/download/${variant}`
  },

  async downloadImage(id: string, variant: 'thumbnail' | 'medium' | 'original') {
    const response = await client.get(`/images/${id}/download/${variant}`, {
      responseType: 'blob'
    })

    return response.data
  },

  async searchPublic(imageId: string) {
    const response = await client.get<Image>(`/images/search/${imageId}`)

    return response.data
  }
}
