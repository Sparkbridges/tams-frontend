import { OrganizationEmployeeSettingsTable, TamsTabs } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import type { TamsMenuItem, TTamsTabs } from '#/lib'
import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Divider, Group } from '@mantine/core'
import { PlusIcon } from '@phosphor-icons/react'
import TamsButtonDropdown from '#/components/molecules/dropdown/TamsButtonDropdown'

export const Route = createFileRoute(
  '/admin-dashboard/organization/system-settings/employee-settings',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Organization Employees System Settings | Tams',
      content: 'Organization Employees System Settings Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const [activeTab, setActiveTab] = useState<
    'types' | 'designation' | 'category' | 'grades' | null
  >('types')

  const [tabCounts, setTabCounts] = useState<{ [key: string]: number }>({
    types: 0,
    designation: 0,
    category: 0,
    grades: 0,
  })

  const tabOptions: TTamsTabs[] = useMemo(
    () => [
      {
        label: 'Employee Types',
        value: 'types',
        value2: tabCounts.types,
      },
      {
        label: 'Employee Designation',
        value: 'designation',
        value2: tabCounts.designation,
        color2: 'red',
      },
      {
        label: 'Employee Category',
        value: 'category',
        value2: tabCounts.category,
        color2: 't-purple',
      },
      {
        label: 'Employee Grades',
        value: 'grades',
        value2: tabCounts.grades,
        color2: 'gray',
      },
    ],
    [tabCounts],
  )

  const dropdownOptions = useMemo(
    (): TamsMenuItem[] => [
      { label: 'Employee Type', type: 'item' },
      { label: 'Employee Designation', type: 'item' },
      { label: 'Employee Category', type: 'item' },
      { label: 'Employee Grade', type: 'item' },
    ],
    [],
  )
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        <Group gap="md">
          <TamsButtonDropdown
            btnText="Add new"
            size="md"
            leftSection={<PlusIcon />}
            options={dropdownOptions}
          />
        </Group>
      </section>
      <Divider mt="lg" />
      <section className="mt-2">
        <TamsTabs
          tabValue={activeTab}
          onTabChange={(value) =>
            setActiveTab(
              value as 'types' | 'designation' | 'category' | 'grades' | null,
            )
          }
          data={tabOptions}
        />
      </section>
      <div className="mt-10">
        <OrganizationEmployeeSettingsTable
          setTabCounts={setTabCounts}
          activeTab={activeTab}
        />
      </div>
    </main>
  )
}
