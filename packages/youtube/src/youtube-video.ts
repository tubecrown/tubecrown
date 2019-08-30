import { Thumbnails } from './youtube-thumbnail'

export interface VideoSnippet {
  readonly publishedAt: string
  readonly title: string
  readonly thumbnails: Thumbnails
  readonly channelId: string
  readonly channelTitle: string
}

export interface SearchVideoParams {
  startDate: string
  endDate: string
  regionCode: string
  maxResults: number
}

export interface SearchVideoId {
  videoId: string
}

export interface SearchVideoResult {
  readonly etag: string
  readonly id: SearchVideoId
  readonly snippet: VideoSnippet
}
