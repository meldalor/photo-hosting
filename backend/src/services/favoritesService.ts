import { FavoriteModel } from '../models/Favorite'
import { ImageModel } from '../models/Image'
import { FavoriteWithImage } from '../types'

export class FavoritesService {
  static async addFavorite(userId: number, imageId: string): Promise<FavoriteWithImage> {
    const image = ImageModel.findById(imageId)

    if (!image) {
      throw new Error('Изображение не найдено')
    }

    if (!image.is_public && image.user_id !== userId) {
      throw new Error('Нельзя добавить в избранное приватное изображение')
    }

    if (FavoriteModel.exists(userId, imageId)) {
      throw new Error('Изображение уже в избранном')
    }

    const favorite = FavoriteModel.create(userId, imageId)

    const imageWithVariants = ImageModel.findByIdWithVariants(imageId)!

    return {
      ...favorite,
      image: imageWithVariants
    }
  }

  static async removeFavorite(userId: number, imageId: string): Promise<void> {
    if (!FavoriteModel.exists(userId, imageId)) {
      throw new Error('Изображение не в избранном')
    }

    FavoriteModel.delete(userId, imageId)
  }

  static async getUserFavorites(userId: number): Promise<FavoriteWithImage[]> {
    return FavoriteModel.findByUserId(userId)
  }

  static async isFavorite(userId: number, imageId: string): Promise<boolean> {
    return FavoriteModel.isFavorite(userId, imageId)
  }
}
