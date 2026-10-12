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
} from '#/lib/types'
import type {
  TCreateHrmExemptionPayload,
  TEditHrmExemptionPayload,
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
  fetchHrmLeaveTypes: async () => {
    return await Client.get<TFetchHrmLeavesTypesResponse>(
      `${ENDPOINTS.hrmLeaveTypes}`,
    )
  },
}

export default hrmClient
