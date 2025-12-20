import { useState, useEffect, useCallback } from 'react'

import { Dialog, Button, Gallery as GalleryComponent } from '@photo-gallery/ui-library'

import styles from './PhotoSelectionModal.module.css'
import { useSession } from '../../context/SessionContext'
import { albumsService } from '../../services/albumsService'
import { imageService } from '../../services/imageService'

import type { Image, Album } from '../../types'

interface PhotoSelectionModalProps {
  open: boolean
  onClose: () => void
  onAdd: (imageIds: string[]) => void
  currentAlbumId?: number
}

type Section = 'gallery' | { type: 'album'; id: number }

export const PhotoSelectionModal = ({ open, onClose, onAdd, currentAlbumId }: PhotoSelectionModalProps) => {
  const { session } = useSession()
  const [selectedSection, setSelectedSection] = useState<Section>('gallery')
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [images, setImages] = useState<Image[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!open || !session) return

    const loadAlbums = async () => {
      try {
        const userAlbums = await albumsService.getAlbums()
        const filteredAlbums = currentAlbumId
          ? userAlbums.filter((album: Album) => album.id !== currentAlbumId)
          : userAlbums

        setAlbums(filteredAlbums)
      } catch (error) {
        console.error('Failed to load albums:', error)
      }
    }

    loadAlbums()
  }, [open, session, currentAlbumId])

  const loadPhotos = useCallback(async () => {
    if (!session) return

    setLoading(true)

    try {
      let photos: Image[] = []

      if (selectedSection === 'gallery') {
        photos = await imageService.getMyImages()
      } else if (selectedSection.type === 'album') {
        const albumData = await albumsService.getAlbumById(selectedSection.id)

        photos = albumData.images
      }

      setImages(photos)

      const urlPromises = photos.map(async (image) => {
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

      setImageUrls(urlMap)
    } catch (error) {
      console.error('Failed to load photos:', error)
    } finally {
      setLoading(false)
    }
  }, [session, selectedSection])

  useEffect(() => {
    if (open) {
      loadPhotos()
    }
  }, [open, loadPhotos])

  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [imageUrls])

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section)
    setSelectedPhotos(new Set())
    setLastSelectedIndex(null)
  }

  const handleCheckboxToggle = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSelected = new Set(selectedPhotos)

    if (newSelected.has(imageId)) {
      newSelected.delete(imageId)
    } else {
      newSelected.add(imageId)
    }
    setSelectedPhotos(newSelected)
  }

  const handlePhotoClick = (imageId: string, index: number, e: React.MouseEvent) => {
    if (e.shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index)
      const end = Math.max(lastSelectedIndex, index)

      const newSelected = new Set(selectedPhotos)

      for (let i = start; i <= end; i++) {
        newSelected.add(images[i].id)
      }

      setSelectedPhotos(newSelected)
    } else {
      handleCheckboxToggle(imageId, e)
      setLastSelectedIndex(index)
    }
  }

  const handleAddClick = () => {
    onAdd(Array.from(selectedPhotos))
    setSelectedPhotos(new Set())
    onClose()
  }

  const handleClose = () => {
    setSelectedPhotos(new Set())
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Добавить фотографии"
      maxWidth="lg"
      actions={
        <>
          <Button variant="text" onClick={handleClose}>
            Отмена
          </Button>
          <Button
            variant="filled"
            onClick={handleAddClick}
            disabled={selectedPhotos.size === 0}
          >
            Добавить ({selectedPhotos.size})
          </Button>
        </>
      }
    >
      <div className={styles.modalContent}>
        <div className={styles.sidebar}>
          <div
            className={`${styles.sidebarItem} ${selectedSection === 'gallery' ? styles.active : ''}`}
            onClick={() => handleSectionClick('gallery')}
          >
            <span className="material-symbols-outlined">photo_library</span>
            <span>Моя галерея</span>
          </div>

          {albums.length > 0 && (
            <>
              <div className={styles.sidebarDivider}>Альбомы</div>
              {albums.map((album) => (
                <div
                  key={album.id}
                  className={`${styles.sidebarItem} ${
                    selectedSection !== 'gallery' && selectedSection.id === album.id
                      ? styles.active
                      : ''
                  }`}
                  onClick={() => handleSectionClick({ type: 'album', id: album.id! })}
                >
                  <span className="material-symbols-outlined">photo_album</span>
                  <span>{album.title}</span>
                </div>
              ))}
            </>
          )}
        </div>

        <div className={styles.photoGrid}>
          {loading && (
            <div className={styles.loading}>
              <p>Загрузка...</p>
            </div>
          )}

          {!loading && images.length === 0 && (
            <div className={styles.emptyState}>
              <span className="material-symbols-outlined">photo</span>
              <p>Нет доступных фотографий</p>
            </div>
          )}

          {!loading && images.length > 0 && (
            <GalleryComponent minColumnWidth={200} gap={16} animated={true}>
              {images.map((image, index) => {
                const isSelected = selectedPhotos.has(image.id)
                const imageUrl = imageUrls[image.id] || ''

                return (
                  <div
                    key={image.id}
                    className={`${styles.photoItem} ${isSelected ? styles.selected : ''}`}
                    onClick={(e) => handlePhotoClick(image.id, index, e)}
                  >
                    <div
                      className={styles.checkbox}
                      onClick={(e) => handleCheckboxToggle(image.id, e)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={image.filename}
                        className={styles.photoImage}
                      />
                    ) : (
                      <div className={styles.photoPlaceholder}>
                        <span className="material-symbols-outlined">image</span>
                      </div>
                    )}

                    <div className={styles.photoName}>{image.filename}</div>
                  </div>
                )
              })}
            </GalleryComponent>
          )}
        </div>
      </div>
    </Dialog>
  )
}
