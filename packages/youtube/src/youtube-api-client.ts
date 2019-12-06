import { getYouTubeConfig, YouTubeConfig } from '@tubecrown/config/lib/youtube'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import Chance from 'chance'
import Keyv from 'keyv'
import { ListResponse, PageInfo } from './youtube-list-response'
import { Thumbnail, Thumbnails } from './youtube-thumbnail'
import {
  SearchVideoId,
  SearchVideoParams,
  SearchVideoResult,
  Video,
  VideoContentDetails,
  VideoSnippet,
  VideoStatistics,
} from './youtube-video'

const config: YouTubeConfig = getYouTubeConfig()

export class ApiClient {
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
    if (config.useFakeData) {
      return this.fakeSearchVideos(searchVideoParams)
    }
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
    if (config.useFakeData) {
      return this.fakeGetVideoDetails(videoIds)
    }
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

  private fakeSearchVideos (searchVideoParams: SearchVideoParams): ListResponse<SearchVideoResult> {
    const { startDate, endDate } = searchVideoParams
    const chance = new Chance(`${startDate}${endDate}`)
    const resultsCount = chance.integer({ min: 100, max: 200 })
    const pageInfo: PageInfo = {
      totalResults: resultsCount,
      resultsPerPage: resultsCount,
    }
    const searchVideoResults: SearchVideoResult[] = []
    for (let i = 0; i < resultsCount; i++) {
      const searchVideoId: SearchVideoId = { videoId: chance.string({ length: 11, alpha: true, numeric: true }) }
      const videoChance = new Chance(searchVideoId.videoId)
      const etag = videoChance.string({ length: 55 })
      const defaultThumbnail: Thumbnail = {
        url: 'https://via.placeholder.com/120x90.jpg',
        width: 120,
        height: 90,
      }
      const mediumThumbnail: Thumbnail = {
        url: 'https://via.placeholder.com/320x180.jpg',
        width: 320,
        height: 180,
      }
      const highThumbnail: Thumbnail = {
        url: 'https://via.placeholder.com/480x360.jpg',
        width: 480,
        height: 360,
      }
      const thumbnails: Thumbnails = {
        default: defaultThumbnail,
        medium: mediumThumbnail,
        high: highThumbnail,
      }
      const randomDate: string | Date = videoChance.date({ min: new Date(startDate), max: new Date(endDate) })
      const videoSnippet: VideoSnippet = {
        title: videoChance.sentence(),
        channelId: videoChance.string({ length: 24, alpha: true, numeric: true }),
        channelTitle: videoChance.sentence({ words: videoChance.integer({ min: 1, max: 5 }) }),
        publishedAt: randomDate instanceof Date ? randomDate.toISOString() : randomDate,
        thumbnails,
      }
      const searchVideoResult: SearchVideoResult = {
        etag,
        id: searchVideoId,
        snippet: videoSnippet,
      }
      searchVideoResults.push(searchVideoResult)
    }
    const listResponse: ListResponse<SearchVideoResult> = {
      etag: chance.string({ length: 55 }),
      pageInfo,
      items: searchVideoResults,
    }
    return listResponse
  }

  private fakeGetVideoDetails (videoIds: string[]): Record<string, Video> {
    const videoById: Record<string, Video> = {}
    for (const videoId of videoIds) {
      const chance = new Chance(videoId)
      const etag = chance.string({ length: 55 })
      const durationHour = chance.integer({ min: 0, max: 23 })
      const durationMinute = chance.integer({ min: 1, max: 59 })
      const durationSecond = chance.integer({ min: 1, max: 59 })
      const contentDetails: VideoContentDetails = {
        duration:
          durationHour !== 0
            ? `PT${durationHour}H${durationMinute}M${durationSecond}S`
            : `PT${durationMinute}M${durationSecond}S`,
      }
      const statistics: VideoStatistics = {
        viewCount: `${chance.integer({ min: 1000, max: 9999999 })}`,
      }
      const video: Video = {
        etag,
        id: videoId,
        contentDetails,
        statistics,
      }
      videoById[videoId] = video
    }
    return videoById
  }
}
