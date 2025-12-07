import { Button } from '@photo-gallery/ui-library'
import { useNavigate, useLocation } from 'react-router-dom'

import { useSession } from '../../context/SessionContext'
import './Header.css'

export const Header = () => {
  const { session, logout } = useSession()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header>
      <h2>Photo Gallery Header</h2>
      {session && (
        <div>
          <nav>
            <Button
              onClick={() => navigate('/gallery')}
              disabled={location.pathname === '/gallery'}
              variant={location.pathname === '/gallery' ? 'secondary' : 'primary'}
            >
              Gallery
            </Button>
            <Button
              onClick={() => navigate('/upload')}
              disabled={location.pathname === '/upload'}
              variant={location.pathname === '/upload' ? 'secondary' : 'primary'}
            >
              Upload
            </Button>
          </nav>
          <div>
            <span>User: {session.email}</span>
            <Button onClick={logout} variant="danger">
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
