import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS } from '../client'
import type { TBaseQueryParams } from '#/lib/types'
import { performanceClient } from '../client/performance'
import type {
  TFetchPerformanceAppraisalGeneralSettingsResponse,
  TFetchPerformanceAppraisalGradingSettingsResponse,
  TFetchPerformanceAppraiserSettingsResponse,
  TUpdatePerformanceAppraisalGeneralSettingsPayload,
  TUpdatePerformanceAppraisalGradingSettingsPayload,
  AppraisalPeopleKind,
  TFetchPerformanceApproverSettingsResponse,
  TSaveAppraisalPeopleSettingPayload,
  TFetchPerformanceTrainingsResponse,
  TPerformanceTrainingParams,
  TFetchPerformanceTrainingByIdResponse,
  TCreatePerformanceTaskProjectParams,
  TFetchPerformanceTaskProjectsResponse,
  TUpdateProjectStatusPayload,
  TFetchProjectKanbanTasksParams,
  TMoveProjectKanbanTaskPayload,
  TFetchPerformanceTaskProjectByIdResponse,
  TFetchProjectKanbanStatusesResponse,
  TCreateTasksByProjectIdResponse,
} from '#/lib/types/api/performance'
import { notifications } from '@mantine/notifications'
import { useTamsStore } from '#/lib/store'
import type {
  TCreatePerformanceTaskManagementTaskPayload,
  TCreatePerformanceTrainingPayload,
  TEditPerformanceTaskManagementProjectPayload,
  TEditPerformanceTrainingPayload,
  TPerformanceTaskManagementProjectPayload,
} from '#/lib/utils/schema/performance.schema'

export function usePerformanceAccess() {
  const user = useTamsStore((state) => state.user)
  return {
    canGeneratePerformanceReport:
      user?.permissions.includes('generate performance report') ?? false,
    canViewAppraisalGeneralSettings:
      user?.permissions.includes('get appraisal general settings') ?? false,
    canViewAppraisalGradingSettings:
      user?.permissions.includes('get appraisal grade settings') ?? false,
    canViewAppraiserSettings:
      user?.permissions.includes('view an appraiser setting') ?? false,

    canViewTraining: user?.permissions.includes('view training') ?? false,
    canCreateTraining: user?.permissions.includes('create training') ?? false,
    canEditTraining: user?.permissions.includes('edit training') ?? false,
    canDeleteTraining: user?.permissions.includes('delete training') ?? false,

    canViewTaskManagement: user?.permissions.includes('get my tasks') ?? false,
    canCreateTaskManagement:
      user?.permissions.includes('create project task') ?? false,
  }
}

export const useFetchPerformanceAppraisalGeneralSettingsResponse = <TSelected>(
  select: (
    data: TFetchPerformanceAppraisalGeneralSettingsResponse,
  ) => TSelected,
  params?: TBaseQueryParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.performanceAppraisalGeneralSettings, params],
    queryFn: () =>
      performanceClient.getPerformanceAppraisalGeneralSettings(params),
    select,
    enabled: enabled && !!params,
  })
}

export const useUpdatePerformanceAppraisalGeneralSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TUpdatePerformanceAppraisalGeneralSettingsPayload) =>
      performanceClient.updatePerformanceAppraisalGeneralSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceAppraisalGeneralSettings],
      })
      notifications.show({
        title: 'Success',
        message: `Appraisal periods updated successfully.`,
        color: 'green',
      })
    },
  })
}

export const useFetchPerformanceAppraisalGradingSettings = <TSelected>(
  select: (
    data: TFetchPerformanceAppraisalGradingSettingsResponse,
  ) => TSelected,
  params?: TBaseQueryParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.performanceAppraisalGradingSettings, params],
    queryFn: () =>
      performanceClient.getPerformanceAppraisalGradingSettings(params),
    select,
    enabled: enabled && !!params,
  })
}

export const useUpdatePerformanceAppraisalGradingSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TUpdatePerformanceAppraisalGradingSettingsPayload) =>
      performanceClient.updatePerformanceAppraisalGradingSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceAppraisalGradingSettings],
      })
      notifications.show({
        title: 'Success',
        message: `Grading settings updated successfully.`,
        color: 'green',
      })
    },
  })
}

export const useFetchPerformanceAppraiserSettings = <TSelected>(
  select: (data: TFetchPerformanceAppraiserSettingsResponse) => TSelected,
  params?: TBaseQueryParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.performanceAppraisalAppraisers, params],
    queryFn: () => performanceClient.getPerformanceAppraiserSettings(params),
    select,
    enabled: enabled && !!params,
  })
}

export const useFetchPerformanceApproverSettings = <TSelected>(
  select: (data: TFetchPerformanceApproverSettingsResponse) => TSelected,
  params: TBaseQueryParams,
  enabled = true,
) =>
  useQuery({
    queryKey: ['appraisal-approver-settings', params],
    queryFn: () => performanceClient.getPerformanceApproverSettings(params),
    select,
    enabled,
  })

export const useAppraisalPeopleSetting = (
  kind: AppraisalPeopleKind,
  id?: number,
) =>
  useQuery({
    queryKey: ['appraisal-people-setting', kind, id],
    queryFn: () => {
      if (!id)
        throw new Error('Select an appraisal setting to view its details.')
      return performanceClient.getAppraisalPeopleSetting(kind, id)
    },
    enabled: !!id,
  })

const invalidatePeopleSettings = (
  queryClient: ReturnType<typeof useQueryClient>,
  kind: AppraisalPeopleKind,
) =>
  Promise.all([
    queryClient.invalidateQueries({
      queryKey: [
        kind === 'appraiser'
          ? ENDPOINTS.performanceAppraisalAppraisers
          : 'appraisal-approver-settings',
      ],
    }),
    queryClient.invalidateQueries({
      queryKey: ['appraisal-people-setting', kind],
    }),
  ])

export const useSaveAppraisalPeopleSetting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TSaveAppraisalPeopleSettingPayload) =>
      performanceClient.saveAppraisalPeopleSetting(payload),
    onSuccess: async (response, payload) => {
      await invalidatePeopleSettings(queryClient, payload.kind)
      notifications.show({
        title: 'Success',
        message: response.message,
        color: 'green',
      })
    },
  })
}

export const useDeleteAppraisalPeopleSetting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ kind, id }: { kind: AppraisalPeopleKind; id: number }) =>
      performanceClient.deleteAppraisalPeopleSetting(kind, id),
    onSuccess: async (response, payload) => {
      await invalidatePeopleSettings(queryClient, payload.kind)
      notifications.show({
        title: 'Success',
        message: response.message,
        color: 'green',
      })
    },
  })
}

export const useFetchPerformanceTrainings = <TSelected>(
  select: (data: TFetchPerformanceTrainingsResponse) => TSelected,
  params?: TPerformanceTrainingParams,
  enabled = true,
) =>
  useQuery({
    queryKey: [ENDPOINTS.performanceTrainings, params],
    queryFn: () => performanceClient.fetchPerformanceTrainings(params),
    select,
    enabled: enabled && !!params,
  })

export const useFetchPerformanceTrainingById = <TSelected>(
  select: (data: TFetchPerformanceTrainingByIdResponse) => TSelected,
  id?: number,
  enabled = true,
) =>
  useQuery({
    queryKey: [ENDPOINTS.performanceTrainings, id],
    queryFn: () => performanceClient.fetchPerformanceTrainingById(id),
    select,
    enabled: enabled && Boolean(id),
  })

export const useCreatePerformanceTraining = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TCreatePerformanceTrainingPayload) =>
      performanceClient.createPerformanceTraining(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceTrainings],
      })
      notifications.show({
        title: 'Success',
        message: 'Performance training created successfully.',
        color: 'green',
      })
    },
  })
}

export const useUpdatePerformanceTraining = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TEditPerformanceTrainingPayload) =>
      performanceClient.updatePerformanceTraining(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceTrainings],
      })
      notifications.show({
        title: 'Success',
        message: 'Performance training updated successfully.',
        color: 'green',
      })
    },
  })
}

export const useApprovePerformanceTraining = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number
      status: 'approved' | 'rejected'
    }) => performanceClient.approvePerformanceTraining({ id, status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceTrainings],
      })
      notifications.show({
        title: 'Success',
        message: 'Performance training status updated successfully.',
        color: 'green',
      })
    },
  })
}

export const useDeletePerformanceTraining = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => performanceClient.deletePerformanceTraining(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceTrainings],
      })
      notifications.show({
        title: 'Success',
        message: 'Performance training deleted successfully.',
        color: 'green',
      })
    },
  })
}

export const useFetchPerformanceTaskProjects = <TSelected>(
  params: TCreatePerformanceTaskProjectParams,
  select?: (data: TFetchPerformanceTaskProjectsResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.performanceTaskProjects, params],
    queryFn: () => performanceClient.fetchPerformanceTaskProjects(params),
    select,
  })
}

export const useFetchHrmProjectById = <TSelected>(
  id: number,
  select?: (data: TFetchPerformanceTaskProjectByIdResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.performanceTaskProjects, id],
    queryFn: () => performanceClient.fetchHrmProjectById(id),
    enabled: Boolean(id),
    select,
  })
}

export const useCreateHrmProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TPerformanceTaskManagementProjectPayload) =>
      performanceClient.createHrmProject(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceTaskProjects],
      })
      notifications.show({
        title: 'Success',
        message: 'HRM project created successfully.',
        color: 'green',
      })
    },
  })
}

export const useUpdateHrmProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TEditPerformanceTaskManagementProjectPayload) =>
      performanceClient.updateHrmProject(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceTaskProjects],
      })
      notifications.show({
        title: 'Success',
        message: 'HRM project updated successfully.',
        color: 'green',
      })
    },
  })
}

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TUpdateProjectStatusPayload) =>
      performanceClient.updateProjectStatus(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceTaskProjects],
      })
      notifications.show({
        title: 'Success',
        message: 'HRM project status updated successfully.',
        color: 'green',
      })
    },
  })
}

export const useDeletePerformanceTaskProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      performanceClient.deletePerformanceTaskProject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceTaskProjects],
      })
      notifications.show({
        title: 'Success',
        message: 'HRM project deleted successfully.',
        color: 'green',
      })
    },
  })
}

export const useFetchProjectKanbanStatuses = <TSelected>(
  params: TFetchProjectKanbanTasksParams,
  select?: (data: TFetchProjectKanbanStatusesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.projectKanbanTaskStatus, params],
    queryFn: () => performanceClient.fetchProjectKanbanStatuses(params),
    select,
  })
}

export const useFetchProjectKanbanTasks = (
  params: TFetchProjectKanbanTasksParams,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.projectKanbanTasks, params],
    queryFn: () => performanceClient.fetchProjectKanbanTasks(params),
  })
}

export const useMoveProjectKanbanTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: TMoveProjectKanbanTaskPayload) => {
      const response = await performanceClient.moveProjectKanbanTask(data)
      if (!response.status) throw new Error(response.message)
      return response
    },
    onSuccess: async (_response, { project_id }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.projectKanbanTasks, { project_id }],
        }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.performanceTaskProjects],
        }),
      ])
    },
  })
}

export const useFetchTasksByProjectId = <TSelected>(
  params: TFetchProjectKanbanTasksParams,
  select?: (data: TCreateTasksByProjectIdResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.tasksByProjectId, params],
    queryFn: () => performanceClient.fetchTasksByProjectId(params),
    select,
  })
}

export const useCreateProjectKanbanTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TCreatePerformanceTaskManagementTaskPayload) =>
      performanceClient.createProjectKanbanTask(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.projectKanbanTasks],
      })
      notifications.show({
        title: 'Success',
        message: 'Project Kanban task created successfully.',
        color: 'green',
      })
    },
  })
}
