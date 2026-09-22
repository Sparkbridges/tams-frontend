import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { Notifications } from '@mantine/notifications'

import '../styles/css/styles.css'
import { MantineProvider } from '@mantine/core'
import { theme } from '#/styles/theme/theme.config'
import { QueryProvider } from '#/lib'
import { TamsPageError } from '#/components'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: () => <TamsPageError type="500" />,
  notFoundComponent: () => <TamsPageError type="404" />,
})

function RootComponent() {
  return (
    <>
      <HeadContent />
      <QueryProvider>
        <MantineProvider theme={theme}>
          <Notifications position="top-right" />
          <Outlet />
        </MantineProvider>
      </QueryProvider>
    </>
  )
}
