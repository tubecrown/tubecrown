export interface PageInfo {
  totalResults: number
  resultsPerPage: number
}

export interface ListResponse<T> {
  readonly etag: string
  readonly prevPageToken?: string
  readonly nextPageToken?: string
  readonly pageInfo: PageInfo
  readonly items: T[]
}
