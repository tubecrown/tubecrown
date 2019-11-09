import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaskRunRepository } from '@tubecrown/models/lib/task'
import { CommonModule } from '../common'
import { DetailRefreshTask } from './detail-refresh'
import { SearchRefreshTask } from './search-refresh'
import { Task } from './task'
import { TaskScheduler } from './task-scheduler'

const taskProviders: (new (...args: any[]) => Task)[] = [SearchRefreshTask, DetailRefreshTask]

@Module({
  imports: [TypeOrmModule.forFeature([TaskRunRepository]), CommonModule],
  providers: [
    ...taskProviders,
    {
      provide: 'tasks',
      useFactory: (...tasks: Task[]): Task[] => tasks,
      inject: taskProviders,
    },
    TaskScheduler,
  ],
})
export class TaskModule {}
