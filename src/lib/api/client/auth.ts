import { Client } from '#/lib/config'
import type {
  TGetUserResponse,
  TLoginPayload,
  TLoginResponse,
  TLogoutResponse,
  TVerifyCompanyUrlResponse,
} from '#/lib/types'
import { ENDPOINTS } from './endpoints'

const authClient = {
  /**
   * Description - verify company url.
   * @param {string} payload.company_id - company ID (company url without the domain).
   * @returns Data fetched from `/auth/verify-company-url`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  verifyCompanyUrl: async (payload: { company_id: string }) => {
    return await Client.post<TVerifyCompanyUrlResponse>(
      ENDPOINTS.verifyCompanyUrl,
      payload,
    )
  },

  /**
   * Description - login user.
   * @param {TLoginPayload} payload - The login payload.
   * @returns Data fetched from `/auth/login`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  login: async (payload: TLoginPayload) => {
    return await Client.post<TLoginResponse>(ENDPOINTS.login, payload)
  },

  /**
   * Description - logout user and revoke current token.
   * @returns Data fetched from `/auth/logout`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  logout: async () => {
    return await Client.post<TLogoutResponse>(ENDPOINTS.logout)
  },

  /**
   * Description - get user details.
   * @returns Data fetched from `/user`, or an error if the API call fails.
   * @throws {Error} If the request fails.
   */
  getUser: async () => {
    return await Client.get<TGetUserResponse>(ENDPOINTS.getUser)
  },
}

export default authClient
