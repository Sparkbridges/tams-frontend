import { Client } from '#/lib/config'
import type {
  TApplicantListResponse,
  TApplicantParams,
  TApplicantResponse,
  TApplicantStatisticsResponse,
  TCsvFieldsResponse,
  TScreeningRequirements,
  TScreeningRequirementsResponse,
  TScreeningResult,
  TUpdateApplicantStatus,
} from '#/lib/types/api/ats'
import type { TGetApiResponse } from '#/lib/types/api/request.types'
import { ENDPOINTS } from './endpoints'

const endpoint = ENDPOINTS.recruitmentApplicants
export const atsClient = {
  documentUrl: (path: string) =>
    Client.get<TGetApiResponse<string>>(ENDPOINTS.documentSignedUrl, {
      params: { path },
    }),
  list: (params: TApplicantParams) =>
    Client.get<TApplicantListResponse>(endpoint, { params }),
  detail: (id: number) => Client.get<TApplicantResponse>(`${endpoint}/${id}`),
  updateStatus: (data: TUpdateApplicantStatus) =>
    Client.put(`${endpoint}/update-status`, data),
  delete: (id: number) => Client.delete(`${endpoint}/${id}`),
  statistics: (params: {
    job_posting_id?: number
    start_date?: string
    end_date?: string
  }) =>
    Client.get<TApplicantStatisticsResponse>(`${endpoint}/dashboard`, {
      params,
    }),
  requirements: (id: number) =>
    Client.get<TScreeningRequirementsResponse>(
      `${endpoint}/requirements/${id}`,
    ),
  saveRequirements: ({
    id,
    ...data
  }: TScreeningRequirements & { id: number }) =>
    Client.put(`${endpoint}/requirements/${id}`, data),
  screen: ({ id, file }: { id: number; file?: File }) => {
    const data = new FormData()
    if (file) data.append('file', file)
    return Client.post<TGetApiResponse<TScreeningResult>>(
      `${endpoint}/${id}/screen`,
      data,
    )
  },
  csvFields: (file: File) => {
    const data = new FormData()
    data.append('applicantsFile', file)
    return Client.post<TCsvFieldsResponse>(
      `${endpoint}/get-fields-from-csv`,
      data,
    )
  },
  import: ({
    file,
    fields,
  }: {
    file: File
    fields: { label: string; value: string | null }[]
  }) => {
    const data = new FormData()
    data.append('applicantsFile', file)
    data.append('fields', JSON.stringify(fields))
    return Client.post<TGetApiResponse<{ imported: number }>>(
      `${endpoint}/upload`,
      data,
    )
  },
}
