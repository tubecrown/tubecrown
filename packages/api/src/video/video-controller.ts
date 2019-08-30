import { VideoDto } from '@tubecrown/core/lib/video'
import { Controller, Get } from '@nestjs/common'

@Controller('videos')
export class VideoController {
  @Get()
  async search (): Promise<VideoDto[]> {
    const videos: VideoDto[] = [
      { id: '1', title: 'Video 1' },
      { id: '2', title: 'Video 2' },
    ]
    return videos
  }
}
