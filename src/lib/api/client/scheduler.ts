import { Client } from '#/lib/config'
import type {
  TGetApiResponse,
  TPostApiResponse,
} from '#/lib/types/api/request.types'
import type {
  SaveSchedulesPayload,
  SchedulerEmployee,
  SchedulerParams,
} from '#/lib/types/api/scheduler'
import { ENDPOINTS } from './endpoints'

const schedulerClient = {
  list: (params: SchedulerParams) =>
    Client.get<
      TGetApiResponse<{
        results: SchedulerEmployee[]
        total: number
        dates: { date: string; readable_date: string; is_past: boolean }[]
      }>
    >(ENDPOINTS.attendanceSchedules, { params }),
  save: (payload: SaveSchedulesPayload) =>
    Client.post<TPostApiResponse<{ saved: number; skipped: number }>>(
      ENDPOINTS.attendanceSchedules,
      payload,
    ),
}
export default schedulerClient
