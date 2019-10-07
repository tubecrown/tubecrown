import { DataOnly } from '../utils/data-only'

export class VideoDto {
  readonly id: string
  readonly titleHtml: string
  readonly publishedAt: string
  readonly thumbnail: string
  readonly channelId: string
  readonly channelTitle: string
  readonly duration: string
  readonly viewCount: number

  constructor (videoDtoOptions: DataOnly<VideoDto>) {
    const { id, titleHtml, publishedAt, thumbnail, channelId, channelTitle, duration, viewCount } = videoDtoOptions
    this.id = id
    this.titleHtml = titleHtml
    this.publishedAt = publishedAt
    this.thumbnail = thumbnail
    this.channelId = channelId
    this.channelTitle = channelTitle
    this.duration = duration
    this.viewCount = viewCount
  }

  __isDto () {
    return true
  }
}
