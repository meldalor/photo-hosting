import React from 'react'
import './Gallery.css'

export interface GalleryProps {
  
  children: React.ReactNode
  
  minColumnWidth?: number
  
  gap?: number
  
  animated?: boolean
  
  emptyState?: React.ReactNode
  
  className?: string
}

export const Gallery: React.FC<GalleryProps> = ({
  children,
  minColumnWidth = 280,
  gap = 24,
  animated = true,
  emptyState,
  className = '',
}) => {
  const childrenArray = React.Children.toArray(children)
  const isEmpty = childrenArray.length === 0

  if (isEmpty && emptyState) {
    return <div className="md3-gallery-empty">{emptyState}</div>
  }

  const classNames = [
    'md3-gallery',
    animated && 'md3-gallery--animated',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classNames}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="md3-gallery__item"
          style={
            animated
              ? {
                animationDelay: `${index * 50}ms`,
              }
              : undefined
          }
        >
          {child}
        </div>
      ))}
    </div>
  )
}
