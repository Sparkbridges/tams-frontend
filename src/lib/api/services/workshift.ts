import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { useTamsStore } from '#/lib/store'
import { getErrorMessage } from '#/lib/utils'
import { useAttendanceScope } from './attendance'
import workshiftClient from '../client/workshift'
import organizationClient from '../client/organization'
import type { CalendarParams, RosterParams } from '#/lib/types/api/workshift'

export function useWorkshiftAccess() {
  const user = useTamsStore((state) => state.user)
  return {
    canView: user?.permissions.includes('view regular shifts') ?? false,
    canCreate: user?.permissions.includes('create regular shift') ?? false,
    canEdit: user?.permissions.includes('update regular shift') ?? false,
    canDelete: user?.permissions.includes('delete regular shift') ?? false,
    canAssign: user?.permissions.includes('assign shift') ?? false,
    canViewTypes: user?.permissions.includes('view shift type') ?? false,
    canSaveTypes: user?.permissions.includes('save shift type') ?? false,
    canDeleteTypes: user?.permissions.includes('delete shift type') ?? false,
    canViewClock: user?.permissions.includes('get clock settings') ?? false,
    canSaveClock: user?.permissions.includes('create clock settings') ?? false,
    isHqAdmin:
      !!user?.employee.branch.is_hq &&
      !!user.permissions.includes('view backend'),
  }
}

export function useWorkshifts(
  params: Parameters<typeof workshiftClient.list>[0],
) {
  const scope = useAttendanceScope()
  const { canView } = useWorkshiftAccess()
  return useQuery({
    queryKey: ['attendance-workshifts', scope, 'list', params],
    queryFn: () => workshiftClient.list(params),
    enabled: canView,
  })
}
export function useWorkshift(id: number) {
  const scope = useAttendanceScope()
  const { canView } = useWorkshiftAccess()
  return useQuery({
    queryKey: ['attendance-workshifts', scope, 'detail', id],
    queryFn: () => workshiftClient.detail(id),
    enabled: canView && id > 0,
  })
}
export function useShiftTypes() {
  const scope = useAttendanceScope()
  const { canViewTypes } = useWorkshiftAccess()
  return useQuery({
    queryKey: ['attendance-workshifts', scope, 'types'],
    queryFn: workshiftClient.types,
    enabled: canViewTypes,
  })
}
export function useShiftCalendar(params: CalendarParams) {
  const scope = useAttendanceScope()
  const { canView } = useWorkshiftAccess()
  return useQuery({
    queryKey: ['attendance-workshifts', scope, 'calendar', params],
    queryFn: () => workshiftClient.calendar(params),
    enabled: canView && params.employee_id > 0,
  })
}
export function useShiftRoster(params: RosterParams | null, page: number) {
  const scope = useAttendanceScope()
  const { canView } = useWorkshiftAccess()
  return useQuery({
    queryKey: ['attendance-workshifts', scope, 'roster', params, page],
    queryFn: () => {
      if (!params) throw new Error('Choose roster filters first')
      return workshiftClient.roster({ ...params, page, perPage: 10 })
    },
    enabled: canView && params !== null,
  })
}
export function useShiftClock() {
  const scope = useAttendanceScope()
  const { canViewClock } = useWorkshiftAccess()
  return useQuery({
    queryKey: ['attendance-workshifts', scope, 'clock'],
    queryFn: workshiftClient.clock,
    enabled: canViewClock,
  })
}

export function useShiftBranches(enabled = true) {
  const scope = useAttendanceScope()
  return useQuery({
    queryKey: ['attendance-workshifts', scope, 'branches'],
    queryFn: () => organizationClient.fetchOrganizationBranches(),
    enabled,
  })
}
export function useShiftDepartments(branchId: number) {
  const scope = useAttendanceScope()
  return useQuery({
    queryKey: ['attendance-workshifts', scope, 'departments', branchId],
    queryFn: () =>
      organizationClient.fetchDepartmentsAssignedToBranch(branchId),
    enabled: branchId > 0,
  })
}
export function useShiftEmployeeSearch(query: string) {
  const scope = useAttendanceScope()
  return useQuery({
    queryKey: ['attendance-workshifts', scope, 'employees', query],
    queryFn: () => organizationClient.searchOrganizationEmployees({ query }),
    enabled: query.trim().length > 0,
  })
}
function useShiftMutation<T>(
  mutationFn: (payload: T) => Promise<{ message: string }>,
) {
  const client = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async (response) => {
      await client.invalidateQueries({ queryKey: ['attendance-workshifts'] })
      notifications.show({
        title: 'Success',
        message: response.message,
        color: 'green',
      })
    },
    onError: (error) =>
      notifications.show({
        title: 'Work shift request failed',
        message: getErrorMessage(error),
        color: 'red',
      }),
  })
}
export const useCreateWorkshift = () => useShiftMutation(workshiftClient.create)
export const useUpdateWorkshift = () => useShiftMutation(workshiftClient.update)
export const useDeleteWorkshift = () => useShiftMutation(workshiftClient.remove)
export const useAssignWorkshift = () => useShiftMutation(workshiftClient.assign)
export const useUnassignWorkshift = () =>
  useShiftMutation(workshiftClient.unassign)
export const useSaveShiftTypes = () =>
  useShiftMutation(workshiftClient.saveTypes)
export const useDeleteShiftType = () =>
  useShiftMutation(workshiftClient.removeType)
export const useSaveShiftClock = () =>
  useShiftMutation(workshiftClient.saveClock)
