import { useState, useEffect, useCallback } from 'react'

import { Gallery as GalleryComponent, PhotoCard } from '@photo-gallery/ui-library'
import { useNavigate } from 'react-router-dom'

import styles from './Gallery.module.css'
import { Header } from '../../components/Header/Header'
import { Loader } from '../../components/Loader/Loader'
import { useSession } from '../../context/SessionContext'
import { imageService } from '../../services/imageService'

import type { Image } from '../../db/types'

export const Gallery = () => {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const { session } = useSession()
  const navigate = useNavigate()

  const loadImages = useCallback(async () => {
    if (!session) return

    setLoading(true)

    try {
      const userImages = await imageService.getImagesByUser(session.userId)

      setImages(userImages)
    } catch (error) {
      console.error('Failed to load images:', error)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  const handleDelete = async (imageId: number | undefined) => {
    if (!imageId) return

    if (confirm('Вы уверены, что хотите удалить это изображение?')) {
      try {
        await imageService.deleteImage(imageId)
        await loadImages()
      } catch (error) {
        console.error('Failed to delete image:', error)
      }
    }
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Моя Галерея</h1>

        {loading && <Loader />}

        {!loading && images.length === 0 && (
          <div className={styles.emptyState}>
            <p>У вас пока нет изображений. Используйте кнопку "Загрузить" выше.</p>
          </div>
        )}

        {!loading && images.length > 0 && (
          <GalleryComponent>
            {images.map((image) => {
              const imageUrl = URL.createObjectURL(image.file)

              return (
                <PhotoCard
                  key={image.id}
                  title={image.filename}
                  author={session?.email || 'Неизвестно'}
                  uploadDate={new Date(image.createdAt).toLocaleDateString()}
                  imageUrl={imageUrl}
                  fileSize={image.fileSize}
                  width={image.width}
                  height={image.height}
                  onDelete={() => handleDelete(image.id)}
                  onClick={() => navigate(`/photo/${image.id}`)}
                />
              )
            })}
          </GalleryComponent>
        )}
      </div>
    </>
  )
}
