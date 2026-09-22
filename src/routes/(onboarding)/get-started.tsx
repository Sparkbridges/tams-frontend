import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(onboarding)/get-started')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(onboarding)/get-started"!</div>
}
