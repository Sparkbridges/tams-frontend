import { Client } from '#/lib/config'
import type {
  AttendanceReportParams,
  AttendanceReportResponse,
} from '#/lib/types/api/attendanceReports'
import type { TGetApiResponse } from '#/lib/types/api/request.types'
import { ENDPOINTS } from './endpoints'

const attendanceReportsClient = {
  generate: ({
    type,
    ...payload
  }: Omit<AttendanceReportParams, 'page'> & { page: number | 'all' }) =>
    Client.post<AttendanceReportResponse>(
      ENDPOINTS.attendanceReportGenerate.replace(':type', type),
      payload,
    ),
  download: ({ type, ...payload }: AttendanceReportParams) =>
    Client.post<TGetApiResponse<string>>(
      ENDPOINTS.attendanceReportDownload.replace(':type', type),
      payload,
    ),
  file: (filename: string) => {
    if (!filename || /[/\\]/.test(filename))
      throw new Error('Invalid report download filename')
    const url = new URL(
      `/downloads/${encodeURIComponent(filename)}`,
      import.meta.env.VITE_BACKEND_URL,
    )
    return Client.get<Blob>(url.href, { responseType: 'blob' })
  },
}
export default attendanceReportsClient
