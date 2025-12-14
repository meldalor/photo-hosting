import { useState } from 'react'

import { Form, Input, Button } from '@photo-gallery/ui-library'
import { useNavigate, Link } from 'react-router-dom'

import styles from './Login.module.css'
import { useSession } from '../../context/SessionContext'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useSession()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    setLoading(true)

    try {
      await login(email, password)
      navigate('/gallery')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Вход</h1>
      <Form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Электронная почта"
            required
            disabled={loading}
          />
        </div>
        <div className={styles.formGroup}>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
            disabled={loading}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Вход'}
        </Button>
      </Form>
      <p className={styles.linkText}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  )
}
