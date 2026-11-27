import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Badge, Button, Group } from '@mantine/core'
import {
  useApplicants,
  useDeleteApplicant,
  useUpdateApplicants,
} from '#/lib/api/services/ats'
import { useRecruitmentAccess } from '#/lib/api/services/recruitment'
import type { TamsTableBulkSelection, TamsTableColumn } from '#/lib/types'
import type { TApplicantStatus } from '#/lib/types/api/ats'
import type { TApplicantSearch } from '#/lib/utils/schema/ats.schema'
import { applicantStatusLabels } from '#/lib/utils/schema/ats.schema'

const route = getRouteApi('/admin-dashboard/recruitment/ats/tracking/$id')
export default function useApplicantTrackingTable(jobId: number) {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const access = useRecruitmentAccess()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [action, setAction] = useState<{
    status: TApplicantStatus
    ids: number[]
    schedule?: boolean
  } | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')
  const [validation, setValidation] = useState('')
  const query = useApplicants({
    job_posting_id: jobId,
    page: search.page || 1,
    per_page: 10,
    status: search.tab && search.tab !== 'all' ? [search.tab] : undefined,
    search_query: search.search || undefined,
    source: search.source,
    years_of_experience_min: search.minimum,
    years_of_experience_max: search.maximum,
  })
  const update = useUpdateApplicants()
  const deletion = useDeleteApplicant()
  const changeSearch = (changes: Partial<TApplicantSearch>) => {
    navigate({
      search: (previous) => ({ ...previous, page: 1, ...changes }),
      replace: true,
    })
  }
  const beginAction = (
    status: TApplicantStatus,
    ids: number[],
    schedule = false,
  ) => {
    setValidation('')
    setInterviewDate('')
    setInterviewTime('')
    update.reset()
    setAction({
      status,
      ids: ids.map(Number),
      ...(schedule ? { schedule: true } : {}),
    })
  }
  const confirmAction = async () => {
    if (!action) return
    if (action.schedule && (!interviewDate || !interviewTime)) {
      setValidation('Select both an interview date and time.')
      return
    }
    try {
      await update.mutateAsync({
        job_id: jobId,
        application_ids: action.ids,
        status: action.status,
        ...(action.schedule
          ? { interview_date: interviewDate, interview_time: interviewTime }
          : {}),
      })
      setAction(null)
    } catch (error) {
      console.error('Unable to update applicants', error)
    }
  }
  const confirmDelete = async () => {
    if (!deletingId) return
    try {
      await deletion.mutateAsync(deletingId)
      setDeletingId(null)
      setSelectedId(null)
    } catch (error) {
      console.error('Unable to delete application', error)
    }
  }
  const columns: TamsTableColumn[] = [
    ...(access.canUpdateApplicants
      ? [{ label: '', accessor: 'selection', type: 'checkbox' as const }]
      : []),
    { label: 'Candidate', accessor: 'name' },
    { label: 'Email', accessor: 'email' },
    {
      label: 'Stage',
      accessor: 'stage',
      render: (row) => (
        <Badge>{applicantStatusLabels[row.stage as TApplicantStatus]}</Badge>
      ),
    },
    { label: 'Experience (years)', accessor: 'years_of_experience' },
    { label: 'Source', accessor: 'source' },
    { label: 'Applied', accessor: 'applied' },
    { label: 'Interview', accessor: 'interview' },
    { label: 'CV screening', accessor: 'screening' },
    {
      label: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Group gap="xs" onClick={(event) => event.stopPropagation()}>
          {access.canViewApplicantDetails && (
            <Button
              size="xs"
              variant="subtle"
              onClick={() => setSelectedId(Number(row.id))}
            >
              View
            </Button>
          )}
          {access.canUpdateApplicants && (
            <Button
              size="xs"
              variant="subtle"
              onClick={() => beginAction('shortlisted', [Number(row.id)], true)}
            >
              Interview
            </Button>
          )}
          {access.canDeleteApplicants && (
            <Button
              size="xs"
              variant="subtle"
              color="red"
              onClick={() => {
                deletion.reset()
                setDeletingId(Number(row.id))
              }}
            >
              Delete
            </Button>
          )}
        </Group>
      ),
    },
  ]
  const bulkSelectionOptions: TamsTableBulkSelection[] =
    access.canUpdateApplicants
      ? [
          {
            label: 'Shortlist',
            action: (ids) => beginAction('shortlisted', ids),
          },
          {
            label: 'Schedule interview',
            action: (ids) => beginAction('shortlisted', ids, true),
          },
          {
            label: 'Mark as hired',
            action: (ids) => beginAction('completed', ids),
            color: 'green',
          },
          {
            label: 'Reject',
            action: (ids) => beginAction('rejected', ids),
            color: 'red',
          },
        ]
      : []
  const tableData = query.data?.data.results.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    stage: item.status,
    years_of_experience: item.years_of_experience,
    source: item.source,
    applied: item.created_at.slice(0, 10),
    interview: item.interview_date
      ? `${item.interview_date.slice(0, 10)} ${item.interview_time || ''}`
      : 'Not scheduled',
    screening: item.screening_stale
      ? 'Outdated - rerun'
      : (item.screening_status || 'not_assessed').replaceAll('_', ' '),
  }))
  return {
    search,
    changeSearch,
    query,
    columns,
    bulkSelectionOptions,
    tableData,
    access,
    selectedId,
    setSelectedId,
    action,
    setAction,
    deletingId,
    setDeletingId,
    interviewDate,
    setInterviewDate,
    interviewTime,
    setInterviewTime,
    validation,
    update,
    deletion,
    beginAction,
    confirmAction,
    confirmDelete,
  }
}
