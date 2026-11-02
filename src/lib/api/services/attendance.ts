import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import attendanceClient from '../client/attendance'
import { useTamsStore } from '#/lib/store'
import { notifications } from '@mantine/notifications'
import type {
  AttendanceDeviceParams,
  AttendanceDeviceTransactionResponse,
  AttendanceDeviceTypeResponse,
  AttendanceDeviceUserParams,
  AttendanceDeviceUserResponse,
  TGetAttendanceDeviceResponse,
} from '#/lib/types/api/attendance'
import { ENDPOINTS } from '../client'
import type { TBaseQueryParams } from '#/lib/types'

export function useAttendanceAccess() {
  const user = useTamsStore((state) => state.user)
  return {
    canView: user?.permissions.includes('view all device') ?? false,
    canViewDetail: user?.permissions.includes('view single device') ?? false,
    canCreate: user?.permissions.includes('create device') ?? false,
    canEdit: user?.permissions.includes('edit device') ?? false,
  }
}

export function useAttendanceScope() {
  const user = useTamsStore((state) => state.user)
  const branch = useTamsStore((state) => state.activeBranch)
  return [user?.employee.company_id, user?.id, branch]
}

export function useGetAttendanceDevices<TSelected>(
  params?: AttendanceDeviceParams,
  select?: (data: TGetAttendanceDeviceResponse) => TSelected,
  enabled?: boolean,
) {
  const scope = useAttendanceScope()
  const { canView } = useAttendanceAccess()
  return useQuery({
    queryKey: [ENDPOINTS.attendanceDevices, scope, 'list', params],
    queryFn: () => attendanceClient.devices(params),
    enabled: canView && enabled,
    select,
  })
}

export function useAttendanceDevice(id: number) {
  const scope = useAttendanceScope()
  const { canViewDetail } = useAttendanceAccess()
  return useQuery({
    queryKey: [ENDPOINTS.attendanceDevices, scope, id],
    queryFn: () => attendanceClient.device(id),
    enabled: canViewDetail && Number.isInteger(id) && id > 0,
  })
}

export function useAttendanceDeviceTypes<TSelected>(
  select?: (data: AttendanceDeviceTypeResponse) => TSelected,
  enabled = true,
) {
  const scope = useAttendanceScope()
  return useQuery({
    queryKey: [ENDPOINTS.attendanceDeviceTypes, scope],
    queryFn: attendanceClient.deviceTypes,
    enabled,
    select,
  })
}

export function useAttendanceDeviceUsers<TSelected>(
  params?: AttendanceDeviceUserParams,
  select?: (data: AttendanceDeviceUserResponse) => TSelected,
  enabled?: boolean,
) {
  const scope = useAttendanceScope()
  const { canView } = useAttendanceAccess()
  return useQuery({
    queryKey: [ENDPOINTS.attendanceDevices, scope, params],
    queryFn: () => attendanceClient.users(params),
    enabled: canView && enabled,
    select,
  })
}

export function useAttendanceTransactions<TSelected>(
  params: TBaseQueryParams,
  select?: (data: AttendanceDeviceTransactionResponse) => TSelected,
  enabled?: boolean,
) {
  const scope = useAttendanceScope()
  const { canView } = useAttendanceAccess()
  return useQuery({
    queryKey: [ENDPOINTS.attendanceDevices, scope, 'transactions', params],
    queryFn: () => attendanceClient.transactions(params),
    enabled: canView && enabled,
    select,
  })
}

export function useAttendanceTransaction(
  id: number,
  params: { page: number; perPage: number },
  active = true,
) {
  const scope = useAttendanceScope()
  const { canView } = useAttendanceAccess()
  const enabled = active && canView && Number.isInteger(id) && id > 0
  const transaction = useQuery({
    queryKey: [ENDPOINTS.attendanceDevices, scope, 'transaction', id],
    queryFn: () => attendanceClient.transaction(id),
    enabled,
  })
  const commands = useQuery({
    queryKey: [
      ENDPOINTS.attendanceDevices,
      scope,
      'transaction',
      id,
      'commands',
      params,
    ],
    queryFn: () => attendanceClient.transactionCommands(id, params),
    enabled,
  })
  return { transaction, commands }
}

function useDeviceMutation<T, TResponse extends { message: string }>(
  mutationFn: (payload: T) => Promise<TResponse>,
  key: string,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: [key] })
      notifications.show({
        title: 'Success',
        message: response.message,
        color: 'green',
      })
    },
  })
}

export const useCreateAttendanceDevice = () =>
  useDeviceMutation(attendanceClient.createDevice, ENDPOINTS.attendanceDevices)
export const useUpdateAttendanceDevice = () =>
  useDeviceMutation(attendanceClient.updateDevice, ENDPOINTS.attendanceDevices)
export const useAttendanceDeviceCommand = () =>
  useDeviceMutation(attendanceClient.command, ENDPOINTS.attendanceDevices)
export const useTransferAttendanceUsers = () =>
  useDeviceMutation(attendanceClient.transfer, ENDPOINTS.attendanceDeviceUsers)
export const useBulkTransferAttendanceUsers = () =>
  useDeviceMutation(
    attendanceClient.bulkTransfer,
    ENDPOINTS.attendanceDeviceUsers,
  )
