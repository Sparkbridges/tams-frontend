import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS, recruitmentClient } from '../client'
import { notifications } from '@mantine/notifications'
import type {
  TRecruitmentJobPostingsResponse,
  TRecruitmentJobRequestsParams,
  TRecruitmentJobRequestsResponse,
} from '#/lib/types'
import { useTamsStore } from '#/lib/store'

export function useRecruitmentAccess() {
  const user = useTamsStore((state) => state.user)
  return {
    canViewApplicants:
      user?.permissions.includes('get all job applications') ?? false,
    canViewApplicantDetails:
      user?.permissions.includes('get one job application') ?? false,
    canUpdateApplicants:
      user?.permissions.includes('update job application status') ?? false,
    canDeleteApplicants:
      user?.permissions.includes('delete job applications') ?? false,
    canViewTalentRequests:
      user?.permissions.includes('get all talent requests') ?? false,
    canCreateTalentRequest:
      user?.permissions.includes('create talent request') ?? false,
    canApproveTalentRequest:
      user?.permissions.includes('approve talent request') ?? false,

    canViewJobPostings:
      user?.permissions.includes('get all job postings') ?? false,
    canCreateJobPosting:
      user?.permissions.includes('create job posting') ?? false,
    canViewJobPostingDetails:
      user?.permissions.includes('get one job posting') ?? false,
    canDeleteJobPosting:
      user?.permissions.includes('delete job posting') ?? false,
    canPublishJobPosting:
      user?.permissions.includes('publish job posting') ?? false,
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
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentJobPostings],
      })
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentJobPostingsArchived],
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

export const useFetchRecruitmentJobPostings = <TSelected>(
  params?: TRecruitmentJobRequestsParams,
  select?: (data: TRecruitmentJobPostingsResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.recruitmentJobPostings, params],
    queryFn: () => recruitmentClient.fetchRecruitmentJobPostings(params),
    select,
  })
}

export const useFetchRecruitmentJobPostingsArchived = <TSelected>(
  params?: TRecruitmentJobRequestsParams,
  select?: (data: TRecruitmentJobPostingsResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.recruitmentJobPostingsArchived, params],
    queryFn: () =>
      recruitmentClient.fetchRecruitmentJobPostingsArchived(params),
    select,
  })
}

export const useFetchRecruitmentJobPostingById = (id: number) => {
  return useQuery({
    queryKey: [ENDPOINTS.recruitmentJobPostings, id],
    queryFn: () => recruitmentClient.fetchRecruitmentJobPostingById(id),
    enabled: !!id,
  })
}

export const useUpdateRecruitmentJobPostingStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.updateRecruitmentJobPostingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentJobPostings],
      })
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentTalentRequests],
      })
      notifications.show({
        title: 'Success',
        message: 'Recruitment job posting status updated successfully',
        color: 'green',
      })
    },
  })
}

export const useDeleteRecruitmentJobPosting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.deleteRecruitmentJobPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentJobPostingsArchived],
      })
      notifications.show({
        title: 'Success',
        message: 'Recruitment job posting deleted successfully',
        color: 'green',
      })
    },
  })
}

export const useRestoreArchivedRecruitmentJobPostings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.restoreArchivedRecruitmentJobPostings,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.recruitmentJobPostingsArchived],
        }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.recruitmentJobPostings],
        }),
      ])

      notifications.show({
        title: 'Success',
        message: 'Archived recruitment job postings restored successfully',
        color: 'green',
      })
    },
  })
}

export const useArchiveRecruitmentJobPosting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.archiveRecruitmentJobPosting,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.recruitmentJobPostingsArchived],
        }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.recruitmentJobPostings],
        }),
      ])

      notifications.show({
        title: 'Success',
        message: 'Recruitment job posting archived successfully',
        color: 'green',
      })
    },
  })
}

export const useEditRecruitmentJobPosting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.editRecruitmentJobPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentJobPostings],
      })
      notifications.show({
        title: 'Success',
        message: 'Recruitment job posting updated successfully',
        color: 'green',
      })
    },
  })
}

export const useCreateRecruitmentJobPosting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recruitmentClient.createRecruitmentJobPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.recruitmentJobPostings],
      })
      notifications.show({
        title: 'Success',
        message: 'Recruitment job posting created successfully',
        color: 'green',
      })
    },
  })
}
