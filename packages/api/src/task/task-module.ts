import { Module } from '@nestjs/common'
import { CommonModule } from '../common'
import { TaskScheduleService } from './task-schedule-service'

@Module({
  imports: [CommonModule],
  providers: [TaskScheduleService],
})
export class TaskModule {}
