import path from 'path'
import { PostgresConfig } from '../postgres-config'
import { TaskConfig } from '../task-config'
import { YouTubeConfig } from '../youtube-config'

export const youTube: YouTubeConfig = {
  apiKey: 'YOUTUBE_API_KEY',
  cacheUri: `sqlite://${path.join(__dirname, '../../../../tmp/youtube-api.sqlite')}`,
}

export const task: TaskConfig = {
  cron: '0 */1 * * * *', // every minute
}

export const postgres: PostgresConfig = {
  host: 'localhost',
  port: 5432,
  database: 'tubecrown',
  username: 'tubecrown_postgres',
  password: 'tubecrown_secret',
}
