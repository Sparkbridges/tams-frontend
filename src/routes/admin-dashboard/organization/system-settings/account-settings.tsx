import {
  AccountSettingsPublicHolidayTable,
  EditCompanyForm,
  TamsButton,
  TamsStatsCard,
  TamsTabs,
} from '#/components'
import {
  documentHelper,
  getUpcomingHoliday,
  newDayjs,
  useGetPageHeader,
  useGetPublicHolidaySettings,
} from '#/lib'
import type {
  TGetPublicHolidaySettingsData,
  TStatsCard,
  TTamsTabs,
} from '#/lib'
import { Divider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { BellIcon, PlusIcon, TicketIcon } from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute(
  '/admin-dashboard/organization/system-settings/account-settings',
)({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Organization Account System Settings | Tams',
      content: 'Organization Account System Settings Page',
      name: 'description',
    }),
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const [activeTab, setActiveTab] = useState<
    'company' | 'public_holiday' | null
  >('company')
  const [
    openedAddHolidayModal,
    { open: openAddHolidayModal, close: closeAddHolidayModal },
  ] = useDisclosure(false)

  const {
    data: publicHolidaySettings,
    isLoading: loadingPublicHolidaySettings,
  } = useGetPublicHolidaySettings(undefined, (data) => data.data)

  const tabOptions = useMemo(
    (): TTamsTabs[] => [
      {
        label: 'Company Settings',
        value: 'company',
      },
      {
        label: 'Public Holiday',
        value: 'public_holiday',
        value2: publicHolidaySettings?.total ?? 0,
      },
    ],
    [publicHolidaySettings?.total],
  )

  const publicHolidaysStats = useMemo((): TStatsCard[] => {
    const upcomingHolidays = getUpcomingHoliday(
      publicHolidaySettings?.results as TGetPublicHolidaySettingsData[],
    )
    return [
      {
        title: 'Total Public Holidays',
        description: `There are ${publicHolidaySettings?.total ?? 0} public holidays set.`,
        color: 'dark',
        value: publicHolidaySettings?.total ?? 0,
        loading: loadingPublicHolidaySettings,
        icon: TicketIcon,
      },
      {
        title: 'Upcoming Holidays',
        description: `${newDayjs(upcomingHolidays?.date).format('MMMM D, YYYY') ?? 'N/A'}.`,
        color: 'green',
        value: upcomingHolidays?.name,
        loading: loadingPublicHolidaySettings,
        icon: BellIcon,
      },
    ]
  }, [publicHolidaySettings, loadingPublicHolidaySettings])

  return (
    <main>
      <section className="flex items-center justify-between">
        {pageHeader()}
        {activeTab === 'public_holiday' && (
          <TamsButton
            size="md"
            leftSection={<PlusIcon />}
            onClick={openAddHolidayModal}
          >
            Add New Holiday
          </TamsButton>
        )}
      </section>
      <Divider mt="lg" />
      <section className="mt-2">
        <TamsTabs
          tabValue={activeTab}
          onTabChange={(value) =>
            setActiveTab(value as 'company' | 'public_holiday' | null)
          }
          data={tabOptions}
        />
      </section>

      {activeTab === 'public_holiday' && (
        <section className="flex items-center mt-5 gap-5">
          {publicHolidaysStats.map((stat) => (
            <TamsStatsCard isFullWidth key={stat.title} {...stat} />
          ))}
        </section>
      )}

      <div className="mt-10">
        {activeTab === 'company' && <EditCompanyForm />}
        {activeTab === 'public_holiday' && (
          <AccountSettingsPublicHolidayTable
            openedCreatePublicHolidaysSettingsModal={openedAddHolidayModal}
            open={openedAddHolidayModal}
            onClose={closeAddHolidayModal}
          />
        )}
      </div>
    </main>
  )
}
