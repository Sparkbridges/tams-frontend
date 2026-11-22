import { TamsGoBackNavigation, TamsConfirmation } from '#/components/molecules'
import { TamsButton, TamsSpinner, TamsTable } from '#/components'
import {
  useApproveAppraisalRequests,
  useFetchAppraisalApprovals,
  useRejectAppraisalRequests,
} from '#/lib'
import type { TamsTableColumn, TamsTableData } from '#/lib/types'
import { LoadingOverlay } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute(
  '/admin-dashboard/performance/appraisal/approvals',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [action, setAction] = useState<'approve' | 'reject'>('approve')
  const [opened, { open, close }] = useDisclosure(false)
  const { data, isLoading } = useFetchAppraisalApprovals({
    page,
    perPage: 10,
    search_query: search || undefined,
  })
  const approveMutation = useApproveAppraisalRequests()
  const rejectMutation = useRejectAppraisalRequests()

  const results =
    (data?.data as unknown as { results?: Record<string, unknown>[] })
      ?.results ?? []
  const total = (data?.data as unknown as { total?: number })?.total ?? 0
  const tableData: TamsTableData[] = results.map((row) => {
    const employee = row.employee as
      { first_name?: string; last_name?: string } | undefined
    const group = row.appraisalGroup as { name?: string } | undefined
    return {
      id: Number(row.id),
      employee:
        [employee?.first_name, employee?.last_name].filter(Boolean).join(' ') ||
        `Employee ${String(row.employee_id)}`,
      group: group?.name ?? 'Not provided',
      status: String(row.approval_status ?? 'pending'),
      approved_count: Number(row.approved_count ?? 0),
    }
  })
  const columns: TamsTableColumn[] = [
    { label: 'ID', accessor: 'id' },
    { label: 'Employee', accessor: 'employee' },
    { label: 'Appraisal Group', accessor: 'group' },
    { label: 'Approval Count', accessor: 'approved_count' },
    { label: 'Status', accessor: 'status' },
  ]

  const confirmAction = async () => {
    if (action === 'approve') {
      await approveMutation.mutateAsync(selectedIds)
    } else {
      await rejectMutation.mutateAsync(selectedIds)
    }
    setSelectedIds([])
    close()
  }

  return (
    <div className="relative px-7 pb-8 space-y-4">
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      <TamsGoBackNavigation label="Back to Appraisal Groups" />
      {selectedIds.length > 0 && (
        <div className="flex gap-3">
          <TamsButton
            onClick={() => {
              setAction('approve')
              open()
            }}
          >
            Approve selected
          </TamsButton>
          <TamsButton
            variant="outline"
            color="red"
            onClick={() => {
              setAction('reject')
              open()
            }}
          >
            Reject selected
          </TamsButton>
        </div>
      )}
      <TamsTable
        data={tableData}
        columns={columns}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        total={total}
        limit={10}
        loading={isLoading}
        bulkSelectionOptions={[
          {
            label: 'Select for approval',
            action: (ids) => setSelectedIds(ids),
            color: 'blue',
          },
        ]}
      />
      <TamsConfirmation
        opened={opened}
        onClose={close}
        onConfirm={confirmAction}
        loading={approveMutation.isPending || rejectMutation.isPending}
        isCritical={action === 'reject'}
        confirmText={action === 'approve' ? 'Approve' : 'Reject'}
        title={`${action === 'approve' ? 'Approve' : 'Reject'} appraisals`}
        message={`Are you sure you want to ${action} ${selectedIds.length} selected appraisal request(s)?`}
      />
    </div>
  )
}
