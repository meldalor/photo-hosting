import multer from 'multer'
import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'
import { validators } from '../utils/validators'

const storage = multer.memoryStorage()

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (validators.isValidImageFile(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Неверный формат файла. Поддерживаются: JPEG, PNG, GIF, WEBP'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxFileSize
  }
})

export function handleUploadError(err: unknown, _req: Request, res: Response, next: NextFunction): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: `Размер файла превышает максимально допустимый (${env.maxFileSize / 1024 / 1024} МБ)`
      })
      return
    }
    res.status(400).json({ error: err.message })
    return
  }

  if (err instanceof Error) {
    res.status(400).json({ error: err.message })
    return
  }

  next()
}
