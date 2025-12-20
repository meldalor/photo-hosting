import { Response } from 'express'
import { AuthRequest } from '../types'
import { ImageService } from '../services/imageService'
import path from 'path'
import fs from 'fs'
import { env } from '../config/env'
import { transformImageWithVariants } from '../utils/transformers'

export class ImagesController {
  static async upload(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' })
      }

      const isPublic = req.body.isPublic === 'true' || req.body.isPublic === true
      const customFilename = req.body.filename ? String(req.body.filename).trim() : undefined

      const image = await ImageService.uploadImage(req.user.userId, req.file, isPublic, customFilename)

      return res.status(201).json(transformImageWithVariants(image))
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }

  static async getMyImages(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const isPublic = req.query.isPublic === 'true' ? true : req.query.isPublic === 'false' ? false : undefined

      const images = await ImageService.getUserImages(req.user.userId, isPublic)

      return res.status(200).json(images.map(transformImageWithVariants))
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }

  static async getImageById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params

      const image = await ImageService.getImageById(id)

      if (!image) {
        return res.status(404).json({ error: 'Изображение не найдено' })
      }

      if (req.user) {
        if (!ImageService.canAccess(image, req.user.userId)) {
          return res.status(403).json({ error: 'Доступ запрещен' })
        }
      } else {
        if (!image.is_public) {
          return res.status(403).json({ error: 'Доступ запрещен. Изображение приватное.' })
        }
      }

      return res.status(200).json(transformImageWithVariants(image))
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }

  static async updateImage(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { id } = req.params
      const { filename, isPublic } = req.body

      const image = await ImageService.updateImage(id, req.user.userId, {
        filename,
        isPublic
      })

      return res.status(200).json(transformImageWithVariants(image))
    } catch (error) {
      const err = error as Error
      if (err.message.includes('нет прав')) {
        return res.status(403).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  static async cropImage(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { id } = req.params
      const { x, y, width, height } = req.body

      if (x === undefined || y === undefined || width === undefined || height === undefined) {
        return res.status(400).json({ error: 'Необходимо указать координаты обрезки' })
      }

      const image = await ImageService.cropImage(id, req.user.userId, { x, y, width, height })

      return res.status(200).json(transformImageWithVariants(image))
    } catch (error) {
      const err = error as Error
      if (err.message.includes('нет прав')) {
        return res.status(403).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  static async deleteImage(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { id } = req.params

      await ImageService.deleteImage(id, req.user.userId)

      return res.status(204).send()
    } catch (error) {
      const err = error as Error
      if (err.message.includes('нет прав')) {
        return res.status(403).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  static async downloadImage(req: AuthRequest, res: Response) {
    try {
      const { id, variant } = req.params

      if (!['thumbnail', 'medium', 'original'].includes(variant)) {
        return res.status(400).json({ error: 'Неверный тип изображения' })
      }

      const image = await ImageService.getImageById(id)

      if (!image) {
        return res.status(404).json({ error: 'Изображение не найдено' })
      }

      if (req.user) {
        if (!ImageService.canAccess(image, req.user.userId)) {
          return res.status(403).json({ error: 'Доступ запрещен' })
        }
      } else {
        if (!image.is_public) {
          return res.status(403).json({ error: 'Доступ запрещен. Изображение приватное.' })
        }
      }

      const variantData = image.variants.find(v => v.variant_type === variant)

      if (!variantData) {
        return res.status(404).json({ error: 'Вариант изображения не найден' })
      }

      const filePath = path.join(env.uploadDir, variant, variantData.filename)

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Файл не найден' })
      }

      return res.sendFile(filePath)
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }

  static async searchPublicImage(req: AuthRequest, res: Response) {
    try {
      const { imageId } = req.params

      const image = await ImageService.searchPublicImage(imageId)

      if (!image) {
        return res.status(404).json({ error: 'Публичное изображение не найдено' })
      }

      return res.status(200).json(transformImageWithVariants(image))
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }
}
