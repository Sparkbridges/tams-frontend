export type PerformanceReportScope =
  'branch' | 'department' | 'team' | 'grade' | 'employee'

export type PerformanceReportParams = {
  fetch_by: PerformanceReportScope
  fetch_by_id: number[]
  branch_id?: number
  columns: string[]
  year: number
  group_by: 'employee'
  page: number
  perPage: number
}

export type PerformanceAreaReport = {
  id: number
  name: string
  weight: number
  kpiCategories: {
    id: number
    name: string
    kpiSubcategories: { id: number; name: string; weight: number }[]
  }[]
}

export type PerformanceScorecard = {
  id: number
  approval_status: string
  grade_score?: number | null
  created_at: string
  employee: { id: number }
  appraisalGroup: {
    id: number
    name: string
    appraisal_year: number
    appraisalPeriod: { id: number; name: string } | null
    performanceAreas: PerformanceAreaReport[]
  }
}

export type PerformanceEmployeeReport = {
  id: number
  first_name: string
  last_name: string
  scorecards: PerformanceScorecard[]
  [key: string]: unknown
}

export type PerformanceReportResponse = {
  data: { reports: PerformanceEmployeeReport[]; total: number }
  message: string
}
