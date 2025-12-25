import { Response } from 'express'
import { AuthRequest } from '../types'
import { AlbumsService } from '../services/albumsService'
import { transformAlbum, transformAlbumWithImages } from '../utils/transformers'

export class AlbumsController {
  static async createAlbum(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { title, description, isPublic } = req.body

      const album = await AlbumsService.createAlbum(
        req.user.userId,
        title,
        description,
        isPublic
      )

      return res.status(201).json(transformAlbum(album))
    } catch (error) {
      const err = error as Error
      if (err.message.includes('обязательно')) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  static async getUserAlbums(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const albums = await AlbumsService.getUserAlbums(req.user.userId)

      return res.status(200).json(albums.map(transformAlbum))
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message })
    }
  }

  static async getAlbumById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const albumId = parseInt(id, 10)

      if (isNaN(albumId)) {
        return res.status(400).json({ error: 'Неверный ID альбома' })
      }

      const userId = req.user?.userId

      const album = await AlbumsService.getAlbumById(albumId, userId)

      return res.status(200).json(transformAlbumWithImages(album))
    } catch (error) {
      const err = error as Error
      if (err.message.includes('не найден')) {
        return res.status(404).json({ error: err.message })
      }
      if (err.message.includes('Доступ запрещен')) {
        return res.status(403).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  static async updateAlbum(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { id } = req.params
      const albumId = parseInt(id, 10)

      if (isNaN(albumId)) {
        return res.status(400).json({ error: 'Неверный ID альбома' })
      }

      const { title, description, isPublic } = req.body

      const album = await AlbumsService.updateAlbum(albumId, req.user.userId, {
        title,
        description,
        isPublic
      })

      return res.status(200).json(transformAlbum(album))
    } catch (error) {
      const err = error as Error
      if (err.message.includes('нет прав')) {
        return res.status(403).json({ error: err.message })
      }
      if (err.message.includes('не найден')) {
        return res.status(404).json({ error: err.message })
      }
      if (err.message.includes('не может быть пустым')) {
        return res.status(400).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  static async deleteAlbum(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { id } = req.params
      const albumId = parseInt(id, 10)

      if (isNaN(albumId)) {
        return res.status(400).json({ error: 'Неверный ID альбома' })
      }

      await AlbumsService.deleteAlbum(albumId, req.user.userId)

      return res.status(204).send()
    } catch (error) {
      const err = error as Error
      if (err.message.includes('нет прав')) {
        return res.status(403).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  static async addImageToAlbum(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { id, imageId } = req.params
      const albumId = parseInt(id, 10)

      if (isNaN(albumId)) {
        return res.status(400).json({ error: 'Неверный ID альбома' })
      }

      await AlbumsService.addImageToAlbum(albumId, req.user.userId, imageId)

      return res.status(201).json({ message: 'Изображение добавлено в альбом' })
    } catch (error) {
      const err = error as Error
      if (err.message.includes('нет прав')) {
        return res.status(403).json({ error: err.message })
      }
      if (err.message.includes('не найдено') || err.message.includes('не найден')) {
        return res.status(404).json({ error: err.message })
      }
      if (err.message.includes('уже в альбоме')) {
        return res.status(409).json({ error: err.message })
      }
      if (err.message.includes('приватное')) {
        return res.status(403).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }

  static async removeImageFromAlbum(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' })
      }

      const { id, imageId } = req.params
      const albumId = parseInt(id, 10)

      if (isNaN(albumId)) {
        return res.status(400).json({ error: 'Неверный ID альбома' })
      }

      await AlbumsService.removeImageFromAlbum(albumId, req.user.userId, imageId)

      return res.status(204).send()
    } catch (error) {
      const err = error as Error
      if (err.message.includes('нет прав')) {
        return res.status(403).json({ error: err.message })
      }
      if (err.message.includes('не в альбоме')) {
        return res.status(404).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }
}
