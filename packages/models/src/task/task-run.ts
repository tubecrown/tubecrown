import { nowAsString } from '@tubecrown/core/lib/utils/datetime'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { TaskType } from './task-type'

export enum TaskRunStatus {
  PENDING = 'PENDING',
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

  @Column({ type: 'enum', enum: TaskType, nullable: false })
  taskType!: TaskType

  @Column({ type: 'enum', enum: TaskRunStatus, nullable: false })
  status!: TaskRunStatus

  @Column({ type: 'text', nullable: false })
  createdAt!: string

  @Column({ type: 'text', nullable: false })
  finishedAt!: string

  constructor (taskRunOptions?: TaskRunOptions) {
    if (taskRunOptions) {
      const { taskType } = taskRunOptions
      this.taskType = taskType
      this.status = TaskRunStatus.PENDING
      this.createdAt = nowAsString()
    }
  }
}
