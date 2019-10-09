import { EntityRepository, Repository } from 'typeorm'
import { TaskRun } from './task-run'

@EntityRepository(TaskRun)
export class TaskRunRepository extends Repository<TaskRun> {}
