import { TamsAvatar } from '#/components/atoms'
import { TamsSearchDropdown } from '#/components/molecules'
import { useSearchOrganizationEmployees } from '#/lib'
import { ActionIcon, Paper } from '@mantine/core'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const SearchEmployeeWidget = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [recentlyViewed, setRecentlyViewed] = useState<Record<string, any>[]>(
    [],
  )

  const navigate = useNavigate()

  useEffect(() => {
    const storedRecentlyViewed = localStorage.getItem('recentlyViewedEmployees')
    if (storedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(storedRecentlyViewed))
    }
  }, [])

  const handleEmployeeClick = (employee: Record<string, any>) => {
    const prevRecentlyViewed = [
      employee,
      ...recentlyViewed.filter((e) => e.id !== employee.id),
    ]
    localStorage.setItem(
      'recentlyViewedEmployees',
      JSON.stringify(prevRecentlyViewed),
    )
    navigate({
      to: '/admin-dashboard/organization/employees/details/$id',
      params: { id: employee.id },
    })
  }
    
    const handleRemoveRecentlyViewed = (employeeId: string) => {
      const updatedRecentlyViewed = recentlyViewed.filter((e) => e.id !== employeeId)
      setRecentlyViewed(updatedRecentlyViewed)
      localStorage.setItem('recentlyViewedEmployees', JSON.stringify(updatedRecentlyViewed))
    }
  const { data: employees, isFetching } = useSearchOrganizationEmployees(
    {
      query: searchQuery,
    },
    (data) =>
      data.data.map((employee) => ({
        label: employee.name,
        value: employee.id,
      })),
  )
  return (
    <Paper className=" bg-midnight rounded-lg p-6 text-white h-full">
      <h3 className="font-semibold text-lg mb-4">Employee Directory</h3>
      <div className="relative mb-6">
        <TamsSearchDropdown
          leftSection={(<MagnifyingGlassIcon />) as React.ReactNode}
          dropdownclassname="bg-night"
          dropdownitemclassname="hover:bg-midnight"
          onOptionSelect={(item)=> handleEmployeeClick(item)}
          size="lg"
          value={searchQuery}
          loading={isFetching}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for employee"
          styles={{
            input: {
              backgroundColor: 'var(--color-night)',
              color: 'white',
            },
          }}
          data={employees}
          dataLeft="avatar"
        />
      </div>
      {recentlyViewed.length > 0 && (
        <h4 className="font-medium text-white uppercase tracking-wider mb-3">
          Recently Viewed
        </h4>
      )}
      <div className="flex space-x-4">
        {recentlyViewed.map((employee) => (
          <div
            onClick={() => handleEmployeeClick(employee)}
            key={employee.id}
            className="flex flex-col items-center relative cursor-pointer"
          >
            <TamsAvatar
              name={employee.label}
              alt={employee.label}
              color="initials"
            />
            <span className="text-xs mt-1 text-surface-variant">
              {employee.label?.length > 9 ? employee.label.slice(0, 10) + '...' : employee.label}
            </span>
            <ActionIcon
              variant="subtle"
              color="red"
              size="xs"
              className="absolute top-0 right-0"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveRecentlyViewed(employee.id)
              }}
            >
              <XIcon />
            </ActionIcon>
          </div>
        ))}
      </div>
    </Paper>
  )
}

export default SearchEmployeeWidget
