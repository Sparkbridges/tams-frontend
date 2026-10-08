import { Client } from '#/lib/config'
import type {
  TApproveHrmExemptionPayload,
  TCanApproveHrmExemptionResponse,
  TCreateHrmExemptionResponse,
  TFetchHrmExemptionByIdResponse,
  TFetchHrmExemptionsParams,
  TFetchHrmExemptionsResponse,
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
}

export default hrmClient
