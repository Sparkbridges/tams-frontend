import { useTamsStore } from '../store'
import { redirect } from '@tanstack/react-router'

// for auth routes
export const handleAuthRoutesMiddleware = async () => {
  const user = useTamsStore.getState().user
  if (user) {
    const isAdmin = useTamsStore.getState().isAdmin
    throw redirect({ to: isAdmin ? '/admin-dashboard' : '/ess' })
  }
}

export const handleAuthenticatedRoutesMiddleware = async (pathname: string) => {
  const user = useTamsStore.getState().user
  if (!user) {
    throw redirect({ to: '/login' })
  }

  const isAdmin = useTamsStore.getState().isAdmin

  if (pathname.startsWith('/admin-dashboard') && !isAdmin) {
    throw redirect({ to: '/ess' })
  }

  if (isAdmin && pathname.startsWith('/ess')) {
    throw redirect({ to: '/admin-dashboard' })
  }
}
