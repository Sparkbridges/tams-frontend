import { handleAuthRoutesMiddleware } from '#/lib'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_pathlessLayout')({
  component: RouteComponent,
  beforeLoad:async()=> await handleAuthRoutesMiddleware()
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
