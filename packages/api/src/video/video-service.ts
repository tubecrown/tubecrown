import { Injectable } from '@nestjs/common'
import { VideoDto } from '@tubecrown/core/lib/video'
import { YouTube } from '@tubecrown/youtube'
import { DateTime } from 'luxon'
import { ConfigService } from '../config'

@Injectable()
export class VideoService {
  private readonly youTubeApiClient: YouTube.ApiClient

  constructor (configService: ConfigService) {
    this.youTubeApiClient = new YouTube.ApiClient(configService.youTubeConfig)
  }

  async search (): Promise<VideoDto[]> {
    const currentDate = DateTime.utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    const videoSearchReponse = await this.youTubeApiClient.searchVideos({
      startDate: currentDate.minus({ day: 1 }).toISO(),
      endDate: currentDate.toISO(),
      regionCode: 'US',
      maxResults: 12,
    })
    return videoSearchReponse.items.map((searchVideoResult) => {
      return new VideoDto({
        id: searchVideoResult.id.videoId,
        title: searchVideoResult.snippet.title,
      })
    })
  }
}
