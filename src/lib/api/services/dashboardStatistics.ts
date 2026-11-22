import { useQuery } from '@tanstack/react-query'
import { dashboardStatisticsClient } from '../client/dashboardStatistics'
import type {
  AttendanceStatistics,
  DashboardParams,
  HrmStatistics,
} from '../client/dashboardStatistics'
import { useAttendanceScope } from './attendance'

export function useHrmStatistic<T extends keyof HrmStatistics>(
  type: T,
  params: DashboardParams,
) {
  const scope = useAttendanceScope()
  return useQuery({
    queryKey: ['hrm-dashboard', scope, type, params],
    queryFn: () => dashboardStatisticsClient.hrm(type, params),
    retry: false,
  })
}

export function useAttendanceStatistic<T extends keyof AttendanceStatistics>(
  type: T,
  params: DashboardParams,
) {
  const scope = useAttendanceScope()
  return useQuery({
    queryKey: ['attendance-dashboard', scope, type, params],
    queryFn: () => dashboardStatisticsClient.attendance(type, params),
    retry: false,
  })
}
