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
  TCreateProjectKanbanStatusPayload,
  TUpdateProjectKanbanStatusPayload,
  TDeleteProjectKanbanStatusPayload,
  TUpdateProjectKanbanTaskPayload,
  TDeleteProjectKanbanTaskPayload,
  TFetchFeedbackSurveysParams,
  TCreateFeedbackSurveyPayload,
  TUpdateFeedbackSurveyPayload,
  TAnswerFeedbackPayload,
  TDeleteFeedbackAnswerPayload,
  TFetchAppraisalGroupsParams,
  TFetchAppraisalGroupsResponse,
  TCreateAppraisalGroupPayload,
  TUpdateAppraisalGroupPayload,
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
    canViewFeedback: user?.permissions.includes('get all surveys') ?? false,
    canCreateFeedback: user?.permissions.includes('create surveys') ?? false,
    canEditFeedback: user?.permissions.includes('get one survey') ?? false,
    canAnswerFeedback: user?.permissions.includes('get one survey') ?? false,
    canViewAppraisals:
      user?.permissions.includes('get all appraisals') ?? false,
    canCreateAppraisal: user?.permissions.includes('create appraisal') ?? false,
    canUpdateAppraisal: user?.permissions.includes('update appraisal') ?? false,
    canInitiateAppraisal:
      user?.permissions.includes('initiate appraisals') ?? false,
    canApproveAppraisal:
      user?.permissions.includes('approve appraisals') ?? false,
    canGradeAppraisal:
      user?.permissions.includes('grade an appraisal') ?? false,
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

export const useFetchProjectKanbanTask = (
  id: number,
  projectId: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.projectKanbanTasks, id, projectId],
    queryFn: () => performanceClient.fetchProjectKanbanTask(id, projectId),
    enabled:
      enabled &&
      Number.isSafeInteger(id) &&
      id > 0 &&
      Number.isSafeInteger(projectId) &&
      projectId > 0,
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

export const useCreateProjectKanbanStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TCreateProjectKanbanStatusPayload) =>
      performanceClient.createProjectKanbanStatus(data),
    onSuccess: async (_response, data) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            ENDPOINTS.projectKanbanTasks,
            { project_id: data.project_id },
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.projectKanbanTaskStatus],
        }),
      ])
      notifications.show({
        title: 'Success',
        message: 'Task column created successfully.',
        color: 'green',
      })
    },
  })
}

export const useUpdateProjectKanbanStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TUpdateProjectKanbanStatusPayload) =>
      performanceClient.updateProjectKanbanStatus(data),
    onSuccess: async (_response, data) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ENDPOINTS.projectKanbanTasks,
          { project_id: data.project_id },
        ],
      })
      notifications.show({
        title: 'Success',
        message: 'Task column updated successfully.',
        color: 'green',
      })
    },
  })
}

export const useDeleteProjectKanbanStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TDeleteProjectKanbanStatusPayload) =>
      performanceClient.deleteProjectKanbanStatus(data),
    onSuccess: async (_response, data) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ENDPOINTS.projectKanbanTasks,
          { project_id: data.project_id },
        ],
      })
      notifications.show({
        title: 'Success',
        message: 'Task column deleted successfully.',
        color: 'green',
      })
    },
  })
}

export const useUpdateProjectKanbanTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TUpdateProjectKanbanTaskPayload) =>
      performanceClient.updateProjectKanbanTask(data),
    onSuccess: async (_response, data) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            ENDPOINTS.projectKanbanTasks,
            { project_id: data.project_id },
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.projectKanbanTasks, data.id],
        }),
      ])
      notifications.show({
        title: 'Success',
        message: 'Project Kanban task updated successfully.',
        color: 'green',
      })
    },
  })
}

export const useDeleteProjectKanbanTask = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TDeleteProjectKanbanTaskPayload) =>
      performanceClient.deleteProjectKanbanTask(data),
    onSuccess: async (_response, data) => {
      await queryClient.invalidateQueries({
        queryKey: [
          ENDPOINTS.projectKanbanTasks,
          { project_id: data.project_id },
        ],
      })
      notifications.show({
        title: 'Success',
        message: 'Project Kanban task deleted successfully.',
        color: 'green',
      })
    },
  })
}

export const useFetchFeedbackSurveys = (
  params: TFetchFeedbackSurveysParams,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.feedbackSurveys, params],
    queryFn: () => performanceClient.fetchFeedbackSurveys(params),
  })
}

export const useFetchFeedbackSurvey = (id: number, enabled = true) => {
  return useQuery({
    queryKey: [ENDPOINTS.feedbackSurveys, id],
    queryFn: () => performanceClient.fetchFeedbackSurvey(id),
    enabled: enabled && Number.isSafeInteger(id) && id > 0,
  })
}

export const useFetchFeedbackAnswers = (id: number, enabled = true) => {
  return useQuery({
    queryKey: [ENDPOINTS.feedbackSurveys, 'answers', id],
    queryFn: () => performanceClient.fetchFeedbackAnswers(id),
    enabled: enabled && Number.isSafeInteger(id) && id > 0,
  })
}

export const useFetchAssignedFeedbackSurveys = () => {
  return useQuery({
    queryKey: [ENDPOINTS.feedbackSurveys, 'assigned-to-me'],
    queryFn: () => performanceClient.fetchAssignedFeedbackSurveys(),
  })
}

export const useFetchAppliedFeedbackSurveys = () => {
  return useQuery({
    queryKey: [ENDPOINTS.feedbackSurveys, 'applied-to-me'],
    queryFn: () => performanceClient.fetchAppliedFeedbackSurveys(),
  })
}

export const useFetchCreatedFeedbackSurveys = () => {
  return useQuery({
    queryKey: [ENDPOINTS.feedbackSurveys, 'created-by-me'],
    queryFn: () => performanceClient.fetchCreatedFeedbackSurveys(),
  })
}

const invalidateFeedbackQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  await queryClient.invalidateQueries({
    queryKey: [ENDPOINTS.feedbackSurveys],
  })
}

export const useCreateFeedbackSurvey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TCreateFeedbackSurveyPayload) =>
      performanceClient.createFeedbackSurvey(data),
    onSuccess: async () => {
      await invalidateFeedbackQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Feedback survey created successfully.',
        color: 'green',
      })
    },
  })
}

export const useUpdateFeedbackSurvey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TUpdateFeedbackSurveyPayload) =>
      performanceClient.updateFeedbackSurvey(data),
    onSuccess: async () => {
      await invalidateFeedbackQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Feedback survey updated successfully.',
        color: 'green',
      })
    },
  })
}

export const useArchiveFeedbackSurvey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => performanceClient.archiveFeedbackSurvey(id),
    onSuccess: async () => {
      await invalidateFeedbackQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Feedback survey archived successfully.',
        color: 'green',
      })
    },
  })
}

export const useRestoreFeedbackSurvey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => performanceClient.restoreFeedbackSurvey(id),
    onSuccess: async () => {
      await invalidateFeedbackQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Feedback survey restored successfully.',
        color: 'green',
      })
    },
  })
}

export const useDeleteFeedbackSurvey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => performanceClient.deleteFeedbackSurvey(id),
    onSuccess: async () => {
      await invalidateFeedbackQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Feedback survey permanently deleted.',
        color: 'green',
      })
    },
  })
}

export const useAnswerFeedbackSurvey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TAnswerFeedbackPayload) =>
      performanceClient.answerFeedbackSurvey(data),
    onSuccess: async () => {
      await invalidateFeedbackQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Feedback submitted successfully.',
        color: 'green',
      })
    },
  })
}

export const useFetchAppraisalGroups = <TSelected>(
  params: TFetchAppraisalGroupsParams,
  select?: (data: TFetchAppraisalGroupsResponse) => TSelected,
  enabled = true,
) =>
  useQuery({
    queryKey: [ENDPOINTS.performanceAppraisalGroups, params],
    queryFn: () => performanceClient.fetchAppraisalGroups(params),
    select,
    enabled,
  })

export const useFetchArchivedAppraisalGroups = <TSelected>(
  params: TFetchAppraisalGroupsParams,
  select?: (data: TFetchAppraisalGroupsResponse) => TSelected,
) =>
  useQuery({
    queryKey: [ENDPOINTS.performanceAppraisalArchives, params],
    queryFn: () => performanceClient.fetchArchivedAppraisalGroups(params),
    select,
  })

export const useFetchAppraisalGroup = (id: number, enabled = true) =>
  useQuery({
    queryKey: [ENDPOINTS.performanceAppraisalGroups, id],
    queryFn: () => performanceClient.fetchAppraisalGroup(id),
    enabled: enabled && Number.isSafeInteger(id) && id > 0,
  })

const invalidateAppraisalGroupQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: [ENDPOINTS.performanceAppraisalGroups],
    }),
    queryClient.invalidateQueries({
      queryKey: [ENDPOINTS.performanceAppraisalArchives],
    }),
  ])
}

export const useCreateAppraisalGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TCreateAppraisalGroupPayload) =>
      performanceClient.createAppraisalGroup(data),
    onSuccess: async () => {
      await invalidateAppraisalGroupQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Appraisal group created successfully.',
        color: 'green',
      })
    },
  })
}

export const useUpdateAppraisalGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TUpdateAppraisalGroupPayload) =>
      performanceClient.updateAppraisalGroup(data),
    onSuccess: async () => {
      await invalidateAppraisalGroupQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Appraisal group updated successfully.',
        color: 'green',
      })
    },
  })
}

export const useInitiateAppraisalGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (appraisal_group_id: number) =>
      performanceClient.initiateAppraisalGroup(appraisal_group_id),
    onSuccess: async () => {
      await invalidateAppraisalGroupQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Appraisal sent successfully.',
        color: 'green',
      })
    },
  })
}

export const useEndAppraisalGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (appraisal_group_id: number) =>
      performanceClient.endAppraisalGroup(appraisal_group_id),
    onSuccess: async () => {
      await invalidateAppraisalGroupQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Appraisal session ended successfully.',
        color: 'green',
      })
    },
  })
}

export const useArchiveAppraisalGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => performanceClient.archiveAppraisalGroup(id),
    onSuccess: async () => {
      await invalidateAppraisalGroupQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Appraisal group archived successfully.',
        color: 'green',
      })
    },
  })
}

export const useBulkArchiveAppraisalGroups = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) =>
      performanceClient.bulkArchiveAppraisalGroups(ids),
    onSuccess: async () => {
      await invalidateAppraisalGroupQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Appraisal groups archived successfully.',
        color: 'green',
      })
    },
  })
}

export const useRestoreAppraisalGroups = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) =>
      performanceClient.restoreAppraisalGroups(ids),
    onSuccess: async () => {
      await invalidateAppraisalGroupQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Appraisal groups restored successfully.',
        color: 'green',
      })
    },
  })
}

export const useFetchMyAppraisals = (
  params: TBaseQueryParams & { has_ended?: boolean },
) =>
  useQuery({
    queryKey: [ENDPOINTS.myPerformanceAppraisals, params],
    queryFn: () => performanceClient.fetchMyAppraisals(params),
  })

export const useFetchAppraiserAppraisals = (
  params: TBaseQueryParams & { has_ended?: boolean },
) =>
  useQuery({
    queryKey: [ENDPOINTS.appraiserPerformanceAppraisals, params],
    queryFn: () => performanceClient.fetchAppraiserAppraisals(params),
  })

export const useFetchAppraisalApprovals = (
  params: TBaseQueryParams & { has_ended?: boolean },
) =>
  useQuery({
    queryKey: [ENDPOINTS.performanceAppraisalApprovals, params],
    queryFn: () => performanceClient.fetchAppraisalApprovals(params),
  })

export const useApproveAppraisalRequests = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (appraisal_id: number[]) =>
      performanceClient.approveAppraisalRequests(appraisal_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceAppraisalApprovals],
      })
      notifications.show({
        title: 'Success',
        message: 'Appraisal requests approved successfully.',
        color: 'green',
      })
    },
  })
}

export const useRejectAppraisalRequests = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (appraisal_id: number[]) =>
      performanceClient.rejectAppraisalRequests(appraisal_id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.performanceAppraisalApprovals],
      })
      notifications.show({
        title: 'Success',
        message: 'Appraisal requests rejected successfully.',
        color: 'green',
      })
    },
  })
}

export const usePermanentlyDeleteAppraisalGroups = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) =>
      performanceClient.permanentlyDeleteAppraisalGroups(ids),
    onSuccess: async () => {
      await invalidateAppraisalGroupQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Appraisal groups permanently deleted.',
        color: 'green',
      })
    },
  })
}

export const useDeleteFeedbackAnswers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TDeleteFeedbackAnswerPayload) =>
      performanceClient.deleteFeedbackAnswers(data),
    onSuccess: async () => {
      await invalidateFeedbackQueries(queryClient)
      notifications.show({
        title: 'Success',
        message: 'Feedback answers deleted successfully.',
        color: 'green',
      })
    },
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
