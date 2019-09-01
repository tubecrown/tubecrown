import { Controller, Get, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common'
import { VideoDto } from '@tubecrown/core/lib/video'
import { LogService } from '../common'
import { VideoService } from './video-service'

@Controller('videos')
export class VideoController {
  constructor (private readonly videoService: VideoService, private readonly logService: LogService) {}

  @Get()
  async search (): Promise<VideoDto[]> {
    try {
      const videos = await this.videoService.search()
      return videos
    } catch (err) {
      this.logService.logError(err)
      throw new InternalServerErrorException()
    }
  }

  @Get(':videoId')
  async getVideoById (@Param('videoId') videoId: string): Promise<VideoDto> {
    let video: VideoDto | undefined
    try {
      video = await this.videoService.getVideoById(videoId)
    } catch (err) {
      this.logService.logError(err)
      throw new InternalServerErrorException()
    }
    if (!video) {
      throw new NotFoundException()
    }
    return video
  }
}
