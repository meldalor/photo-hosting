import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'

import authRoutes from './routes/auth.routes'
import imagesRoutes from './routes/images.routes'
import favoritesRoutes from './routes/favorites.routes'
import albumsRoutes from './routes/albums.routes'
import imageLikesRoutes from './routes/imageLikes.routes'

export const app = express()

app.use(cors({
  origin: env.allowedOrigins,
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/images', imagesRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/albums', albumsRoutes)
app.use('/api/likes', imageLikesRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' })
})

app.use(errorHandler)
