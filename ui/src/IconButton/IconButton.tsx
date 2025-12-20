import React from 'react'

import { Ripple } from '../Ripple/Ripple'
import './IconButton.css'

export interface IconButtonProps {
  
  icon: React.ReactNode
  
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined'
  
  disabled?: boolean
  
  selected?: boolean
  
  size?: 'small' | 'medium' | 'large'
  
  ariaLabel: string
  
  className?: string
  
  type?: 'button' | 'submit' | 'reset'
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'standard',
  disabled = false,
  selected = false,
  size = 'medium',
  ariaLabel,
  className = '',
  type = 'button',
}) => {
  const classNames = [
    'md3-icon-button',
    `md3-icon-button--${variant}`,
    `md3-icon-button--${size}`,
    selected && 'md3-icon-button--selected',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      type={type}
    >
      {!disabled && <Ripple />}
      <span className="md3-icon-button__icon">{icon}</span>
    </button>
  )
}
