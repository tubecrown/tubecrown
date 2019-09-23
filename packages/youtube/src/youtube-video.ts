import { Thumbnails } from './youtube-thumbnail'

export interface VideoSnippet {
  readonly publishedAt: string
  readonly title: string
  readonly thumbnails: Thumbnails
  readonly channelId: string
  readonly channelTitle: string
}

export interface VideoContentDetails {
  readonly duration: string
}

export interface VideoStatistics {
  readonly viewCount: string
}

export interface SearchVideoParams {
  startDate: string
  endDate: string
  regionCode: string
  maxResults: number
  pageToken?: string
}

export interface SearchVideoId {
  videoId: string
}

export interface SearchVideoResult {
  readonly etag: string
  readonly id: SearchVideoId
  readonly snippet: VideoSnippet
}

export interface Video {
  readonly etag: string
  readonly id: string
  readonly contentDetails: VideoContentDetails
  readonly statistics: VideoStatistics
}
