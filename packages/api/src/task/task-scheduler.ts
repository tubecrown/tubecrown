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

  start () {
    job({
      cronTime: config.cron,
      onTick: () => this.scheduleTasks(),
      start: true,
    })
  }

  private async scheduleTasks () {
    const now = getNow()
    const inProgressTaskCount = await this.taskRunRepository.countInProgress()
    if (inProgressTaskCount) {
      console.log(getNowString(), `There are ${inProgressTaskCount} tasks in progress.`)
      return
    }
    for (const task of this.tasks) {
      const lastRun: TaskRun | undefined = await this.taskRunRepository.findLastByTaskType(task.type)
      if (!lastRun) {
        await this.startTask(task, 'there was no previous run')
        return
      }
      if (parseDateTime(lastRun.finishedAt).plus(task.sleepTimeSinceLastRun) < now) {
        await this.startTask(task, `last run finished at ${lastRun.finishedAt}`)
        return
      }
    }
    console.log(getNowString(), `No scheduled task.`)
  }

  private async startTask (task: Task, reason: string) {
    console.log(getNowString(), `Starting task ${task.type} due to [${reason}]`)
    const taskRun = new TaskRun({
      taskType: task.type,
    })
    await this.taskRunRepository.save(taskRun)
    try {
      await task.run()
      await this.stopTask(taskRun, TaskRunStatus.SUCCESS)
    } catch (err) {
      this.logService.logError(err)
      await this.stopTask(taskRun, TaskRunStatus.FAILURE)
    }
  }

  private async stopTask (taskRun: TaskRun, status: TaskRunStatus) {
    console.log(getNowString(), `Stopping task ${taskRun.taskType} with status [${status}]`)
    taskRun.status = status
    taskRun.finishedAt = getNowString()
    await this.taskRunRepository.save(taskRun)
  }
}
