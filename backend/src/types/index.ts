import { Request } from 'express'

export interface AuthRequest extends Request {
  user?: {
    userId: number
    email: string
  }
}

export interface User {
  id?: number
  email: string
  password_hash: string
  created_at?: string
}

export interface Image {
  id: string
  user_id: number
  filename: string
  original_filename: string
  file_size: number
  width: number
  height: number
  is_public: boolean
  created_at?: string
  updated_at?: string
}

export interface ImageVariant {
  id?: number
  image_id: string
  variant_type: 'thumbnail' | 'medium' | 'original'
  filename: string
  width: number
  height: number
  file_size: number
}

export interface Favorite {
  id?: number
  user_id: number
  image_id: string
  created_at?: string
}

export interface Album {
  id?: number
  user_id: number
  title: string
  description?: string
  is_public: boolean
  created_at?: string
  updated_at?: string
}

export interface AlbumImage {
  id?: number
  album_id: number
  image_id: string
  position: number
  added_at?: string
}

export interface ImageWithVariants extends Image {
  variants: ImageVariant[]
  user_email?: string
}

export interface AlbumWithImages extends Album {
  images: ImageWithVariants[]
  image_count: number
}

export interface FavoriteWithImage extends Favorite {
  image: ImageWithVariants
}

export interface JWTPayload {
  userId: number
  email: string
}
