import { ImageLikeModel } from '../models/ImageLike'
import { ImageModel } from '../models/Image'
import type { ImageWithVariants } from '../types'

export class ImageLikesService {
  
  static async toggleLike(userId: number, imageId: string): Promise<{ liked: boolean; likeCount: number }> {
    const image = ImageModel.findById(imageId)
    if (!image) {
      throw new Error('Изображение не найдено')
    }

    if (!image.is_public && image.user_id !== userId) {
      throw new Error('Нельзя лайкнуть приватное изображение')
    }

    const isLiked = ImageLikeModel.exists(userId, imageId)

    if (isLiked) {
      ImageLikeModel.delete(userId, imageId)
    } else {
      ImageLikeModel.create(userId, imageId)
    }

    const likeCount = ImageLikeModel.getLikeCount(imageId)

    return {
      liked: !isLiked,
      likeCount
    }
  }

static async getLikeStatus(userId: number, imageId: string): Promise<{ isLiked: boolean; likeCount: number }> {
    const isLiked = ImageLikeModel.isLiked(userId, imageId)
    const likeCount = ImageLikeModel.getLikeCount(imageId)

    return { isLiked, likeCount }
  }

static async getLikeCounts(imageIds: string[]): Promise<Record<string, number>> {
    return ImageLikeModel.getLikeCounts(imageIds)
  }

static async getLikeStatuses(userId: number, imageIds: string[]): Promise<Record<string, boolean>> {
    return ImageLikeModel.getLikeStatuses(userId, imageIds)
  }

static async getLikedImages(userId: number): Promise<ImageWithVariants[]> {
    const likedImageIds = ImageLikeModel.getLikedImageIds(userId)
    const images: ImageWithVariants[] = []

    for (const imageId of likedImageIds) {
      const image = ImageModel.findByIdWithVariants(imageId)
      if (image) {
        images.push(image)
      }
    }

    return images
  }
}
