import './App.css'
import '@photo-gallery/ui-library/style.css'
import { SessionProvider } from './context/SessionProvider'
import { AppRouter } from './router/AppRouter'

function App() {
  return (
    <SessionProvider>
      <AppRouter />
    </SessionProvider>
  )
}

export default App
