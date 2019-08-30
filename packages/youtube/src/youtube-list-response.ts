export interface ListResponse<T> {
  readonly etag: string
  readonly prevPageToken?: string
  readonly nextPageToken?: string
  readonly items: T[]
}
