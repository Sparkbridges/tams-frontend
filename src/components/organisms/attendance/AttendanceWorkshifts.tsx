import { useState } from 'react'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { PenIcon, PlusIcon, TrashIcon, UsersIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { TamsButton, TamsTable } from '#/components/atoms'
import {
  TamsConfirmation,
  TamsTableActionPopover,
} from '#/components/molecules'
import {
  useDeleteWorkshift,
  useWorkshiftAccess,
  useWorkshifts,
} from '#/lib/api/services/workshift'
import type { Workshift } from '#/lib/types/api/workshift'
import type {
  TamsActionPopoverOption,
  TamsTableColumn,
  TamsTableData,
} from '#/lib/types'
import AttendanceWorkshiftDetailDrawer from '../drawers/AttendanceWorkshiftDetailDrawer'
import {
  AttendanceAccessDenied,
  AttendanceQueryError,
} from './AttendanceDevicesLayout'
import AttendanceWorkshiftsLayout from './AttendanceWorkshiftsLayout'

export default function AttendanceWorkshifts() {
  const access = useWorkshiftAccess()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)
  const [deleting, setDeleting] = useState<Workshift | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure()
  const handleRowClick = (row: TamsTableData) => {
    if (!access.canView) return
    setSelectedId(Number(row.id))
    openDetail()
  }
  const query = useWorkshifts({
    page,
    per_page: 10,
    search_query: debouncedSearch || undefined,
  })
  const remove = useDeleteWorkshift()
  const columns: TamsTableColumn[] = [
    { label: 'ID', accessor: 'id' },
    { label: 'Shift name', accessor: 'name' },
    { label: 'Scope', accessor: 'scope' },
    {
      label: '',
      accessor: 'actions',
      render: (row) => {
        const shift = query.data?.data.results.find(
          (item) => item.id === row.id,
        )
        const options: TamsActionPopoverOption[] = [
          {
            label: 'Edit',
            color: '',
            icon: PenIcon,
            hidden: !access.canEdit,
            action: () =>
              navigate({
                to: '/admin-dashboard/attendance/workshift/edit/$id',
                params: { id: String(row.id) },
              }),
          },
          {
            label: 'Assign',
            color: '',
            icon: UsersIcon,
            hidden: !access.canAssign,
            action: () =>
              navigate({
                to: '/admin-dashboard/attendance/workshift/assign-employee/$id',
                params: { id: String(row.id) },
              }),
          },
          {
            label: 'Delete',
            icon: TrashIcon,
            color: 'red',
            hidden:
              !access.canDelete ||
              !shift ||
              (Boolean(shift.is_generic) && !access.isHqAdmin),
            action: () => {
              if (shift) setDeleting(shift)
            },
          },
        ]
        return options.some((option) => !option.hidden) ? (
          <TamsTableActionPopover data={options} />
        ) : null
      },
    },
  ]
  if (!access.canView) return <AttendanceAccessDenied />
  return (
    <AttendanceWorkshiftsLayout
      actions={
        access.canCreate && (
          <TamsButton
            size="md"
            onClick={() =>
              navigate({ to: '/admin-dashboard/attendance/workshift/create' })
            }
            leftSection={<PlusIcon />}
          >
            New work shift
          </TamsButton>
        )
      }
    >
      {query.isError && (
        <AttendanceQueryError
          error={query.error}
          retry={() => void query.refetch()}
        />
      )}
      <TamsTable
        columns={columns}
        handleRowClick={handleRowClick}
        data={(query.data?.data.results ?? []).map((shift) => ({
          id: shift.id,
          name: shift.name,
          scope: shift.is_generic
            ? 'All branches'
            : `Branch ${shift.station_id}`,
        }))}
        loading={query.isLoading}
        page={page}
        setPage={setPage}
        total={query.data?.data.total}
        search={search}
        setSearch={(value) => {
          setSearch(value)
          setPage(1)
        }}
        placeholder="Search work shifts"
      />
      {openedDetail && selectedId !== null && (
        <AttendanceWorkshiftDetailDrawer
          key={selectedId}
          selectedId={selectedId}
          opened
          onClose={closeDetail}
        />
      )}
      <TamsConfirmation
        opened={deleting !== null}
        onClose={() => {
          if (!remove.isPending) setDeleting(null)
        }}
        title="Delete work shift"
        isCritical
        loading={remove.isPending}
        message={`Delete "${deleting?.name ?? ''}"?${deleting?.has_assignables ? ' This also removes its assignments. Affected employees may no longer have a regular shift.' : ''} This cannot be undone.`}
        onConfirm={() => {
          if (deleting && !remove.isPending)
            remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }}
      />
    </AttendanceWorkshiftsLayout>
  )
}
