import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/attendance/workshift/details/$id',
)({
  beforeLoad: ({ params }) => {
    if (
      !/^[1-9]\d*$/.test(params.id) ||
      !Number.isSafeInteger(Number(params.id))
    )
      throw notFound()
    throw redirect({ to: '/admin-dashboard/attendance/workshift' })
  },
})
