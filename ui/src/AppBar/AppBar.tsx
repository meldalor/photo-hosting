import React, { useEffect, useState } from 'react'
import './AppBar.css'

export interface AppBarProps {
  
  leadingIcon?: React.ReactNode
  
  title?: string
  
  trailingIcons?: React.ReactNode[]
  
  centerTitle?: boolean
  
  variant?: 'small' | 'medium' | 'large'
  
  elevateOnScroll?: boolean
  
  scrollBehavior?: 'pin' | 'scroll' | 'elevate'
  
  className?: string
  
  children?: React.ReactNode
}

export const AppBar: React.FC<AppBarProps> = ({
  leadingIcon,
  title,
  trailingIcons = [],
  centerTitle = false,
  variant = 'small',
  elevateOnScroll = true,
  scrollBehavior = 'pin',
  className = '',
  children,
}) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (!elevateOnScroll && scrollBehavior !== 'scroll') return

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop

      setIsScrolled(scrollTop > 0)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [elevateOnScroll, scrollBehavior])

  const classNames = [
    'md3-app-bar',
    `md3-app-bar--${variant}`,
    centerTitle && 'md3-app-bar--center',
    scrollBehavior === 'scroll' && 'md3-app-bar--scroll',
    elevateOnScroll && isScrolled && 'md3-app-bar--elevated',
    isScrolled && scrollBehavior === 'scroll' && 'md3-app-bar--hidden',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={classNames}>
      <div className="md3-app-bar__container">
        {}
        {leadingIcon && <div className="md3-app-bar__leading">{leadingIcon}</div>}

        {}
        {children ? (
          <div className="md3-app-bar__content">{children}</div>
        ) : (
          title && <h1 className="md3-app-bar__title">{title}</h1>
        )}

        {}
        {trailingIcons.length > 0 && (
          <div className="md3-app-bar__trailing">
            {trailingIcons.map((icon, index) => (
              <div key={index} className="md3-app-bar__action">
                {icon}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
