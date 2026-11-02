import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin-dashboard/attendance/')({
  beforeLoad: () => {
    throw redirect({ to: '/admin-dashboard/attendance/devices' })
  },
})
