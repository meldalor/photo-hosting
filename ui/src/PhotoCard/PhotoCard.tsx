import React from 'react'

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
  className?: string
  onDelete?: () => void
  onClick?: () => void
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
  className = '',
  onDelete,
  onClick,
}) => {
  return (
    <div className={`photo-card ${className}`}>
      {imageUrl && (
        <div className="photo-card__image-container">
          <img
            src={imageUrl}
            alt={title}
            className="photo-card__image"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
          />
        </div>
      )}
      <div className="photo-card__content">
        <h3 className="photo-card__title">{title}</h3>
        {description && <p className="photo-card__description">{description}</p>}
        <div className="photo-card__meta">
          <span className="photo-card__author">Автор: {author}</span>
          <span className="photo-card__date">Дата: {uploadDate}</span>
          {width && height && (
            <span className="photo-card__resolution">
              Разрешение: {width} × {height}
            </span>
          )}
          {fileSize && (
            <span className="photo-card__size">
              Размер: {formatFileSize(fileSize)}
            </span>
          )}
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="photo-card__delete"
            type="button"
          >
            Удалить
          </button>
        )}
      </div>
    </div>
  )
}
