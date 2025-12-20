import { useState } from 'react'

import { Form, Input, Button } from '@photo-gallery/ui-library'
import { useNavigate, Link } from 'react-router-dom'

import styles from './Register.module.css'
import { useSession } from '../../context/SessionContext'
import { validators } from '../../utils/validators'

export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useSession()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!validators.isValidEmail(email)) {
      setError('Пожалуйста, введите корректный email адрес')

      return
    }

    if (!validators.isValidPassword(password)) {
      setError('Пароль должен содержать минимум 6 символов')

      return
    }

    setLoading(true)

    try {
      await register(email, password)
      navigate('/gallery')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Регистрация</h1>
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
          {loading ? 'Регистрация...' : 'Регистрация'}
        </Button>
      </Form>
      <p className={styles.linkText}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  )
}
