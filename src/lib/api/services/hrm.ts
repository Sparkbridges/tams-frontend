import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS, hrmClient } from '../client'
import type {
  TApproveHrmExemptionPayload,
  TFetchHrmExemptionByIdResponse,
  TFetchHrmExemptionsParams,
  TFetchHrmExemptionsResponse,
} from '#/lib/types'
import { notifications } from '@mantine/notifications'
import type {
  TCreateHrmExemptionPayload,
  TEditHrmExemptionPayload,
} from '#/lib/utils'

export const useGetHrmExemptions = <TSelected>(
  params: TFetchHrmExemptionsParams,
  select?: (data: TFetchHrmExemptionsResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.getHrmExemptions, params],
    queryFn: () => hrmClient.fetchHrmExemptions(params),
    select,
    enabled: !!params,
  })
}

export const useGetHrmExemptionById = <TSelected>(
  id: number,
  select?: (data: TFetchHrmExemptionByIdResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.hrmExemptions, id],
    queryFn: () => hrmClient.fetchHrmExemptionById(id),
    select,
    enabled: !!id,
  })
}

export const useDeleteHrmExemptions = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => hrmClient.deleteExemptions(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.getHrmExemptions],
      })
      notifications.show({
        title: 'Success',
        message: 'Exemption deleted successfully',
        color: 'green',
      })
    },
  })
}

export const useCreateHrmExemption = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateHrmExemptionPayload) =>
      hrmClient.createHrmExemption(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.getHrmExemptions],
      })
      notifications.show({
        title: 'Success',
        message: 'Exemption created successfully',
        color: 'green',
      })
    },
  })
}

export const useUpdateHrmExemption = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TEditHrmExemptionPayload) =>
      hrmClient.updateHrmExemption(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.getHrmExemptions],
      })
      notifications.show({
        title: 'Success',
        message: 'Exemption updated successfully',
        color: 'green',
      })
    },
  })
}

export const useCanApproveHrmExemption = () => {
  return useQuery({
    queryKey: [ENDPOINTS.canApproveHrmExemption],
    queryFn: () => hrmClient.canApproveHrmExemption(),
  })
}

export const useApproveHrmExemption = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TApproveHrmExemptionPayload) =>
      hrmClient.approveHrmExemption(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.getHrmExemptions],
      })
      notifications.show({
        title: 'Success',
        message: 'Exemption approved successfully',
        color: 'green',
      })
    },
  })
}
