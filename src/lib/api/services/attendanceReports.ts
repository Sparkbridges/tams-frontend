import { useQuery } from '@tanstack/react-query'
import { useTamsStore } from '#/lib/store'
import { attendanceReportTypes } from '#/lib/constants/attendanceReports'
import type { AttendanceReportParams } from '#/lib/types/api/attendanceReports'
import attendanceReportsClient from '../client/attendanceReports'
import organizationClient from '../client/organization'
import { useAttendanceScope } from './attendance'

async function fetchReportOptions<T>(
  request: (page: number) => Promise<{ data: { results: T[]; total: number } }>,
) {
  const results: T[] = []
  let page = 1
  let total = 0
  do {
    const response = await request(page)
    total = response.data.total
    if (!response.data.results.length && results.length < total)
      throw new Error('Unable to load the complete report filter options')
    results.push(...response.data.results)
    page++
  } while (results.length < total)
  return results
}

export function useAttendanceReportAccess() {
  const permissions = useTamsStore((state) => state.user?.permissions ?? [])
  return attendanceReportTypes.filter((report) =>
    permissions.some(
      (permission) =>
        permission === `view ${report.value.toLowerCase()} report`,
    ),
  )
}

export function useAttendanceReport(params: AttendanceReportParams | null) {
  const scope = useAttendanceScope()
  const allowed = useAttendanceReportAccess()
  return useQuery({
    queryKey: ['attendance-reports', scope, params],
    queryFn: () => {
      if (!params) throw new Error('Generate an attendance report first')
      return attendanceReportsClient.generate(params)
    },
    enabled: !!params && allowed.some((report) => report.value === params.type),
    retry: false,
  })
}

export function useAttendanceReportTeams(enabled: boolean, search: string) {
  const scope = useAttendanceScope()
  return useQuery({
    queryKey: ['attendance-reports', scope, 'teams', search],
    queryFn: () =>
      fetchReportOptions((page) =>
        organizationClient.fetchOrganizationTeams({
          page,
          perPage: 100,
          search_query: search,
        }),
      ),
    enabled,
  })
}

export function useAttendanceReportGrades(enabled: boolean) {
  const scope = useAttendanceScope()
  return useQuery({
    queryKey: ['attendance-reports', scope, 'grades'],
    queryFn: () =>
      fetchReportOptions((page) =>
        organizationClient.getEmployeeGrades({ page, perPage: 100 }),
      ),
    enabled,
  })
}

export function useAttendanceReportBranches() {
  const scope = useAttendanceScope()
  return useQuery({
    queryKey: ['attendance-reports', scope, 'branches'],
    queryFn: () =>
      fetchReportOptions((page) =>
        organizationClient.fetchOrganizationBranches({ page, perPage: 100 }),
      ),
  })
}
