import { useState, useEffect, useCallback, useRef } from 'react'

import { Gallery as GalleryComponent, PhotoCard, Button, ConfirmDialog, Dialog, Snackbar, IconButton } from '@photo-gallery/ui-library'
import { useParams, useNavigate } from 'react-router-dom'

import styles from './AlbumDetail.module.css'
import { Header } from '../../components/Header/Header'
import { Loader } from '../../components/Loader/Loader'
import { PhotoSelectionModal } from '../../components/PhotoSelectionModal/PhotoSelectionModal'
import { ShareModal } from '../../components/ShareModal/ShareModal'
import { useSession } from '../../context/SessionContext'
import { albumsService } from '../../services/albumsService'
import { imageLikesService } from '../../services/imageLikesService'
import { imageService } from '../../services/imageService'
import { formatDate } from '../../utils/dateFormat'

import type { AlbumWithImages } from '../../types'

export const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { session } = useSession()
  const navigate = useNavigate()

  const [album, setAlbum] = useState<AlbumWithImages | null>(null)
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const imageUrlsRef = useRef<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareImage, setShareImage] = useState<{ id: string; title: string } | null>(null)
  const [photoSelectionModalOpen, setPhotoSelectionModalOpen] = useState(false)

  const [deleteAlbumDialogOpen, setDeleteAlbumDialogOpen] = useState(false)
  const [removeImageDialogOpen, setRemoveImageDialogOpen] = useState(false)
  const [imageToRemove, setImageToRemove] = useState<string | null>(null)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const loadAlbum = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError('')

    try {
      const albumData = await albumsService.getAlbumById(Number(id))

      if (!session && !albumData.isPublic) {
        setError('Доступ запрещен. Это приватный альбом.')
        setLoading(false)

        return
      }

      setAlbum(albumData)
      setEditTitle(albumData.title)
      setEditDescription(albumData.description || '')

      const urlPromises = albumData.images.map(async (image) => {
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

      if (session) {
        const imageIds = albumData.images.map(img => img.id)
        const counts = await imageLikesService.getLikeCounts(imageIds)

        setLikeCounts(counts)

        const statuses = await imageLikesService.getLikeStatuses(imageIds)
        const likedIds = new Set(Object.keys(statuses).filter(id => statuses[id]))

        setFavorites(likedIds)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Не удалось загрузить альбом'

      if (errorMsg.includes('Доступ запрещен') || errorMsg.includes('приватн')) {
        setError('Доступ запрещен. Это приватный альбом.')
      } else {
        setError(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }, [id, session])

  useEffect(() => {
    loadAlbum()

    return () => {
      Object.values(imageUrlsRef.current).forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [loadAlbum])

  const handleUpdate = async () => {
    if (!album || !editTitle.trim()) return

    try {
      await albumsService.updateAlbum(album.id!, {
        title: editTitle,
        description: editDescription,
        isPublic: false
      })
      setEditMode(false)
      await loadAlbum()
      setSnackbarMessage('Альбом обновлен')
      setSnackbarOpen(true)
    } catch (err) {
      console.error('Failed to update album:', err)
      setErrorMessage('Не удалось обновить альбом')
      setErrorDialogOpen(true)
    }
  }

  const handleDelete = () => {
    setDeleteAlbumDialogOpen(true)
  }

  const confirmDeleteAlbum = async () => {
    if (!album) return

    try {
      await albumsService.deleteAlbum(album.id!)
      navigate('/albums')
    } catch (err) {
      console.error('Failed to delete album:', err)
      setErrorMessage('Не удалось удалить альбом')
      setErrorDialogOpen(true)
    }
  }

  const handleRemoveImage = (imageId: string) => {
    setImageToRemove(imageId)
    setRemoveImageDialogOpen(true)
  }

  const confirmRemoveImage = async () => {
    if (!album || !imageToRemove) return

    try {
      await albumsService.removeImageFromAlbum(album.id!, imageToRemove)
      await loadAlbum()
      setSnackbarMessage('Изображение удалено из альбома')
      setSnackbarOpen(true)
    } catch (err) {
      console.error('Failed to remove image:', err)
      setErrorMessage('Не удалось удалить изображение')
      setErrorDialogOpen(true)
    } finally {
      setImageToRemove(null)
    }
  }

  const handleAddImages = async (imageIds: string[]) => {
    if (!album || imageIds.length === 0) return

    try {
      for (const imageId of imageIds) {
        await albumsService.addImageToAlbum(album.id!, imageId)
      }
      await loadAlbum()
      setSnackbarMessage(`Добавлено изображений: ${imageIds.length}`)
      setSnackbarOpen(true)
    } catch (err: unknown) {
      console.error('Failed to add images:', err)

      const error = err as { response?: { status?: number; data?: { error?: string } }; message?: string }
      const status = error.response?.status
      const message = error.response?.data?.error || error.message

      if (status === 409) {
        setErrorMessage(`Изображение уже в альбоме: ${message}`)
      } else if (status === 403) {
        setErrorMessage(`Нет прав на добавление: ${message}`)
      } else if (status === 404) {
        setErrorMessage(`Изображение не найдено: ${message}`)
      } else {
        setErrorMessage('Не удалось добавить изображения. Проверьте доступность изображений.')
      }
      setErrorDialogOpen(true)
    }
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

      setSnackbarMessage(result.liked ? 'Добавлено в избранное' : 'Удалено из избранного')
      setSnackbarOpen(true)
    } catch (error) {
      setFavorites(favorites)
      setErrorMessage('Ошибка обновления избранного')
      setErrorDialogOpen(true)
      console.error('Failed to toggle favorite:', error)
    }
  }

  const handleShare = (imageId: string, imageTitle: string) => {
    setShareImage({ id: imageId, title: imageTitle })
    setShareModalOpen(true)
  }

  const isOwner = album && session && album.userId === session.userId

  return (
    <>
      <Header />
      <div className={styles.container}>
        {loading && <Loader />}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <Button onClick={() => navigate('/albums')}>Назад к альбомам</Button>
          </div>
        )}

        {!loading && !error && album && (
          <>
            <div className={styles.albumHeader}>
              {!editMode ? (
                <>
                  <div className={styles.albumInfo}>
                    <h1 className={styles.title}>{album.title}</h1>
                  </div>
                  {album.description && (
                    <p className={styles.description}>{album.description}</p>
                  )}
                  <div className={styles.meta}>
                    <span>Изображений: {album.image_count}</span>
                    <span>Создан: {formatDate(album.createdAt)}</span>
                  </div>
                </>
              ) : (
                <div className={styles.editForm}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Название альбома"
                    className={styles.input}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Описание"
                    className={styles.textarea}
                  />
                </div>
              )}

              {isOwner && (
                <div className={styles.headerActions}>
                  {!editMode ? (
                    <>
                      <IconButton
                        icon={<span className="material-symbols-outlined">edit</span>}
                        onClick={() => setEditMode(true)}
                        variant="tonal"
                        ariaLabel="Редактировать"
                      />
                      <IconButton
                        icon={<span className="material-symbols-outlined">delete</span>}
                        onClick={handleDelete}
                        variant="tonal"
                        ariaLabel="Удалить альбом"
                        className={styles.dangerButton}
                      />
                    </>
                  ) : (
                    <>
                      <Button variant="filled" onClick={handleUpdate}>Сохранить</Button>
                      <Button
                        variant="text"
                        onClick={() => {
                          setEditMode(false)
                          setEditTitle(album.title)
                          setEditDescription(album.description || '')
                        }}
                      >
                        Отмена
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {album.images.length === 0 && !isOwner ? (
              <div className={styles.emptyState}>
                <p>В альбоме пока нет изображений.</p>
              </div>
            ) : (
              <GalleryComponent>
                {isOwner && (
                  <div
                    className={styles.addPhotoCard}
                    onClick={() => setPhotoSelectionModalOpen(true)}
                  >
                    <div className={styles.addPhotoIcon}>
                      <span className="material-symbols-outlined">add</span>
                    </div>
                    <span>Добавить фото</span>
                  </div>
                )}

                {album.images.map((image) => {
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
                      isFavorite={favorites.has(image.id)}
                      onToggleFavorite={session ? () => handleToggleFavorite(image.id) : undefined}
                      likeCount={likeCounts[image.id] || 0}
                      onShare={() => handleShare(image.id, image.filename)}
                      onDelete={isOwner ? () => handleRemoveImage(image.id) : undefined}
                      onClick={() => navigate(`/photo/${image.id}`, {
                        state: {
                          imageIds: album.images.map(img => img.id),
                          currentIndex: album.images.findIndex(img => img.id === image.id),
                          source: 'album'
                        }
                      })}
                    />
                  )
                })}
              </GalleryComponent>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteAlbumDialogOpen}
        onClose={() => setDeleteAlbumDialogOpen(false)}
        onConfirm={confirmDeleteAlbum}
        title="Удалить альбом?"
        message="Это действие безвозвратно удалит альбом и все его содержимое."
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
      />

      <ConfirmDialog
        open={removeImageDialogOpen}
        onClose={() => setRemoveImageDialogOpen(false)}
        onConfirm={confirmRemoveImage}
        title="Удалить изображение?"
        message="Это действие удалит изображение из альбома (но не из галереи)."
        confirmText="Удалить"
        cancelText="Отмена"
      />

      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="Ошибка"
        actions={
          <Button variant="text" onClick={() => setErrorDialogOpen(false)}>
            OK
          </Button>
        }
        maxWidth="xs"
      >
        <p style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
          {errorMessage}
        </p>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        duration={3000}
      />

      {shareImage && (
        <ShareModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          imageId={shareImage.id}
          imageTitle={shareImage.title}
        />
      )}

      <PhotoSelectionModal
        open={photoSelectionModalOpen}
        onClose={() => setPhotoSelectionModalOpen(false)}
        onAdd={handleAddImages}
        currentAlbumId={album?.id}
      />
    </>
  )
}
