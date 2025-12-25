import { Response } from 'express'
import { AuthRequest } from '../types'
import { FavoritesService } from '../services/favoritesService'
import { transformFavoriteWithImage } from '../utils/transformers'

export class FavoritesController {
  static async getUserFavorites(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const favorites = await FavoritesService.getUserFavorites(req.user.userId)

      return res.status(200).json(favorites.map(transformFavoriteWithImage))
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }

  static async addFavorite(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { imageId } = req.params

      const favorite = await FavoritesService.addFavorite(req.user.userId, imageId)

      return res.status(201).json(transformFavoriteWithImage(favorite))
    } catch (error) {
      const err = error as Error
      if (err.message.includes('не найдено')) {
        return res.status(404).json({ error: err.message })
      }
      if (err.message.includes('уже в избранном')) {
        return res.status(409).json({ error: err.message })
      }
      if (err.message.includes('приватное')) {
        return res.status(403).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  static async removeFavorite(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { imageId } = req.params

      await FavoritesService.removeFavorite(req.user.userId, imageId)

      return res.status(204).send()
    } catch (error) {
      const err = error as Error
      if (err.message.includes('не в избранном')) {
        return res.status(404).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  static async checkIsFavorite(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { imageId } = req.params

      const isFavorite = await FavoritesService.isFavorite(req.user.userId, imageId)

      return res.status(200).json({ isFavorite })
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }
}
