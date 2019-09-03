import { Injectable } from '@nestjs/common'
import { VideoDto } from '@tubecrown/core/lib/video'
import { YouTube } from '@tubecrown/youtube'
import { Video } from '@tubecrown/youtube/lib/exports'
import { DateTime } from 'luxon'
import { ConfigService, HtmlService } from '../common'

@Injectable()
export class VideoService {
  private readonly youTubeApiClient: YouTube.ApiClient

  constructor (private readonly htmlService: HtmlService, configService: ConfigService) {
    this.youTubeApiClient = new YouTube.ApiClient(configService.youTubeConfig)
  }

  async search (): Promise<VideoDto[]> {
    const currentDate = DateTime.utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    const videoSearchReponse = await this.youTubeApiClient.searchVideos({
      startDate: currentDate.minus({ day: 1 }).toISO(),
      endDate: currentDate.toISO(),
      regionCode: 'US',
      maxResults: 50,
    })
    const videoIds: string[] = videoSearchReponse.items.map((searchVideoResult) => searchVideoResult.id.videoId)
    const videoById: Record<string, Video> = await this.youTubeApiClient.getVideoDetails(videoIds)
    return videoSearchReponse.items.map((searchVideoResult) => {
      const { title, publishedAt, thumbnails, channelId, channelTitle } = searchVideoResult.snippet
      const { contentDetails, statistics } = videoById[searchVideoResult.id.videoId]
      return new VideoDto({
        id: searchVideoResult.id.videoId,
        titleHtml: this.htmlService.sanitize(title),
        publishedAt,
        thumbnail: thumbnails.high.url,
        channelId,
        channelTitle,
        duration: contentDetails.duration,
        viewCount: +statistics.viewCount,
      })
    })
  }

  async getVideoById (videoId: string): Promise<VideoDto | undefined> {
    const videos = await this.search()
    return videos.find((video) => video.id === videoId)
  }
}
