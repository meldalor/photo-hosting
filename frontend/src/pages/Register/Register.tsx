import { useState } from 'react'

import { Form, Input, Button, CircularProgress } from '@photo-gallery/ui-library'
import { useNavigate, Link } from 'react-router-dom'

import styles from './Register.module.css'
import { useSession } from '../../context/SessionContext'
import { validators } from '../../utils/validators'

export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const { register } = useSession()
  const navigate = useNavigate()

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email обязателен')

      return false
    }

    if (!validators.isValidEmail(value)) {
      setEmailError('Некорректный email')

      return false
    }
    setEmailError('')

    return true
  }

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Пароль обязателен')

      return false
    }

    if (!validators.isValidPassword(value)) {
      setPasswordError('Пароль должен содержать минимум 6 символов')

      return false
    }
    setPasswordError('')

    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const emailValid = validateEmail(email)
    const passwordValid = validatePassword(password)

    if (!emailValid || !passwordValid) {
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
      <div className={styles.card}>
        <h1 className={styles.title}>Регистрация</h1>
        <p className={styles.subtitle}>Создайте новый аккаунт</p>

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
            helperText="Используйте корректный email адрес"
            leadingIcon={<span className="material-symbols-outlined">email</span>}
            required
            disabled={loading}
            variant="filled"
          />

          <Input
            type="password"
            label="Пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              validatePassword(e.target.value)
            }}
            error={!!passwordError}
            errorText={passwordError}
            helperText="Минимум 6 символов"
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
            disabled={loading || !!emailError || !!passwordError}
            variant="filled"
            fullWidth
            icon={
              loading ? (
                <CircularProgress size="small" color="primary" />
              ) : (
                <span className="material-symbols-outlined">person_add</span>
              )
            }
            iconPosition="leading"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </Form>

        <p className={styles.linkText}>
          Уже есть аккаунт?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
