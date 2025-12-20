import React from 'react'
import './CircularProgress.css'

export interface CircularProgressProps {
  
  size?: 'small' | 'medium' | 'large'
  
  determinate?: boolean
  
  value?: number
  
  color?: 'primary' | 'secondary' | 'error'
  
  className?: string
}

const SIZE_MAP = {
  small: 24,
  medium: 40,
  large: 56,
}

const STROKE_WIDTH_MAP = {
  small: 3,
  medium: 4,
  large: 5,
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 'medium',
  determinate = false,
  value = 0,
  color = 'primary',
  className = '',
}) => {
  const diameter = SIZE_MAP[size]
  const strokeWidth = STROKE_WIDTH_MAP[size]
  const radius = (diameter - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const strokeDashoffset = determinate
    ? circumference - (value / 100) * circumference
    : 0

  const classNames = [
    'md3-circular-progress',
    `md3-circular-progress--${size}`,
    `md3-circular-progress--${color}`,
    determinate && 'md3-circular-progress--determinate',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} role="progressbar" aria-valuenow={determinate ? value : undefined}>
      <svg
        className="md3-circular-progress__svg"
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
      >
        {}
        <circle
          className="md3-circular-progress__circle-bg"
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />

        {}
        <circle
          className="md3-circular-progress__circle"
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            ...(determinate && {
              transition: 'stroke-dashoffset 0.3s ease',
            }),
          }}
        />
      </svg>
    </div>
  )
}
