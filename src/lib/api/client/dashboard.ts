import { Client } from '#/lib/config'
import type {
  TFetchAttendanceDashboardPunctualityParams,
  TFetchEmployeeHomeDetailsResponse,
} from '#/lib/types'
import { ENDPOINTS } from './endpoints'

const dashboardClient = {
  /**
   * Description - fetch employee home details.
   * @returns Data fetched from `/home/admin`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchEmployeeHomeDetails: async () => {
    return await Client.get<TFetchEmployeeHomeDetailsResponse>(
      ENDPOINTS.fetchEmployeeHomeDetails,
    )
  },

  /**
   * Description - fetch attendance dashboard punctuality.
   * @param params - Parameters for fetching attendance dashboard punctuality.
   * @returns Data fetched from `/attendance/dashboard/punctuality`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchAttendanceDashboardPunctuality: async (
    params: TFetchAttendanceDashboardPunctualityParams,
  ) => {
    return await Client.get(ENDPOINTS.fetchAttendanceDashboardPunctuality, {
      params,
    })
  },
}

export default dashboardClient
