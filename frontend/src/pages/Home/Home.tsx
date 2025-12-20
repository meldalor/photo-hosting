import { Button } from '@photo-gallery/ui-library'
import { useNavigate } from 'react-router-dom'

import styles from './Home.module.css'

export const Home = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <h1>Фото Хостинг</h1>
      <div className={styles.buttons}>
        <Button onClick={() => navigate('/login')} variant="primary">
          Вход
        </Button>
        <Button onClick={() => navigate('/register')} variant="secondary">
          Регистрация
        </Button>
      </div>
    </div>
  )
}
