import { Module } from '@nestjs/common'
import { YouTube } from '@tubecrown/youtube'
import config from 'config'
import { ConfigService } from './config-service'
import { HtmlService } from './html-service'
import { LogService } from './log-service'

@Module({
  providers: [
    { provide: 'youTubeConfig', useValue: config.get<YouTube.Config>('youTube') },
    ConfigService,
    HtmlService,
    LogService,
  ],
  exports: [ConfigService, HtmlService, LogService],
})
export class CommonModule {}
