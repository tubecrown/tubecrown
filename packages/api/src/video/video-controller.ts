import { Controller, Get } from '@nestjs/common'
import { VideoDto } from '@tubecrown/core/lib/video'
import { VideoService } from './video-service'

@Controller('videos')
export class VideoController {
  constructor (private readonly videoService: VideoService) {}

  @Get()
  search (): Promise<VideoDto[]> {
    return this.videoService.search()
  }
}
