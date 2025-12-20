import { Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import { jwtUtils } from '../utils/jwt'

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Токен аутентификации не предоставлен' })
  }

  try {
    const decoded = jwtUtils.verifyToken(token)
    req.user = decoded
    return next()
  } catch (error) {
    return res.status(403).json({ error: 'Недействительный или истекший токен' })
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const decoded = jwtUtils.verifyToken(token)
      req.user = decoded
    // eslint-disable-next-line no-empty
    } catch (error) {
    }
  }

  next()
}
