import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS, recruitmentClient } from '../client'
import { notifications } from '@mantine/notifications'
import type {
  TRecruitmentJobRequestsParams,
  TRecruitmentJobRequestsResponse,
} from '#/lib/types'
import { useTamsStore } from '#/lib/store'

export function useRecruitmentAccess() {
  const user = useTamsStore((state) => state.user)
  return {
    canViewTalentRequests:
      user?.permissions.includes('get all talent requests') ?? false,
    canCreateTalentRequest:
      user?.permissions.includes('create talent request') ?? false,
    canApproveTalentRequest:
      user?.permissions.includes('approve talent request') ?? false,
  }
}

export const useRecruitmentEmailTemplates = () => {
  return useQuery({
    queryKey: [ENDPOINTS.recruitmentEmailTemplates],
    queryFn: recruitmentClient.getRecruitmentEmailTemplates,
  })
}

export const useRecruitmentEmailTemplateById = (templateId: number) => {
  return useQuery({
    queryKey: [ENDPOINTS.recruitmentEmailTemplates, templateId],
    queryFn: () =>
      recruitmentClient.getRecruitmentEmailTemplateById(templateId),
    enabled: !!templateId,
  })
}

export const useUpdateRecruitmentEmailTemplateById = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.updateRecruitmentEmailTemplateById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentEmailTemplates],
      })
      notifications.show({
        title: 'Success',
        message: 'Recruitment email template updated successfully',
        color: 'green',
      })
    },
  })
}

export const useRecruitmentSettings = () => {
  return useQuery({
    queryKey: [ENDPOINTS.recruitmentSettings],
    queryFn: recruitmentClient.getRecruitmentSettings,
  })
}

export const useUpdateRecruitmentSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.updateRecruitmentSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentSettings],
      })
      notifications.show({
        title: 'Success',
        message: 'Recruitment settings updated successfully',
        color: 'green',
      })
    },
  })
}

export const useRecruitmentTalentRequests = <TSelected>(
  params?: TRecruitmentJobRequestsParams,
  select?: (data: TRecruitmentJobRequestsResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.recruitmentTalentRequests, params],
    queryFn: () => recruitmentClient.getRecruitmentJobRequests(params),
    select,
  })
}

export const useRecruitmentTalentRequestById = (requestId: number) => {
  return useQuery({
    queryKey: [ENDPOINTS.recruitmentTalentRequests, requestId],
    queryFn: () => recruitmentClient.getRecruitmentTalentRequestById(requestId),
    enabled: !!requestId,
  })
}

export const useUpdateRecruitmentTalentRequestStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.updateRecruitmentTalentRequestStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentTalentRequests],
      })
      notifications.show({
        title: 'Success',
        message: 'Recruitment talent request status updated successfully',
        color: 'green',
      })
    },
  })
}

export const useDeleteRecruitmentTalentRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.deleteRecruitmentTalentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentTalentRequests],
      })
      notifications.show({
        title: 'Success',
        message: 'Recruitment talent request deleted successfully',
        color: 'green',
      })
    },
  })
}

export const useCreateRecruitmentTalentRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.createRecruitmentTalentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentTalentRequests],
      })
      notifications.show({
        title: 'Success',
        message: 'Recruitment talent request created successfully',
        color: 'green',
      })
    },
  })
}

export const useEditRecruitmentTalentRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.editRecruitmentTalentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentTalentRequests],
      })
      notifications.show({
        title: 'Success',
        message: 'Recruitment talent request updated successfully',
        color: 'green',
      })
    },
  })
}
