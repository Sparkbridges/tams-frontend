import { useQuery } from "@tanstack/react-query"
import { ENDPOINTS, payrollClient } from "../client"

export const useVerifyAccountNumber = (queryParams: { account_number: string , bank_code: string }) => {
     return useQuery({
       queryKey: [ENDPOINTS.verifyAccountNumber, queryParams],
       queryFn: () => payrollClient.verifyAccountNumber(queryParams),
     })
}