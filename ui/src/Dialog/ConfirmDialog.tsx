import React from 'react'

import { Dialog } from './Dialog'
import { Button } from '../Button/Button'

export interface ConfirmDialogProps {
  
  open: boolean
  
  onClose: () => void
  
  onConfirm: () => void
  
  title: string
  
  message: string
  
  confirmText?: string
  
  cancelText?: string
  
  variant?: 'default' | 'danger'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  variant = 'default',
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const actions = (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Button variant="text" onClick={onClose}>
        {cancelText}
      </Button>
      <Button
        variant={variant === 'danger' ? 'filled' : 'filled'}
        onClick={handleConfirm}
        className={variant === 'danger' ? 'md3-button--danger' : ''}
      >
        {confirmText}
      </Button>
    </div>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      actions={actions}
      maxWidth="xs"
    >
      <p style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
        {message}
      </p>
    </Dialog>
  )
}
