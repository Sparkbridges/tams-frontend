import { OrganizationEmployeeSettingsTable, TamsTabs } from '#/components'
import { documentHelper, useGetPageHeader } from '#/lib'
import type { TamsMenuItem, TTamsTabs } from '#/lib'
import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Divider, Group } from '@mantine/core'
import { FilePlusIcon, PlusIcon } from '@phosphor-icons/react'
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
  const [createType, setCreateType] = useState('')

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
      },
      {
        label: 'Employee Category',
        value: 'category',
        value2: tabCounts.category,
      },
      {
        label: 'Employee Grades',
        value: 'grades',
        value2: tabCounts.grades,
      },
    ],
    [tabCounts],
  )

  const dropdownOptions = useMemo(
    (): TamsMenuItem[] => [
      {
        label: 'Employee Type',
        type: 'item',
        onClick: () => setCreateType('types'),
        icon: FilePlusIcon,
      },
      {
        label: 'Employee Designation',
        type: 'item',
        onClick: () => setCreateType('designation'),
        icon: FilePlusIcon,
      },
      {
        label: 'Employee Category',
        type: 'item',
        onClick: () => setCreateType('category'),
        icon: FilePlusIcon,
      },
      {
        label: 'Employee Grade',
        type: 'item',
        onClick: () => setCreateType('grades'),
        icon: FilePlusIcon,
      },
    ],
    [],
  )
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        <Group gap="md">
          <TamsButtonDropdown
            width={250}
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
          createType={createType}
          setCreateType={setCreateType}
        />
      </div>
    </main>
  )
}
