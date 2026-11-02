import { TamsButton, TamsPageError, TamsTabs } from '#/components'
import AttendanceDevicesTable from '#/components/organisms/data-table/AttendanceDevicesTable'
import { documentHelper, useAttendanceAccess, useGetPageHeader } from '#/lib'
import type { TTamsTabs } from '#/lib'
import { Divider } from '@mantine/core'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/admin-dashboard/attendance/devices/')({
  component: AttendanceDevicesPage,
  head: () =>
    documentHelper({
      title: 'Attendance Devices | Tams',
      content: 'Attendance Devices Page',
      name: 'description',
    }),
})

function AttendanceDevicesPage() {
  const { pageHeader } = useGetPageHeader()
  const navigate = useNavigate()
  const access = useAttendanceAccess()

  const [activeTab, setActiveTab] = useState<
    'devices' | 'user' | 'logs' | null
  >('devices')

  const tabOptions = useMemo(
    (): TTamsTabs[] => [
      {
        label: 'Devices',
        value: 'devices',
      },
      {
        label: 'User management',
        value: 'user',
      },
      {
        label: 'Transaction logs',
        value: 'logs',
      },
    ],
    [],
  )
  if (!access.canView) return <TamsPageError type="403" />
  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        {access.canCreate && activeTab === 'devices' && (
          <TamsButton
            size="md"
            leftSection={<PlusIcon />}
            onClick={() =>
              navigate({ to: '/admin-dashboard/attendance/devices/create' })
            }
          >
            New device
          </TamsButton>
        )}
      </section>
      <Divider mt="lg" />
      <section className="mt-2">
        <TamsTabs
          tabValue={activeTab}
          onTabChange={(value) =>
            setActiveTab(value as 'devices' | 'user' | 'logs' | null)
          }
          data={tabOptions}
        />
      </section>
      <div className="mt-10">
        <AttendanceDevicesTable activeTab={activeTab} />
      </div>
    </main>
  )
}
