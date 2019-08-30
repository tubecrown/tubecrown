export class VideoDto {
  readonly id: string
  readonly title: string

  constructor (videoDtoOptions: VideoDto) {
    const { id, title } = videoDtoOptions
    this.id = id
    this.title = title
  }
}
