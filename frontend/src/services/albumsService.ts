import { albumsApi } from '../api/albums.api'
import { Album, AlbumWithImages } from '../types'

export const albumsService = {
  async getAlbums(): Promise<Album[]> {
    return await albumsApi.getAlbums()
  },

  async getAlbumById(id: number): Promise<AlbumWithImages> {
    return await albumsApi.getAlbumById(id)
  },

  async createAlbum(data: { title: string; description?: string; isPublic?: boolean }): Promise<Album> {
    return await albumsApi.createAlbum(data)
  },

  async updateAlbum(id: number, data: { title?: string; description?: string; isPublic?: boolean }): Promise<Album> {
    return await albumsApi.updateAlbum(id, data)
  },

  async deleteAlbum(id: number): Promise<void> {
    return await albumsApi.deleteAlbum(id)
  },

  async addImageToAlbum(albumId: number, imageId: string): Promise<void> {
    return await albumsApi.addImageToAlbum(albumId, imageId)
  },

  async removeImageFromAlbum(albumId: number, imageId: string): Promise<void> {
    return await albumsApi.removeImageFromAlbum(albumId, imageId)
  }
}
