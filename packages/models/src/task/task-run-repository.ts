import { EntityRepository, Repository } from 'typeorm'
import { TaskRun, TaskRunStatus } from './task-run'
import { TaskType } from './task-type'

@EntityRepository(TaskRun)
export class TaskRunRepository extends Repository<TaskRun> {
  countInProgress (): Promise<number> {
    return this.count({ status: TaskRunStatus.RUNNING })
  }

  findLastByTaskType (taskType: TaskType): Promise<TaskRun | undefined> {
    return this.findOne({
      where: { taskType },
      order: {
        createdAt: 'DESC',
      },
    })
  }
}
