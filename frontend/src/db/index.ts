import Dexie, { type EntityTable } from 'dexie'

import type { User, Image } from './types'

const db = new Dexie('AppDB') as Dexie & {
  users: EntityTable<User, 'id'>
  images: EntityTable<Image, 'id'>
}

db.version(1).stores({
  users: '++id, email, passwordHash, createdAt',
  images: '++id, userId, filename, createdAt'
})

export { db }
