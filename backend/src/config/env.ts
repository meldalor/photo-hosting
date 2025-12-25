import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-not-for-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databasePath: path.resolve(process.env.DATABASE_PATH || './database/photo-hosting.db'),
  uploadDir: path.resolve(process.env.UPLOAD_DIR || './uploads'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',')
}
