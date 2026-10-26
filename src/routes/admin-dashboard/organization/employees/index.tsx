import { OrganizationEmployeeTable, TamsTabs } from '#/components'
import TamsButtonDropdown from '#/components/molecules/dropdown/TamsButtonDropdown'
import {
  UploadEmployeeModal,
  InviteEmployeeModal,
} from '#/components/organisms/modals'
import {
  documentHelper,
  useFetchOrganizationEmployeesCount,
  useGetPageHeader,
} from '#/lib'
import type { TamsMenuItem, TTamsTabs } from '#/lib'
import { Divider, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  PaperPlaneTiltIcon,
  PlusIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute(
  '/admin-dashboard/organization/employees/',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Employees | Tams',
      content: 'Organization Employees Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const navigate = Route.useNavigate()

  const { data: employeesCount } = useFetchOrganizationEmployeesCount(
    (data) => data.data,
  )

  const [
    isUploadEmployeeModalOpen,
    { open: openUploadEmployeeModal, close: closeUploadEmployeeModal },
  ] = useDisclosure(false)

  const [
    inviteEmployeeModalOpen,
    { open: openInviteEmployeeModal, close: closeInviteEmployeeModal },
  ] = useDisclosure(false)

  const [tabValue, setTabValue] = useState<string | null>('all')

  const tabOptions: TTamsTabs[] = useMemo(
    () => [
      {
        label: 'All Employees',
        value: 'all',
        value2: employeesCount?.unarchived,
      },
      {
        label: 'Archived',
        value: 'archived',
        value2: employeesCount?.archived,
        color2: 'gray',
      },
    ],
    [employeesCount],
  )

  const buttonDropdownOptions: TamsMenuItem[] = [
    {
      label: 'Add Employee Manually',
      type: 'item',
      onClick: () =>
        navigate({
          to: `/admin-dashboard/organization/employees/create`,
        }),
      icon: PlusIcon,
    },
    {
      label: 'Upload Employees',
      type: 'item',
      onClick: openUploadEmployeeModal,
      icon: UploadSimpleIcon,
    },
    {
      label: 'Invite Employee',
      type: 'item',
      onClick: openInviteEmployeeModal,
      icon: PaperPlaneTiltIcon,
    },
  ]
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        <Group gap="md">
          <TamsButtonDropdown
            width={250}
            size="md"
            options={buttonDropdownOptions}
            btnText="Add Employee"
          />
        </Group>
      </section>
      <Divider mt="lg" />
      <section className="mt-2">
        <TamsTabs
          tabValue={tabValue}
          onTabChange={(value) => setTabValue(value)}
          data={tabOptions}
        />
      </section>
      <div className="mt-10">
        <OrganizationEmployeeTable activeTab={tabValue} />
      </div>
      <UploadEmployeeModal
        opened={isUploadEmployeeModalOpen}
        onClose={closeUploadEmployeeModal}
      />
      <InviteEmployeeModal
        opened={inviteEmployeeModalOpen}
        onClose={closeInviteEmployeeModal}
      />
    </main>
  )
}
