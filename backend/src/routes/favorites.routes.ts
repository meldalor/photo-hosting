import { Router } from 'express'
import { FavoritesController } from '../controllers/favorites.controller'
import { authenticateToken } from '../middleware/auth'

const router = Router()

router.use(authenticateToken)

router.get('/', FavoritesController.getUserFavorites)

router.get('/:imageId/check', FavoritesController.checkIsFavorite)

router.post('/:imageId', FavoritesController.addFavorite)

router.delete('/:imageId', FavoritesController.removeFavorite)

export default router
