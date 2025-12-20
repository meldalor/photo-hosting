import client from './client'
import { Image } from './images.api'

export interface Album {
  id: number
  userId: number
  title: string
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface AlbumWithImages extends Album {
  images: Image[]
  image_count: number
}

export const albumsApi = {
  async getAlbums() {
    const response = await client.get<Album[]>('/albums')

    return response.data
  },

  async getAlbumById(id: number) {
    const response = await client.get<AlbumWithImages>(`/albums/${id}`)

    return response.data
  },

  async createAlbum(data: { title: string; description?: string; isPublic?: boolean }) {
    const response = await client.post<Album>('/albums', data)

    return response.data
  },

  async updateAlbum(id: number, data: { title?: string; description?: string; isPublic?: boolean }) {
    const response = await client.patch<Album>(`/albums/${id}`, data)

    return response.data
  },

  async deleteAlbum(id: number) {
    await client.delete(`/albums/${id}`)
  },

  async addImageToAlbum(albumId: number, imageId: string) {
    await client.post(`/albums/${albumId}/images/${imageId}`)
  },

  async removeImageFromAlbum(albumId: number, imageId: string) {
    await client.delete(`/albums/${albumId}/images/${imageId}`)
  }
}
