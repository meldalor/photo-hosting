import React from 'react'

import { IconButton } from '../IconButton/IconButton'
import { Ripple } from '../Ripple/Ripple'
import './PhotoCard.css'

export interface PhotoCardProps {
  
  title: string
  
  description?: string
  
  author: string
  
  uploadDate: string
  
  imageUrl?: string
  
  fileSize?: number
  
  width?: number
  
  height?: number
  
  variant?: 'elevated' | 'filled' | 'outlined'
  
  loading?: boolean
  
  isPublic?: boolean
  
  className?: string
  
  onDelete?: () => void
  
  onClick?: () => void
  
  isFavorite?: boolean
  
  onToggleFavorite?: (e: React.MouseEvent) => void
  
  likeCount?: number
  
  onShare?: (e: React.MouseEvent) => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  title,
  description,
  author,
  uploadDate,
  imageUrl,
  fileSize,
  width,
  height,
  variant = 'elevated',
  loading = false,
  isPublic,
  className = '',
  onDelete,
  onClick,
  isFavorite,
  onToggleFavorite,
  likeCount,
  onShare,
}) => {
  const classNames = [
    'md3-photo-card',
    `md3-photo-card--${variant}`,
    onClick && 'md3-photo-card--clickable',
    loading && 'md3-photo-card--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (loading) {
    return (
      <div className={classNames}>
        <div className="md3-photo-card__image-skeleton" />
        <div className="md3-photo-card__content">
          <div className="md3-photo-card__skeleton-title" />
          <div className="md3-photo-card__skeleton-description" />
          <div className="md3-photo-card__skeleton-meta">
            <div className="md3-photo-card__skeleton-line" />
            <div className="md3-photo-card__skeleton-line" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={classNames} onClick={onClick}>
      {onClick && <Ripple />}

      {}
      {imageUrl && (
        <div className="md3-photo-card__image-container">
          <img src={imageUrl} alt={title} className="md3-photo-card__image" />

          {}
          {isPublic !== undefined && (
            <div className="md3-photo-card__badge">
              <span className="material-symbols-outlined">
                {isPublic ? 'public' : 'lock'}
              </span>
            </div>
          )}
        </div>
      )}

      {}
      <div className="md3-photo-card__content">
        <h3 className="md3-photo-card__title">{title}</h3>

        {description && <p className="md3-photo-card__description">{description}</p>}

        {}
        <div className="md3-photo-card__meta">
          <span className="md3-photo-card__meta-item">
            <span className="material-symbols-outlined">person</span>
            {author}
          </span>
          <span className="md3-photo-card__meta-item">
            <span className="material-symbols-outlined">calendar_today</span>
            {uploadDate}
          </span>
          {width && height && (
            <span className="md3-photo-card__meta-item">
              <span className="material-symbols-outlined">photo_size_select_large</span>
              {width} × {height}
            </span>
          )}
          {fileSize && (
            <span className="md3-photo-card__meta-item">
              <span className="material-symbols-outlined">storage</span>
              {formatFileSize(fileSize)}
            </span>
          )}
        </div>

        {}
        {(onToggleFavorite || likeCount !== undefined || onShare || onDelete) && (
          <div className="md3-photo-card__actions">
            <div className="md3-photo-card__action-buttons md3-photo-card__action-buttons--left">
              {onToggleFavorite && (
                <button
                  className={`md3-photo-card__like-button ${isFavorite ? 'md3-photo-card__like-button--active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(e)
                  }}
                  aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                  <span className="material-symbols-outlined">
                    {isFavorite ? 'favorite' : 'favorite_border'}
                  </span>
                  {likeCount !== undefined && <span className="md3-photo-card__like-button-count">{likeCount}</span>}
                </button>
              )}
            </div>

            <div className="md3-photo-card__action-buttons md3-photo-card__action-buttons--right">
              {onShare && (
                <IconButton
                  icon={<span className="material-symbols-outlined">share</span>}
                  onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                    e?.stopPropagation()
                    onShare(e!)
                  }}
                  variant="tonal"
                  ariaLabel="Поделиться"
                  size="small"
                />
              )}

              {onDelete && (
                <IconButton
                  icon={<span className="material-symbols-outlined">delete</span>}
                  onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                    e?.stopPropagation()
                    onDelete()
                  }}
                  variant="tonal"
                  ariaLabel="Удалить изображение"
                  size="small"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
