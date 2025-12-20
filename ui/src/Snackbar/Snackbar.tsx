import React, { useEffect } from 'react'

import { Button } from '../Button/Button'
import './Snackbar.css'

export interface SnackbarAction {
  label: string
  onClick: () => void
}

export interface SnackbarProps {
  
  open: boolean
  
  message: string
  
  severity?: 'info' | 'success' | 'warning' | 'error'
  
  action?: SnackbarAction
  
  duration?: number
  
  onClose: () => void
  
  className?: string
}

export const Snackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  severity = 'info',
  action,
  duration = 6000,
  onClose,
  className = '',
}) => {
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [open, duration, onClose])

  const classNames = [
    'md3-snackbar',
    `md3-snackbar--${severity}`,
    open && 'md3-snackbar--open',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (!open) return null

  return (
    <div className={classNames} role="alert" aria-live="polite">
      <div className="md3-snackbar__surface">
        {}
        <span className="md3-snackbar__icon material-symbols-outlined">
          {severity === 'success' && 'check_circle'}
          {severity === 'error' && 'error'}
          {severity === 'warning' && 'warning'}
          {severity === 'info' && 'info'}
        </span>

        {}
        <span className="md3-snackbar__message">{message}</span>

        {}
        {action && (
          <Button
            variant="text"
            size="small"
            onClick={action.onClick}
            className="md3-snackbar__action"
          >
            {action.label}
          </Button>
        )}

        {}
        <button
          className="md3-snackbar__close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  )
}
