import axios, { AxiosInstance, AxiosResponse } from 'axios'
import Keyv from 'keyv'
import { Config } from './youtube-config'
import { ListResponse } from './youtube-list-response'
import { SearchVideoParams, SearchVideoResult } from './youtube-video'

export class ApiClient {
  private readonly http: AxiosInstance
  private readonly cache: Keyv

  constructor (private readonly config: Config) {
    this.http = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
    })
    this.cache = new Keyv(config.cacheUri, {
      ttl: 24 * 60 * 60 * 1000,
    })
  }

  searchVideos (searchVideoParams: SearchVideoParams): Promise<ListResponse<SearchVideoResult>> {
    const { startDate, endDate, regionCode, maxResults } = searchVideoParams
    const cacheKey = `searchVideos/${[startDate, endDate, regionCode, maxResults].join('&')}`
    return this.requestWithCache(cacheKey, this.http.get<ListResponse<SearchVideoResult>>('search', {
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
    }))
  }

  private async requestWithCache<T> (cacheKey: string, request: Promise<AxiosResponse<T>>): Promise<T> {
    const cachedResponse: T | undefined = await this.cache.get(cacheKey)
    if (cachedResponse) {
      return cachedResponse
    }
    const response = (await request).data
    await this.cache.set(cacheKey, response)
    return response
  }
}
