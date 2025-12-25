import { Router } from 'express'
import { ImageLikesController } from '../controllers/imageLikes.controller'
import { authenticateToken } from '../middleware/auth'

const router = Router()

router.use(authenticateToken)

router.get('/images', ImageLikesController.getLikedImages)

router.post('/:imageId/toggle', ImageLikesController.toggleLike)

router.get('/:imageId/status', ImageLikesController.getLikeStatus)

router.post('/counts', ImageLikesController.getLikeCounts)

router.post('/statuses', ImageLikesController.getLikeStatuses)

export default router
