import { useState } from 'react'

import { Button } from '@photo-gallery/ui-library'
import { useNavigate } from 'react-router-dom'

import styles from './Upload.module.css'
import { Header } from '../../components/Header/Header'
import { ImageCropper } from '../../components/ImageCropper'
import { useSession } from '../../context/SessionContext'
import { imageService } from '../../services/imageService'
import { validators } from '../../utils/validators'

export const Upload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [filename, setFilename] = useState('')
  const [showCropper, setShowCropper] = useState(false)
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
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

    const fileNameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '')

    setFilename(fileNameWithoutExtension)

    const reader = new FileReader()

    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleCropComplete = (blob: Blob) => {
    setCroppedBlob(blob)
    setShowCropper(false)
    const reader = new FileReader()

    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(blob)
  }

  const handleCancelCrop = () => {
    setShowCropper(false)
  }

  const handleOpenCropper = () => {
    if (preview) {
      setShowCropper(true)
    }
  }

  const handleUpload = async () => {
    if (!file || !session) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const fileToUpload = croppedBlob
        ? new File([croppedBlob], file.name, { type: file.type })
        : file

      await imageService.uploadImage(fileToUpload, isPublic, filename || undefined)
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
        {showCropper && preview ? (
          <ImageCropper
            image={preview}
            mimeType={file?.type}
            onCropComplete={handleCropComplete}
            onCancel={handleCancelCrop}
          />
        ) : (
          <>
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
              <>
                <div className={styles.preview}>
                  <img
                    src={preview}
                    alt="Предпросмотр"
                    className={styles.previewImage}
                  />
                </div>
                <div className={styles.nameInput}>
                  <label htmlFor="filename" className={styles.nameLabel}>
                    Название изображения
                  </label>
                  <input
                    id="filename"
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className={styles.nameField}
                    placeholder="Введите название..."
                    disabled={loading}
                  />
                </div>
                <div className={styles.publicCheckbox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      disabled={loading}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxCustom}></span>
                    <span className={styles.checkboxText}>Сделать публичным</span>
                  </label>
                </div>
                <div className={styles.actionButtons}>
                  <Button onClick={handleOpenCropper} disabled={loading}>
                    Обрезать изображение
                  </Button>
                  <Button onClick={handleUpload} disabled={!file || loading}>
                    {loading ? 'Загрузка...' : 'Загрузить'}
                  </Button>
                </div>
              </>
            )}
            {error && <div className={styles.error}>{error}</div>}
          </>
        )}
      </div>
    </>
  )
}
