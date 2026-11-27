import type { TGetApiResponse } from './request.types'
import type { TRecruitmentJobPosting } from './recruitment'

export type TApplicantStatus =
  'pending' | 'shortlisted' | 'completed' | 'rejected'
export type TScreeningRequirements = {
  required_skills: string[]
  preferred_skills: string[]
  qualifications: string[]
  minimum_years_experience: number | null
}
export type TScreeningResult = {
  status: 'complete' | 'needs_cv' | 'needs_requirements' | 'unreadable'
  version: string
  assessed_at: string
  message: string
  findings: {
    requirement: string
    category: 'required' | 'preferred' | 'qualification'
    outcome: 'mentioned' | 'not_mentioned' | 'needs_review'
    evidence: string | null
  }[]
  experience: {
    minimum: number | null
    declared: number
    outcome: 'not_required' | 'declared_meets' | 'declared_below'
  }
}
export type TApplicant = {
  id: number
  job_posting_id: number
  name: string
  email: string
  phone_number: string
  years_of_experience: number
  source: 'website' | 'upload'
  status: TApplicantStatus
  created_at: string
  resume_url: string | null
  custom_answers: unknown
  interview_date: string | null
  interview_time: string | null
  job_posting: TRecruitmentJobPosting
  screening?: TScreeningResult | null
  screening_stale?: boolean
  screening_status?: TScreeningResult['status'] | 'not_assessed'
}
export type TApplicantParams = {
  page: number
  per_page: number
  job_posting_id: number
  status?: TApplicantStatus[]
  search_query?: string
  source?: 'website' | 'upload'
  years_of_experience_min?: number
  years_of_experience_max?: number
}
export type TUpdateApplicantStatus = {
  job_id: number
  application_ids: number[]
  status: TApplicantStatus
  interview_date?: string
  interview_time?: string
}
export type TApplicantListResponse = TGetApiResponse<{
  results: TApplicant[]
  total: number
}>
export type TApplicantResponse = TGetApiResponse<TApplicant>
export type TScreeningRequirementsResponse = TGetApiResponse<{
  requirements: TScreeningRequirements
  role: string
  description: string
}>
export type TApplicantStatisticsResponse = TGetApiResponse<{
  total_applications: number | string
  pending_applications: number | null
  shortlisted_applications: number | null
  completed_applications: number | null
  rejected_applications: number | null
  totalJobPosting: number
}>
export type TCsvFieldsResponse = TGetApiResponse<{
  fieldsFromCSV: string[]
  applicantsUploadFields: { label: string; value: string }[]
}>
