import type { TCompanyDetailsType, TUser } from '../store.types'
import type { TGetApiResponse, TPostApiResponse } from './request.types'

export type TVerifyCompanyUrlResponse = TPostApiResponse<TCompanyDetailsType>

export type TLoginPayload = {
  company_id: string
  username: string
  password: string
  client_id?: number | string
  client_secret?: string
  grant_type?: string
}

export type TLoginResponse = {
  access_token: string
  refresh_token: string
  token_type: 'Bearer'
  expires_in: number
}

export type TGetUserResponse = TGetApiResponse<TUser>
export type TLogoutResponse = TPostApiResponse<boolean>
