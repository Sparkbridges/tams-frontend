import { Breadcrumbs, ThemeIcon } from '@mantine/core'
import { Link, useLocation } from '@tanstack/react-router'
import { pageHeaderNav } from '../constants'

const useGetPageHeader = () => {
  const { pathname } = useLocation()

  const items = pathname
    .split('/')
    .slice(2)
    .map((_, index) => {
      const path = `/${pathname
        .split('/')
        .slice(1, index + 3)
        .join('/')}`
      return (
        <Link
          key={index}
          to={path}
          className={`${pathname === path ? 'text-blue-500' : 'text-gray-700'} font-semibold text-sm capitalize`}
        >
          {pathname.split('/')[index + 2]}
        </Link>
      )
    })

  const title = pathname.split('/')[pathname.split('/').length - 1]
  const pageobject = pageHeaderNav[title]

  const pageHeader = () => {
    if (!pageobject) return null
    return (
      <div className="space-y-3">
        <Breadcrumbs separator=">">{items}</Breadcrumbs>
        <div className="flex gap-4">
          <ThemeIcon variant="light" className="size-13">
            {pageobject.icon && <pageobject.icon size={30} />}
          </ThemeIcon>
          <div>
            <h1 className="text-3xl font-bold">{pageobject.title}</h1>
            <p className="text-sm text-gray-600">{pageobject.description}</p>
          </div>
        </div>
      </div>
    )
  }
  return { pageHeader }
}

export default useGetPageHeader
