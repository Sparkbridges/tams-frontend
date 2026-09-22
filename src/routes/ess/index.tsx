import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ess/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ess/"!</div>
}
