import React, { useState, useCallback } from 'react'
import './Ripple.css'

interface RippleItem {
  x: number
  y: number
  size: number
  key: number
}

export interface RippleProps {
  
  color?: string
  
  duration?: number
  
  disabled?: boolean
}

let rippleKeyCounter = 0

export const Ripple: React.FC<RippleProps> = ({
  color = 'currentColor',
  duration = 600,
  disabled = false,
}) => {
  const [ripples, setRipples] = useState<RippleItem[]>([])

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return

      const target = event.currentTarget
      const rect = target.getBoundingClientRect()

      const size = Math.max(rect.width, rect.height)

      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2

      const newRipple: RippleItem = {
        x,
        y,
        size,
        key: rippleKeyCounter++,
      }

      setRipples((prevRipples) => [...prevRipples, newRipple])

      setTimeout(() => {
        setRipples((prevRipples) =>
          prevRipples.filter((ripple) => ripple.key !== newRipple.key)
        )
      }, duration)
    },
    [disabled, duration]
  )

  return (
    <div
      className="md3-ripple-container"
      onMouseDown={handleMouseDown}
      style={{
        // @ts-expect-error - CSS custom properties
        '--md3-ripple-color': color,
        '--md3-ripple-duration': `${duration}ms`,
      }}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="md3-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
          }}
        />
      ))}
    </div>
  )
}
