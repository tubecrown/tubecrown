import { Module } from '@nestjs/common'
import { YouTube } from '@tubecrown/youtube'
import config from 'config'
import { HtmlService } from './html-service'
import { LogService } from './log-service'

@Module({
  providers: [
    HtmlService,
    LogService,
  ],
  exports: [HtmlService, LogService],
})
export class CommonModule {}
