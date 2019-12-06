import { getYouTubeConfig, YouTubeConfig } from '@tubecrown/config/lib/youtube'
import { ListResponse } from './youtube-list-response'
import { MockApiClient } from './youtube-mock-api-client'
import { RealApiClient } from './youtube-real-api-client'
import { SearchVideoParams, SearchVideoResult, Video } from './youtube-video'

const config: YouTubeConfig = getYouTubeConfig()

export interface ApiClient {
  searchVideos (searchVideoParams: SearchVideoParams): Promise<ListResponse<SearchVideoResult>>
  getVideoDetails (videoIds: string[]): Promise<Record<string, Video>>
}

export const createApiClient = (): ApiClient => (config.useMockData ? new MockApiClient() : new RealApiClient())
