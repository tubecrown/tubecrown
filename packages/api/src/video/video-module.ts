import { Module } from '@nestjs/common'
import { CommonModule } from '../common'
import { VideoController } from './video-controller'
import { VideoService } from './video-service'

@Module({
  imports: [CommonModule],
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
