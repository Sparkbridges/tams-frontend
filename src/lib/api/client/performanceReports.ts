import { Client } from '#/lib/config'
import type {
  PerformanceReportParams,
  PerformanceReportResponse,
} from '#/lib/types/api/performanceReports'
import { performanceReportSchema } from '#/lib/utils/schema/performanceReports.schema'

const performanceReportsClient = {
  generate: (params: PerformanceReportParams) =>
    Client.post<PerformanceReportResponse>(
      '/hrm/appraisals/reports',
      performanceReportSchema.parse(params),
    ),
  async all(params: PerformanceReportParams) {
    const reports: PerformanceReportResponse['data']['reports'] = []
    let page = 1
    let total = 0
    do {
      const response = await performanceReportsClient.generate({
        ...params,
        page,
        perPage: 100,
      })
      total = response.data.total
      if (total > 10000)
        throw new Error(
          'Report export exceeds 10,000 employees. Narrow the workforce criteria.',
        )
      if (!response.data.reports.length && reports.length < total) {
        throw new Error(
          'Unable to export the complete report. Refresh and try again.',
        )
      }
      reports.push(...response.data.reports)
      page++
    } while (reports.length < total)
    if (
      new Set(reports.map((employee) => employee.id)).size !== reports.length ||
      reports.length !== total
    ) {
      throw new Error('Report changed during export. Refresh and try again.')
    }
    return reports
  },
}

export default performanceReportsClient
