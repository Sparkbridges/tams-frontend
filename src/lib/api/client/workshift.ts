import { Client } from '#/lib/config'
import type { TGetApiResponse } from '#/lib/types/api/request.types'
import type {
  AssignWorkshiftPayload,
  CalendarDay,
  CalendarParams,
  ClockSetting,
  ClockValue,
  RosterParams,
  RosterResult,
  ShiftType,
  Workshift,
  WorkshiftPayload,
} from '#/lib/types/api/workshift'
import { ENDPOINTS } from './endpoints'

const base = ENDPOINTS.attendanceWorkshifts
type AttendanceResponse<T> = TGetApiResponse<T>
type AttendancePage<T> = { results: T[]; total: number }
const workshiftClient = {
  list: (params: { page: number; per_page: number; search_query?: string }) =>
    Client.get<AttendanceResponse<AttendancePage<Workshift>>>(base, { params }),
  detail: (id: number) =>
    Client.get<AttendanceResponse<Workshift>>(`${base}/${id}`),
  create: (payload: WorkshiftPayload) =>
    Client.post<AttendanceResponse<Workshift>>(base, payload),
  update: ({ id, ...payload }: WorkshiftPayload & { id: number }) =>
    Client.put<AttendanceResponse<Workshift>>(`${base}/${id}`, payload),
  remove: (id: number) =>
    Client.delete<AttendanceResponse<unknown>>(`${base}/${id}`, {
      params: { force: true },
    }),
  assign: (payload: AssignWorkshiftPayload) =>
    Client.post<AttendanceResponse<unknown>>(
      ENDPOINTS.attendanceWorkshiftAssignments,
      payload,
    ),
  unassign: (payload: { id: number; assignable_id: number }) =>
    Client.put<AttendanceResponse<unknown>>(`${base}/unassign`, payload),
  types: () =>
    Client.get<AttendanceResponse<ShiftType[]>>(ENDPOINTS.attendanceShiftTypes),
  saveTypes: (payload: { shift_types: ShiftType[] }) =>
    Client.post<AttendanceResponse<unknown>>(
      ENDPOINTS.attendanceShiftTypes,
      payload,
    ),
  removeType: (id: number) =>
    Client.delete<AttendanceResponse<unknown>>(
      `${ENDPOINTS.attendanceShiftTypes}/${id}`,
    ),
  calendar: (params: CalendarParams) =>
    Client.get<AttendanceResponse<CalendarDay[]>>(
      ENDPOINTS.attendanceCalendar,
      { params },
    ),
  roster: (params: RosterParams & { page: number; perPage: number }) =>
    Client.get<AttendanceResponse<RosterResult>>(ENDPOINTS.attendanceRoster, {
      params,
    }),
  exportRoster: (params: RosterParams & { page: number; perPage: number }) =>
    Client.post<AttendanceResponse<string>>(
      `${ENDPOINTS.attendanceRoster}/download/csv`,
      params,
    ),
  downloadRosterFile: (filename: string) => {
    if (!filename || /[/\\]/.test(filename))
      throw new Error('Invalid roster download filename')
    const url = new URL(
      `/downloads/${encodeURIComponent(filename)}`,
      import.meta.env.VITE_BACKEND_URL,
    )
    return Client.get<Blob>(url.href, { responseType: 'blob' })
  },
  clock: () =>
    Client.get<AttendanceResponse<ClockSetting>>(ENDPOINTS.attendanceSettings, {
      params: { name: 'IGNORE_FUNCTION_KEY' },
    }),
  saveClock: (value: ClockValue) =>
    Client.post<AttendanceResponse<unknown>>(
      ENDPOINTS.attendanceSettings,
      { name: 'IGNORE_FUNCTION_KEY', is_generic: true, value },
      { params: { name: 'IGNORE_FUNCTION_KEY' } },
    ),
}
export default workshiftClient
