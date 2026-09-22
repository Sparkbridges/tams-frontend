import { TamsThemeSwitch, TBrand } from '#/components/molecules'
import { AppShell, Burger, Divider, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from '#/styles/css/modules/Dashboard.module.css'
import { adminNavigation, USER_VIEW } from '#/lib'
import { TamsNavLink } from '#/components/atoms'
import { useLocation } from '@tanstack/react-router'
import { useLayoutEffect, useState } from 'react'
import {
  BranchesDropdown,
  NotificationsDropdown,
  ProfileAvatarDropdown,
} from '../dropdowns'

type DashboardLayoutProps = {
  children: React.ReactNode
  viewType: USER_VIEW
}

const DashboardLayout = ({ children, viewType }: DashboardLayoutProps) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

  const [navObject, setNavObj] = useState<Record<string, boolean>>({})

  const navigation = viewType === USER_VIEW.ADMIN ? adminNavigation : []

  const parentRoute = viewType === USER_VIEW.ADMIN ? '/admin-dashboard' : '/ess'

  const { pathname } = useLocation()

  useLayoutEffect(() => {
    if (pathname) {
      const route =
        pathname.split('/').length == 2
          ? pathname
          : pathname.split('/').slice(0, 3).join('/')
      setNavObj({ [route]: true })
    }
  }, [pathname])

  const handleChangeRoute = (url: string) => {
    if (pathname.startsWith(url)) {
      setNavObj((prev) => {
        const next = { ...prev }
        for (const k in next) {
          next[k] = k !== url
        }
        next[url] = !prev[url]
        return next
      })
    }
  }

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <AppShell.Header className={classes.appHeader}>
        <Group justify="space-between" h="100%" px="md">
          <div>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <Divider
              className="hidden sm:inline-block"
              orientation="vertical"
            />
            <div className="hidden sm:block">
              <BranchesDropdown />
            </div>
            <Divider
              className="hidden sm:inline-block"
              orientation="vertical"
            />
            <NotificationsDropdown />
            <Divider orientation="vertical" />
            <TamsThemeSwitch />
            <Divider orientation="vertical" />
            <ProfileAvatarDropdown />
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className={classes.appHeader} p="md">
        <TBrand />
        <Divider my="md" />
        <div className="space-y-2 h-200 overflow-y-auto">
          {navigation.map((navItem) => {
            const path =
              navItem.url === 'index'
                ? parentRoute
                : `${parentRoute}${navItem.url}`

            if (navItem.children && navItem.children.length > 0) {
              return (
                <TamsNavLink
                  key={navItem.id}
                  childrenOffset={28}
                  label={navItem.name}
                  leftSection={navItem.img ? <navItem.img size={24} /> : null}
                  to={path}
                  activeProps={{ className: classes.navLinkActive }}
                  opened={navObject[path] || false}
                  onClick={() => handleChangeRoute(path)}
                >
                  {navItem.children.map((child) => {
                    const childPath =
                      child.url === 'index' ? path : `${path}${child.url}`
                    return (
                      <TamsNavLink
                        key={child.id}
                        leftSection={child.img ? <child.img size={24} /> : null}
                        label={child.name}
                        to={childPath}
                        activeOptions={{ exact: true }}
                        activeProps={{ className: classes.navLinkChildActive }}
                      />
                    )
                  })}
                </TamsNavLink>
              )
            }
            return (
              <TamsNavLink
                key={navItem.id}
                leftSection={navItem.img ? <navItem.img size={24} /> : null}
                label={navItem.name}
                to={path}
                activeOptions={{ exact: true }}
                activeProps={{ className: classes.navLinkActive }}
              />
            )
          })}
        </div>
        <Divider className="sm:hidden" />
        <div className="sm:hidden">
          <BranchesDropdown />
        </div>
      </AppShell.Navbar>
      <AppShell.Main className={classes.appMain}>{children}</AppShell.Main>
    </AppShell>
  )
}

export default DashboardLayout
