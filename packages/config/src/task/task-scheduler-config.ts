import config from 'config'

export interface TaskSchedulerConfig {
  readonly cron: string
}

export const getTaskSchedulerConfig = () => config.get<TaskSchedulerConfig>('taskScheduler')
