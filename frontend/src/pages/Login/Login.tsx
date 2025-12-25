import { useState } from 'react'

import { Form, Input, Button, CircularProgress } from '@photo-gallery/ui-library'
import { useNavigate, Link } from 'react-router-dom'

import styles from './Login.module.css'
import { useSession } from '../../context/SessionContext'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const { login } = useSession()
  const navigate = useNavigate()

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email обязателен')

      return false
    }

    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Некорректный email')

      return false
    }
    setEmailError('')

    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      return
    }

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
      <div className={styles.card}>
        <h1 className={styles.title}>Вход</h1>
        <p className={styles.subtitle}>Войдите в свой аккаунт</p>

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              validateEmail(e.target.value)
            }}
            error={!!emailError}
            errorText={emailError}
            leadingIcon={<span className="material-symbols-outlined">email</span>}
            required
            disabled={loading}
            variant="filled"
          />

          <Input
            type="password"
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leadingIcon={<span className="material-symbols-outlined">lock</span>}
            required
            disabled={loading}
            variant="filled"
          />

          {error && (
            <div className={styles.errorContainer}>
              <span className="material-symbols-outlined">error</span>
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !!emailError}
            variant="filled"
            fullWidth
            icon={
              loading ? (
                <CircularProgress size="small" color="primary" />
              ) : (
                <span className="material-symbols-outlined">login</span>
              )
            }
            iconPosition="leading"
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </Form>

        <p className={styles.linkText}>
          Нет аккаунта?{' '}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
