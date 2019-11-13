import { Injectable } from '@nestjs/common'
import { TaskType } from '@tubecrown/models/lib/task'
import { Task } from '../task'

@Injectable()
export class DetailRefreshTask implements Task {
  type = TaskType.DETAIL_REFRESH
  sleepTimeSinceLastRun = { minutes: 1 }

  async run () {
    await new Promise((resolve) => setTimeout(resolve, 30000))
  }
}
