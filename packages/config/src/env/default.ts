import path from 'path'
import { YouTubeConfig } from '../youtube-config'

export const youTube: YouTubeConfig = {
  apiKey: 'YOUTUBE_API_KEY',
  cacheUri: `sqlite://${path.join(__dirname, '../../../../tmp/youtube-api.sqlite')}`,
}

export const postgres = {
  host: 'localhost',
  port: 5432,
  database: 'tubecrown',
  username: 'tubecrown_postgres',
  password: 'tubecrown_secret',
}
