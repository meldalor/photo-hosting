import { useState, useEffect } from 'react'

import { Button } from '@photo-gallery/ui-library'
import { useParams, useNavigate } from 'react-router-dom'

import styles from './PhotoDetail.module.css'
import { Header } from '../../components/Header/Header'
import { Loader } from '../../components/Loader/Loader'
import { useSession } from '../../context/SessionContext'
import { imageService } from '../../services/imageService'

import type { Image } from '../../db/types'

export const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { session } = useSession()
  const navigate = useNavigate()

  const [image, setImage] = useState<Image | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadImage = async () => {
      if (!id || !session) {
        setError('Missing image ID or session')
        setLoading(false)

        return
      }

      try {
        const imageData = await imageService.getImageById(Number(id))

        if (!imageData) {
          setError('Image not found')
          setLoading(false)

          return
        }

        if (imageData.userId !== session.userId) {
          setError('You do not have permission to view this image')
          setLoading(false)

          return
        }

        setImage(imageData)
        const url = URL.createObjectURL(imageData.file)

        setImageUrl(url)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load image')
      } finally {
        setLoading(false)
      }
    }

    loadImage()
  }, [id, session])

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  const handleBackToGallery = () => {
    navigate('/gallery')
  }

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
            <div className={styles.imageContainer}>
              <img
                src={imageUrl}
                alt={image.filename}
                className={styles.image}
              />
            </div>

            <div className={styles.metadata}>
              <h1 className={styles.title}>{image.filename}</h1>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Автор:</span>
                <span className={styles.metaValue}>{session?.email || 'Неизвестно'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Дата загрузки:</span>
                <span className={styles.metaValue}>
                  {new Date(image.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Разрешение:</span>
                <span className={styles.metaValue}>
                  {image.width} × {image.height} px
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Размер файла:</span>
                <span className={styles.metaValue}>
                  {(image.fileSize / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>

            <div className={styles.backButton}>
              <Button onClick={handleBackToGallery}>Назад в галерею</Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
