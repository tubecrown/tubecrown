import { Injectable } from '@nestjs/common'
import { getTaskScheduleConfig, TaskScheduleConfig } from '@tubecrown/config/lib/task'
import { job } from 'cron'

@Injectable()
export class TaskScheduleService {
  private readonly config: TaskScheduleConfig

  constructor () {
    this.config = getTaskScheduleConfig()
  }

  schedule () {
    job({
      cronTime: this.config.cron,
      onTick: () => {
        console.log('cron', new Date())
      },
      start: true,
    })
  }
}
