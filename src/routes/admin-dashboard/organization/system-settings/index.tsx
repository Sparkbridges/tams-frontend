import { documentHelper, systemSettingsOptions, useGetPageHeader } from '#/lib'
import { Paper } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin-dashboard/organization/system-settings/',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Organization System Settings | Tams',
      content: 'Organization System Settings Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const navigate = useNavigate()
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
      </section>
      <section className="mt-10 grid grid-cols-12 gap-5">
        {systemSettingsOptions.map((option) => (
          <Paper
            onClick={() => navigate({ to: `${option.value}` })}
            withBorder
            py="lg"
            className="lg:col-span-4 text-center cursor-pointer hover:shadow-md hover:bg-primary/5 transition-shadow duration-300"
            key={option.value}
          >
            <img
              src={option.image}
              className="object-contain w-40 h-20 mx-auto block"
              alt={option.label}
            />
            <h3 className="mt-4 text-lg font-semibold">{option.label}</h3>
            <p className="mt-2 text-sm text-gray-600">{option.description}</p>
          </Paper>
        ))}
      </section>
    </main>
  )
}
