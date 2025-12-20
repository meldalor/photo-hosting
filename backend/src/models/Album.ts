import { db } from '../config/database'
import { Album, AlbumImage, AlbumWithImages, ImageWithVariants } from '../types'
import { ImageModel } from './Image'

interface AlbumRow {
  id: number
  user_id: number
  title: string
  description: string | null
  is_public: number
  created_at: string
  updated_at: string
  image_count?: number
}

interface AlbumImageRow {
  id: number
  album_id: number
  image_id: string
  position: number
  added_at: string
  user_id: number
  filename: string
  original_filename: string
  file_size: number
  width: number
  height: number
  is_public: number
  created_at: string
  updated_at: string
}

export class AlbumModel {
  static create(userId: number, title: string, description?: string, isPublic: boolean = false): Album {
    const stmt = db.prepare(`
      INSERT INTO albums (user_id, title, description, is_public)
      VALUES (?, ?, ?, ?)
    `)

    const result = stmt.run(userId, title, description || null, isPublic ? 1 : 0)

    return {
      id: result.lastInsertRowid as number,
      user_id: userId,
      title,
      description,
      is_public: isPublic,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  static findById(id: number): Album | undefined {
    const stmt = db.prepare(`
      SELECT * FROM albums WHERE id = ?
    `)

    const result = stmt.get(id) as AlbumRow | undefined
    if (!result) return undefined

    return {
      ...result,
      description: result.description ?? undefined,
      is_public: Boolean(result.is_public)
    }
  }

  static findByIdWithImages(id: number): AlbumWithImages | undefined {
    const album = this.findById(id)
    if (!album) return undefined

    const albumImages = this.getAlbumImages(id)
    const images = albumImages.map(ai => ai.image)

    return {
      ...album,
      images,
      image_count: images.length
    }
  }

  static findByUserId(userId: number): Album[] {
    const stmt = db.prepare(`
      SELECT a.*, COUNT(ai.id) as image_count
      FROM albums a
      LEFT JOIN album_images ai ON a.id = ai.album_id
      WHERE a.user_id = ?
      GROUP BY a.id
      ORDER BY a.updated_at DESC
    `)

    const results = stmt.all(userId) as AlbumRow[]

    return results.map(row => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      description: row.description ?? undefined,
      is_public: Boolean(row.is_public),
      created_at: row.created_at,
      updated_at: row.updated_at
    }))
  }

  static update(
    id: number,
    updates: Partial<Pick<Album, 'title' | 'description' | 'is_public'>>
  ): Album | undefined {
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (updates.title !== undefined) {
      fields.push('title = ?')
      values.push(updates.title)
    }

    if (updates.description !== undefined) {
      fields.push('description = ?')
      values.push(updates.description)
    }

    if (updates.is_public !== undefined) {
      fields.push('is_public = ?')
      values.push(updates.is_public ? 1 : 0)
    }

    if (fields.length === 0) {
      return this.findById(id)
    }

    fields.push('updated_at = CURRENT_TIMESTAMP')

    const query = `UPDATE albums SET ${fields.join(', ')} WHERE id = ?`
    values.push(id)

    const stmt = db.prepare(query)
    stmt.run(...values)

    return this.findById(id)
  }

  static delete(id: number): void {
    const stmt = db.prepare('DELETE FROM albums WHERE id = ?')
    stmt.run(id)
  }

  static addImage(albumId: number, imageId: string, position: number = 0): AlbumImage {
    const stmt = db.prepare(`
      INSERT INTO album_images (album_id, image_id, position)
      VALUES (?, ?, ?)
    `)

    const result = stmt.run(albumId, imageId, position)

    const updateStmt = db.prepare('UPDATE albums SET updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    updateStmt.run(albumId)

    return {
      id: result.lastInsertRowid as number,
      album_id: albumId,
      image_id: imageId,
      position,
      added_at: new Date().toISOString()
    }
  }

  static removeImage(albumId: number, imageId: string): void {
    const stmt = db.prepare(`
      DELETE FROM album_images WHERE album_id = ? AND image_id = ?
    `)

    stmt.run(albumId, imageId)

    const updateStmt = db.prepare('UPDATE albums SET updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    updateStmt.run(albumId)
  }

  static getAlbumImages(albumId: number): Array<AlbumImage & { image: ImageWithVariants }> {
    const stmt = db.prepare(`
      SELECT ai.*, i.*, u.email as user_email
      FROM album_images ai
      JOIN images i ON ai.image_id = i.id
      LEFT JOIN users u ON i.user_id = u.id
      WHERE ai.album_id = ?
      ORDER BY ai.position, ai.added_at
    `)

    const results = stmt.all(albumId) as (AlbumImageRow & { user_email?: string })[]

    return results.map(row => ({
      id: row.id,
      album_id: row.album_id,
      image_id: row.image_id,
      position: row.position,
      added_at: row.added_at,
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
        user_email: row.user_email,
        variants: ImageModel.getVariants(row.image_id)
      }
    }))
  }

  static hasImage(albumId: number, imageId: string): boolean {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM album_images WHERE album_id = ? AND image_id = ?
    `)

    const result = stmt.get(albumId, imageId) as { count: number }
    return result.count > 0
  }

  static isOwner(albumId: number, userId: number): boolean {
    const stmt = db.prepare('SELECT user_id FROM albums WHERE id = ?')
    const result = stmt.get(albumId) as { user_id: number } | undefined

    return result?.user_id === userId
  }

  static exists(id: number): boolean {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM albums WHERE id = ?')
    const result = stmt.get(id) as { count: number }
    return result.count > 0
  }

  static getImageCount(albumId: number): number {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM album_images WHERE album_id = ?')
    const result = stmt.get(albumId) as { count: number }
    return result.count
  }
}
