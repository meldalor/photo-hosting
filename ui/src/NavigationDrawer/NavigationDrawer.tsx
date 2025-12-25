import React, { useEffect } from 'react'
import './NavigationDrawer.css'

export interface NavigationDrawerItemProps {
  
  label: string
  
  icon?: React.ReactNode
  
  active?: boolean
  
  badge?: string | number
  
  onClick?: () => void
  
  className?: string
}

export const NavigationDrawerItem: React.FC<NavigationDrawerItemProps> = ({
  label,
  icon,
  active = false,
  badge,
  onClick,
  className = '',
}) => {
  const classNames = [
    'md3-nav-drawer-item',
    active && 'md3-nav-drawer-item--active',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classNames} onClick={onClick} type="button">
      {}
      {icon && <div className="md3-nav-drawer-item__icon">{icon}</div>}

      {}
      <span className="md3-nav-drawer-item__label">{label}</span>

      {}
      {badge !== undefined && (
        <div className="md3-nav-drawer-item__badge">{badge}</div>
      )}
    </button>
  )
}

export interface NavigationDrawerProps {
  
  open: boolean
  
  onClose: () => void
  
  variant?: 'modal' | 'standard'
  
  children: React.ReactNode
  
  header?: React.ReactNode
  
  footer?: React.ReactNode
  
  className?: string
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  onClose,
  variant = 'modal',
  children,
  header,
  footer,
  className = '',
}) => {
  useEffect(() => {
    if (!open || variant !== 'modal') return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose, variant])

  useEffect(() => {
    if (variant !== 'modal') return

    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open, variant])

  const drawerClassNames = [
    'md3-nav-drawer',
    `md3-nav-drawer--${variant}`,
    open && 'md3-nav-drawer--open',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {}
      {variant === 'modal' && open && (
        <div className="md3-nav-drawer-scrim" onClick={onClose} />
      )}

      {}
      <aside className={drawerClassNames}>
        {}
        {header && <div className="md3-nav-drawer__header">{header}</div>}

        {}
        <nav className="md3-nav-drawer__content">{children}</nav>

        {}
        {footer && <div className="md3-nav-drawer__footer">{footer}</div>}
      </aside>
    </>
  )
}
