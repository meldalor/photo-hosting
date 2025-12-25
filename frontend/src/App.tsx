import './App.css'
import '@photo-gallery/ui-library/style.css'
import { SessionProvider } from './context/SessionProvider'
import { AppRouter } from './router/AppRouter'
import { useTheme } from './hooks/useTheme'

function App() {
  useTheme()

  return (
    <SessionProvider>
      <AppRouter />
    </SessionProvider>
  )
}

export default App
