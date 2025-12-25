import { Image, ImageVariant, ImageWithVariants, Album, AlbumWithImages, Favorite, FavoriteWithImage } from '../types'

interface TransformedImage {
  id: string
  userId: number
  filename: string
  originalFilename: string
  fileSize: number
  width: number
  height: number
  isPublic: boolean
  createdAt?: string
  updatedAt?: string
}

interface TransformedImageVariant {
  variantType: string
  filename: string
  width: number
  height: number
  fileSize: number
}

interface TransformedImageWithVariants extends TransformedImage {
  variants: TransformedImageVariant[]
  userEmail?: string
}

interface TransformedAlbum {
  id?: number
  userId: number
  title: string
  description?: string
  isPublic: boolean
  createdAt?: string
  updatedAt?: string
}

interface TransformedAlbumWithImages extends TransformedAlbum {
  images: TransformedImageWithVariants[]
  image_count: number
}

interface TransformedFavorite {
  id?: number
  userId: number
  imageId: string
  createdAt?: string
}

interface TransformedFavoriteWithImage extends TransformedFavorite {
  image: TransformedImageWithVariants
}

export function transformImage(image: Image): TransformedImage {
  return {
    id: image.id,
    userId: image.user_id,
    filename: image.filename,
    originalFilename: image.original_filename,
    fileSize: image.file_size,
    width: image.width,
    height: image.height,
    isPublic: image.is_public,
    createdAt: image.created_at,
    updatedAt: image.updated_at
  }
}

export function transformImageVariant(variant: ImageVariant): TransformedImageVariant {
  return {
    variantType: variant.variant_type,
    filename: variant.filename,
    width: variant.width,
    height: variant.height,
    fileSize: variant.file_size
  }
}

export function transformImageWithVariants(image: ImageWithVariants): TransformedImageWithVariants {
  return {
    ...transformImage(image),
    variants: image.variants.map(transformImageVariant),
    userEmail: image.user_email
  }
}

export function transformAlbum(album: Album): TransformedAlbum {
  return {
    id: album.id,
    userId: album.user_id,
    title: album.title,
    description: album.description,
    isPublic: album.is_public,
    createdAt: album.created_at,
    updatedAt: album.updated_at
  }
}

export function transformAlbumWithImages(album: AlbumWithImages): TransformedAlbumWithImages {
  return {
    ...transformAlbum(album),
    images: album.images.map(transformImageWithVariants),
    image_count: album.image_count
  }
}

export function transformFavorite(favorite: Favorite): TransformedFavorite {
  return {
    id: favorite.id,
    userId: favorite.user_id,
    imageId: favorite.image_id,
    createdAt: favorite.created_at
  }
}

export function transformFavoriteWithImage(favorite: FavoriteWithImage): TransformedFavoriteWithImage {
  return {
    ...transformFavorite(favorite),
    image: transformImageWithVariants(favorite.image)
  }
}
