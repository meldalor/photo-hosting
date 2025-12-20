import { useState } from 'react'

import { Button } from '@photo-gallery/ui-library'
import { useNavigate } from 'react-router-dom'

import styles from './Upload.module.css'
import { Header } from '../../components/Header/Header'
import { useSession } from '../../context/SessionContext'
import { imageService } from '../../services/imageService'
import { validators } from '../../utils/validators'

export const Upload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { session } = useSession()
  const navigate = useNavigate()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    setError('')

    if (!selectedFile) {
      setFile(null)
      setPreview(null)

      return
    }

    if (!validators.isValidImageFile(selectedFile)) {
      setError('Пожалуйста, выберите корректный файл изображения (JPEG, PNG, GIF или WEBP)')
      setFile(null)
      setPreview(null)

      return
    }

    if (!validators.isValidImageSize(selectedFile, 10)) {
      setError('Размер изображения должен быть меньше 10МБ')
      setFile(null)
      setPreview(null)

      return
    }

    setFile(selectedFile)

    const reader = new FileReader()

    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file || !session) {
      return
    }

    setLoading(true)
    setError('')

    try {
      await imageService.uploadImage(session.userId, file)
      navigate('/gallery')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Загрузка изображения</h1>
        <div className={styles.fileInputWrapper}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
        {preview && (
          <div className={styles.preview}>
            <img
              src={preview}
              alt="Предпросмотр"
              className={styles.previewImage}
            />
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}
        <Button onClick={handleUpload} disabled={!file || loading}>
          {loading ? 'Загрузка...' : 'Загрузить'}
        </Button>
      </div>
    </>
  )
}
