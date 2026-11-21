import { TamsButton, TamsTextInput } from '#/components/atoms'
import {
  TamsConfirmation,
  TamsEmptyState,
  TamsFloatingIndicator,
  TamsMulticolorProgress,
  TamsPagination,
  TamsTableActionPopover,
  TamsTableFilter,
} from '#/components/molecules'
import {
  capitalize,
  getStatusColor,
  newDayjs,
  usePerformanceTaskProjects,
} from '#/lib'
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Paper,
  Pill,
  Skeleton,
} from '@mantine/core'
import {
  ArrowRightIcon,
  ArrowsDownUpIcon,
  CalendarDotsIcon,
  CheckCircleIcon,
  ListBulletsIcon,
  MagnifyingGlassIcon,
  SquaresFourIcon,
} from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'

type PerformanceTaskManagementProps = {
  activeTab: 'all' | 'archived'
}

const PerformanceTaskManagement = ({
  activeTab,
}: PerformanceTaskManagementProps) => {
  const {
    tableData,
    search,
    setSearch,
    loading,
    branches,
    branchFilter,
    setBranchFilter,
    teamFilter,
    setTeamFilter,
    teams,
    statusFilter,
    setStatusFilter,
    statusOptions,
    actionPopoverOptions,
    sort,
    setSort,
    sortOptions,
    displayType,
    setDisplayType,
    page,
    setPage,
    total,
    handleCloseConfirmation,
    openedConfirmation,
    actionType,
    isPending,
    handleAction,
    emptyState,
  } = usePerformanceTaskProjects({ activeTab })
  const navigate = useNavigate()
  return (
    <div>
      <Paper px={20} py={14}>
        <div className="flex gap-4 items-center">
          <TamsTextInput
            leftSection={<MagnifyingGlassIcon />}
            placeholder="Search tasks..."
            className="flex-1"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Divider orientation="vertical" />
          <div className="flex items-center gap-2.5">
            <TamsTableFilter
              label="Branch"
              selectedOption={branchFilter}
              setSelectedItem={setBranchFilter}
              data={branches}
              showLabelAsSelectedOption
              disableAllOption
              width={250}
            />
            <TamsTableFilter
              label="Teams"
              selectedOption={teamFilter}
              setSelectedItem={setTeamFilter}
              data={teams}
              showLabelAsSelectedOption
              disableAllOption
              width={250}
            />
            <TamsTableFilter
              label="Status"
              selectedOption={statusFilter}
              setSelectedItem={(value) =>
                setStatusFilter(
                  value as 'pending' | 'active' | 'abandoned' | 'completed',
                )
              }
              data={statusOptions}
              showLabelAsSelectedOption
              disableAllOption
              width={250}
            />
            <TamsTableFilter
              label="Sort"
              selectedOption={sort}
              setSelectedItem={(value) =>
                setSort(
                  value as
                    | 'recently_updated'
                    | 'due_date'
                    | 'highest_completion'
                    | 'priority',
                )
              }
              data={sortOptions}
              showLabelAsSelectedOption
              disableAllOption
              width={250}
              overrideIcon={<ArrowsDownUpIcon />}
            />
            <TamsFloatingIndicator
              data={[
                { icon: ListBulletsIcon, value: 'list' },
                { icon: SquaresFourIcon, value: 'grid' },
              ]}
              setSelectedItem={(value) =>
                setDisplayType(value as 'list' | 'grid')
              }
            />
          </div>
        </div>
      </Paper>

      <Box className="mt-3">
        <section
          className={`space-y-4 ${displayType === 'grid' ? 'grid grid-cols-3 gap-4' : ''}`}
        >
          {!tableData &&
            loading &&
            Array.from({ length: 12 }).map((_, index) => (
              <Paper
                withBorder
                className={`flex px-8 py-6 rounded-2xl`}
                key={index}
                aria-hidden="true"
              >
                <div className="flex-1 space-y-2.5">
                  <div className="flex gap-2 items-center">
                    <Skeleton width={80} height={18} radius="xl" />
                    <Skeleton width={64} height={18} radius="xl" />
                    <Skeleton width={5} height={5} circle />
                    <Skeleton width={140} height={14} />
                  </div>
                  <div className="flex h-8 items-center">
                    <Skeleton width="60%" maw={360} height={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton width={72} height={14} />
                    <Skeleton width={5} height={5} circle />
                    <Skeleton width={64} height={14} />
                    <Skeleton width={16} height={16} circle />
                    <Skeleton width={100} height={14} />
                  </div>
                </div>
                <div className="w-75 space-y-4">
                  <Skeleton height={20} radius="xl" />
                  <Skeleton
                    className="ml-auto"
                    width={170}
                    height={36}
                    radius="sm"
                  />
                </div>
              </Paper>
            ))}
          {Array.isArray(tableData) &&
            tableData?.map((item) => {
              const { color, variant } = getStatusColor(
                item.is_archived ? 'archived' : item.status,
              )
              return (
                <Paper
                  key={item.id}
                  withBorder
                  className={`flex justify-between px-8 py-6 rounded-lg ${displayType === 'grid' ? 'flex-col space-y-5' : ''}`}
                >
                  <div className=" space-y-2.5">
                    {displayType === 'list' ? (
                      <div className="flex gap-2 items-center">
                        <Badge color={color} variant={variant} size="xs">
                          {item.is_archived ? 'archived' : item.status}
                        </Badge>
                        <span className="size-1.25 rounded-full bg-gray-700" />
                        {item.teams?.map((team) => (
                          <Pill
                            className="bg-secondary/20 text-secondary"
                            size="xs"
                            key={team.id}
                          >
                            {team.team_name}
                          </Pill>
                        ))}
                        <span className="size-1.25 rounded-full bg-gray-700" />
                        <div
                          className={`${newDayjs(item.date_to).isBefore(newDayjs(), 'date') ? 'text-red-500' : ''} flex items-center gap-2 text-xs font-medium`}
                        >
                          <CalendarDotsIcon />
                          Due: {newDayjs(item.date_to).format('MMM DD, YYYY')}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex gap-2 items-center justify-between">
                          <Badge color={color} variant={variant} size="xs">
                            {item.is_archived ? 'archived' : item.status}
                          </Badge>
                          <div
                            className={`${newDayjs(item.date_to).isBefore(newDayjs(), 'date') ? 'text-red-500' : ''} flex items-center gap-2 text-xs font-medium`}
                          >
                            <CalendarDotsIcon />
                            Due: {newDayjs(item.date_to).format('MMM DD, YYYY')}
                          </div>
                        </div>
                        {item.teams?.map((team) => (
                          <Pill
                            className="bg-secondary/20 text-secondary mr-2"
                            size="xs"
                            key={team.id}
                          >
                            {team.team_name}
                          </Pill>
                        ))}
                      </div>
                    )}
                    <h1 className="text-2xl font-bold">
                      {capitalize(item.name.trim())}
                    </h1>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-green-900 font-light gap-0.5 flex items-center">
                        <CheckCircleIcon weight="fill" />
                        {item.task_count} tasks
                      </div>
                      <span className="size-1.25 rounded-full bg-gray-700" />
                      <div className="text-xs gap-1.5 flex items-center">
                        <span className="font-medium">Created by:</span>
                        <Avatar
                          size={'xs'}
                          name={item.created_by?.fullname}
                          color="initials"
                        />
                        {item.created_by?.fullname}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <TamsMulticolorProgress
                      value={item.completed_tasks}
                      total={item.task_count}
                      className={`${
                        displayType === 'grid' ? 'w-full' : 'w-75'
                      }`}
                    />
                    <div className="flex gap-2 justify-end">
                      {item.status === 'active' && (
                        <TamsButton
                          rightSection={<ArrowRightIcon />}
                          onClick={() =>
                            navigate({
                              to: `/admin-dashboard/performance/task-management/board/$id`,
                              params: { id: String(item.id) },
                            })
                          }
                          size={displayType === 'list' ? 'sm' : 'xs'}
                          variant="light"
                        >
                          View Project Board
                        </TamsButton>
                      )}
                      <TamsTableActionPopover
                        data={actionPopoverOptions(item)}
                        size={displayType === 'list' ? 'lg' : 'md'}
                        variant="subtle"
                      />
                    </div>
                  </div>
                </Paper>
              )
            })}

          {Array.isArray(tableData) && tableData.length === 0 && !loading && (
            <TamsEmptyState empty={emptyState} height={350} />
          )}
        </section>
      </Box>

      <Paper className="mt-4 py-4 px-8">
        <TamsPagination
          limit={10}
          page={page}
          total={total}
          onPageChange={setPage ?? (() => {})}
        />
      </Paper>

      <TamsConfirmation
        onClose={handleCloseConfirmation}
        opened={openedConfirmation}
        loading={isPending}
        title={`${capitalize(actionType ?? '')} Project`}
        isCritical
        confirmText="Yes, Sure"
        message={`Are you sure you want to ${actionType} this project?`}
        onConfirm={handleAction}
      />
    </div>
  )
}

export default PerformanceTaskManagement
