import config from 'config'

export interface TaskConfig {
  readonly cron: string
}

export const getTaskConfig = () => config.get<TaskConfig>('task')
