export interface User {
  id?: number
  email: string
  passwordHash: string
  createdAt: Date
}

export interface Image {
  id?: number
  userId: number
  file: Blob
  filename: string
  createdAt: Date
}
