import type {
  PerformanceEmployeeReport,
  PerformanceReportParams,
} from '#/lib/types/api/performanceReports'
import {
  performanceEmployeeColumns,
  performanceScorecardColumns,
} from '#/lib/constants/performanceReports'
import { reportCell } from './attendanceReports'

export function performanceReportColumns(params: PerformanceReportParams) {
  return [
    { value: 'name', label: 'Employee' },
    ...performanceEmployeeColumns.filter((column) =>
      params.columns.includes(column.value),
    ),
    ...performanceScorecardColumns,
  ]
}

export function performanceReportRows(
  reports: PerformanceEmployeeReport[],
): Record<string, unknown>[] {
  return reports.flatMap((employee) => {
    const identity = {
      ...Object.fromEntries(
        Object.entries(employee).filter(([key]) => key !== 'scorecards'),
      ),
      name: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
    }
    const scorecards = employee.scorecards.map((card) => ({
      ...identity,
      appraisal_group: card.appraisalGroup.name,
      appraisal_period: card.appraisalGroup.appraisalPeriod?.name,
      appraisal_year: card.appraisalGroup.appraisal_year,
      approval_status: card.approval_status,
      grade_score: card.grade_score,
      created_at: card.created_at,
    }))
    return scorecards.length
      ? scorecards
      : [
          {
            ...identity,
            appraisal_group:
              'No approved scorecards from ended appraisal groups',
          },
        ]
  })
}

export function performanceDisplayValue(value: unknown) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, unknown>
    return reportCell(
      record.name ??
        record.station_name ??
        record.department_name ??
        record.grade_name ??
        value,
    )
  }
  return reportCell(value)
}
