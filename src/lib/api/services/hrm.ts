import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS, hrmClient } from '../client'
import type {
  TApproveHrmExemptionPayload,
  TDeleteLeavesPayload,
  TFetchHrmExemptionByIdResponse,
  TFetchHrmExemptionsParams,
  TFetchHrmExemptionsResponse,
  TFetchHrmLeaveByIdResponse,
  TFetchHrmLeavesParams,
  TFetchHrmLeavesResponse,
  TFetchHrmLeavesTypesResponse,
  TFetchLeaveTypesByEmployeeIdResponse,
  TTCreateHrmLeavePayload,
  TTEditHrmLeavePayload,
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

export const useGetHrmLeaves = <TSelected>(
  params: TFetchHrmLeavesParams,
  select?: (data: TFetchHrmLeavesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.hrmLeaves, params],
    queryFn: () => hrmClient.fetchHrmLeaves(params),
    select,
    enabled: !!params,
  })
}

export const useGetHrmLeaveById = <TSelected>(
  id: number,
  select?: (data: TFetchHrmLeaveByIdResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.hrmLeaves, id],
    queryFn: () => hrmClient.fetchHrmLeaveById(id),
    select,
    enabled: !!id,
  })
}

export const useDeleteHrmLeaves = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TDeleteLeavesPayload) =>
      hrmClient.deleteLeaves(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaves],
      })
      notifications.show({
        title: 'Success',
        message: 'Leave(s) deleted successfully',
        color: 'green',
      })
    },
  })
}

export const useCreateHrmLeave = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TTCreateHrmLeavePayload) =>
      hrmClient.createHrmLeave(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaves],
      })
      notifications.show({
        title: 'Success',
        message: 'Leave created successfully',
        color: 'green',
      })
    },
  })
}

export const useUpdateHrmLeave = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TTEditHrmLeavePayload) =>
      hrmClient.updateHrmLeave(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaves],
      })
      notifications.show({
        title: 'Success',
        message: 'Leave updated successfully',
        color: 'green',
      })
    },
  })
}

export const useGetHrmLeaveTypes = <TSelected>(
  select?: (data: TFetchHrmLeavesTypesResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.hrmLeaveTypes],
    queryFn: () => hrmClient.fetchHrmLeaveTypes(),
    select,
  })
}

export const useGetHrmLeaveTypesByEmployeeId = <TSelected>(
  params: {
    employee_id: number
  },
  select?: (data: TFetchLeaveTypesByEmployeeIdResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.getHrmLeaveTypeByEmployeeId, params],
    queryFn: () => hrmClient.fetchHrmLeaveTypesByEmployeeId(params),
    select,
  })
}
