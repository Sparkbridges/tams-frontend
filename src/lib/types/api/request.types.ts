export type TGetApiResponseWithPagination<T> = {
  statusCode: number
  success: boolean
  message: string
  data: T
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TGetApiResponse<T> = {
  status: boolean
  message: string
  data: T
  path: string
}

export type TPostApiResponse<T> = {
  status: boolean
  message: string
  data: T
}
