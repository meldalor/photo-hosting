interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false
}: ButtonProps) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} data-variant={variant}>
      {children}
    </button>
  )
}
