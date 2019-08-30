import { Inject, Injectable } from '@nestjs/common'
import { YouTube } from '@tubecrown/youtube'

@Injectable()
export class ConfigService {
  constructor (
    @Inject('youTubeConfig')
    readonly youTubeConfig: YouTube.Config,
  ) {}
}
