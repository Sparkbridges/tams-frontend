import {
  RecentActivityCard,
  SearchEmployeeWidget,
  TamsPageError,
  WorkForcePulseCard,
} from '#/components'
import {
  documentHelper,
  // useFetchAttendanceDashboardPunctuality,
  useFetchEmployeeHomeDetails,
  useTamsStore,
} from '#/lib'
import type { TFetchAttendanceDashboardPunctualityParams } from '#/lib'
import { Box, Paper, Text } from '@mantine/core'
import {
  BankIcon,
  CakeIcon,
  CalendarXIcon,
  ConfettiIcon,
  GearIcon,
  HeartbeatIcon,
  NotePencilIcon,
} from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createFileRoute('/admin-dashboard/')({
  component: RouteComponent,
  head: () =>
    documentHelper({
      title: 'Admin Dashboard | Tams',
      content: 'Admin Dashboard Page',
      name: 'description',
    }),
  errorComponent: () => <TamsPageError type="500" />,
})

function RouteComponent() {
  const { activeBranch } = useTamsStore()
  const navigate = useNavigate()
  const { data: employeeHomeDetails } = useFetchEmployeeHomeDetails()

  const params: TFetchAttendanceDashboardPunctualityParams = useMemo(
    () => ({
      page: 1,
      per_page: 1000,
      type: 'present',
      branch_id: activeBranch || 'all',
      date: new Date().toISOString(),
    }),
    [activeBranch],
  )

  console.log(params)

  /*  const { data: attendanceDashboardPunctuality } =
    useFetchAttendanceDashboardPunctuality(params) */

  const handleQuickLinkClick = (href: string) => navigate({ to: href })

  const quickLinks = [
    {
      label: 'Exemptions',
      icon: NotePencilIcon,
      href: '/admin-dashboard/exemptions',
    },
    {
      label: 'Leave',
      icon: CalendarXIcon,
      href: '/admin-dashboard/leave',
    },
    {
      label: 'Loans',
      icon: BankIcon,
      href: '/admin-dashboard/loans',
    },
    {
      label: 'Settings',
      icon: GearIcon,
      href: '/admin-dashboard/settings',
    },
  ]
  return (
    <Box className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Paper
          px={'lg'}
          py={{ base: 'md', sm: 'xl' }}
          withBorder
          className="lg:col-span-8 relative flex items-center rounded-lg"
        >
          <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="150" cy="50" fill="#016AEA" r="40"></circle>
              <circle cx="180" cy="120" fill="#016AEA" r="30"></circle>
              <circle cx="120" cy="180" fill="#016AEA" r="50"></circle>
            </svg>
          </div>
          <section className="flex justify-between items-center w-full">
            <div>
              <h2 className="font-bold text-3xl text-gray-800">
                Welcome, Admin
              </h2>
              <Text c="dimmed" className=" text-sm mt-1">
                It is another day to be great!!!
              </Text>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex items-center space-x-3 backdrop-blur-sm">
              <HeartbeatIcon className="text-primary" size={32} />
              <div>
                <p className="font-medium text-primary uppercase tracking-wide">
                  Intelligence Insight
                </p>
                <p className="font-title-sm text-gray-800 font-semibold">
                  System Health: 100%
                </p>
              </div>
            </div>
          </section>
        </Paper>
        <div className="lg:col-span-4 bg-primary text-white rounded-lg p-6 bento-shadow flex flex-col justify-center space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="p-2 bg-white/20 rounded-md">
              <CakeIcon size={20} />
            </div>
            <div>
              <p className=" font-semibold">0 Birthdays</p>
              <p className="text-sm opacity-80">Celebrants Today</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="p-2 bg-white/20 rounded-md">
              <ConfettiIcon size={20} />
            </div>
            <div>
              <p className=" font-semibold">0 Anniversaries</p>
              <p className="text-sm opacity-80">Work Anniversaries</p>
            </div>
          </div>
        </div>
      </div>

      {/* second row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6">
          <WorkForcePulseCard data={employeeHomeDetails?.data} />
        </div>
        <div className="lg:col-span-6">
          <SearchEmployeeWidget />
        </div>
      </div>

      {/* third row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <RecentActivityCard
            data={employeeHomeDetails?.data.recent_activity_histories}
          />
        </div>
        <div className="lg:col-span-5">
          <Paper
            className="rounded-lg"
            withBorder
            px={'lg'}
            py={{ base: 'md', sm: 'lg' }}
          >
            <h3 className="font-semibold text-lg text-gray-800  mb-6">
              Quick Links
            </h3>
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {quickLinks.map((link, index) => (
                <div
                  key={index}
                  onClick={() => handleQuickLinkClick(link.href)}
                  className="border cursor-pointer bg-[#F9FAFC] border-[#C2C6D7] rounded-md p-5 flex flex-col items-center justify-center space-y-3"
                >
                  {<link.icon className="text-primary" size={42} />}
                  <span>{link.label}</span>
                </div>
              ))}
            </section>
          </Paper>
        </div>
      </div>
    </Box>
  )
}
