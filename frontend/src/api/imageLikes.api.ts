import client from './client'

import type { Image } from '../types'

export interface LikeStatus {
  isLiked: boolean
  likeCount: number
}

export interface ToggleLikeResponse {
  liked: boolean
  likeCount: number
}

export const imageLikesApi = {
  async toggleLike(imageId: string): Promise<ToggleLikeResponse> {
    const response = await client.post<ToggleLikeResponse>(`/likes/${imageId}/toggle`)

    return response.data
  },

  async getLikeStatus(imageId: string): Promise<LikeStatus> {
    const response = await client.get<LikeStatus>(`/likes/${imageId}/status`)

    return response.data
  },

  async getLikeCounts(imageIds: string[]): Promise<Record<string, number>> {
    const response = await client.post<Record<string, number>>('/likes/counts', { imageIds })

    return response.data
  },

  async getLikeStatuses(imageIds: string[]): Promise<Record<string, boolean>> {
    const response = await client.post<Record<string, boolean>>('/likes/statuses', { imageIds })

    return response.data
  },

  async getLikedImages(): Promise<Image[]> {
    const response = await client.get<Image[]>('/likes/images')

    return response.data
  }
}
