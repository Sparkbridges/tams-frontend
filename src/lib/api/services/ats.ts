import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { atsClient } from '../client/ats'
import { ENDPOINTS } from '../client/endpoints'
import { useRecruitmentAccess } from './recruitment'
import type { TApplicantParams } from '#/lib/types/api/ats'

const key = ENDPOINTS.recruitmentApplicants

export function useApplicants(params: TApplicantParams) {
  const { canViewApplicants } = useRecruitmentAccess()
  return useQuery({
    queryKey: [key, 'list', params],
    queryFn: () => atsClient.list(params),
    enabled: canViewApplicants,
  })
}
export function useApplicant(id: number | null, opened: boolean) {
  const { canViewApplicantDetails } = useRecruitmentAccess()
  return useQuery({
    queryKey: [key, 'detail', id],
    queryFn: () => atsClient.detail(id!),
    enabled: opened && !!id && canViewApplicantDetails,
  })
}
export function useApplicantStatistics(params: {
  job_posting_id?: number
  start_date?: string
  end_date?: string
}) {
  const { canViewApplicants } = useRecruitmentAccess()
  return useQuery({
    queryKey: [key, 'statistics', params],
    queryFn: () => atsClient.statistics(params),
    enabled: canViewApplicants,
  })
}
export function useScreeningRequirements(id: number, enabled: boolean) {
  const { canViewApplicants } = useRecruitmentAccess()
  return useQuery({
    queryKey: [key, 'requirements', id],
    queryFn: () => atsClient.requirements(id),
    enabled: enabled && canViewApplicants,
  })
}

function useAtsMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  message: string,
) {
  const client = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: [key] })
      notifications.show({ title: 'Success', message, color: 'green' })
    },
  })
}
export const useUpdateApplicants = () =>
  useAtsMutation(
    atsClient.updateStatus,
    'Applicant status updated successfully',
  )
export const useDeleteApplicant = () =>
  useAtsMutation(atsClient.delete, 'Application deleted successfully')
export const useSaveScreeningRequirements = () =>
  useAtsMutation(
    atsClient.saveRequirements,
    'Screening requirements saved. Existing assessments may need to be rerun.',
  )
export const useScreenApplicant = () =>
  useAtsMutation(
    atsClient.screen,
    'CV screening finished. Review the assessment before making a decision.',
  )
export const useImportApplicants = () =>
  useAtsMutation(atsClient.import, 'Applicants imported successfully')
export const useApplicantCsvFields = () =>
  useMutation({ mutationFn: atsClient.csvFields })
export const useApplicantDocumentUrl = () =>
  useMutation({ mutationFn: atsClient.documentUrl })
