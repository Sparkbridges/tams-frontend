import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(onboarding)/change-password-first-signin',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(onboarding)/change-password-first-signin"!</div>
}
