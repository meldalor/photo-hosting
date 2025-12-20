import { AlbumModel } from '../models/Album'
import { ImageModel } from '../models/Image'
import { Album, AlbumWithImages } from '../types'

export class AlbumsService {
  static async createAlbum(
    userId: number,
    title: string,
    description?: string,
    isPublic: boolean = false
  ): Promise<Album> {
    if (!title || title.trim().length === 0) {
      throw new Error('Название альбома обязательно')
    }

    return AlbumModel.create(userId, title.trim(), description?.trim(), isPublic)
  }

  static async getAlbumById(albumId: number, userId?: number): Promise<AlbumWithImages> {
    const album = AlbumModel.findByIdWithImages(albumId)

    if (!album) {
      throw new Error('Альбом не найден')
    }

    if (!album.is_public && (!userId || album.user_id !== userId)) {
      throw new Error('Доступ запрещен')
    }

    return album
  }

  static async getUserAlbums(userId: number): Promise<Album[]> {
    return AlbumModel.findByUserId(userId)
  }

  static async updateAlbum(
    albumId: number,
    userId: number,
    updates: { title?: string; description?: string; isPublic?: boolean }
  ): Promise<Album> {
    if (!AlbumModel.isOwner(albumId, userId)) {
      throw new Error('У вас нет прав на редактирование этого альбома')
    }

    if (updates.title !== undefined && updates.title.trim().length === 0) {
      throw new Error('Название альбома не может быть пустым')
    }

    const updatedAlbum = AlbumModel.update(albumId, {
      title: updates.title?.trim(),
      description: updates.description?.trim(),
      is_public: updates.isPublic
    })

    if (!updatedAlbum) {
      throw new Error('Альбом не найден')
    }

    return updatedAlbum
  }

  static async deleteAlbum(albumId: number, userId: number): Promise<void> {
    if (!AlbumModel.isOwner(albumId, userId)) {
      throw new Error('У вас нет прав на удаление этого альбома')
    }

    AlbumModel.delete(albumId)
  }

  static async addImageToAlbum(albumId: number, userId: number, imageId: string): Promise<void> {
    if (!AlbumModel.isOwner(albumId, userId)) {
      throw new Error('У вас нет прав на редактирование этого альбома')
    }

    const image = ImageModel.findById(imageId)

    if (!image) {
      throw new Error('Изображение не найдено')
    }

    if (!image.is_public && image.user_id !== userId) {
      throw new Error('Нельзя добавить в альбом приватное изображение')
    }

    if (AlbumModel.hasImage(albumId, imageId)) {
      throw new Error('Изображение уже в альбоме')
    }

    const position = AlbumModel.getImageCount(albumId)

    AlbumModel.addImage(albumId, imageId, position)
  }

  static async removeImageFromAlbum(
    albumId: number,
    userId: number,
    imageId: string
  ): Promise<void> {
    if (!AlbumModel.isOwner(albumId, userId)) {
      throw new Error('У вас нет прав на редактирование этого альбома')
    }

    if (!AlbumModel.hasImage(albumId, imageId)) {
      throw new Error('Изображение не в альбоме')
    }

    AlbumModel.removeImage(albumId, imageId)
  }
}
