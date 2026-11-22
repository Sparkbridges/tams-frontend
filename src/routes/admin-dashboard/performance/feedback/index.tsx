import FeedbackAnswersDetailDrawer from '#/components/organisms/drawers/FeedbackAnswersDetailDrawer'
import { TamsButton, TamsTable } from '#/components/atoms'
import {
  TamsConfirmation,
  TamsTableActionPopover,
  TamsTabs,
} from '#/components/molecules'
import {
  emptyStates,
  newDayjs,
  useArchiveFeedbackSurvey,
  useDeleteFeedbackSurvey,
  useFetchFeedbackSurveys,
  useGetPageHeader,
  usePerformanceAccess,
  useRestoreFeedbackSurvey,
} from '#/lib'
import type {
  TamsActionPopoverOption,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
  TTamsTabs,
} from '#/lib'
import type { TFeedbackSurvey } from '#/lib/types/api/performance'
import { Badge, Divider } from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import {
  ArchiveIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowClockwiseIcon,
} from '@phosphor-icons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/admin-dashboard/performance/feedback/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pageHeader } = useGetPageHeader()
  const navigate = useNavigate()
  const access = usePerformanceAccess()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)
  const [tabValue, setTabValue] = useState<string | null>('all')

  const tabOptions: TTamsTabs[] = [
    {
      label: 'All Feedback',
      value: 'all',
    },
    {
      label: 'Archived',
      value: 'archived',
      color2: 'gray',
    },
  ]

  const [selectedSurvey, setSelectedSurvey] = useState<TFeedbackSurvey | null>(
    null,
  )
  const [selectedAnswersId, setSelectedAnswersId] = useState<number | null>(
    null,
  )
  const [actionType, setActionType] = useState<
    'archive' | 'restore' | 'delete' | null
  >(null)

  const [openedAnswers, { open: openAnswers, close: closeAnswers }] =
    useDisclosure(false)
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)

  const query = useFetchFeedbackSurveys({
    page,
    perPage: 10,
    archived: tabValue === 'archived',
    search_query: debouncedSearch || undefined,
  })
  const archiveMutation = useArchiveFeedbackSurvey()
  const restoreMutation = useRestoreFeedbackSurvey()
  const deleteMutation = useDeleteFeedbackSurvey()

  const surveys = query.data?.data?.results ?? []
  const total = query.data?.data?.total ?? 0

  const tableData: TamsTableData[] = surveys.map((survey) => ({
    id: survey.id,
    title: survey.name,
    description: survey.description,
    status: survey.deleted_at ? 'Archived' : 'Active',
    date_added: survey.created_at
      ? newDayjs(survey.created_at).format('MMM DD, YYYY')
      : 'Not provided',
  }))

  const actionOptions = (row: TamsTableData): TamsActionPopoverOption[] => {
    const survey = surveys.find((item) => item.id === row.id)
    if (!survey) return []

    return [
      {
        label: 'View Answers',
        action: () => {
          setSelectedAnswersId(survey.id)
          openAnswers()
        },
        color: 'blue',
        icon: EyeIcon,
      },
      {
        label: 'Edit',
        action: () =>
          navigate({
            to: '/admin-dashboard/performance/feedback/edit/$id',
            params: { id: String(survey.id) },
          }),
        color: '',
        icon: PencilIcon,
        hidden: tabValue === 'archived' || !access.canEditFeedback,
      },
      {
        label: 'Archive',
        action: () => {
          setSelectedSurvey(survey)
          setActionType('archive')
          openConfirmation()
        },
        color: 'orange',
        icon: ArchiveIcon,
        hidden: tabValue !== 'archived',
      },
      {
        label: 'Restore',
        action: () => {
          setSelectedSurvey(survey)
          setActionType('restore')
          openConfirmation()
        },
        color: 'blue',
        icon: ArrowClockwiseIcon,
        hidden: tabValue !== 'archived',
      },
      {
        label: 'Delete Permanently',
        action: () => {
          setSelectedSurvey(survey)
          setActionType('delete')
          openConfirmation()
        },
        color: 'red',
        icon: TrashIcon,
        hidden: tabValue !== 'archived',
      },
    ]
  }

  const columns: TamsTableColumn[] = useMemo(
    () => [
      { label: 'ID', accessor: 'id', enableSorting: true, width: 60 },
      { label: 'Feedback title', accessor: 'title', enableSorting: true },
      { label: 'Description', accessor: 'description' },
      {
        label: 'Status',
        accessor: 'status',
        render: (row) => (
          <Badge
            variant="light"
            color={row.status === 'Active' ? 'green' : 'gray'}
          >
            {String(row.status)}
          </Badge>
        ),
      },
      { label: 'Date added', accessor: 'date_added' },
      {
        label: '',
        accessor: 'actions',
        render: (row) => <TamsTableActionPopover data={actionOptions(row)} />,
      },
    ],
    [surveys, tabValue, access.canEditFeedback],
  )

  const handleConfirmation = async () => {
    if (!selectedSurvey || !actionType) return

    if (actionType === 'archive') {
      await archiveMutation.mutateAsync(selectedSurvey.id)
    } else if (actionType === 'restore') {
      await restoreMutation.mutateAsync(selectedSurvey.id)
    } else {
      await deleteMutation.mutateAsync(selectedSurvey.id)
    }

    closeConfirmation()
    setSelectedSurvey(null)
    setActionType(null)
  }

  const closeConfirmationModal = () => {
    closeConfirmation()
    setSelectedSurvey(null)
    setActionType(null)
  }

  const isActionPending =
    archiveMutation.isPending ||
    restoreMutation.isPending ||
    deleteMutation.isPending

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (tableData.length === 0 && !query.isLoading) {
      if (search?.length) {
        return tabValue === 'archived'
          ? emptyStates.archivedFeedback[1]
          : emptyStates.feedback[1]
      }
      if (tabValue === 'archived') return emptyStates.archivedFeedback[0]
      return emptyStates.feedback[0]
    }
    return emptyStates.feedback[0]
  }, [tableData.length, query.isLoading, search, tabValue])

  return (
    <main className="px-7 pb-8">
      <section className="flex items-center justify-between mb-5">
        {pageHeader()}
        {access.canCreateFeedback && tabValue !== 'archived' && (
          <TamsButton
            size="md"
            leftSection={<PlusIcon />}
            onClick={() =>
              navigate({ to: '/admin-dashboard/performance/feedback/create' })
            }
          >
            Create feedback
          </TamsButton>
        )}
      </section>

      <Divider mt="lg" />
      <section className="mt-2 mb-10">
        <TamsTabs
          tabValue={tabValue}
          onTabChange={(value) => setTabValue(value)}
          data={tabOptions}
        />
      </section>

      <TamsTable
        data={tableData}
        columns={columns}
        empty={emptyState}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        total={total}
        limit={10}
        loading={query.isLoading}
      />

      <FeedbackAnswersDetailDrawer
        opened={openedAnswers}
        surveyId={selectedAnswersId}
        onClose={() => {
          closeAnswers()
          setSelectedAnswersId(null)
        }}
      />

      <TamsConfirmation
        opened={openedConfirmation}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmation}
        loading={isActionPending}
        isCritical={actionType === 'delete'}
        confirmText={
          actionType === 'delete'
            ? 'Delete permanently'
            : actionType === 'restore'
              ? 'Restore'
              : 'Archive'
        }
        title={`${actionType ? actionType[0].toUpperCase() + actionType.slice(1) : 'Feedback'} feedback`}
        message={`Are you sure you want to ${actionType ?? 'change'} this feedback survey?`}
      />
    </main>
  )
}
