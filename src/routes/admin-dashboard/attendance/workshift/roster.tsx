import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod/v4'
import AttendanceShiftRoster from '#/components/organisms/attendance/AttendanceShiftRoster'
import { rosterFilterSchema } from '#/lib/utils/schema/workshift.schema'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/workshift/roster',
)({
  validateSearch: z.object({ filters: rosterFilterSchema.optional() }),
  component: ShiftRoster,
})
function ShiftRoster() {
  const { filters } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  return (
    <AttendanceShiftRoster
      filters={filters}
      onGenerate={(next) => {
        void navigate({ search: { filters: next } })
      }}
    />
  )
}
