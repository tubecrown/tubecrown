import config from 'config'

export interface YouTubeConfig {
  readonly useMockData: boolean
  readonly apiKey: string
  readonly cacheUri: string
}

export const getYouTubeConfig = () => config.get<YouTubeConfig>('youTube')
