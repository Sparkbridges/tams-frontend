import { Client } from "#/lib/config"
import type { TVerifyAccountNumberResponse } from "#/lib/types"
import { ENDPOINTS } from "./endpoints"

const payrollClient = {
    /**
     * Description - verify account number.
     * @param {string} queryParams.query - account number to verify.
     * @returns Data fetched from `/payroll/payment-management/payments/verify-account-number`, or an error if the API call fails.
     * @throws {Error} If the request fails.
     */
    verifyAccountNumber: async (queryParams: { account_number: string , bank_code: string }) => {
        return await Client.get<TVerifyAccountNumberResponse>(
            ENDPOINTS.verifyAccountNumber,
            { params: queryParams },
        )
    },
}

export default payrollClient