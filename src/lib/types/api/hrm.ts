import type {
  TBaseQueryParams,
  TGetApiResponse,
  TPostApiResponse,
} from './request.types'

export type TFetchHrmExemptionsParams = TBaseQueryParams & {
  status?: string
  start_date?: string
  end_date?: string
}

export type TFetchHrmExemptionsData = {
  id: number
  reason: string
  exemption_type: string
  employee_id: number
  approval_status: string
  exemption_date: string[]
  approval_note: null
  created_at: string
  updated_at: string
  company_id: number
  station_id: number
  exemption_approval_status: number
  rejection_reason: string | null
  employee_name: string
  exemptionsdate: {
    id: number
    exemption_date: string
  }[]
}
export type TFetchHrmExemptionsResponse = TGetApiResponse<{
  results: TFetchHrmExemptionsData[]
  total: number
}>

export type TFetchHrmExemptionByIdData = {
  id: number
  reason: string
  exemption_type: string
  employee_id: number
  approval_status: string
  exemption_date: string[]
  approval_note: string | null
  created_at: string
  updated_at: string
  company_id: number
  station_id: number
  exemption_approval_status: number
  rejection_reason: string | null
  exemptionsdate: {
    id: number
    exemption_date: string
  }[]
  employees: {
    id: number
    employee_name: string
  }[]
}

export type TFetchHrmExemptionByIdResponse =
  TGetApiResponse<TFetchHrmExemptionByIdData>

export type TCreateHrmExemptionResponse = TPostApiResponse<{
  reason: string
  exemption_type: string
  employee_id: number
  company_id: number
  station_id: number
  exemption_date: string[]
  created_at: string
  updated_at: string
  id: number
}>

export type TCanApproveHrmExemptionResponse = TGetApiResponse<boolean>

export type TApproveHrmExemptionPayload = {
  exemption_request_ids: number[]
}
