import { getYouTubeConfig, YouTubeConfig } from '@tubecrown/config/lib/youtube'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import Keyv from 'keyv'
import { ApiClient } from './youtube-api-client'
import { ListResponse } from './youtube-list-response'
import { SearchVideoParams, SearchVideoResult, Video } from './youtube-video'

const config: YouTubeConfig = getYouTubeConfig()

export class RealApiClient implements ApiClient {
  private readonly http: AxiosInstance
  private readonly cache: Keyv

  constructor () {
    this.http = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
    })
    this.cache = new Keyv(config.cacheUri, {
      ttl: 24 * 60 * 60 * 1000,
    })
  }

  async searchVideos (searchVideoParams: SearchVideoParams): Promise<ListResponse<SearchVideoResult>> {
    const { startDate, endDate, regionCode, maxResults, pageToken } = searchVideoParams
    const cacheKey = `searchVideos/${[startDate, endDate, regionCode, maxResults, pageToken].join('&')}`
    return this.requestWithCache(cacheKey, () =>
      this.http.get<ListResponse<SearchVideoResult>>('search', {
        params: {
          type: 'video',
          part: 'snippet',
          videoEmbeddable: true,
          order: 'viewCount',
          publishedAfter: startDate,
          publishedBefore: endDate,
          regionCode,
          maxResults,
          pageToken,
          key: config.apiKey,
        },
      }),
    )
  }

  async getVideoDetails (videoIds: string[]): Promise<Record<string, Video>> {
    const videoById: Record<string, Video> = {}
    const videoIdsToQuery = []
    for (const videoId of videoIds) {
      const cacheKey = `getVideoDetails/${videoId}`
      const cachedVideo: Video | undefined = await this.cache.get(cacheKey)
      if (cachedVideo) {
        videoById[videoId] = cachedVideo
      } else {
        videoIdsToQuery.push(videoId)
      }
    }
    if (videoIdsToQuery.length) {
      const videos: Video[] = (
        await this.http.get<ListResponse<Video>>('videos', {
          params: {
            part: 'snippet,contentDetails,status,statistics',
            id: videoIdsToQuery.join(','),
            key: config.apiKey,
          },
        })
      ).data.items
      for (const video of videos) {
        const cacheKey = `getVideoDetails/${video.id}`
        await this.cache.set(cacheKey, video)
        videoById[video.id] = video
      }
    }
    return videoById
  }

  private async requestWithCache<T> (cacheKey: string, request: () => Promise<AxiosResponse<T>>): Promise<T> {
    const cachedResponse: T | undefined = await this.cache.get(cacheKey)
    if (cachedResponse) {
      return cachedResponse
    }
    const response = (await request()).data
    await this.cache.set(cacheKey, response)
    return response
  }
}
