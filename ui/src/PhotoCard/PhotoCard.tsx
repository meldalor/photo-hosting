import React from 'react'

import './PhotoCard.css'

export interface PhotoCardProps {
  title: string
  description: string
  author: string
  uploadDate: string
  imageUrl?: string
  className?: string
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  title,
  description,
  author,
  uploadDate,
  imageUrl,
  className = '',
}) => {
  return (
    <div className={`photo-card ${className}`}>
      {imageUrl && (
        <div className="photo-card__image-container">
          <img
            src={imageUrl}
            alt={title}
            className="photo-card__image"
          />
        </div>
      )}
      <div className="photo-card__content">
        <h3 className="photo-card__title">{title}</h3>
        <p className="photo-card__description">{description}</p>
        <div className="photo-card__meta">
          <span className="photo-card__author">Автор: {author}</span>
          <span className="photo-card__date">Дата: {uploadDate}</span>
        </div>
      </div>
    </div>
  )
}
