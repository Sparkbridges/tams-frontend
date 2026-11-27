import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { recruitmentClient, ENDPOINTS } from '#/lib/api/client'
import { useRecruitmentAccess } from '#/lib/api/services/recruitment'
import type { TamsTableColumn } from '#/lib/types'

export default function useRecruitmentAtsJobsTable() {
  const access = useRecruitmentAccess()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const params = { page, per_page: 10, search_query: search || undefined }
  const query = useQuery({
    queryKey: [ENDPOINTS.recruitmentJobPostings, params],
    queryFn: () => recruitmentClient.fetchRecruitmentJobPostings(params),
    enabled: access.canViewApplicants && access.canViewJobPostings,
  })
  const columns: TamsTableColumn[] = [
    { label: 'Job role', accessor: 'role' },
    { label: 'Status', accessor: 'status' },
    { label: 'Work mode', accessor: 'work_mode' },
    { label: 'Type', accessor: 'type' },
    { label: 'Job UUID (CSV Job ID)', accessor: 'uuid' },
    {
      label: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Link
          className="text-blue-600 hover:underline"
          to="/admin-dashboard/recruitment/ats/tracking/$id"
          params={{ id: String(row.id) }}
        >
          Track applicants
        </Link>
      ),
    },
  ]
  const tableData = query.data?.data.results.map((job) => ({
    id: job.id,
    role: job.role,
    status: job.status,
    work_mode: job.work_mode,
    type: job.type,
    uuid: job.uuid,
  }))
  return {
    query,
    tableData,
    columns,
    page,
    setPage,
    search,
    setSearch: (value: string) => {
      setSearch(value)
      setPage(1)
    },
  }
}
