import path from 'path'
import { PostgresConfig } from '../postgres'
import { TaskSchedulerConfig } from '../task'
import { YouTubeConfig } from '../youtube'

export const youTube: YouTubeConfig = {
  useMockData: false,
  apiKey: 'YOUTUBE_API_KEY',
  cacheUri: `sqlite://${path.join(__dirname, '../../../../tmp/youtube-api.sqlite')}`,
}

export const taskScheduler: TaskSchedulerConfig = {
  cron: '0 */1 * * * *', // every minute
}

export const postgres: PostgresConfig = {
  host: 'localhost',
  hostForApi: 'postgres',
  port: 5432,
  database: 'tubecrown',
  username: 'tubecrown_postgres',
  password: 'tubecrown_secret',
}
