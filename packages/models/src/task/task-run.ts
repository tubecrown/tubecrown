import { getNowString } from '@tubecrown/core/lib/utils/datetime'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { TaskType } from './task-type'

export enum TaskRunStatus {
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export interface TaskRunOptions {
  readonly taskType: TaskType
}

@Entity()
export class TaskRun {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number

  @Column({ type: 'enum', enum: TaskType })
  taskType!: TaskType

  @Column({ type: 'enum', enum: TaskRunStatus })
  status!: TaskRunStatus

  @Column({ type: 'text' })
  createdAt!: string

  @Column({ type: 'text', nullable: true })
  finishedAt!: string

  constructor (taskRunOptions?: TaskRunOptions) {
    if (taskRunOptions) {
      const { taskType } = taskRunOptions
      this.taskType = taskType
      this.status = TaskRunStatus.RUNNING
      this.createdAt = getNowString()
    }
  }
}
