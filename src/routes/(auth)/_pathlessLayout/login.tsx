import { TAuthForm, TBrand } from '#/components'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_pathlessLayout/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-dvh relative py-20 cloud-bg">
      <section className=" max-w-xl mx-auto space-y-4">
        <TBrand />
        <TAuthForm />
      </section>
    </div>
  )
}
