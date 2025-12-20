import React from 'react'

import { Ripple } from '../Ripple/Ripple'
import './Button.css'

export interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal'
  
  legacyVariant?: 'primary' | 'secondary' | 'danger'

  disabled?: boolean
  fullWidth?: boolean
  
  icon?: React.ReactNode
  
  iconPosition?: 'leading' | 'trailing' | 'only'
  
  size?: 'small' | 'medium' | 'large'
  
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'filled',
  legacyVariant,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'leading',
  size = 'medium',
  className = '',
}) => {
  const finalVariant = React.useMemo(() => {
    if (legacyVariant) {
      const legacyMapping: Record<string, ButtonProps['variant']> = {
        primary: 'filled',
        secondary: 'outlined',
        danger: 'filled',
      }

      return legacyMapping[legacyVariant] || variant
    }

    return variant
  }, [legacyVariant, variant])

  const isIconOnly = iconPosition === 'only' || (icon && !children)

  const classNames = [
    'md3-button',
    `md3-button--${finalVariant}`,
    `md3-button--${size}`,
    fullWidth && 'md3-button--full-width',
    icon && iconPosition === 'leading' && 'md3-button--with-icon-leading',
    icon && iconPosition === 'trailing' && 'md3-button--with-icon-trailing',
    isIconOnly && 'md3-button--icon-only',
    legacyVariant === 'danger' && 'md3-button--danger',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classNames}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {!disabled && <Ripple />}

      <span className="md3-button__content">
        {icon && (iconPosition === 'leading' || isIconOnly) && (
          <span className="md3-button__icon md3-button__icon--leading">
            {icon}
          </span>
        )}

        {!isIconOnly && children && (
          <span className="md3-button__label">{children}</span>
        )}

        {icon && iconPosition === 'trailing' && !isIconOnly && (
          <span className="md3-button__icon md3-button__icon--trailing">
            {icon}
          </span>
        )}
      </span>
    </button>
  )
}
