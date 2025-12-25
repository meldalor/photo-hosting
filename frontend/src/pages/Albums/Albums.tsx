import { useState, useEffect, useCallback } from 'react'

import { Button, ConfirmDialog, Dialog, Gallery } from '@photo-gallery/ui-library'
import { useNavigate } from 'react-router-dom'

import styles from './Albums.module.css'
import { Header } from '../../components/Header/Header'
import { Loader } from '../../components/Loader/Loader'
import { useSession } from '../../context/SessionContext'
import { albumsService } from '../../services/albumsService'
import { formatDate } from '../../utils/dateFormat'

import type { Album } from '../../types'

export const Albums = () => {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAlbumTitle, setNewAlbumTitle] = useState('')
  const [newAlbumDescription, setNewAlbumDescription] = useState('')
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [albumToDelete, setAlbumToDelete] = useState<number | null>(null)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { session } = useSession()
  const navigate = useNavigate()

  const loadAlbums = useCallback(async () => {
    if (!session) return

    setLoading(true)

    try {
      const userAlbums = await albumsService.getAlbums()

      setAlbums(userAlbums)
    } catch (error) {
      console.error('Failed to load albums:', error)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    loadAlbums()
  }, [loadAlbums])

  const handleCreateAlbum = async () => {
    if (!newAlbumTitle.trim()) {
      setErrorMessage('Введите название альбома')
      setErrorDialogOpen(true)

      return
    }

    try {
      await albumsService.createAlbum({
        title: newAlbumTitle,
        description: newAlbumDescription,
        isPublic: false
      })

      setNewAlbumTitle('')
      setNewAlbumDescription('')
      setShowCreateForm(false)
      await loadAlbums()
    } catch (error) {
      console.error('Failed to create album:', error)
      setErrorMessage('Не удалось создать альбом')
      setErrorDialogOpen(true)
    }
  }

  const handleDeleteAlbum = (albumId: number) => {
    setAlbumToDelete(albumId)
    setConfirmDialogOpen(true)
  }

  const confirmDeleteAlbum = async () => {
    if (!albumToDelete) return

    try {
      await albumsService.deleteAlbum(albumToDelete)
      await loadAlbums()
    } catch (error) {
      console.error('Failed to delete album:', error)
      setErrorMessage('Не удалось удалить альбом')
      setErrorDialogOpen(true)
    } finally {
      setAlbumToDelete(null)
    }
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Мои Альбомы</h1>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Отмена' : 'Создать альбом'}
          </Button>
        </div>

        {showCreateForm && (
          <div className={styles.createForm}>
            <input
              type="text"
              placeholder="Название альбома"
              value={newAlbumTitle}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
              className={styles.input}
            />
            <textarea
              placeholder="Описание (необязательно)"
              value={newAlbumDescription}
              onChange={(e) => setNewAlbumDescription(e.target.value)}
              className={styles.textarea}
            />
            <Button onClick={handleCreateAlbum}>Создать</Button>
          </div>
        )}

        {loading && <Loader />}

        {!loading && albums.length === 0 && !showCreateForm && (
          <div className={styles.emptyState}>
            <p>У вас пока нет альбомов. Создайте первый альбом!</p>
          </div>
        )}

        {!loading && albums.length > 0 && (
          <Gallery minColumnWidth={300} gap={24} animated={true}>
            {albums.map((album) => (
              <div key={album.id} className={styles.albumCard}>
                <div className={styles.albumHeader}>
                  <h3 className={styles.albumTitle}>{album.title}</h3>
                </div>
                {album.description && (
                  <p className={styles.albumDescription}>{album.description}</p>
                )}
                <div className={styles.albumMeta}>
                  <span>Создан: {formatDate(album.createdAt)}</span>
                </div>
                <div className={styles.albumActions}>
                  <Button onClick={() => navigate(`/albums/${album.id}`)}>
                    Открыть
                  </Button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteAlbum(album.id!)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </Gallery>
        )}
      </div>

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmDeleteAlbum}
        title="Удалить альбом?"
        message="Это действие безвозвратно удалит альбом и все его содержимое."
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
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
    </>
  )
}
