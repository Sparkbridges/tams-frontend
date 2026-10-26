import { Client } from '#/lib/config'
import type {
  TApproveHrmExemptionPayload,
  TCanApproveHrmExemptionResponse,
  TCreateHrmExemptionResponse,
  TFetchHrmExemptionByIdResponse,
  TFetchHrmExemptionsParams,
  TFetchHrmExemptionsResponse,
  TFetchHrmLeaveByIdResponse,
  TFetchHrmLeavesParams,
  TFetchHrmLeavesResponse,
  TFetchHrmLeavesTypesResponse,
  TDeleteLeavesPayload,
  TFetchLeaveTypesByEmployeeIdResponse,
  TTCreateHrmLeavePayload,
  TTEditHrmLeavePayload,
  TCreateHrmLeaveResponse,
  TGenerateHrmReportsParams,
  TGenerateHrmReportsResponse,
  TFetchHrmLeaveReportsResponse,
  TBaseQueryParams,
  TUpdateHrmLeaveTypeStatusPayload,
  TReassignPendingLeavesPayload,
  TFetchHrmLeaveTypeByIdResponse,
  TFetchHrmLeaveApproversResponse,
  TFetchHrmLeaveApproversByIdResponse,
  TFetchHrmExemptionsApprovalsResponse,
  TFetchHrmExemptionsApprovalByIdResponse,
} from '#/lib/types'
import { paramsSerializer } from '#/lib/utils'
import type {
  TCreateEditHrmExemptionApproverPayload,
  TCreateHrmExemptionPayload,
  TCreateHrmLeaveApproverPayload,
  TCreateHrmLeaveTypePayload,
  TEditHrmExemptionPayload,
  TEditHrmLeaveApproverPayload,
  TEditHrmLeaveTypePayload,
} from '#/lib/utils'
import { ENDPOINTS } from './endpoints'

const hrmClient = {
  /**
   * Description - fetch hrm exemptions.
   * @param params Query parameters for fetching HRM exemptions.
   * @returns Data fetched from `/hrm/exemptions/view-all`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmExemptions: async (params: TFetchHrmExemptionsParams) => {
    return await Client.get<TFetchHrmExemptionsResponse>(
      ENDPOINTS.getHrmExemptions,
      { params },
    )
  },

  /**
   * Description - Fetch a single HRM exemption by ID.
   * @param id The ID of the exemption to fetch.
   * @returns Data fetched from `/hrm/exemptions/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmExemptionById: async (id: number) => {
    return await Client.get<TFetchHrmExemptionByIdResponse>(
      `${ENDPOINTS.hrmExemptions}/${id}`,
    )
  },

  /**
   * Description - delete hrm exemptions.
   * @param ids Array of exemption IDs to delete.
   * @returns Data fetched from `/hrm/exemptions`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteExemptions: async (ids: number[]) => {
    return await Client.delete(
      `${ENDPOINTS.hrmExemptions}/${JSON.stringify(ids)}`,
    )
  },

  /**
   * Description - create a new HRM exemption.
   * @param payload The data for the new exemption.
   * @returns Data fetched from `/hrm/exemptions`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createHrmExemption: async (payload: TCreateHrmExemptionPayload) => {
    return await Client.post<TCreateHrmExemptionResponse>(
      ENDPOINTS.hrmExemptions,
      payload,
    )
  },

  /**
   * Description - update an existing HRM exemption.
   * @param id The ID of the exemption to update.
   * @param payload The updated data for the exemption.
   * @returns Data fetched from `/hrm/exemptions/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateHrmExemption: async ({ id, ...payload }: TEditHrmExemptionPayload) => {
    return await Client.put(`${ENDPOINTS.hrmExemptions}/${id}`, payload)
  },

  /**
   * Description - can the logged-in user approve HRM exemptions.
   * @returns Data fetched from `/hrm/exemptions/can-approve`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  canApproveHrmExemption: async () => {
    return await Client.get<TCanApproveHrmExemptionResponse>(
      `${ENDPOINTS.canApproveHrmExemption}`,
    )
  },

  /**
   * Description - approve an HRM exemption request.
   * @param payload The data for approving the exemption request.
   * @returns Data fetched from `/hrm/exemptions/approve`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  approveHrmExemption: async (payload: TApproveHrmExemptionPayload) => {
    return await Client.post(`${ENDPOINTS.approveHrmExemption}`, payload)
  },

  /**
   * Description - fetch all Hrm Leaves request.
   * @param params The query parameters for fetching HRM leaves.
   * @returns Data fetched from `/hrm/leaves`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmLeaves: async (params: TFetchHrmLeavesParams) => {
    return await Client.get<TFetchHrmLeavesResponse>(`${ENDPOINTS.hrmLeaves}`, {
      params,
    })
  },

  /**
   * Description - fetch a specific HRM leave by ID.
   * @param id The ID of the HRM leave to fetch.
   * @returns Data fetched from `/hrm/leaves/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmLeaveById: async (id: number) => {
    return await Client.get<TFetchHrmLeaveByIdResponse>(
      `${ENDPOINTS.hrmLeaves}/${id}`,
    )
  },

  /**
   * Description - delete HRM leaves single and bulk records.
   * @param payload The data for deleting the leaves.
   * @returns Data fetched from `/hrm/leaves/delete`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteLeaves: async (payload: TDeleteLeavesPayload) => {
    return await Client.post(`${ENDPOINTS.deleteLeaves}`, payload)
  },

  /**
   * Description - create new leave
   * @param payload The data for creating the new leave.
   * @returns Data fetched from `/hrm/leaves/create`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createHrmLeave: async (payload: TTCreateHrmLeavePayload) => {
    return await Client.post<TCreateHrmLeaveResponse>(
      `${ENDPOINTS.hrmLeaves}`,
      payload,
    )
  },

  /**
   * Description - update an existing leave
   * @param payload the data for updating the existing leave.
   * @returns Data fetched from `/hrm/leaves/update`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateHrmLeave: async ({ id, ...payload }: TTEditHrmLeavePayload) => {
    return await Client.put(`${ENDPOINTS.hrmLeaves}/${id}`, payload)
  },

  /**
   * Description - reassign pending leaves from one leave type to another.
   * @param payload The data for reassigning the pending leaves.
   * @returns Data fetched from `/hrm/leaves/reassign-pending`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  reassignPendingLeaves: async (payload: TReassignPendingLeavesPayload) => {
    return await Client.post(`${ENDPOINTS.reassignPendingLeaves}`, payload)
  },

  /**
   * Description - fetch HRM leave types by employee ID.
   * @param employeeId The ID of the employee for whom to fetch leave types.
   * @returns Data fetched from `/hrm/leave-types-by-employee?employee_id={employeeId}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmLeaveTypesByEmployeeId: async (params: { employee_id: number }) => {
    return await Client.get<TFetchLeaveTypesByEmployeeIdResponse>(
      `${ENDPOINTS.getHrmLeaveTypeByEmployeeId}`,
      { params },
    )
  },

  /**
   * Description - fetch all HRM leave types.
   * @returns Data fetched from `/hrm/leaves/settings/leavetypes`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmLeaveTypes: async (params?: TBaseQueryParams) => {
    return await Client.get<TFetchHrmLeavesTypesResponse>(
      `${ENDPOINTS.hrmLeaveTypes}`,
      { params },
    )
  },

  /**
   * Description - fetch a specific HRM leave type by ID.
   * @param id The ID of the leave type to fetch.
   * @returns Data fetched from `/hrm/leaves/settings/leavetypes/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmLeaveTypeById: async (id: number) => {
    return await Client.get<TFetchHrmLeaveTypeByIdResponse>(
      `${ENDPOINTS.hrmLeaveTypes}/${id}`,
    )
  },

  /**
   * Description - create a new HRM leave type.
   * @param payload The data for creating the HRM leave type.
   * @returns Data fetched from `/hrm/leaves/settings/leavetypes`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createHrmLeaveType: async (payload: TCreateHrmLeaveTypePayload) => {
    return await Client.post(`${ENDPOINTS.hrmLeaveTypes}`, payload)
  },

  /**
   * Description - update an existing HRM leave type.
   * @param id The ID of the leave type to update.
   * @param payload The data for updating the HRM leave type.
   * @returns Data fetched from `/hrm/leaves/settings/leavetypes/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateHrmLeaveType: async (payload: TEditHrmLeaveTypePayload) => {
    return await Client.put(`${ENDPOINTS.hrmLeaveTypes}/${payload.id}`, payload)
  },

  /**
   * Description - delete an existing leave.
   * @param id The ID of the leave to delete.
   * @returns Data fetched from `/hrm/leaves/settings/leavetypes/{id}`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteHrmLeaveTypes: async (id: number) => {
    return await Client.delete(`${ENDPOINTS.hrmLeaveTypes}/${id}`)
  },

  /**
   * Description - update the status of an existing leave type.
   * @param id The ID of the leave type to update.
   * @param payload The data for updating the leave type status.
   * @returns Data fetched from `/hrm/leaves/settings/leavetypes/:id/status`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateHrmLeaveTypeStatus: async (
    payload: TUpdateHrmLeaveTypeStatusPayload,
  ) => {
    return await Client.patch(
      `${ENDPOINTS.updateLeaveTypesStatus.replace(':id', payload.id.toString())}`,
      payload,
    )
  },

  /**
   * Description - generate HRM reports.
   * @param payload The data for generating the HRM reports.
   * @returns Data fetched from `/hrm/reports/generate-exemption-usage-reports`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  generateHrmReports: async (params?: TGenerateHrmReportsParams) => {
    return await Client.get<TGenerateHrmReportsResponse>(
      `${ENDPOINTS.fetchHrmReports}`,
      { params, paramsSerializer: (query) => paramsSerializer(query) },
    )
  },

  /**
   * Description - fetch HRM leave reports.
   * @param params The data for fetching the HRM leave reports.
   * @returns Data fetched from `/hrm/reports/generate-leave-usage-reports`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  generateHrmLeaveReports: async (params?: TGenerateHrmReportsParams) => {
    return await Client.get<TFetchHrmLeaveReportsResponse>(
      `${ENDPOINTS.fetchHrmLeaveReports}`,
      { params, paramsSerializer: (query) => paramsSerializer(query) },
    )
  },

  /**
   * Description - fetch HRM leave approvers.
   * @param params The query parameters for fetching the HRM leave approvers.
   * @returns Data fetched from `/hrm/leaves/settings/approversettings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmLeaveApprovers: async (params?: TBaseQueryParams) => {
    return await Client.get<TFetchHrmLeaveApproversResponse>(
      `${ENDPOINTS.hrmLeaveApprovers}`,
      { params },
    )
  },

  /**
   * Description - fetch a single HRM leave approver by ID.
   * @param id The ID of the HRM leave approver.
   * @returns Data fetched from `/hrm/leaves/settings/approversettings/:id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmLeaveApproverById: async (id: number) => {
    return await Client.get<TFetchHrmLeaveApproversByIdResponse>(
      `${ENDPOINTS.hrmLeaveApprovers}/${id}`,
    )
  },

  /**
   * Description - create a new HRM leave approver.
   * @param payload The data for creating the HRM leave approver.
   * @returns Data fetched from `/hrm/leaves/settings/approversettings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createHrmLeaveApprover: async (payload: TCreateHrmLeaveApproverPayload) => {
    return await Client.post(`${ENDPOINTS.hrmLeaveApprovers}`, payload)
  },

  /**
   * Description - update an existing HRM leave approver.
   * @param payload The data for updating the HRM leave approver.
   * @returns Data fetched from `/hrm/leaves/settings/approversettings`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateHrmLeaveApprover: async (payload: TEditHrmLeaveApproverPayload) => {
    return await Client.put(
      `${ENDPOINTS.hrmLeaveApprovers}/${payload.id}`,
      payload,
    )
  },

  /**
   * Description - delete existing HRM leave approvers.
   * @param payload The payload containing the IDs of the HRM leave approvers to delete.
   * @returns Data fetched from `/hrm/leaves/settings/approversettings/:id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  deleteHrmLeaveApprover: async (payload: { approverIds: number[] }) => {
    return await Client.post(`${ENDPOINTS.hrmLeaveApprovers}/delete`, payload)
  },

  /**
   * Description - fetch all HRM exemptions settings approvals.
   * @param params The query parameters for fetching the HRM exemptions settings approvals.
   * @returns Data fetched from `/hrm/exemptions/settings/approvals`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmExemptionsSettingsApprovals: async (params?: TBaseQueryParams) => {
    return await Client.get<TFetchHrmExemptionsApprovalsResponse>(
      `${ENDPOINTS.hrmExemptionsSettingsApprovals}`,
      { params },
    )
  },

  /**
   * Description - fetch hrm exemptions settings approval by ID.
   * @param id The ID of the HRM exemptions settings approval.
   * @returns Data fetched from `/hrm/exemptions/settings/approvals/:id`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  fetchHrmExemptionsSettingsApprovalById: async (id: number) => {
    return await Client.get<TFetchHrmExemptionsApprovalByIdResponse>(
      `${ENDPOINTS.hrmExemptionsSettingsApprovals}/${id}`,
    )
  },

  /**
   * Description - delete hrm exemptions settings approval by ID.
   * @param id The ID of the HRM exemptions settings approval.
   * @throws {Error} If the request fails.
   */
  deleteHrmExemptionsSettingsApprovalById: async (ids: number[]) => {
    return await Client.delete<TFetchHrmExemptionsApprovalByIdResponse>(
      `${ENDPOINTS.hrmExemptionsSettingsApprovals}/${JSON.stringify(ids)}`,
    )
  },

  /**
   * Description - create new HRM exemptions settings approval.
   * @param payload The payload containing the details of the HRM exemptions settings approval to create.
   * @returns Data fetched from `/hrm/exemptions/settings/approvals`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  createHrmExemptionsSettingsApproval: async (
    payload: TCreateEditHrmExemptionApproverPayload,
  ) => {
    return await Client.post(
      `${ENDPOINTS.hrmExemptionsSettingsApprovals}`,
      payload,
    )
  },

  /**
   * Description - update HRM exemptions settings approval.
   * @param payload The payload containing the details of the HRM exemptions settings approval to update.
   * @returns Data fetched from `/hrm/exemptions/settings/approvals`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  updateHrmExemptionsSettingsApproval: async (
    payload: TCreateEditHrmExemptionApproverPayload,
  ) => {
    return await Client.put(
      `${ENDPOINTS.hrmExemptionsSettingsApprovals}/${payload.id}`,
      payload,
    )
  },
}

export default hrmClient
