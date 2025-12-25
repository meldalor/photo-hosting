import React, { useEffect } from 'react'
import './Dialog.css'

export interface DialogProps {
  
  open: boolean
  
  onClose: () => void
  
  title: string
  
  children: React.ReactNode
  
  actions?: React.ReactNode
  
  fullScreen?: boolean
  
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg'
  
  className?: string
  
  closeOnBackdropClick?: boolean
}

const MAX_WIDTH_MAP = {
  xs: '280px',
  sm: '560px',
  md: '840px',
  lg: '1120px',
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  fullScreen = false,
  maxWidth = 'sm',
  className = '',
  closeOnBackdropClick = true,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnBackdropClick) {
      onClose()
    }
  }

  if (!open) return null

  const dialogClassNames = [
    'md3-dialog',
    fullScreen && 'md3-dialog--fullscreen',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {}
      <div
        className="md3-dialog-backdrop"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {}
      <div
        className={dialogClassNames}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        style={{
          ...(!fullScreen && { maxWidth: MAX_WIDTH_MAP[maxWidth] }),
        }}
      >
        {}
        <div className="md3-dialog__header">
          <h2 className="md3-dialog__title" id="dialog-title">
            {title}
          </h2>
          <button
            className="md3-dialog__close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {}
        <div className="md3-dialog__content">{children}</div>

        {}
        {actions && <div className="md3-dialog__actions">{actions}</div>}
      </div>
    </>
  )
}
