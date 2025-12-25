export interface User {
  id: number
  email: string
  createdAt: string
}

export interface Image {
  id: string
  userId: number
  filename: string
  originalFilename: string
  fileSize: number
  width: number
  height: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
  variants: ImageVariant[]
  userEmail?: string
}

export interface ImageVariant {
  variantType: 'thumbnail' | 'medium' | 'original'
  filename: string
  width: number
  height: number
  fileSize: number
}

export interface Favorite {
  id: number
  userId: number
  imageId: string
  createdAt: string
  image: Image
}

export interface Album {
  id: number
  userId: number
  title: string
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface AlbumWithImages extends Album {
  images: Image[]
  image_count: number
}

export interface Session {
  userId: number
  email: string
}
