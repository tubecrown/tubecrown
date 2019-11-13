import { Inject, Injectable } from '@nestjs/common'
import { getTaskSchedulerConfig, TaskSchedulerConfig } from '@tubecrown/config/lib/task'
import { getNow, getNowString, parseDateTime } from '@tubecrown/core/lib/utils/datetime'
import { TaskRun, TaskRunRepository, TaskRunStatus } from '@tubecrown/models/lib/task'
import { job } from 'cron'
import { LogService } from '../common'
import { Task } from './task'

const config: TaskSchedulerConfig = getTaskSchedulerConfig()

@Injectable()
export class TaskScheduler {
  constructor (
    @Inject('tasks') private readonly tasks: Task[],
    private readonly taskRunRepository: TaskRunRepository,
    private readonly logService: LogService,
  ) {}

  schedule () {
    job({
      cronTime: config.cron,
      onTick: () => this.checkTasks(),
      start: true,
    })
  }

  private async checkTasks () {
    const inProgressTaskCount = await this.taskRunRepository.countInProgress()
    if (inProgressTaskCount) {
      console.log(getNowString(), `There are ${inProgressTaskCount} tasks in progress.`)
      return
    }
    const now = getNow()
    for (const task of this.tasks) {
      const lastRun: TaskRun | undefined = await this.taskRunRepository.findLastByTaskType(task.type)
      if (!lastRun) {
        await this.start(task, 'there was no previous run')
        return
      }
      if (!lastRun.finishedAt) {
        continue
      }
      if (parseDateTime(lastRun.finishedAt).plus(task.sleepTimeSinceLastRun) < now) {
        await this.start(task, `last run finished at ${lastRun.finishedAt}`)
        return
      }
    }
    console.log(getNowString(), `No scheduled task.`)
  }

  private async start (task: Task, reason: string) {
    console.log(getNowString(), `Starting task ${task.type} due to [${reason}]`)
    const taskRun = new TaskRun({
      taskType: task.type,
    })
    await this.taskRunRepository.save(taskRun)
    try {
      await task.run()
      await this.stop(taskRun, TaskRunStatus.SUCCESS)
    } catch (err) {
      this.logService.logError(err)
      await this.stop(taskRun, TaskRunStatus.FAILURE)
    }
  }

  private async stop (taskRun: TaskRun, status: TaskRunStatus) {
    console.log(getNowString(), `Stopping task ${taskRun.taskType} with status [${status}]`)
    taskRun.status = status
    taskRun.finishedAt = getNowString()
    await this.taskRunRepository.save(taskRun)
  }
}
