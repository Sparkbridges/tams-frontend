import { Client } from '#/lib/config'
import type { TBaseQueryParams } from '#/lib/types'
import type {
  TFetchPerformanceAppraisalGeneralSettingsResponse,
  TFetchPerformanceAppraisalGradingSettingsResponse,
  TFetchPerformanceAppraiserSettingsResponse,
  TUpdatePerformanceAppraisalGeneralSettingsPayload,
  TUpdatePerformanceAppraisalGradingSettingsPayload,
  AppraisalPeopleKind,
  TAppraisalPeopleSetting,
  TPerformanceAppraiserSetting,
  TPerformanceApproverSetting,
  TFetchPerformanceApproverSettingsResponse,
  TSaveAppraisalPeopleSettingPayload,
  TFetchPerformanceTrainingsResponse,
  TPerformanceTrainingParams,
  TFetchPerformanceTrainingByIdResponse,
  TCreatePerformanceTrainingResponse,
  TCreateHrmProjectResponse,
  TCreatePerformanceTaskProjectParams,
  TFetchPerformanceTaskProjectsResponse,
  TFetchPerformanceTaskProjectByIdResponse,
  TUpdateProjectStatusPayload,
  TFetchProjectKanbanTasksParams,
  TFetchProjectKanbanTasksResponse,
  TFetchProjectKanbanStatusesResponse,
  TCreateProjectKanbanTaskResponse,
  TCreateTasksByProjectIdResponse,
  TMoveProjectKanbanTaskPayload,
  TCreateProjectKanbanStatusPayload,
  TUpdateProjectKanbanStatusPayload,
  TDeleteProjectKanbanStatusPayload,
  TUpdateProjectKanbanTaskPayload,
  TDeleteProjectKanbanTaskPayload,
  TFetchProjectKanbanTaskResponse,
  TFetchFeedbackSurveysParams,
  TFetchFeedbackSurveysResponse,
  TFetchFeedbackSurveyResponse,
  TFetchFeedbackAnswersResponse,
  TFetchFeedbackAssignedResponse,
  TFetchFeedbackAppliedResponse,
  TFetchFeedbackCreatedResponse,
  TCreateFeedbackSurveyPayload,
  TUpdateFeedbackSurveyPayload,
  TAnswerFeedbackPayload,
  TDeleteFeedbackAnswerPayload,
  TFetchAppraisalGroupsParams,
  TFetchAppraisalGroupsResponse,
  TAppraisalGroup,
  TCreateAppraisalGroupPayload,
  TUpdateAppraisalGroupPayload,
} from '#/lib/types/api/performance'
import type { TGetApiResponse } from '#/lib/types/api/request.types'
import type {
  TCreatePerformanceTrainingPayload,
  TEditPerformanceTaskManagementProjectPayload,
  TEditPerformanceTrainingPayload,
  TPerformanceTaskManagementProjectPayload,
  TCreatePerformanceTaskManagementTaskPayload,
} from '#/lib/utils/schema/performance.schema'
import { ENDPOINTS } from './endpoints'

const approverSettingsEndpoint = '/hrm/appraisals/settings/approver-settings'

export const performanceClient = {
  /**
   * Description - Get performance appraisal general settings
   * @param {TBaseQueryParams} [params] Optional query parameters for the request
   * @returns {Promise<TFetchPerformanceAppraisalGeneralSettingsResponse>} A promise that resolves with the performance appraisal general settings
   */
  getPerformanceAppraisalGeneralSettings: async (params?: TBaseQueryParams) => {
    return await Client.get<TFetchPerformanceAppraisalGeneralSettingsResponse>(
      ENDPOINTS.performanceAppraisalGeneralSettings,
      { params },
    )
  },

  /**
   * Description - Update performance appraisal general settings
   * @param {TUpdatePerformanceAppraisalGeneralSettingsPayload} payload The payload containing the appraisals and id for the update
   * @returns {Promise<void>} A promise that resolves when the update is complete
   */
  updatePerformanceAppraisalGeneralSettings: async ({
    appraisals,
    id,
  }: TUpdatePerformanceAppraisalGeneralSettingsPayload) => {
    return await Client.put(
      `${ENDPOINTS.performanceAppraisalGeneralSettings}/${id}`,
      {
        appraisal_period: appraisals,
        num_appraisals_per_year: appraisals.length,
      },
    )
  },

  /**
   * Description - Get performance appraisal grading settings
   * @param {TBaseQueryParams} [params] Optional query parameters for the request
   * @returns {Promise<any>} A promise that resolves with the performance appraisal grading settings
   */
  getPerformanceAppraisalGradingSettings: async (params?: TBaseQueryParams) => {
    return await Client.get<TFetchPerformanceAppraisalGradingSettingsResponse>(
      ENDPOINTS.performanceAppraisalGradingSettings,
      { params },
    )
  },

  /**
   * Description - Update performance appraisal grading settings
   * @param {TUpdatePerformanceAppraisalGradingSettingsPayload} payload The payload containing the grading settings for the update
   * @returns {Promise<void>} A promise that resolves when the update is complete
   */
  updatePerformanceAppraisalGradingSettings: async (
    payload: TUpdatePerformanceAppraisalGradingSettingsPayload,
  ) => {
    return await Client.put(
      ENDPOINTS.performanceAppraisalGradingSettings,
      payload,
    )
  },

  /**
   * Description - Get performance appraiser settings
   * @param {TBaseQueryParams} [params] Optional query parameters for the request
   * @returns {Promise<any>} A promise that resolves with the performance appraiser settings
   */
  getPerformanceAppraiserSettings: async (params?: TBaseQueryParams) => {
    return await Client.get<TFetchPerformanceAppraiserSettingsResponse>(
      ENDPOINTS.performanceAppraisalAppraisers,
      { params },
    )
  },
  getPerformanceApproverSettings: (params: TBaseQueryParams) =>
    Client.get<TFetchPerformanceApproverSettingsResponse>(
      approverSettingsEndpoint,
      {
        params: {
          page: params.page,
          per_page: params.perPage,
          search_query: params.search_query,
        },
      },
    ),
  getAppraisalPeopleSetting: async (
    kind: AppraisalPeopleKind,
    id: number,
  ): Promise<TAppraisalPeopleSetting> => {
    if (kind === 'appraiser') {
      const { data } = await Client.get<
        TGetApiResponse<TPerformanceAppraiserSetting>
      >(`${ENDPOINTS.performanceAppraisalAppraisers}/${id}`)
      const category = data.category_type
      return {
        id: data.id,
        name: data.description,
        description: data.description,
        approvalType: 'sequential',
        category,
        branchId: data.station_id,
        assignments:
          category === 'employees'
            ? data.employees.map((employee) => ({
                value: String(employee.employee_id),
                label: employee.employee_name,
              }))
            : category === 'department'
              ? data.departments.map((department) => ({
                  value: String(department.id),
                  label: department.department_name,
                }))
              : category === 'station_grade'
                ? data.employeeGrades.map((grade) => ({
                    value: String(grade.employee_grade_id),
                    label: grade.grade_name,
                  }))
                : data.branches.map((branch) => ({
                    value: String(branch.station_id),
                    label: branch.station_name,
                  })),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        persons: [...data.approvalLevels]
          .sort((a, b) => a.level - b.level)
          .map((person) => ({
            level: person.level,
            personId: person.approval_person_id,
            personType: 'static',
            alternateId: person.alt_approval_person_id || undefined,
            alternateType: 'static',
            name: person.approval_person_name,
            alternateName: person.alt_approval_person,
          })),
      }
    }
    const { data } = await Client.get<
      TGetApiResponse<TPerformanceApproverSetting>
    >(`${approverSettingsEndpoint}/${id}`)
    return {
      id: data.id,
      name: data.name,
      description: data.description ?? '',
      approvalType: data.approval_type,
      category: 'employees',
      branchId: data.station_id,
      assignments: [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      persons: [...(data.approver_persons ?? [])]
        .sort((a, b) => a.level - b.level)
        .map((person) => ({
          level: person.level,
          personId: person.approver_person_id,
          personType: person.approver_person_type,
          alternateId: person.alt_approver_person_id,
          alternateType: person.alt_approver_person_type,
          name:
            person.approver_person_name ?? String(person.approver_person_id),
          alternateName: person.alt_approver_person_name ?? '',
        })),
    }
  },
  saveAppraisalPeopleSetting: ({
    kind,
    id,
    data,
  }: TSaveAppraisalPeopleSettingPayload) => {
    const endpoint =
      kind === 'appraiser'
        ? ENDPOINTS.performanceAppraisalAppraisers
        : approverSettingsEndpoint
    return id
      ? Client.put<TGetApiResponse<unknown>>(`${endpoint}/${id}`, data)
      : Client.post<TGetApiResponse<unknown>>(endpoint, data)
  },
  deleteAppraisalPeopleSetting: (kind: AppraisalPeopleKind, id: number) =>
    kind === 'appraiser'
      ? Client.post<TGetApiResponse<unknown>>(
          `${ENDPOINTS.performanceAppraisalAppraisers}/delete`,
          { appraiserIds: [id] },
        )
      : Client.delete<TGetApiResponse<unknown>>(
          `${approverSettingsEndpoint}/${id}`,
        ),

  fetchAppraisalGroups: (params: TFetchAppraisalGroupsParams) =>
    Client.get<TFetchAppraisalGroupsResponse>(
      ENDPOINTS.performanceAppraisalGroups,
      { params },
    ),
  fetchArchivedAppraisalGroups: (params: TFetchAppraisalGroupsParams) =>
    Client.get<TFetchAppraisalGroupsResponse>(
      ENDPOINTS.performanceAppraisalArchives,
      { params },
    ),
  fetchAppraisalGroup: (id: number) =>
    Client.get<TGetApiResponse<TAppraisalGroup>>(
      `${ENDPOINTS.performanceAppraisalGroups}/${id}`,
    ),
  fetchMyAppraisals: (params: TBaseQueryParams & { has_ended?: boolean }) =>
    Client.get<TGetApiResponse<{ results: unknown[]; total: number }>>(
      ENDPOINTS.myPerformanceAppraisals,
      { params },
    ),
  fetchAppraiserAppraisals: (
    params: TBaseQueryParams & { has_ended?: boolean },
  ) =>
    Client.get<TGetApiResponse<{ results: unknown[]; total: number }>>(
      ENDPOINTS.appraiserPerformanceAppraisals,
      { params },
    ),
  fetchAppraisalApprovals: (
    params: TBaseQueryParams & { has_ended?: boolean },
  ) =>
    Client.get<TGetApiResponse<{ results: unknown[]; total: number }>>(
      ENDPOINTS.performanceAppraisalApprovals,
      { params },
    ),
  approveAppraisalRequests: (appraisal_id: number[]) =>
    Client.post<TGetApiResponse<unknown>>(
      `${ENDPOINTS.performanceAppraisalGroups}/approve`,
      { appraisal_id },
    ),
  rejectAppraisalRequests: (appraisal_id: number[]) =>
    Client.post<TGetApiResponse<unknown>>(
      `${ENDPOINTS.performanceAppraisalGroups}/reject`,
      { appraisal_id },
    ),
  createAppraisalGroup: (data: TCreateAppraisalGroupPayload) =>
    Client.post<TGetApiResponse<TAppraisalGroup>>(
      ENDPOINTS.performanceAppraisalGroups,
      data,
    ),
  updateAppraisalGroup: (data: TUpdateAppraisalGroupPayload) =>
    Client.put<TGetApiResponse<TAppraisalGroup>>(
      ENDPOINTS.performanceAppraisalGroups,
      data,
    ),
  initiateAppraisalGroup: (appraisal_group_id: number) =>
    Client.post<TGetApiResponse<unknown>>(
      ENDPOINTS.initiatePerformanceAppraisal,
      { appraisal_group_id },
    ),
  endAppraisalGroup: (appraisal_group_id: number) =>
    Client.post<TGetApiResponse<unknown>>(ENDPOINTS.endPerformanceAppraisal, {
      appraisal_group_id,
    }),
  archiveAppraisalGroup: (id: number) =>
    Client.delete<TGetApiResponse<unknown>>(
      `${ENDPOINTS.performanceAppraisalGroups}/${id}`,
    ),
  bulkArchiveAppraisalGroups: (ids: number[]) =>
    Client.delete<TGetApiResponse<unknown>>(
      ENDPOINTS.performanceAppraisalGroups,
      { data: { ids } },
    ),
  restoreAppraisalGroups: (ids: number[]) =>
    Client.put<TGetApiResponse<unknown>>(
      `${ENDPOINTS.performanceAppraisalGroups}/restore`,
      { ids },
    ),
  permanentlyDeleteAppraisalGroups: (ids: number[]) =>
    Client.delete<TGetApiResponse<unknown>>(
      ENDPOINTS.performanceAppraisalArchives,
      { data: { ids } },
    ),

  /**
   * Description - Fetches the list of performance trainings.
   * @param params - The query parameters for fetching performance trainings.
   * @returns A promise that resolves to the list of performance trainings.
   */
  fetchPerformanceTrainings: (params?: TPerformanceTrainingParams) =>
    Client.get<TFetchPerformanceTrainingsResponse>(
      ENDPOINTS.performanceTrainings,
      { params },
    ),

  /**
   * Description - Fetches the details of a specific performance training by ID.
   * @param id - The ID of the performance training to fetch.
   * @returns A promise that resolves to the performance training details.
   */
  fetchPerformanceTrainingById: (id?: number) =>
    Client.get<TFetchPerformanceTrainingByIdResponse>(
      `${ENDPOINTS.performanceTrainings}/${id}`,
    ),

  /**
   * Description - Creates a new performance training.
   * @param data - The data for the new performance training.
   * @returns A promise that resolves to the created performance training.
   */
  createPerformanceTraining: (data: TCreatePerformanceTrainingPayload) =>
    Client.post<TCreatePerformanceTrainingResponse>(
      ENDPOINTS.performanceTrainings,
      data,
    ),

  /**
   * Description - Updates a performance training by ID.
   * @param id - The ID of the performance training to update.
   * @param data - The updated data for the performance training.
   * @returns A promise that resolves to the updated performance training.
   */
  updatePerformanceTraining: (payload: TEditPerformanceTrainingPayload) =>
    Client.put<TCreatePerformanceTrainingResponse>(
      `${ENDPOINTS.performanceTrainings}/${payload.id}`,
      payload,
    ),

  /**
   * Description - Approves a performance training by ID.
   * @param id - The ID of the performance training to approve.
   * @returns A promise that resolves to the approval response.
   */
  approvePerformanceTraining: ({
    id,
    status,
  }: {
    id: number
    status: 'approved' | 'rejected'
  }) =>
    Client.patch<TGetApiResponse<unknown>>(
      ENDPOINTS.performanceTrainingApproval.replace(':id', String(id)),
      { status },
    ),

  /**
   * Description - Deletes a performance training by ID.
   * @param id - The ID of the performance training to delete.
   * @returns A promise that resolves to the deletion response.
   */
  deletePerformanceTraining: (id: number) =>
    Client.delete<TGetApiResponse<unknown>>(
      `${ENDPOINTS.performanceTrainings}/${id}`,
    ),

  /**
   * Description - Fetches the list of performance task projects.
   * @param {TCreatePerformanceTaskProjectParams} params - The query parameters for fetching performance task projects.
   * @returns {TFetchPerformanceTaskProjectsResponse} A promise that resolves to the list of performance task projects.
   */
  fetchPerformanceTaskProjects: (params: TCreatePerformanceTaskProjectParams) =>
    Client.get<TFetchPerformanceTaskProjectsResponse>(
      ENDPOINTS.performanceTaskProjects,
      { params },
    ),

  /**
   * Description - Fetches a single HRM project by ID.
   * @param id - The ID of the HRM project to fetch.
   * @returns A promise that resolves to the HRM project.
   */
  fetchHrmProjectById: (id: number) =>
    Client.get<TFetchPerformanceTaskProjectByIdResponse>(
      `${ENDPOINTS.performanceTaskProjects}/${id}`,
    ),

  /**
   * Description - Creates a new HRM project.
   * @param data - The data for the new HRM project.
   * @returns A promise that resolves to the created HRM project.
   */
  createHrmProject: (data: TPerformanceTaskManagementProjectPayload) =>
    Client.post<TCreateHrmProjectResponse>(
      ENDPOINTS.performanceTaskProjects,
      data,
    ),

  /**
   * Description - Updates an HRM project by ID.
   * @param data - The updated data for the HRM project.
   * @returns A promise that resolves to the updated HRM project.
   */
  updateHrmProject: (data: TEditPerformanceTaskManagementProjectPayload) =>
    Client.put<TCreateHrmProjectResponse>(
      `${ENDPOINTS.performanceTaskProjects}/${data.id}`,
      data,
    ),

  /**
   * Description - Updates the status of an HRM project by ID.
   * @param id - The ID of the HRM project to update.
   * @param status - The new status for the HRM project.
   * @returns A promise that resolves to the updated HRM project.
   */
  updateProjectStatus: ({ id, ...restPayload }: TUpdateProjectStatusPayload) =>
    Client.put<TGetApiResponse<unknown>>(
      ENDPOINTS.updateProjectStatus.replace(':id', String(id)),
      restPayload,
    ),

  /**
   * Description - Deletes an HRM project by ID.
   * @param id - The ID of the HRM project to delete.
   * @returns A promise that resolves to the deletion response.
   */
  deletePerformanceTaskProject: (id: number) =>
    Client.delete<TGetApiResponse<unknown>>(
      `${ENDPOINTS.performanceTaskProjects}/${id}`,
    ),

  /**
   * Description - Fetch all project Kanban tasks.
   * @param params - The query parameters for fetching project Kanban tasks.
   * @returns A promise that resolves to the list of project Kanban tasks.
   */
  fetchProjectKanbanTasks: (params: TFetchProjectKanbanTasksParams) =>
    Client.get<TFetchProjectKanbanTasksResponse>(ENDPOINTS.projectKanbanTasks, {
      params,
    }),

  moveProjectKanbanTask: (data: TMoveProjectKanbanTaskPayload) =>
    Client.put<TGetApiResponse<null>>(
      `${ENDPOINTS.projectKanbanTasks}/update-task-status`,
      data,
    ),

  /**
   * Description - Create a new project Kanban task.
   * @param data - The data for the new project Kanban task.
   * @returns A promise that resolves to the created project Kanban task.
   */
  createProjectKanbanTask: (
    data: TCreatePerformanceTaskManagementTaskPayload,
  ) =>
    Client.post<TCreateProjectKanbanTaskResponse>(
      ENDPOINTS.projectKanbanTasks,
      data,
    ),

  fetchProjectKanbanTask: (id: number, projectId: number) =>
    Client.get<TFetchProjectKanbanTaskResponse>(
      `${ENDPOINTS.projectKanbanTasks}/${id}`,
      { params: { project_id: projectId } },
    ),

  updateProjectKanbanTask: (data: TUpdateProjectKanbanTaskPayload) =>
    Client.put<TGetApiResponse<unknown>>(
      `${ENDPOINTS.projectKanbanTasks}/${data.id}`,
      data,
    ),

  deleteProjectKanbanTask: (data: TDeleteProjectKanbanTaskPayload) =>
    Client.delete<TGetApiResponse<unknown>>(
      `${ENDPOINTS.projectKanbanTasks}/${data.id}`,
      { data },
    ),

  /**
   * Description - fetch all project kanban statuses.
   * @param project_id - The ID of the project to fetch Kanban statuses for.
   * @returns A promise that resolves to the list of project Kanban statuses.
   */
  fetchProjectKanbanStatuses: (params: TFetchProjectKanbanTasksParams) =>
    Client.get<TFetchProjectKanbanStatusesResponse>(
      ENDPOINTS.projectKanbanTaskStatus,
      {
        params,
      },
    ),

  createProjectKanbanStatus: (data: TCreateProjectKanbanStatusPayload) =>
    Client.post<TGetApiResponse<unknown>>(
      ENDPOINTS.projectKanbanTaskStatus,
      data,
    ),

  updateProjectKanbanStatus: (data: TUpdateProjectKanbanStatusPayload) =>
    Client.put<TGetApiResponse<unknown>>(
      ENDPOINTS.projectKanbanTaskStatus,
      data,
    ),

  deleteProjectKanbanStatus: (data: TDeleteProjectKanbanStatusPayload) =>
    Client.delete<TGetApiResponse<unknown>>(ENDPOINTS.projectKanbanTaskStatus, {
      data,
    }),

  /**
   * Description - Fetch all tasks associated with a ProjectId
   * @param project_id - The ID of the project to fetch Kanban
   * @returns A promise
   */
  fetchTasksByProjectId: (params: TFetchProjectKanbanTasksParams) =>
    Client.get<TCreateTasksByProjectIdResponse>(ENDPOINTS.tasksByProjectId, {
      params,
    }),

  fetchFeedbackSurveys: (params: TFetchFeedbackSurveysParams) =>
    Client.get<TFetchFeedbackSurveysResponse>(ENDPOINTS.feedbackSurveys, {
      params,
    }),

  fetchFeedbackSurvey: (id: number) =>
    Client.get<TFetchFeedbackSurveyResponse>(
      `${ENDPOINTS.feedbackSurveys}/${id}`,
    ),

  fetchFeedbackAnswers: (id: number) =>
    Client.get<TFetchFeedbackAnswersResponse>(
      `${ENDPOINTS.feedbackSurveys}/get-survey-answers`,
      { params: { id } },
    ),

  createFeedbackSurvey: (data: TCreateFeedbackSurveyPayload) =>
    Client.post<TGetApiResponse<unknown>>(ENDPOINTS.feedbackSurveys, data),

  updateFeedbackSurvey: (data: TUpdateFeedbackSurveyPayload) =>
    Client.put<TGetApiResponse<unknown>>(ENDPOINTS.feedbackSurveys, data),

  archiveFeedbackSurvey: (id: number) =>
    Client.post<TGetApiResponse<unknown>>(
      `${ENDPOINTS.feedbackSurveys}/${id}/archive`,
    ),

  restoreFeedbackSurvey: (id: number) =>
    Client.post<TGetApiResponse<unknown>>(
      `${ENDPOINTS.feedbackSurveys}/${id}/restore`,
    ),

  deleteFeedbackSurvey: (id: number) =>
    Client.delete<TGetApiResponse<unknown>>(
      `${ENDPOINTS.feedbackSurveys}/${id}`,
    ),

  deleteFeedbackAnswers: (data: TDeleteFeedbackAnswerPayload) =>
    Client.delete<TGetApiResponse<unknown>>(
      `${ENDPOINTS.feedbackSurveys}/${data.id}/answers`,
      { params: data },
    ),

  answerFeedbackSurvey: (data: TAnswerFeedbackPayload) =>
    Client.post<TGetApiResponse<unknown>>(
      `${ENDPOINTS.feedbackSurveys}/answer`,
      data,
    ),

  fetchAssignedFeedbackSurveys: () =>
    Client.get<TFetchFeedbackAssignedResponse>(
      `${ENDPOINTS.feedbackSurveys}/assigned-to-me`,
    ),

  fetchAppliedFeedbackSurveys: () =>
    Client.get<TFetchFeedbackAppliedResponse>(
      `${ENDPOINTS.feedbackSurveys}/applied-to-me`,
    ),

  fetchCreatedFeedbackSurveys: () =>
    Client.get<TFetchFeedbackCreatedResponse>(
      `${ENDPOINTS.feedbackSurveys}/created-by-me`,
    ),
}
