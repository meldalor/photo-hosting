import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

import { Button, Snackbar, Dialog, IconButton } from '@photo-gallery/ui-library'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import styles from './PhotoDetail.module.css'
import { Header } from '../../components/Header/Header'
import { Loader } from '../../components/Loader/Loader'
import { ShareModal } from '../../components/ShareModal/ShareModal'
import { useSession } from '../../context/SessionContext'
import { albumsService } from '../../services/albumsService'
import { imageLikesService } from '../../services/imageLikesService'
import { imageService } from '../../services/imageService'

import type { Image, Album } from '../../types'

interface LocationState {
  imageIds?: string[]
  currentIndex?: number
  source?: 'gallery' | 'album' | 'favorites'
}

export const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { session } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as LocationState | null

  const [image, setImage] = useState<Image | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const imageUrlRef = useRef<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [likeCount, setLikeCount] = useState<number>(0)
  const [albums, setAlbums] = useState<Album[]>([])
  const [showAlbumModal, setShowAlbumModal] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [newFilename, setNewFilename] = useState('')

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isHoveringImage, setIsHoveringImage] = useState(false)
  const [isOverContainer, setIsOverContainer] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadImage = async () => {
      if (!id) {
        setError('Отсутствует ID изображения')
        setLoading(false)

        return
      }

      try {
        const imageData = await imageService.getImageById(id)

        if (!imageData) {
          setError('Изображение не найдено')
          setLoading(false)

          return
        }

        if (!session && !imageData.isPublic) {
          setError('Доступ запрещен. Это приватное изображение.')
          setLoading(false)

          return
        }

        setImage(imageData)

        try {
          const url = await imageService.downloadImageBlob(id, 'original')

          imageUrlRef.current = url
          setImageUrl(url)
        } catch (err) {
          console.error('Failed to load image blob:', err)
        }

        if (session) {
          try {
            const likeStatus = await imageLikesService.getLikeStatus(id)

            setIsFavorite(likeStatus.isLiked)
            setLikeCount(likeStatus.likeCount)
          } catch (err) {
            console.error('Failed to load like status:', err)
          }

          try {
            const userAlbums = await albumsService.getAlbums()

            setAlbums(userAlbums)
          } catch (err) {
            console.error('Failed to load albums:', err)
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Не удалось загрузить изображение'

        if (errorMsg.includes('Доступ запрещен') || errorMsg.includes('приватное')) {
          setError('Доступ запрещен. Это приватное изображение.')
        } else {
          setError(errorMsg)
        }
      } finally {
        setLoading(false)
      }
    }

    loadImage()

    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current)
      }
    }
  }, [id, session])

  useEffect(() => {
    const preventScroll = (e: WheelEvent) => {
      if (isOverContainer) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', preventScroll, { passive: false, capture: true })

    return () => {
      window.removeEventListener('wheel', preventScroll, { capture: true })
    }
  }, [isOverContainer])

  const handleBackToGallery = () => {
    navigate('/gallery')
  }

  const handleTogglePublic = async () => {
    if (!image) return

    try {
      const updatedImage = await imageService.togglePublic(image.id, !image.isPublic)

      setImage(updatedImage)
    } catch (err) {
      console.error('Failed to toggle public status:', err)
    }
  }

  const handleToggleFavorite = async () => {
    if (!image) return

    try {
      const result = await imageLikesService.toggleLike(image.id)

      setIsFavorite(result.liked)
      setLikeCount(result.likeCount)
      setSnackbarMessage(result.liked ? 'Добавлено в избранное' : 'Удалено из избранного')
      setSnackbarOpen(true)
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
      setErrorMessage('Не удалось обновить избранное')
      setErrorDialogOpen(true)
    }
  }

  const handleAddToAlbum = async (albumId: number) => {
    if (!image) return

    try {
      await albumsService.addImageToAlbum(albumId, image.id)
      setShowAlbumModal(false)
      setSnackbarMessage('Изображение добавлено в альбом')
      setSnackbarOpen(true)
    } catch (err) {
      console.error('Failed to add to album:', err)
      setErrorMessage(err instanceof Error ? err.message : 'Не удалось добавить в альбом')
      setErrorDialogOpen(true)
    }
  }

  const handleDownload = async (variant: 'thumbnail' | 'medium' | 'original') => {
    if (!image) return

    try {
      const blob = await imageService.downloadImageBlob(image.id, variant)
      const link = document.createElement('a')

      link.href = blob
      const extension = image.originalFilename.split('.').pop() || 'jpg'
      const baseName = image.filename.includes('.')
        ? image.filename.substring(0, image.filename.lastIndexOf('.'))
        : image.filename

      link.download = `${baseName}_${variant}.${extension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blob)
      setSnackbarMessage('Изображение скачано')
      setSnackbarOpen(true)
    } catch (err) {
      console.error('Failed to download image:', err)
      setErrorMessage('Не удалось скачать изображение')
      setErrorDialogOpen(true)
    }
  }

  const handleStartEditName = () => {
    if (!image) return
    setNewFilename(image.filename)
    setIsEditingName(true)
  }

  const handleCancelEditName = () => {
    setIsEditingName(false)
    setNewFilename('')
  }

  const handleSaveFilename = async () => {
    if (!image || !newFilename.trim()) return

    try {
      const updatedImage = await imageService.updateImage(image.id, { filename: newFilename.trim() })

      setImage(updatedImage)
      setIsEditingName(false)
      setNewFilename('')
      setSnackbarMessage('Имя файла изменено')
      setSnackbarOpen(true)
    } catch (err) {
      console.error('Failed to update filename:', err)
      setErrorMessage('Не удалось изменить имя файла')
      setErrorDialogOpen(true)
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isHoveringImage) {
      return
    }

    if (!imageRef.current || !containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const offsetX = mouseX - rect.width / 2
    const offsetY = mouseY - rect.height / 2

    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(Math.max(scale * delta, 1), 5)

    if (newScale === 1) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    } else {
      const scaleDiff = newScale / scale
      const newX = position.x * scaleDiff + offsetX * (1 - scaleDiff)
      const newY = position.y * scaleDiff + offsetY * (1 - scaleDiff)

      setScale(newScale)
      setPosition({ x: newX, y: newY })
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale > 1) {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && scale > 1) {
      e.preventDefault()
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDoubleClick = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleImageMouseEnter = () => {
    setIsHoveringImage(true)
  }

  const handleImageMouseLeave = () => {
    setIsHoveringImage(false)
  }

  const handleContainerMouseEnter = () => {
    setIsOverContainer(true)
  }

  const handleContainerMouseLeave = () => {
    setIsOverContainer(false)
  }

  const availableDownloadVariants = useMemo(() => {
    if (!image) return []

    const minDimension = Math.min(image.width, image.height)
    const variants: Array<'thumbnail' | 'medium' | 'original'> = []

    variants.push('original')

    if (minDimension >= 800) {
      variants.unshift('medium')
    }

    if (minDimension >= 200) {
      variants.unshift('thumbnail')
    }

    return variants
  }, [image])

  const canNavigate = useMemo(
    () => locationState?.imageIds && locationState?.imageIds.length > 1,
    [locationState?.imageIds]
  )
  const currentIndex = useMemo(() => locationState?.currentIndex ?? -1, [locationState?.currentIndex])
  const imageIds = useMemo(() => locationState?.imageIds ?? [], [locationState?.imageIds])

  const handlePreviousImage = useCallback(() => {
    if (!canNavigate || currentIndex <= 0) return

    const prevImageId = imageIds[currentIndex - 1]

    navigate(`/photo/${prevImageId}`, {
      state: {
        imageIds,
        currentIndex: currentIndex - 1,
        source: locationState?.source
      },
      replace: true
    })
  }, [canNavigate, currentIndex, imageIds, navigate, locationState])

  const handleNextImage = useCallback(() => {
    if (!canNavigate || currentIndex >= imageIds.length - 1) return

    const nextImageId = imageIds[currentIndex + 1]

    navigate(`/photo/${nextImageId}`, {
      state: {
        imageIds,
        currentIndex: currentIndex + 1,
        source: locationState?.source
      },
      replace: true
    })
  }, [canNavigate, currentIndex, imageIds, navigate, locationState])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canNavigate) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePreviousImage()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canNavigate, handlePreviousImage, handleNextImage])

  const isOwner = image && session && image.userId === session.userId

  return (
    <>
      <Header />
      <div className={styles.container}>
        {loading && (
          <div className={styles.loading}>
            <Loader />
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <Button onClick={handleBackToGallery}>Назад в галерею</Button>
          </div>
        )}

        {!loading && !error && image && (
          <>
            <div
              className={styles.imageContainer}
              ref={containerRef}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleContainerMouseLeave}
              onMouseEnter={handleContainerMouseEnter}
              onDoubleClick={handleDoubleClick}
              style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt={image.filename}
                className={styles.image}
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  pointerEvents: 'auto'
                }}
              />

              {canNavigate && currentIndex > 0 && (
                <button
                  className={`${styles.navigationButton} ${styles.prev}`}
                  onClick={handlePreviousImage}
                  aria-label="Предыдущее фото"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
              )}

              {canNavigate && currentIndex < imageIds.length - 1 && (
                <button
                  className={`${styles.navigationButton} ${styles.next}`}
                  onClick={handleNextImage}
                  aria-label="Следующее фото"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              )}

              {scale > 1 && (
                <div className={styles.zoomIndicator}>
                  {Math.round(scale * 100)}%
                </div>
              )}
            </div>

            <div className={styles.pageContent}>
              <div className={styles.titleBar}>
                {likeCount > 0 && (
                  <div className={styles.likeCountDisplay}>
                    <span className="material-symbols-outlined">favorite</span>
                    <span className={styles.likeCountText}>{likeCount}</span>
                  </div>
                )}

                <div className={styles.titleGroup}>
                  {!isEditingName ? (
                    <>
                      <h1 className={styles.title}>{image.filename}</h1>
                      {isOwner && (
                        <IconButton
                          icon={<span className="material-symbols-outlined">edit</span>}
                          onClick={handleStartEditName}
                          variant="tonal"
                          ariaLabel="Редактировать название"
                          size="small"
                        />
                      )}
                    </>
                  ) : (
                    <div className={styles.editNameForm}>
                      <input
                        type="text"
                        value={newFilename}
                        onChange={(e) => setNewFilename(e.target.value)}
                        className={styles.editNameInput}
                        placeholder="Введите новое имя"
                        autoFocus
                      />
                      <div className={styles.editNameButtons}>
                        <IconButton
                          icon={<span className="material-symbols-outlined">check</span>}
                          onClick={handleSaveFilename}
                          variant="filled"
                          ariaLabel="Сохранить"
                          size="small"
                        />
                        <IconButton
                          icon={<span className="material-symbols-outlined">close</span>}
                          onClick={handleCancelEditName}
                          variant="tonal"
                          ariaLabel="Отмена"
                          size="small"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.metadataCard}>
                  <h2 className={styles.cardTitle}>Информация</h2>

                  <div className={styles.metaGrid}>
                    {image.userEmail && (
                      <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>
                          <span className="material-symbols-outlined">person</span>
                          Автор
                        </span>
                        <span className={styles.metaValue}>{image.userEmail}</span>
                      </div>
                    )}

                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>
                        <span className="material-symbols-outlined">tag</span>
                        ID
                      </span>
                      <span className={styles.metaValue}>{image.id}</span>
                    </div>

                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>
                        <span className="material-symbols-outlined">{image.isPublic ? 'public' : 'lock'}</span>
                        Статус
                      </span>
                      <span className={styles.metaValue}>
                        {image.isPublic ? 'Публичное' : 'Приватное'}
                      </span>
                    </div>

                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>
                        <span className="material-symbols-outlined">calendar_today</span>
                        Дата загрузки
                      </span>
                      <span className={styles.metaValue}>
                        {new Date(image.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>
                        <span className="material-symbols-outlined">photo_size_select_large</span>
                        Разрешение
                      </span>
                      <span className={styles.metaValue}>
                        {image.width} × {image.height} px
                      </span>
                    </div>

                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>
                        <span className="material-symbols-outlined">storage</span>
                        Размер файла
                      </span>
                      <span className={styles.metaValue}>
                        {(image.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.actionsCard}>
                  <h2 className={styles.cardTitle}>Действия</h2>

                  <div className={styles.actionsList}>
                    <button className={styles.actionItem} onClick={() => setShowDownloadModal(true)}>
                      <span className="material-symbols-outlined">download</span>
                      <div className={styles.actionText}>
                        <span className={styles.actionLabel}>Скачать</span>
                        <span className={styles.actionDescription}>Сохранить в разных размерах</span>
                      </div>
                    </button>

                    {session && (
                      <button className={styles.actionItem} onClick={handleToggleFavorite}>
                        <span className="material-symbols-outlined">
                          {isFavorite ? 'favorite' : 'favorite_border'}
                        </span>
                        <div className={styles.actionText}>
                          <span className={styles.actionLabel}>
                            {isFavorite ? 'В избранном' : 'Добавить в избранное'}
                          </span>
                          <span className={styles.actionDescription}>
                            Быстрый доступ к любимым фото
                          </span>
                        </div>
                      </button>
                    )}

                    <button className={styles.actionItem} onClick={() => setShowShareModal(true)}>
                      <span className="material-symbols-outlined">share</span>
                      <div className={styles.actionText}>
                        <span className={styles.actionLabel}>Поделиться</span>
                        <span className={styles.actionDescription}>Ссылки и коды для вставки</span>
                      </div>
                    </button>

                    {session && (
                      <button className={styles.actionItem} onClick={() => setShowAlbumModal(true)}>
                        <span className="material-symbols-outlined">add_photo_alternate</span>
                        <div className={styles.actionText}>
                          <span className={styles.actionLabel}>Добавить в альбом</span>
                          <span className={styles.actionDescription}>Организуйте свои фото</span>
                        </div>
                      </button>
                    )}

                    {isOwner && (
                      <button className={styles.actionItem} onClick={handleTogglePublic}>
                        <span className="material-symbols-outlined">
                          {image.isPublic ? 'lock_open' : 'lock'}
                        </span>
                        <div className={styles.actionText}>
                          <span className={styles.actionLabel}>
                            {image.isPublic ? 'Сделать приватным' : 'Сделать публичным'}
                          </span>
                          <span className={styles.actionDescription}>
                            {image.isPublic ? 'Скрыть от других' : 'Поделиться со всеми'}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {showAlbumModal && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <h2>Выберите альбом</h2>
                  {albums.length === 0 ? (
                    <p>У вас пока нет альбомов</p>
                  ) : (
                    <div className={styles.albumList}>
                      {albums.map((album) => (
                        <button
                          key={album.id}
                          onClick={() => handleAddToAlbum(album.id)}
                          className={styles.albumItem}
                        >
                          {album.title}
                        </button>
                      ))}
                    </div>
                  )}
                  <Button onClick={() => setShowAlbumModal(false)}>
                    Отмена
                  </Button>
                </div>
              </div>
            )}

            {showDownloadModal && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <h2>Выберите разрешение</h2>
                  <div className={styles.downloadList}>
                    {availableDownloadVariants.includes('thumbnail') && (
                      <button
                        onClick={() => {
                          handleDownload('thumbnail')
                          setShowDownloadModal(false)
                        }}
                        className={styles.downloadItem}
                      >
                        <strong>Миниатюра</strong> (200px)
                      </button>
                    )}
                    {availableDownloadVariants.includes('medium') && (
                      <button
                        onClick={() => {
                          handleDownload('medium')
                          setShowDownloadModal(false)
                        }}
                        className={styles.downloadItem}
                      >
                        <strong>Средний размер</strong> (800px)
                      </button>
                    )}
                    {availableDownloadVariants.includes('original') && (
                      <button
                        onClick={() => {
                          handleDownload('original')
                          setShowDownloadModal(false)
                        }}
                        className={styles.downloadItem}
                      >
                        <strong>Оригинал</strong> ({image.width} × {image.height} px)
                      </button>
                    )}
                  </div>
                  <Button onClick={() => setShowDownloadModal(false)}>
                    Отмена
                  </Button>
                </div>
              </div>
            )}

            <div className={styles.backButton}>
              <Button onClick={handleBackToGallery}>Назад в галерею</Button>
            </div>
          </>
        )}
      </div>

      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        duration={3000}
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

      {image && (
        <ShareModal
          open={showShareModal}
          onClose={() => setShowShareModal(false)}
          imageId={image.id}
          imageTitle={image.filename}
        />
      )}
    </>
  )
}
