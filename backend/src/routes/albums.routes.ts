import { Router } from 'express'
import { AlbumsController } from '../controllers/albums.controller'
import { authenticateToken, optionalAuth } from '../middleware/auth'

const router = Router()

router.get('/', authenticateToken, AlbumsController.getUserAlbums)

router.post('/', authenticateToken, AlbumsController.createAlbum)

router.get('/:id', optionalAuth, AlbumsController.getAlbumById)

router.patch('/:id', authenticateToken, AlbumsController.updateAlbum)

router.delete('/:id', authenticateToken, AlbumsController.deleteAlbum)

router.post('/:id/images/:imageId', authenticateToken, AlbumsController.addImageToAlbum)

router.delete('/:id/images/:imageId', authenticateToken, AlbumsController.removeImageFromAlbum)

export default router
