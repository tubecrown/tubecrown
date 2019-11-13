import { TaskType } from '@tubecrown/models/lib/task'
import { DurationObject } from 'luxon'

export interface Task {
  type: TaskType
  sleepTimeSinceLastRun: DurationObject
  run (): Promise<void>
}
