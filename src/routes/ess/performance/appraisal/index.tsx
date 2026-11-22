import { TamsButton, TamsSpinner, TamsTable, TamsTabs } from '#/components'
import {
  useFetchAppraisalApprovals,
  useFetchAppraiserAppraisals,
  useFetchMyAppraisals,
  usePerformanceAccess,
} from '#/lib'
import type { TamsTableColumn, TamsTableData, TTamsTabs } from '#/lib'
import { LoadingOverlay } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/ess/performance/appraisal/')({
  component: RouteComponent,
})

type AppraisalView = 'self' | 'appraiser' | 'approvals'

function RouteComponent() {
  const { canGradeAppraisal, canApproveAppraisal } = usePerformanceAccess()
  const [activeTab, setActiveTab] = useState<AppraisalView>('self')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [hasEnded, setHasEnded] = useState(false)

  const selfQuery = useFetchMyAppraisals({
    page,
    perPage: 10,
    search_query: search || undefined,
    has_ended: hasEnded,
  })
  const appraiserQuery = useFetchAppraiserAppraisals({
    page,
    perPage: 10,
    search_query: search || undefined,
    has_ended: hasEnded,
  })
  const approvalQuery = useFetchAppraisalApprovals({
    page,
    perPage: 10,
    search_query: search || undefined,
  })

  const query =
    activeTab === 'self'
      ? selfQuery
      : activeTab === 'appraiser'
        ? appraiserQuery
        : approvalQuery

  const responseData = query.data?.data as unknown as
    { results?: Record<string, unknown>[]; total?: number } | undefined
  const results = responseData?.results ?? []
  const total = responseData?.total ?? 0

  const tableData: TamsTableData[] = results.map((row) => {
    const group = row.appraisalGroup as
      { name?: string; appraisal_year?: number } | undefined
    const employee = row.employee as
      { first_name?: string; last_name?: string } | undefined

    return {
      id: Number(row.id),
      group: group?.name ?? 'Not provided',
      year: group?.appraisal_year ?? 'Not provided',
      employee:
        [employee?.first_name, employee?.last_name].filter(Boolean).join(' ') ||
        (row.employee_id
          ? `Employee ${String(row.employee_id)}`
          : 'Not provided'),
      status: String(row.approval_status ?? 'pending'),
      approved_count: Number(row.approved_count ?? 0),
    }
  })

  const columns: TamsTableColumn[] =
    activeTab === 'approvals'
      ? [
          { label: 'ID', accessor: 'id' },
          { label: 'Employee', accessor: 'employee' },
          { label: 'Appraisal Group', accessor: 'group' },
          { label: 'Approval Count', accessor: 'approved_count' },
          { label: 'Status', accessor: 'status' },
        ]
      : [
          { label: 'ID', accessor: 'id' },
          { label: 'Appraisal Group', accessor: 'group' },
          { label: 'Year', accessor: 'year' },
          { label: 'Status', accessor: 'status' },
          { label: 'Approval Count', accessor: 'approved_count' },
          ...(activeTab === 'appraiser'
            ? [{ label: 'Employee', accessor: 'employee' }]
            : []),
        ]

  const tabs: TTamsTabs[] = [
    { label: 'My Appraisal', value: 'self' },
    ...(canGradeAppraisal ? [{ label: 'Appraiser', value: 'appraiser' }] : []),
    ...(canApproveAppraisal
      ? [{ label: 'Approvals', value: 'approvals' }]
      : []),
  ]

  return (
    <div className="relative px-7 pb-8 space-y-4">
      <LoadingOverlay
        visible={query.isLoading}
        loaderProps={{ children: <TamsSpinner size={32} /> }}
      />
      <TamsTabs
        tabValue={activeTab}
        onTabChange={(value) => {
          setActiveTab(value as AppraisalView)
          setPage(1)
        }}
        data={tabs}
      />
      {activeTab !== 'approvals' && (
        <div className="flex justify-end">
          <TamsButton
            variant="light"
            onClick={() => setHasEnded((value) => !value)}
          >
            {hasEnded ? 'Show Ongoing' : 'Show Completed'}
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
        loading={query.isLoading}
      />
    </div>
  )
}
