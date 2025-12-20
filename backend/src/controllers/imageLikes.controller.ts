import { Response } from 'express'
import { AuthRequest } from '../types'
import { ImageLikesService } from '../services/imageLikesService'
import { transformImageWithVariants } from '../utils/transformers'

export class ImageLikesController {
  
  static async toggleLike(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { imageId } = req.params
      const result = await ImageLikesService.toggleLike(req.user.userId, imageId)

      return res.status(200).json(result)
    } catch (error) {
      const err = error as Error
      if (err.message.includes('не найдено')) {
        return res.status(404).json({ error: err.message })
      }
      if (err.message.includes('приватное')) {
        return res.status(403).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

static async getLikeStatus(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { imageId } = req.params
      const result = await ImageLikesService.getLikeStatus(req.user.userId, imageId)

      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }

static async getLikeCounts(req: AuthRequest, res: Response) {
    try {
      const { imageIds } = req.body

      if (!Array.isArray(imageIds)) {
        return res.status(400).json({ error: 'imageIds must be an array' })
      }

      const counts = await ImageLikesService.getLikeCounts(imageIds)

      return res.status(200).json(counts)
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }

static async getLikeStatuses(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { imageIds } = req.body

      if (!Array.isArray(imageIds)) {
        return res.status(400).json({ error: 'imageIds must be an array' })
      }

      const statuses = await ImageLikesService.getLikeStatuses(req.user.userId, imageIds)

      return res.status(200).json(statuses)
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }

static async getLikedImages(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const images = await ImageLikesService.getLikedImages(req.user.userId)

      return res.status(200).json(images.map(transformImageWithVariants))
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }
}
