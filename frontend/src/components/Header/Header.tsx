import { useState } from 'react'

import {
  AppBar,
  IconButton,
  NavigationDrawer,
  NavigationDrawerItem,
  Button,
} from '@photo-gallery/ui-library'
import { useNavigate, useLocation } from 'react-router-dom'

import { useSession } from '../../context/SessionContext'
import { useTheme } from '../../hooks/useTheme'
import './Header.css'

interface NavItem {
  path: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { path: '/gallery', label: 'Галерея', icon: 'photo_library' },
  { path: '/upload', label: 'Загрузить', icon: 'upload' },
  { path: '/favorites', label: 'Избранное', icon: 'favorite' },
  { path: '/albums', label: 'Альбомы', icon: 'collections' },
]

export const Header = () => {
  const { session, logout } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleNavigation = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  const themeIcon = theme === 'light' ? 'dark_mode' : theme === 'dark' ? 'contrast' : 'light_mode'

  return (
    <>
      <AppBar
        leadingIcon={
          session && (
            <IconButton
              icon={<span className="material-symbols-outlined">menu</span>}
              onClick={() => setDrawerOpen(true)}
              ariaLabel="Открыть меню"
              variant="standard"
              className="header__menu-button"
            />
          )
        }
        title="Фото Галерея"
        trailingIcons={
          session
            ? [
              <div key="desktop-nav" className="header__desktop-nav">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? 'filled' : 'text'}
                    onClick={() => navigate(item.path)}
                    icon={<span className="material-symbols-outlined">{item.icon}</span>}
                    iconPosition="leading"
                    size="medium"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>,
              <IconButton
                key="theme"
                icon={<span className="material-symbols-outlined">{themeIcon}</span>}
                onClick={toggleTheme}
                ariaLabel={`Переключить тему (текущая: ${theme})`}
                variant="standard"
              />,
              <div key="user" className="header__user">
                <span className="header__email">{session.email}</span>
                <Button variant="tonal" onClick={logout} size="small">
                    Выход
                </Button>
              </div>,
            ]
            : []
        }
      />

      {session && (
        <NavigationDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          variant="modal"
          header={
            <div className="header__drawer-header">
              <h3>Фото Галерея</h3>
              <p>{session.email}</p>
            </div>
          }
          footer={
            <div className="header__drawer-footer">
              <NavigationDrawerItem
                label={theme === 'light' ? 'Тёмная тема' : theme === 'dark' ? 'Высокая контрастность' : 'Светлая тема'}
                icon={<span className="material-symbols-outlined">{themeIcon}</span>}
                onClick={toggleTheme}
              />
              <NavigationDrawerItem
                label="Выход"
                icon={<span className="material-symbols-outlined">logout</span>}
                onClick={() => {
                  logout()
                  setDrawerOpen(false)
                }}
              />
            </div>
          }
        >
          {navItems.map((item) => (
            <NavigationDrawerItem
              key={item.path}
              label={item.label}
              icon={<span className="material-symbols-outlined">{item.icon}</span>}
              active={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </NavigationDrawer>
      )}
    </>
  )
}
