import axios from 'axios'

import { AlbumWithImages } from './albums.api'
import { Image } from './images.api'

const publicClient = axios.create({
  baseURL: '/api/public'
})

export const publicApi = {
  async getPublicImage(id: string) {
    const response = await publicClient.get<Image>(`/images/${id}`)

    return response.data
  },

  getPublicImageUrl(id: string, variant: 'thumbnail' | 'medium' | 'original') {
    return `/api/public/images/${id}/${variant}`
  },

  async getPublicAlbum(id: number) {
    const response = await publicClient.get<AlbumWithImages>(`/albums/${id}`)

    return response.data
  }
}
