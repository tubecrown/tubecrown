import axios, { AxiosInstance } from 'axios'
import { Config } from './youtube-config'
import { ListResponse } from './youtube-list-response'
import { SearchVideoParams, SearchVideoResult } from './youtube-video'

export class ApiClient {
  private readonly http: AxiosInstance

  constructor (private readonly config: Config) {
    this.http = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
    })
  }

  async searchVideos (searchVideoParams: SearchVideoParams): Promise<ListResponse<SearchVideoResult>> {
    const { startDate, endDate, regionCode, maxResults } = searchVideoParams
    return (await this.http.get<ListResponse<SearchVideoResult>>('search', {
      params: {
        type: 'video',
        part: 'snippet',
        videoEmbeddable: true,
        order: 'viewCount',
        publishedAfter: startDate,
        publishedBefore: endDate,
        regionCode,
        maxResults,
        key: this.config.apiKey,
      },
    })).data
  }
}
