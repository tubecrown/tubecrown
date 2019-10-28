import config from 'config'

export interface TaskScheduleConfig {
  readonly cron: string
}

export const getTaskScheduleConfig = () => config.get<TaskScheduleConfig>('taskSchedule')
