import { app } from './app'
import { env } from './config/env'
import { initializeDatabase, closeDatabase } from './config/database'

try {
  initializeDatabase()
  console.log('✓ Database initialized')
} catch (error) {
  console.error('Failed to initialize database:', error)
  process.exit(1)
}

const server = app.listen(env.port, () => {
  console.log(`✓ Server running on port ${env.port}`)
  console.log(`✓ Environment: ${env.nodeEnv}`)
  console.log(`✓ Allowed origins: ${env.allowedOrigins.join(', ')}`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    closeDatabase()
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    closeDatabase()
    process.exit(0)
  })
})
