import { useState, useEffect, useCallback, useRef } from 'react'

import {
  Gallery as GalleryComponent,
  PhotoCard,
  Snackbar,
  Dialog,
  Button,
} from '@photo-gallery/ui-library'
import { useNavigate } from 'react-router-dom'

import styles from './Gallery.module.css'
import { Header } from '../../components/Header/Header'
import { ShareModal } from '../../components/ShareModal/ShareModal'
import { useSession } from '../../context/SessionContext'
import { imageLikesService } from '../../services/imageLikesService'
import { imageService } from '../../services/imageService'
import { formatDate } from '../../utils/dateFormat'

import type { Image } from '../../types'

interface SnackbarState {
  open: boolean
  message: string
  severity: 'info' | 'success' | 'warning' | 'error'
  action?: { label: string; onClick: () => void }
}

export const Gallery = () => {
  const [images, setImages] = useState<Image[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const imageUrlsRef = useRef<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareImage, setShareImage] = useState<{ id: string; title: string } | null>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
  })
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    imageId: string | null
    imageName: string
  }>({
    open: false,
    imageId: null,
    imageName: '',
  })
  const { session } = useSession()
  const navigate = useNavigate()

  const loadImages = useCallback(async () => {
    if (!session) return

    setLoading(true)

    try {
      const userImages = await imageService.getMyImages()

      setImages(userImages)

      const urlPromises = userImages.map(async (image) => {
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

      const imageIds = userImages.map(img => img.id)
      const counts = await imageLikesService.getLikeCounts(imageIds)

      setLikeCounts(counts)

      const statuses = await imageLikesService.getLikeStatuses(imageIds)
      const likedIds = new Set(Object.keys(statuses).filter(id => statuses[id]))

      setFavorites(likedIds)
    } catch (error) {
      console.error('Failed to load images:', error)
      setSnackbar({
        open: true,
        message: 'Ошибка загрузки изображений',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    loadImages()

    return () => {
      Object.values(imageUrlsRef.current).forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [loadImages])

  const handleDeleteClick = (imageId: string | undefined, imageName: string) => {
    if (!imageId) return

    setDeleteDialog({
      open: true,
      imageId,
      imageName,
    })
  }

  const handleDeleteConfirm = async () => {
    const imageId = deleteDialog.imageId

    if (!imageId) return

    const deletedImage = images.find((img) => img.id === imageId)

    if (!deletedImage) return

    setDeleteDialog({ open: false, imageId: null, imageName: '' })

    setImages((prev) => prev.filter((img) => img.id !== imageId))

    try {
      await imageService.deleteImage(imageId)

      setSnackbar({
        open: true,
        message: 'Изображение удалено',
        severity: 'success',
        action: {
          label: 'Отменить',
          onClick: () => {
            setImages((prev) => [...prev, deletedImage])
            setSnackbar({
              open: true,
              message: 'Удаление отменено',
              severity: 'info',
            })
          },
        },
      })
    } catch (error) {
      setImages((prev) => [...prev, deletedImage])
      setSnackbar({
        open: true,
        message: 'Ошибка удаления изображения',
        severity: 'error',
      })
      console.error('Failed to delete image:', error)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, imageId: null, imageName: '' })
  }

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const handleToggleFavorite = async (imageId: string) => {
    const isFavorite = favorites.has(imageId)

    const newFavorites = new Set(favorites)

    if (isFavorite) {
      newFavorites.delete(imageId)
    } else {
      newFavorites.add(imageId)
    }
    setFavorites(newFavorites)

    try {
      const result = await imageLikesService.toggleLike(imageId)

      setLikeCounts(prev => ({ ...prev, [imageId]: result.likeCount }))

      setSnackbar({
        open: true,
        message: result.liked ? 'Добавлено в избранное' : 'Удалено из избранного',
        severity: 'success',
      })
    } catch (error) {
      setFavorites(favorites)
      setSnackbar({
        open: true,
        message: 'Ошибка обновления избранного',
        severity: 'error',
      })
      console.error('Failed to toggle favorite:', error)
    }
  }

  const handleShare = (imageId: string, imageTitle: string) => {
    setShareImage({ id: imageId, title: imageTitle })
    setShareModalOpen(true)
  }

  const emptyState = (
    <div className={styles.emptyState}>
      <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>
        photo_library
      </span>
      <h3>Галерея пуста</h3>
      <p>У вас пока нет изображений. Загрузите первое фото!</p>
      <Button
        variant="filled"
        icon={<span className="material-symbols-outlined">upload</span>}
        iconPosition="leading"
        onClick={() => navigate('/upload')}
      >
        Загрузить фото
      </Button>
    </div>
  )

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Моя Галерея</h1>
          {!loading && images.length > 0 && (
            <p className={styles.subtitle}>
              {images.length} {images.length === 1 ? 'изображение' : 'изображений'}
            </p>
          )}
        </div>

        <GalleryComponent emptyState={emptyState}>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
              <PhotoCard
                key={`skeleton-${index}`}
                loading
                title=""
                author=""
                uploadDate=""
              />
            ))
            : images.map((image) => {
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
                  variant="elevated"
                  isFavorite={favorites.has(image.id)}
                  onToggleFavorite={() => handleToggleFavorite(image.id)}
                  likeCount={likeCounts[image.id] || 0}
                  onShare={() => handleShare(image.id, image.filename)}
                  onDelete={() => handleDeleteClick(image.id, image.filename)}
                  onClick={() => navigate(`/photo/${image.id}`, {
                    state: {
                      imageIds: images.map(img => img.id),
                      currentIndex: images.findIndex(img => img.id === image.id),
                      source: 'gallery'
                    }
                  })}
                />
              )
            })}
        </GalleryComponent>
      </div>

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        title="Удалить изображение?"
        actions={
          <>
            <Button variant="text" onClick={handleDeleteCancel}>
              Отмена
            </Button>
            <Button variant="filled" onClick={handleDeleteConfirm}>
              Удалить
            </Button>
          </>
        }
      >
        <p>
          Вы уверены, что хотите удалить <strong>{deleteDialog.imageName}</strong>? Это действие
          нельзя будет отменить.
        </p>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        action={snackbar.action}
        onClose={handleSnackbarClose}
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
