import React from 'react'
import './LinearProgress.css'

export interface LinearProgressProps {
  
  value?: number
  
  indeterminate?: boolean
  
  color?: 'primary' | 'secondary' | 'error'
  
  className?: string
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  value = 0,
  indeterminate = false,
  color = 'primary',
  className = '',
}) => {
  const classNames = [
    'md3-linear-progress',
    `md3-linear-progress--${color}`,
    indeterminate && 'md3-linear-progress--indeterminate',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div
      className={classNames}
      role="progressbar"
      aria-valuenow={!indeterminate ? clampedValue : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="md3-linear-progress__track">
        {indeterminate ? (
          <>
            <div className="md3-linear-progress__bar md3-linear-progress__bar--indeterminate-1" />
            <div className="md3-linear-progress__bar md3-linear-progress__bar--indeterminate-2" />
          </>
        ) : (
          <div
            className="md3-linear-progress__bar"
            style={{ transform: `scaleX(${clampedValue / 100})` }}
          />
        )}
      </div>
    </div>
  )
}
