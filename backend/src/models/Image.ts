import { db } from '../config/database'
import { Image, ImageVariant, ImageWithVariants } from '../types'

interface ImageRow {
  id: string
  user_id: number
  filename: string
  original_filename: string
  file_size: number
  width: number
  height: number
  is_public: number
  created_at: string
  updated_at: string
  user_email?: string
}

export class ImageModel {
  static create(image: Omit<Image, 'created_at' | 'updated_at'>): Image {
    const stmt = db.prepare(`
      INSERT INTO images (id, user_id, filename, original_filename, file_size, width, height, is_public)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      image.id,
      image.user_id,
      image.filename,
      image.original_filename,
      image.file_size,
      image.width,
      image.height,
      image.is_public ? 1 : 0
    )

    return this.findById(image.id)!
  }

  static createVariant(variant: Omit<ImageVariant, 'id'>): void {
    const stmt = db.prepare(`
      INSERT INTO image_variants (image_id, variant_type, filename, width, height, file_size)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      variant.image_id,
      variant.variant_type,
      variant.filename,
      variant.width,
      variant.height,
      variant.file_size
    )
  }

  static findById(id: string): Image | undefined {
    const stmt = db.prepare(`
      SELECT * FROM images WHERE id = ?
    `)

    const result = stmt.get(id) as ImageRow | undefined
    if (!result) return undefined

    return {
      ...result,
      is_public: Boolean(result.is_public)
    }
  }

  static findByIdWithVariants(id: string): ImageWithVariants | undefined {
    const stmt = db.prepare(`
      SELECT i.*, u.email as user_email
      FROM images i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.id = ?
    `)

    const result = stmt.get(id) as ImageRow | undefined
    if (!result) return undefined

    const image = {
      ...result,
      is_public: Boolean(result.is_public)
    }

    const variants = this.getVariants(id)

    return {
      ...image,
      variants
    }
  }

  static getVariants(imageId: string): ImageVariant[] {
    const stmt = db.prepare(`
      SELECT * FROM image_variants WHERE image_id = ? ORDER BY variant_type
    `)

    return stmt.all(imageId) as ImageVariant[]
  }

  static findByUserId(userId: number, isPublic?: boolean): ImageWithVariants[] {
    let query = `
      SELECT i.*, u.email as user_email
      FROM images i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.user_id = ?
    `
    const params: (number | string)[] = [userId]

    if (isPublic !== undefined) {
      query += ' AND i.is_public = ?'
      params.push(isPublic ? 1 : 0)
    }

    query += ' ORDER BY i.created_at DESC'

    const stmt = db.prepare(query)
    const images = stmt.all(...params) as ImageRow[]

    return images.map(image => ({
      ...image,
      is_public: Boolean(image.is_public),
      variants: this.getVariants(image.id)
    }))
  }

  static findPublicImages(limit: number = 100): ImageWithVariants[] {
    const stmt = db.prepare(`
      SELECT i.*, u.email as user_email
      FROM images i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.is_public = 1
      ORDER BY i.created_at DESC
      LIMIT ?
    `)

    const images = stmt.all(limit) as ImageRow[]

    return images.map(image => ({
      ...image,
      is_public: true,
      variants: this.getVariants(image.id)
    }))
  }

  static update(id: string, updates: Partial<Pick<Image, 'filename' | 'is_public'>>): Image | undefined {
    const fields: string[] = []
    const values: (string | number)[] = []

    if (updates.filename !== undefined) {
      fields.push('filename = ?')
      values.push(updates.filename)
    }

    if (updates.is_public !== undefined) {
      fields.push('is_public = ?')
      values.push(updates.is_public ? 1 : 0)
    }

    if (fields.length === 0) {
      return this.findById(id)
    }

    fields.push('updated_at = CURRENT_TIMESTAMP')

    const query = `UPDATE images SET ${fields.join(', ')} WHERE id = ?`
    values.push(id)

    const stmt = db.prepare(query)
    stmt.run(...values)

    return this.findById(id)
  }

  static delete(id: string): void {
    const stmt = db.prepare('DELETE FROM images WHERE id = ?')
    stmt.run(id)
  }

  static isOwner(imageId: string, userId: number): boolean {
    const stmt = db.prepare('SELECT user_id FROM images WHERE id = ?')
    const result = stmt.get(imageId) as { user_id: number } | undefined

    return result?.user_id === userId
  }

  static exists(id: string): boolean {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM images WHERE id = ?')
    const result = stmt.get(id) as { count: number }
    return result.count > 0
  }
}
