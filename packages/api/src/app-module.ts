import { Module } from '@nestjs/common'
import { TaskModule } from './task'
import { VideoModule } from './video'

@Module({
  imports: [TaskModule, VideoModule],
})
export class AppModule {}
