import { Module } from '@nestjs/common'
import { VideoModule } from './video'

@Module({
  imports: [VideoModule],
})
export class AppModule {}
