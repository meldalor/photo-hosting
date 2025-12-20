import React from 'react'

import './Gallery.css'

export interface GalleryProps {
  children: React.ReactNode
  className?: string
}

export const Gallery: React.FC<GalleryProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`gallery ${className}`}>
      {children}
    </div>
  )
}
