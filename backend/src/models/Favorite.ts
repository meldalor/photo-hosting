import { db } from '../config/database'
import { Favorite, FavoriteWithImage } from '../types'
import { ImageModel } from './Image'

interface FavoriteImageRow {
  id: number
  user_id: number
  image_id: string
  created_at: string
  filename: string
  original_filename: string
  file_size: number
  width: number
  height: number
  is_public: number
  updated_at: string
}

export class FavoriteModel {
  static create(userId: number, imageId: string): Favorite {
    const stmt = db.prepare(`
      INSERT INTO favorites (user_id, image_id)
      VALUES (?, ?)
    `)

    const result = stmt.run(userId, imageId)

    return {
      id: result.lastInsertRowid as number,
      user_id: userId,
      image_id: imageId,
      created_at: new Date().toISOString()
    }
  }

  static delete(userId: number, imageId: string): void {
    const stmt = db.prepare(`
      DELETE FROM favorites WHERE user_id = ? AND image_id = ?
    `)

    stmt.run(userId, imageId)
  }

  static exists(userId: number, imageId: string): boolean {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM favorites WHERE user_id = ? AND image_id = ?
    `)

    const result = stmt.get(userId, imageId) as { count: number }
    return result.count > 0
  }

  static findByUserId(userId: number): FavoriteWithImage[] {
    const stmt = db.prepare(`
      SELECT f.*, i.*
      FROM favorites f
      JOIN images i ON f.image_id = i.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `)

    const results = stmt.all(userId) as FavoriteImageRow[]

    return results.map(row => ({
      id: row.id,
      user_id: row.user_id,
      image_id: row.image_id,
      created_at: row.created_at,
      image: {
        id: row.image_id,
        user_id: row.user_id,
        filename: row.filename,
        original_filename: row.original_filename,
        file_size: row.file_size,
        width: row.width,
        height: row.height,
        is_public: Boolean(row.is_public),
        created_at: row.created_at,
        updated_at: row.updated_at,
        variants: ImageModel.getVariants(row.image_id)
      }
    }))
  }

  static isFavorite(userId: number, imageId: string): boolean {
    return this.exists(userId, imageId)
  }
}
