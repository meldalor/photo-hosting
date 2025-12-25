import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { env } from '../config/env'
import { ImageVariant } from '../types'

export interface ProcessedImage {
  variants: ImageVariant[]
  originalWidth: number
  originalHeight: number
}

export class ImageProcessor {
  static async processImage(
    imageId: string,
    buffer: Buffer,
    originalFilename: string
  ): Promise<ProcessedImage> {
    const ext = path.extname(originalFilename).toLowerCase() || '.jpg'
    const variants: ImageVariant[] = []

    const metadata = await sharp(buffer).metadata()
    const originalWidth = metadata.width || 0
    const originalHeight = metadata.height || 0

    const originalVariantFilename = `${imageId}${ext}`
    const originalPath = path.join(env.uploadDir, 'original', originalVariantFilename)

    await sharp(buffer)
      .jpeg({ quality: 90, mozjpeg: true })
      .png({ compressionLevel: 8 })
      .webp({ quality: 90 })
      .toFile(originalPath)

    const originalStats = await fs.stat(originalPath)
    variants.push({
      image_id: imageId,
      variant_type: 'original',
      filename: originalVariantFilename,
      width: originalWidth,
      height: originalHeight,
      file_size: originalStats.size
    })

    const mediumFilename = `${imageId}${ext}`
    const mediumPath = path.join(env.uploadDir, 'medium', mediumFilename)

    const mediumImage = sharp(buffer).resize(800, 800, {
      fit: 'inside',
      withoutEnlargement: true
    })

    await mediumImage
      .jpeg({ quality: 85, mozjpeg: true })
      .png({ compressionLevel: 7 })
      .webp({ quality: 85 })
      .toFile(mediumPath)

    const mediumMetadata = await sharp(mediumPath).metadata()
    const mediumStats = await fs.stat(mediumPath)
    variants.push({
      image_id: imageId,
      variant_type: 'medium',
      filename: mediumFilename,
      width: mediumMetadata.width || 0,
      height: mediumMetadata.height || 0,
      file_size: mediumStats.size
    })

    const thumbnailFilename = `${imageId}${ext}`
    const thumbnailPath = path.join(env.uploadDir, 'thumbnail', thumbnailFilename)

    const thumbnailImage = sharp(buffer).resize(200, 200, {
      fit: 'inside',
      withoutEnlargement: true
    })

    await thumbnailImage
      .jpeg({ quality: 80, mozjpeg: true })
      .png({ compressionLevel: 6 })
      .webp({ quality: 80 })
      .toFile(thumbnailPath)

    const thumbnailMetadata = await sharp(thumbnailPath).metadata()
    const thumbnailStats = await fs.stat(thumbnailPath)
    variants.push({
      image_id: imageId,
      variant_type: 'thumbnail',
      filename: thumbnailFilename,
      width: thumbnailMetadata.width || 0,
      height: thumbnailMetadata.height || 0,
      file_size: thumbnailStats.size
    })

    return {
      variants,
      originalWidth,
      originalHeight
    }
  }

  static async cropImage(
    imageId: string,
    variantType: 'original' | 'medium' | 'thumbnail',
    cropData: { x: number; y: number; width: number; height: number }
  ): Promise<void> {
    const variant = variantType || 'original'
    const variantDir = path.join(env.uploadDir, variant)

    const files = await fs.readdir(variantDir)
    const imageFile = files.find(f => f.startsWith(imageId))

    if (!imageFile) {
      throw new Error('Image file not found')
    }

    const imagePath = path.join(variantDir, imageFile)
    const tempPath = path.join(variantDir, `temp-${imageFile}`)

    await sharp(imagePath)
      .extract({
        left: Math.round(cropData.x),
        top: Math.round(cropData.y),
        width: Math.round(cropData.width),
        height: Math.round(cropData.height)
      })
      .toFile(tempPath)

    await this.unlinkWithRetry(imagePath)
    await fs.rename(tempPath, imagePath)
  }

  private static async unlinkWithRetry(filePath: string, maxRetries = 10, delayMs = 200): Promise<void> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await fs.unlink(filePath)
        return
      } catch (error: unknown) {
        const fsError = error as NodeJS.ErrnoException
        if ((fsError.code === 'EBUSY' || fsError.code === 'EPERM') && attempt < maxRetries - 1) {
          const delay = delayMs * Math.pow(2, attempt)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw error
      }
    }
  }

  static async deleteImageFiles(imageId: string): Promise<void> {
    const variants = ['original', 'medium', 'thumbnail']

    for (const variant of variants) {
      const variantDir = path.join(env.uploadDir, variant)

      try {
        const files = await fs.readdir(variantDir)
        const imageFile = files.find(f => f.startsWith(imageId))

        if (imageFile) {
          await this.unlinkWithRetry(path.join(variantDir, imageFile))
        }
      } catch (error) {
        console.error(`Error deleting ${variant} variant:`, error)
      }
    }
  }

  static getImagePath(imageId: string, variantType: 'original' | 'medium' | 'thumbnail', ext: string): string {
    return path.join(env.uploadDir, variantType, `${imageId}${ext}`)
  }
}
