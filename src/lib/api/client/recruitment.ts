import { Client } from '#/lib/config'
import type {
  TRecruitmentEmailTemplatesResponse,
  TRecruitmentEmailTemplatesByIdResponse,
  TUpdateRecruitmentEmailTemplateByIdParams,
  TRecruitmentSettingsResponse,
  TUpdateRecruitmentSettingsParams,
  TRecruitmentJobRequestsResponse,
  TRecruitmentJobRequestsParams,
  TRecruitmentTalentRequestByIdResponse,
  TUpdateRecruitmentTalentRequestStatusParams,
  TCreateTalentRequisitionResponse,
  TRecruitmentJobPostingsResponse,
  TRecruitmentJobPostingsByIdResponse,
} from '#/lib/types'
import type {
  TCreateJobPostingPayload,
  TCreateTalentRequisitionPayload,
  TEditJobPostingPayload,
  TEditTalentRequisitionPayload,
} from '#/lib/utils/schema/recruitment.schema'
import { ENDPOINTS } from './endpoints'

const recruitmentClient = {
  /**
   * Description - fetch recruitment email templates.
   * @returns Data fetched from `/recruitment/email-templates`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */

  getRecruitmentEmailTemplates: async () => {
    return await Client.get<TRecruitmentEmailTemplatesResponse>(
      ENDPOINTS.recruitmentEmailTemplates,
    )
  },

  /**
   * Description - fetch a specific recruitment email template by ID.
   * @param {number} templateId - The ID of the recruitment email template to fetch.
   * @returns Data fetched from `/recruitment/email-templates/{templateId}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getRecruitmentEmailTemplateById: async (templateId: number) => {
    return await Client.get<TRecruitmentEmailTemplatesByIdResponse>(
      `${ENDPOINTS.recruitmentEmailTemplates}/${templateId}`,
    )
  },

  /**
   * Description - update a specific recruitment email template by ID.
   * @param {number} templateId - The ID of the recruitment email template to update.
   * @param {object} data - The data to update the recruitment email template with.
   * @returns Data fetched from `/recruitment/email-templates/{templateId}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateRecruitmentEmailTemplateById: async ({
    templateId,
    ...data
  }: TUpdateRecruitmentEmailTemplateByIdParams) => {
    return await Client.put(
      `${ENDPOINTS.recruitmentEmailTemplates}/${templateId}`,
      data,
    )
  },
  /**
   * Description - fetch recruitment settings.
   * @returns Data fetched from `/recruitment/settings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getRecruitmentSettings: async () => {
    return await Client.get<TRecruitmentSettingsResponse>(
      ENDPOINTS.recruitmentSettings,
    )
  },
  /**
   * Description - update recruitment settings.
   * @param {object} data - The data to update the recruitment settings with.
   * @returns Data fetched from `/recruitment/settings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateRecruitmentSettings: async (data: TUpdateRecruitmentSettingsParams) => {
    return await Client.put(ENDPOINTS.recruitmentSettings, data)
  },

  /**
   * Description - fetch recruitment job requests.
   * @returns Data fetched from `/recruitment/job-requests`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getRecruitmentJobRequests: async (params?: TRecruitmentJobRequestsParams) => {
    return await Client.get<TRecruitmentJobRequestsResponse>(
      ENDPOINTS.recruitmentTalentRequests,
      { params },
    )
  },

  /**
   * Description - fetch recruitment by ID.
   * @param {number} talentRequestId - The ID of the recruitment talent request to fetch.
   * @returns Data fetched from `/recruitment/talent-requests/{talentRequestId}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getRecruitmentTalentRequestById: async (talentRequestId: number) => {
    return await Client.get<TRecruitmentTalentRequestByIdResponse>(
      `${ENDPOINTS.recruitmentTalentRequests}/${talentRequestId}`,
    )
  },

  /**
   * Description - update talent request status.
   * @param {number} id - The ID of the recruitment talent request to update.
   * @param {object} data - The data to update the recruitment talent request with.
   * @returns Data fetched from `/recruitment/talent-requests/{talentRequestId}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateRecruitmentTalentRequestStatus: async ({
    id,
    status,
  }: TUpdateRecruitmentTalentRequestStatusParams) => {
    return await Client.post(
      `${ENDPOINTS.recruitmentTalentRequests}/${id}/${status}`,
      {},
    )
  },

  /**
   * Description - delete recruitment talent request.
   * @param {number} id - The ID of the recruitment talent request to delete.
   * @returns Data fetched from `/recruitment/talent-requests/{talentRequestId}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteRecruitmentTalentRequest: async (id: number) => {
    return await Client.delete(`${ENDPOINTS.recruitmentTalentRequests}/${id}`)
  },

  /**
   * Description - create a new recruitment talent request.
   * @param {object} data - The data to create the recruitment talent request with.
   * @returns Data fetched from `/recruitment/talent-requests`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createRecruitmentTalentRequest: async (
    data: Partial<TCreateTalentRequisitionPayload>,
  ) => {
    return await Client.post<TCreateTalentRequisitionResponse>(
      ENDPOINTS.recruitmentTalentRequests,
      data,
    )
  },

  /**
   * Description - edit a recruitment talent request.
   * @param {object} data - The data to edit the recruitment talent request with.
   * @returns Data fetched from `/recruitment/talent-requests/{talentRequestId}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  editRecruitmentTalentRequest: async (
    data: Partial<TEditTalentRequisitionPayload>,
  ) => {
    return await Client.put(
      `${ENDPOINTS.recruitmentTalentRequests}/${data.id}`,
      data,
    )
  },

  /**
   * Description - fetch all recruitment job postings.
   * @returns Data fetched from `/recruitment/job-postings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchRecruitmentJobPostings: async (
    params?: TRecruitmentJobRequestsParams,
  ) => {
    return await Client.get<TRecruitmentJobPostingsResponse>(
      ENDPOINTS.recruitmentJobPostings,
      { params },
    )
  },

  /**
   * Description - fetch all archived recruitment job postings.
   * @returns Data fetched from `/recruitment/job-postings/archives`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchRecruitmentJobPostingsArchived: async (
    params?: TRecruitmentJobRequestsParams,
  ) => {
    return await Client.get<TRecruitmentJobPostingsResponse>(
      ENDPOINTS.recruitmentJobPostingsArchived,
      { params },
    )
  },

  /**
   * Description - fetch a recruitment job posting by ID.
   * @param {number} id - The ID of the recruitment job posting to fetch.
   * @returns Data fetched from `/recruitment/job-postings/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchRecruitmentJobPostingById: async (id: number) => {
    return await Client.get<TRecruitmentJobPostingsByIdResponse>(
      `${ENDPOINTS.recruitmentJobPostings}/${id}`,
    )
  },

  /**
   * Description - Publish or unpublish a job posting.
   * @param {number} id - The ID of the recruitment job posting to update.
   * @param {object} data - The data to update the recruitment job posting with.
   * @returns Data fetched from `/recruitment/job-postings/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateRecruitmentJobPostingStatus: async (
    data: Partial<{ status: string; id: number }>,
  ) => {
    return await Client.put(
      `${ENDPOINTS.recruitmentJobPostings}/${data.status}/${data.id}`,
    )
  },

  /**
   * Description - archive a recruitment job posting.
   * @param {number} id - The ID of the recruitment job posting to archive.
   * @returns Data fetched from `/recruitment/job-postings/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  archiveRecruitmentJobPosting: async (id: number) => {
    return await Client.delete(`${ENDPOINTS.recruitmentJobPostings}/${id}`)
  },

  /**
   * Description - delete a recruitment job posting.
   * @param {object} data - The data containing the IDs of the recruitment job postings to delete.
   * @returns Data fetched from `/recruitment/job-postings/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteRecruitmentJobPosting: async (data: { ids: number[] }) => {
    return await Client.delete(`${ENDPOINTS.recruitmentJobPostings}/archives`, {
      data,
    })
  },

  /**
   * Description - restore archived recruitment job postings.
   * @param {object} data - The data containing the IDs of the recruitment job postings to restore.
   * @returns Data fetched from `/recruitment/job-postings/archives/restore`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  restoreArchivedRecruitmentJobPostings: async (data: { ids: number[] }) => {
    return await Client.put(`${ENDPOINTS.recruitmentJobPostings}/restore`, data)
  },

  /**
   * Description - create a recruitment job posting.
   * @param {TCreateJobPostingPayload} data - The data to create the recruitment job posting with.
   * @returns Data fetched from `/recruitment/job-postings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createRecruitmentJobPosting: async (
    data: Partial<TCreateJobPostingPayload>,
  ) => {
    return await Client.post(`${ENDPOINTS.recruitmentJobPostings}`, data)
  },

  /**
   * Description - edit a recruitment job posting.
   * @param {TEditJobPostingPayload} data - The data to update the recruitment job posting with.
   * @returns Data fetched from `/recruitment/job-postings/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  editRecruitmentJobPosting: async (data: Partial<TEditJobPostingPayload>) => {
    return await Client.put(
      `${ENDPOINTS.recruitmentJobPostings}/${data.id}`,
      data,
    )
  },
}

export default recruitmentClient
