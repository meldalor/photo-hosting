import { db } from '../config/database'

export interface ImageLike {
  id: number
  user_id: number
  image_id: string
  created_at: string
}

export class ImageLikeModel {
  
  static create(userId: number, imageId: string): ImageLike {
    const stmt = db.prepare(`
      INSERT INTO image_likes (user_id, image_id)
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
      DELETE FROM image_likes WHERE user_id = ? AND image_id = ?
    `)
    stmt.run(userId, imageId)
  }

static exists(userId: number, imageId: string): boolean {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM image_likes WHERE user_id = ? AND image_id = ?
    `)
    const result = stmt.get(userId, imageId) as { count: number }
    return result.count > 0
  }

static getLikeCount(imageId: string): number {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM image_likes WHERE image_id = ?
    `)
    const result = stmt.get(imageId) as { count: number }
    return result.count
  }

static getLikeCounts(imageIds: string[]): Record<string, number> {
    if (imageIds.length === 0) return {}

    const placeholders = imageIds.map(() => '?').join(',')
    const stmt = db.prepare(`
      SELECT image_id, COUNT(*) as count
      FROM image_likes
      WHERE image_id IN (${placeholders})
      GROUP BY image_id
    `)
    const results = stmt.all(...imageIds) as Array<{ image_id: string; count: number }>

    return results.reduce((acc, row) => {
      acc[row.image_id] = row.count
      return acc
    }, {} as Record<string, number>)
  }

static isLiked(userId: number, imageId: string): boolean {
    return this.exists(userId, imageId)
  }

static getLikeStatuses(userId: number, imageIds: string[]): Record<string, boolean> {
    if (imageIds.length === 0) return {}

    const placeholders = imageIds.map(() => '?').join(',')
    const stmt = db.prepare(`
      SELECT image_id
      FROM image_likes
      WHERE user_id = ? AND image_id IN (${placeholders})
    `)
    const results = stmt.all(userId, ...imageIds) as Array<{ image_id: string }>

    const statusMap: Record<string, boolean> = {}
    imageIds.forEach(id => {
      statusMap[id] = false
    })

    results.forEach(row => {
      statusMap[row.image_id] = true
    })

    return statusMap
  }

static getLikedImageIds(userId: number): string[] {
    const stmt = db.prepare(`
      SELECT image_id FROM image_likes WHERE user_id = ? ORDER BY created_at DESC
    `)
    const results = stmt.all(userId) as Array<{ image_id: string }>
    return results.map(row => row.image_id)
  }
}
