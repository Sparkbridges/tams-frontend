import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS, hrmClient } from '../client'
import type {
  TApproveHrmExemptionPayload,
  TBaseQueryParams,
  TDeleteLeavesPayload,
  TFetchHrmExemptionByIdResponse,
  TFetchHrmExemptionsApprovalByIdResponse,
  TFetchHrmExemptionsApprovalsResponse,
  TFetchHrmExemptionsParams,
  TFetchHrmExemptionsResponse,
  TFetchHrmLeaveApproversByIdResponse,
  TFetchHrmLeaveApproversResponse,
  TFetchHrmLeaveByIdResponse,
  TFetchHrmLeavesParams,
  TFetchHrmLeavesResponse,
  TFetchHrmLeavesTypesResponse,
  TFetchHrmLeaveTypeByIdResponse,
  TFetchLeaveTypesByEmployeeIdResponse,
  TGenerateHrmReportsParams,
  TReassignPendingLeavesPayload,
  TTCreateHrmLeavePayload,
  TTEditHrmLeavePayload,
  TUpdateHrmLeaveTypeStatusPayload,
} from '#/lib/types'
import { notifications } from '@mantine/notifications'
import type {
  TCreateEditHrmExemptionApproverPayload,
  TCreateHrmExemptionPayload,
  TCreateHrmLeaveApproverPayload,
  TCreateHrmLeaveTypePayload,
  TEditHrmExemptionPayload,
  TEditHrmLeaveApproverPayload,
  TEditHrmLeaveTypePayload,
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

export const useReassignPendingLeaves = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TReassignPendingLeavesPayload) =>
      hrmClient.reassignPendingLeaves(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaveTypes],
      })
      notifications.show({
        title: 'Success',
        message: 'Pending leaves reassigned successfully',
        color: 'green',
      })
    },
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

export const useCreateHrmLeaveType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateHrmLeaveTypePayload) =>
      hrmClient.createHrmLeaveType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaveTypes],
      })
      notifications.show({
        title: 'Success',
        message: 'Leave type created successfully',
        color: 'green',
      })
    },
  })
}

export const useUpdateHrmLeaveType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TEditHrmLeaveTypePayload) =>
      hrmClient.updateHrmLeaveType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaveTypes],
      })
      notifications.show({
        title: 'Success',
        message: 'Leave type updated successfully',
        color: 'green',
      })
    },
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
  params?: TBaseQueryParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.hrmLeaveTypes, params],
    queryFn: () => hrmClient.fetchHrmLeaveTypes(params),
    select,
    enabled,
  })
}

export const useDeleteHrmLeaveType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => hrmClient.deleteHrmLeaveTypes(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaveTypes],
      })
      notifications.show({
        title: 'Success',
        message: 'Leave type deleted successfully',
        color: 'green',
      })
    },
  })
}

export const useUpdateHrmLeaveTypeStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TUpdateHrmLeaveTypeStatusPayload) =>
      hrmClient.updateHrmLeaveTypeStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaveTypes],
      })
      notifications.show({
        title: 'Success',
        message: 'Leave type status updated successfully',
        color: 'green',
      })
    },
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

export const useGenerateHrmReports = (
  enabled: boolean,
  params?: TGenerateHrmReportsParams,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.fetchHrmReports, params],
    queryFn: () => hrmClient.generateHrmReports(params),
    enabled: enabled,
  })
}

export const useGenerateHrmLeaveReports = (
  enabled: boolean,
  params?: TGenerateHrmReportsParams,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.fetchHrmLeaveReports, params],
    queryFn: () => hrmClient.generateHrmLeaveReports(params),
    enabled: enabled,
  })
}

export const useGetHrmLeaveTypeById = <TSelected>(
  id: number,
  select?: (data: TFetchHrmLeaveTypeByIdResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.hrmLeaveTypes, id],
    queryFn: () => hrmClient.fetchHrmLeaveTypeById(id),
    select,
    enabled: Boolean(id),
  })
}

export const useGetHrmLeaveApprovers = <TSelected>(
  params?: TBaseQueryParams,
  select?: (data: TFetchHrmLeaveApproversResponse) => TSelected,
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.hrmLeaveApprovers, params],
    queryFn: () => hrmClient.fetchHrmLeaveApprovers(params),
    select,
    enabled,
  })
}

export const useCreateHrmLeaveApprover = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateHrmLeaveApproverPayload) =>
      hrmClient.createHrmLeaveApprover(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaveApprovers],
      })
      notifications.show({
        title: 'Success',
        message: 'Leave approver created successfully',
        color: 'green',
      })
    },
  })
}

export const useUpdateHrmLeaveApprover = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TEditHrmLeaveApproverPayload) =>
      hrmClient.updateHrmLeaveApprover(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaveApprovers],
      })
      notifications.show({
        title: 'Success',
        message: 'Leave approver updated successfully',
        color: 'green',
      })
    },
  })
}

export const useGetHrmLeaveApproversById = <TSelected>(
  id: number,
  select?: (data: TFetchHrmLeaveApproversByIdResponse) => TSelected,
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.hrmLeaveApprovers, id],
    queryFn: () => hrmClient.fetchHrmLeaveApproverById(id),
    select,
    enabled: Boolean(id) && enabled,
  })
}

export const useDeleteHrmLeaveApprover = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { approverIds: number[] }) =>
      hrmClient.deleteHrmLeaveApprover(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmLeaveApprovers],
      })
      notifications.show({
        title: 'Success',
        message: 'Leave approver(s) deleted successfully',
        color: 'green',
      })
    },
  })
}

export const useGetHrmExemptionsSettingsApprovals = <TSelected>(
  params?: TBaseQueryParams,
  select?: (data: TFetchHrmExemptionsApprovalsResponse) => TSelected,
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.hrmExemptionsSettingsApprovals, params],
    queryFn: () => hrmClient.fetchHrmExemptionsSettingsApprovals(params),
    select,
    enabled,
  })
}

export const useDeleteHrmExemptionsApprover = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: number[]) =>
      hrmClient.deleteHrmExemptionsSettingsApprovalById(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmExemptionsSettingsApprovals],
      })
      notifications.show({
        title: 'Success',
        message: 'HRM exemption setting(s) deleted successfully',
        color: 'green',
      })
    },
  })
}

export const useCreateHrmExemptionsSettingsApprover = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateEditHrmExemptionApproverPayload) =>
      hrmClient.createHrmExemptionsSettingsApproval(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmExemptionsSettingsApprovals],
      })
      notifications.show({
        title: 'Success',
        message: 'HRM exemption setting(s) created successfully',
        color: 'green',
      })
    },
  })
}

export const useUpdateeHrmExemptionsSettingsApprover = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TCreateEditHrmExemptionApproverPayload) =>
      hrmClient.updateHrmExemptionsSettingsApproval(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.hrmExemptionsSettingsApprovals],
      })
      notifications.show({
        title: 'Success',
        message: 'HRM exemption setting(s) updated successfully',
        color: 'green',
      })
    },
  })
}

export const useGetHrmExemptionsSettingsApprovalsById = <TSelected>(
  id: number,
  select?: (data: TFetchHrmExemptionsApprovalByIdResponse) => TSelected,
) => {
  return useQuery({
    queryKey: [ENDPOINTS.hrmExemptionsSettingsApprovals, id],
    queryFn: () => hrmClient.fetchHrmExemptionsSettingsApprovalById(id),
    select,
    enabled: Boolean(id),
  })
}
