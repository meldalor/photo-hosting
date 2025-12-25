import { imageLikesApi, LikeStatus, ToggleLikeResponse } from '../api/imageLikes.api'

import type { Image } from '../types'

export const imageLikesService = {
  async toggleLike(imageId: string): Promise<ToggleLikeResponse> {
    return await imageLikesApi.toggleLike(imageId)
  },

  async getLikeStatus(imageId: string): Promise<LikeStatus> {
    return await imageLikesApi.getLikeStatus(imageId)
  },

  async getLikeCounts(imageIds: string[]): Promise<Record<string, number>> {
    return await imageLikesApi.getLikeCounts(imageIds)
  },

  async getLikeStatuses(imageIds: string[]): Promise<Record<string, boolean>> {
    return await imageLikesApi.getLikeStatuses(imageIds)
  },

  async getLikedImages(): Promise<Image[]> {
    return await imageLikesApi.getLikedImages()
  }
}
