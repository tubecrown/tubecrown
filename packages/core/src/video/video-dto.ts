export class VideoDto {
  readonly id: string
  readonly titleHtml: string
  readonly publishedAt: string
  readonly thumbnail: string
  readonly channelTitle: string

  constructor (videoDtoOptions: VideoDto) {
    const { id, titleHtml, publishedAt, thumbnail, channelTitle } = videoDtoOptions
    this.id = id
    this.titleHtml = titleHtml
    this.publishedAt = publishedAt
    this.thumbnail = thumbnail
    this.channelTitle = channelTitle
  }
}
