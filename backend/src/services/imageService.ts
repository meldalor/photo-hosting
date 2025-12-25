import { nanoid } from 'nanoid'
import { ImageModel } from '../models/Image'
import { ImageProcessor } from '../utils/imageProcessor'
import { ImageWithVariants } from '../types'

export class ImageService {
  static async uploadImage(
    userId: number,
    file: Express.Multer.File,
    isPublic: boolean = false,
    customFilename?: string
  ): Promise<ImageWithVariants> {
    const imageId = nanoid(8)

    const { variants, originalWidth, originalHeight } = await ImageProcessor.processImage(
      imageId,
      file.buffer,
      file.originalname
    )

    const originalVariant = variants.find(v => v.variant_type === 'original')
    if (!originalVariant) {
      throw new Error('Failed to process original image')
    }

    let displayFilename = file.originalname
    if (customFilename) {
      displayFilename = customFilename
        // eslint-disable-next-line no-control-regex
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .trim()
        .substring(0, 255)

      if (!displayFilename) {
        displayFilename = file.originalname
      }
    }

    const image = ImageModel.create({
      id: imageId,
      user_id: userId,
      filename: displayFilename,
      original_filename: file.originalname,
      file_size: originalVariant.file_size,
      width: originalWidth,
      height: originalHeight,
      is_public: isPublic
    })

    for (const variant of variants) {
      ImageModel.createVariant(variant)
    }

    return {
      ...image,
      variants
    }
  }

  static async getImageById(imageId: string): Promise<ImageWithVariants | undefined> {
    return ImageModel.findByIdWithVariants(imageId)
  }

  static async getUserImages(userId: number, isPublic?: boolean): Promise<ImageWithVariants[]> {
    return ImageModel.findByUserId(userId, isPublic)
  }

  static async getPublicImages(limit: number = 100): Promise<ImageWithVariants[]> {
    return ImageModel.findPublicImages(limit)
  }

  static async updateImage(
    imageId: string,
    userId: number,
    updates: { filename?: string; isPublic?: boolean }
  ): Promise<ImageWithVariants> {
    if (!ImageModel.isOwner(imageId, userId)) {
      throw new Error('У вас нет прав на редактирование этого изображения')
    }

    const updatedImage = ImageModel.update(imageId, {
      filename: updates.filename,
      is_public: updates.isPublic
    })

    if (!updatedImage) {
      throw new Error('Изображение не найдено')
    }

    return ImageModel.findByIdWithVariants(imageId)!
  }

  static async cropImage(
    imageId: string,
    userId: number,
    cropData: { x: number; y: number; width: number; height: number }
  ): Promise<ImageWithVariants> {
    if (!ImageModel.isOwner(imageId, userId)) {
      throw new Error('У вас нет прав на редактирование этого изображения')
    }

    const image = ImageModel.findById(imageId)
    if (!image) {
      throw new Error('Изображение не найдено')
    }

    await ImageProcessor.cropImage(imageId, 'original', cropData)
    await ImageProcessor.cropImage(imageId, 'medium', cropData)
    await ImageProcessor.cropImage(imageId, 'thumbnail', cropData)

return ImageModel.findByIdWithVariants(imageId)!
  }

  static async deleteImage(imageId: string, userId: number): Promise<void> {
    if (!ImageModel.isOwner(imageId, userId)) {
      throw new Error('У вас нет прав на удаление этого изображения')
    }

    await ImageProcessor.deleteImageFiles(imageId)

    ImageModel.delete(imageId)
  }

  static async searchPublicImage(imageId: string): Promise<ImageWithVariants | undefined> {
    const image = ImageModel.findByIdWithVariants(imageId)

    if (!image || !image.is_public) {
      return undefined
    }

    return image
  }

  static canAccess(image: ImageWithVariants, userId?: number): boolean {
    if (image.is_public) return true

    if (userId && image.user_id === userId) return true

    return false
  }
}
