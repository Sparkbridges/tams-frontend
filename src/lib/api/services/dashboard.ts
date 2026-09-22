import dashboardClient from "#/lib/api/client/dashboard"
import { useQuery } from "@tanstack/react-query"
import { ENDPOINTS } from "../client"
import type { TFetchAttendanceDashboardPunctualityParams } from "#/lib/types"

export const useFetchEmployeeHomeDetails = () => {
    return useQuery({
      queryKey: [ENDPOINTS.fetchEmployeeHomeDetails],
      queryFn: dashboardClient.fetchEmployeeHomeDetails,
    })
}

export const useFetchAttendanceDashboardPunctuality = (params: TFetchAttendanceDashboardPunctualityParams) => {
  return useQuery({
    queryKey: [ENDPOINTS.fetchAttendanceDashboardPunctuality, params],
    queryFn: () => dashboardClient.fetchAttendanceDashboardPunctuality(params),
  })
}