import { Injectable } from '@nestjs/common'
import { TaskType } from '@tubecrown/models/lib/task'
import { Task } from '../task'

@Injectable()
export class SearchRefreshTask implements Task {
  type = TaskType.SEARCH_REFRESH
  sleepTimeSinceLastRun = { minutes: 3 }

  async run () {
    await new Promise((resolve) => setTimeout(resolve, 10000))
  }
}
