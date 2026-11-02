import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { useAttendanceScope } from './attendance'
import { useTamsStore } from '#/lib/store'
import { getErrorMessage } from '#/lib/utils'
import type { SchedulerParams } from '#/lib/types/api/scheduler'
import schedulerClient from '../client/scheduler'

export function useSchedulerAccess() {
  const permissions = useTamsStore((state) => state.user?.permissions)
  return {
    canView: permissions?.includes('get employee shift') ?? false,
    canSave: permissions?.includes('save employee shift') ?? false,
  }
}
export function useSchedules(params: SchedulerParams | null) {
  const scope = useAttendanceScope()
  const { canView } = useSchedulerAccess()
  return useQuery({
    queryKey: ['attendance-schedules', scope, params],
    queryFn: () => {
      if (!params) throw new Error('Choose schedule filters first')
      return schedulerClient.list(params)
    },
    enabled: canView && params !== null,
  })
}
export function useSaveSchedules() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: schedulerClient.save,
    onSuccess: async (response) => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ['attendance-schedules'] }),
        client.invalidateQueries({ queryKey: ['attendance-workshifts'] }),
      ])
      notifications.show({
        title: 'Schedules saved',
        message: `${response.data.saved} saved, ${response.data.skipped} skipped.`,
        color: 'green',
      })
    },
    onError: (error) =>
      notifications.show({
        title: 'Unable to save schedules',
        message: getErrorMessage(error),
        color: 'red',
      }),
  })
}
