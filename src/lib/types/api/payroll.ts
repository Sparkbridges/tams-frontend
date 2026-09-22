import type { TGetApiResponse } from './request.types'

export type TVerifyAccountNumberResponse = TGetApiResponse<{
  account_number: string
  account_name: string
  bank_id: number
}>
