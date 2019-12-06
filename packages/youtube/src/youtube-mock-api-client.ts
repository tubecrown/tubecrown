import Chance from 'chance'
import { ApiClient } from './youtube-api-client'
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

export class MockApiClient implements ApiClient {
  constructor () {}

  searchVideos (searchVideoParams: SearchVideoParams): Promise<ListResponse<SearchVideoResult>> {
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
    return Promise.resolve(listResponse)
  }

  getVideoDetails (videoIds: string[]): Promise<Record<string, Video>> {
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
    return Promise.resolve(videoById)
  }
}
