import { Router } from 'express'
import { ImagesController } from '../controllers/images.controller'
import { authenticateToken, optionalAuth } from '../middleware/auth'
import { upload, handleUploadError } from '../middleware/upload'

const router = Router()

router.post('/', authenticateToken, upload.single('image'), handleUploadError, ImagesController.upload)

router.get('/', authenticateToken, ImagesController.getMyImages)

router.get('/search/:imageId', authenticateToken, ImagesController.searchPublicImage)

router.get('/:id', optionalAuth, ImagesController.getImageById)

router.patch('/:id', authenticateToken, ImagesController.updateImage)

router.patch('/:id/crop', authenticateToken, ImagesController.cropImage)

router.delete('/:id', authenticateToken, ImagesController.deleteImage)

router.get('/:id/download/:variant', optionalAuth, ImagesController.downloadImage)

export default router
