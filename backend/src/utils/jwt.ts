import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'
import { JWTPayload } from '../types'

export const jwtUtils = {
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    } as SignOptions)
  },

  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, env.jwtSecret) as JWTPayload
  },

  decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload
      return decoded
    } catch (error) {
      return null
    }
  }
}
