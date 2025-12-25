import { useState, useEffect, useCallback, useRef } from 'react'

import { Gallery as GalleryComponent, PhotoCard, ConfirmDialog } from '@photo-gallery/ui-library'
import { useNavigate } from 'react-router-dom'

import styles from './Favorites.module.css'
import { Header } from '../../components/Header/Header'
import { Loader } from '../../components/Loader/Loader'
import { ShareModal } from '../../components/ShareModal/ShareModal'
import { useSession } from '../../context/SessionContext'
import { imageLikesService } from '../../services/imageLikesService'
import { imageService } from '../../services/imageService'
import { formatDate } from '../../utils/dateFormat'

import type { Image } from '../../types'

export const Favorites = () => {
  const [images, setImages] = useState<Image[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const imageUrlsRef = useRef<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [imageToRemove, setImageToRemove] = useState<string | null>(null)
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareImage, setShareImage] = useState<{ id: string; title: string } | null>(null)
  const { session } = useSession()
  const navigate = useNavigate()

  const loadFavorites = useCallback(async () => {
    if (!session) return

    setLoading(true)

    try {
      const likedImages = await imageLikesService.getLikedImages()

      setImages(likedImages)

      const urlPromises = likedImages.map(async (image) => {
        try {
          const url = await imageService.downloadImageBlob(image.id, 'thumbnail')

          return { id: image.id, url }
        } catch (error) {
          console.error(`Failed to load image ${image.id}:`, error)

          return { id: image.id, url: '' }
        }
      })

      const urls = await Promise.all(urlPromises)
      const urlMap = urls.reduce((acc, { id, url }) => {
        acc[id] = url

        return acc
      }, {} as Record<string, string>)

      imageUrlsRef.current = urlMap
      setImageUrls(urlMap)

      const imageIds = likedImages.map(img => img.id)
      const counts = await imageLikesService.getLikeCounts(imageIds)

      setLikeCounts(counts)
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    loadFavorites()

    return () => {
      Object.values(imageUrlsRef.current).forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [loadFavorites])

  const handleRemoveFavorite = (imageId: string) => {
    setImageToRemove(imageId)
    setConfirmDialogOpen(true)
  }

  const confirmRemoveFavorite = async () => {
    if (!imageToRemove) return

    try {
      await imageLikesService.toggleLike(imageToRemove)
      await loadFavorites()
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    } finally {
      setImageToRemove(null)
    }
  }

  const handleToggleFavorite = async (imageId: string) => {
    try {
      await imageLikesService.toggleLike(imageId)
      await loadFavorites()
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const handleShare = (imageId: string, imageTitle: string) => {
    setShareImage({ id: imageId, title: imageTitle })
    setShareModalOpen(true)
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Избранное</h1>

        {loading && <Loader />}

        {!loading && images.length === 0 && (
          <div className={styles.emptyState}>
            <p>У вас пока нет избранных изображений.</p>
          </div>
        )}

        {!loading && images.length > 0 && (
          <GalleryComponent>
            {images.map((image) => {
              const imageUrl = imageUrls[image.id] || ''

              return (
                <PhotoCard
                  key={image.id}
                  title={image.filename}
                  author={image.userEmail || 'Неизвестно'}
                  uploadDate={formatDate(image.createdAt)}
                  imageUrl={imageUrl}
                  fileSize={image.fileSize}
                  width={image.width}
                  height={image.height}
                  isPublic={image.isPublic}
                  isFavorite={true}
                  onToggleFavorite={() => handleToggleFavorite(image.id)}
                  likeCount={likeCounts[image.id] || 0}
                  onShare={() => handleShare(image.id, image.filename)}
                  onDelete={() => handleRemoveFavorite(image.id)}
                  onClick={() => navigate(`/photo/${image.id}`, {
                    state: {
                      imageIds: images.map(img => img.id),
                      currentIndex: images.findIndex(img => img.id === image.id),
                      source: 'favorites'
                    }
                  })}
                />
              )
            })}
          </GalleryComponent>
        )}
      </div>

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmRemoveFavorite}
        title="Удалить из избранного?"
        message="Это действие удалит изображение из ваших избранных."
        confirmText="Удалить"
        cancelText="Отмена"
      />

      {shareImage && (
        <ShareModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          imageId={shareImage.id}
          imageTitle={shareImage.title}
        />
      )}
    </>
  )
}
