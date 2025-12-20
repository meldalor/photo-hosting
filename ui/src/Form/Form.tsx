import './Form.css'

interface FormProps {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export const Form = ({ children, onSubmit }: FormProps) => {
  return <form className="form" onSubmit={onSubmit}>{children}</form>
}
