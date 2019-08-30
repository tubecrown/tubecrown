import { Module } from '@nestjs/common'
import { YouTube } from '@tubecrown/youtube'
import config from 'config'
import { ConfigService } from './config-service'

@Module({
  providers: [{ provide: 'youTubeConfig', useValue: config.get<YouTube.Config>('youTube') }, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
