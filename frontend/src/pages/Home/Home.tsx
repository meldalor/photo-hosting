import { Button } from '@photo-gallery/ui-library'
import { useNavigate } from 'react-router-dom'

import styles from './Home.module.css'

export const Home = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <h1>Photo Hosting</h1>
      <div className={styles.buttons}>
        <Button onClick={() => navigate('/login')} variant="primary">
          Login
        </Button>
        <Button onClick={() => navigate('/register')} variant="secondary">
          Register
        </Button>
      </div>
    </div>
  )
}
