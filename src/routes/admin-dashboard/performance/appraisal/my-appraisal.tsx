import { TamsButton, TamsSpinner, TamsTable } from '#/components'
import { TamsGoBackNavigation } from '#/components/molecules'
import { useFetchMyAppraisals, usePerformanceAccess } from '#/lib'
import type { TamsTableColumn, TamsTableData } from '#/lib/types'
import { LoadingOverlay } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute(
  '/admin-dashboard/performance/appraisal/my-appraisal',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { canGradeAppraisal } = usePerformanceAccess()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [hasEnded, setHasEnded] = useState(false)
  const { data, isLoading } = useFetchMyAppraisals({
    page,
    perPage: 10,
    search_query: search || undefined,
    has_ended: hasEnded,
  })

  const results =
    (data?.data as unknown as { results?: Record<string, unknown>[] })
      ?.results ?? []
  const total = (data?.data as unknown as { total?: number })?.total ?? 0
  const tableData: TamsTableData[] = results.map((row) => {
    const group = row.appraisalGroup as
      { name?: string; appraisal_year?: number } | undefined
    return {
      id: Number(row.id),
      group: group?.name ?? 'Not provided',
      year: group?.appraisal_year ?? 'Not provided',
      status: String(row.approval_status ?? 'pending'),
      approved_count: Number(row.approved_count ?? 0),
    }
  })
  const columns: TamsTableColumn[] = [
    { label: 'ID', accessor: 'id' },
    { label: 'Appraisal Group', accessor: 'group' },
    { label: 'Year', accessor: 'year' },
    { label: 'Status', accessor: 'status' },
    { label: 'Approval Count', accessor: 'approved_count' },
  ]

  return (
    <div className="relative px-7 pb-8 space-y-4">
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      <TamsGoBackNavigation label="Back to Appraisal Groups" />
      <div className="flex justify-end">
        <TamsButton
          variant="light"
          disabled={!canGradeAppraisal}
          onClick={() => setHasEnded((value) => !value)}
        >
          {hasEnded ? 'Show Ongoing' : 'Show Completed'}
        </TamsButton>
      </div>
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
      />
    </div>
  )
}
