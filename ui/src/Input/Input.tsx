interface InputProps {
  type?: 'text' | 'email' | 'password' | 'file'
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  name?: string
  required?: boolean
  disabled?: boolean
}

export const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  required = false,
  disabled = false
}: InputProps) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      required={required}
      disabled={disabled}
    />
  )
}
