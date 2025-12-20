import React, { useState, useId } from 'react'
import './Input.css'

export interface InputProps {
  
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'
  
  value?: string
  
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  
  label?: string
  
  placeholder?: string
  
  name?: string
  
  required?: boolean
  
  disabled?: boolean
  
  error?: boolean
  
  errorText?: string
  
  helperText?: string
  
  variant?: 'filled' | 'outlined'
  
  leadingIcon?: React.ReactNode
  
  trailingIcon?: React.ReactNode
  
  maxLength?: number
  
  showCharacterCount?: boolean
  
  className?: string
  
  autoFocus?: boolean
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value = '',
  onChange,
  label,
  placeholder,
  name,
  required = false,
  disabled = false,
  error = false,
  errorText,
  helperText,
  variant = 'filled',
  leadingIcon,
  trailingIcon,
  maxLength,
  showCharacterCount = false,
  className = '',
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const id = useId()
  const hasValue = value && value.length > 0
  const isPopulated = isFocused || hasValue

  const containerClassNames = [
    'md3-text-field',
    `md3-text-field--${variant}`,
    isPopulated && 'md3-text-field--populated',
    error && 'md3-text-field--error',
    disabled && 'md3-text-field--disabled',
    leadingIcon && 'md3-text-field--with-leading-icon',
    trailingIcon && 'md3-text-field--with-trailing-icon',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const supportingText = error ? errorText : helperText
  const characterCount = showCharacterCount && maxLength ? `${value.length}/${maxLength}` : null

  return (
    <div className={containerClassNames}>
      <div className="md3-text-field__container">
        {}
        {leadingIcon && <div className="md3-text-field__leading-icon">{leadingIcon}</div>}

        {}
        <div className="md3-text-field__field">
          <input
            id={id}
            className="md3-text-field__input"
            type={type}
            value={value}
            onChange={onChange}
            name={name}
            required={required}
            disabled={disabled}
            placeholder={!label ? placeholder : undefined}
            maxLength={maxLength}
            autoFocus={autoFocus}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {}
          {label && (
            <label htmlFor={id} className="md3-text-field__label">
              {label}
              {required && <span className="md3-text-field__required">*</span>}
            </label>
          )}
        </div>

        {}
        {trailingIcon && <div className="md3-text-field__trailing-icon">{trailingIcon}</div>}

        {}
        {variant === 'filled' && <div className="md3-text-field__active-indicator" />}
      </div>

      {}
      {(supportingText || characterCount) && (
        <div className="md3-text-field__supporting-text">
          <span className="md3-text-field__supporting-text-content">{supportingText}</span>
          {characterCount && (
            <span className="md3-text-field__character-count">{characterCount}</span>
          )}
        </div>
      )}
    </div>
  )
}
