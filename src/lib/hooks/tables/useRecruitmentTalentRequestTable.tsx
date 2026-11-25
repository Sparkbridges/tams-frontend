import { TamsTableActionPopover } from '#/components/molecules'
import {
  useFetchOrganizationBranches,
  useFetchOrganizationDepartments,
} from '#/lib/api'
import {
  useDeleteRecruitmentTalentRequest,
  useRecruitmentAccess,
  useRecruitmentTalentRequests,
  useUpdateRecruitmentTalentRequestStatus,
} from '#/lib/api/services/recruitment'
import { emptyStates } from '#/lib/constants'
import type {
  TamsActionPopoverOption,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
  TTalentRequestStatus,
} from '#/lib/types'
import { newDayjs } from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import {
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  PenIcon,
  ProhibitIcon,
  TrashIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

const limit = 10

const useRecruitmentTalentRequestTable = () => {
  const { canCreateTalentRequest, canApproveTalentRequest } =
    useRecruitmentAccess()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [workModeFilter, setWorkModeFilter] = useState<string | undefined>()
  const [jobTypeFilter, setJobTypeFilter] = useState<string | undefined>()
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>()
  const [branchId, setBranchId] = useState<string | undefined>()
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [detailId, setDetailId] = useState<number | null>(null)
  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)

  const [actionType, setActionType] = useState<
    TTalentRequestStatus | 'delete'
  >()

  const [
    openedDetailDrawer,
    { open: openDetailDrawer, close: closeDetailDrawer },
  ] = useDisclosure(false)

  const { data: talentRequests, isLoading: loading } =
    useRecruitmentTalentRequests(
      {
        page: page,
        per_page: limit,
        search_query: search?.length ? search : undefined,
        type: jobTypeFilter,
        status: statusFilter,
        work_mode: workModeFilter,
        department_id: departmentFilter
          ? parseInt(departmentFilter)
          : undefined,
      },
      (data) => {
        return {
          data: data.data.results.map((item) => ({
            id: item.id,
            role: item.role,
            work_mode: item.work_mode,
            type: item.type,
            status: item.status,
            request_date: newDayjs(item.created_at).format('YYYY-MM-DD'),
          })),
          requests: data.data.results,
          total: data.data.total,
        }
      },
    )

  const { data: organizationBranches } = useFetchOrganizationBranches(
    undefined,
    (data) =>
      data.data.results.map((i) => ({
        value: i.id.toString(),
        label: i.station_name,
      })),
  )

  const { data: organizationDepartments } = useFetchOrganizationDepartments(
    undefined,
    (data) =>
      data.data.results
        .filter((i) => i.station_id.toString() === branchId)
        .map((i) => ({
          value: i.id.toString(),
          label: i.department_name,
        })),
  )

  const {
    mutateAsync: mutateAsyncUpdateTalentRequestStatus,
    isPending: isPendingUpdate,
  } = useUpdateRecruitmentTalentRequestStatus()

  const {
    mutateAsync: mutateAsyncDeleteTalentRequest,
    isPending: isPendingDelete,
  } = useDeleteRecruitmentTalentRequest()

  const navigate = useNavigate()

  const handleRowClick = (row: TamsTableData) => {
    setDetailId(Number(row.id))
    openDetailDrawer()
  }

  const handleAction = async () => {
    try {
      if (actionType === 'delete') {
        await mutateAsyncDeleteTalentRequest(Number(selectedId))
      } else {
        await mutateAsyncUpdateTalentRequestStatus({
          id: Number(selectedId),
          status: actionType as TTalentRequestStatus,
        })
      }
      closeConfirmation()
    } catch (error) {
      console.error('Failed to perform action on talent request', error)
    }
  }

  const setupAction = (id: number, type: TTalentRequestStatus | 'delete') => {
    setSelectedId(id)
    setActionType(type)
    openConfirmation()
  }

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => {
    const status = row.status as
      'pending' | 'approved' | 'rejected' | 'cancelled'
    return [
      {
        label: 'Edit',
        action: () =>
          navigate({
            to: `/admin-dashboard/recruitment/talent-requisition/edit`,
            search: { talentRequestId: row.id as number },
          }),
        color: '',
        icon: PenIcon,
        hidden: !canCreateTalentRequest || row.status !== 'pending',
      },
      {
        label: 'Approve',
        action: () => {
          setupAction(row.id as number, 'approve')
        },
        color: 'green',
        icon: CheckCircleIcon,
        hidden: status !== 'pending' || !canApproveTalentRequest,
      },
      {
        label: 'Cancel',
        action: () => {
          setupAction(row.id as number, 'cancel')
        },
        color: 'orange',
        icon: ProhibitIcon,
        hidden: status !== 'approved',
      },
      {
        label: 'Reject',
        action: () => {
          setupAction(row.id as number, 'reject')
        },
        color: 'red',
        icon: XCircleIcon,
        hidden: row.status !== 'pending',
      },
      {
        label: 'Re-open',
        action: () => {
          setupAction(row.id as number, 'reopen')
        },
        color: 'blue',
        icon: ArrowCounterClockwiseIcon,
        hidden: !['rejected', 'cancelled'].includes(status),
      },
      {
        label: 'Delete',
        action: () => {
          setupAction(row.id as number, 'delete')
        },
        color: 'red',
        icon: TrashIcon,
        hidden: !['rejected'].includes(status),
      },
    ]
  }

  const columns: TamsTableColumn[] = [
    {
      label: 'Role',
      accessor: 'role',
    },
    {
      label: 'Work mode',
      accessor: 'work_mode',
    },
    {
      label: 'Type',
      accessor: 'type',
    },
    {
      label: 'Status',
      accessor: 'status',
    },
    {
      label: 'Request Date',
      accessor: 'request_date',
      enableSorting: true,
    },
    {
      label: '',
      accessor: 'actions',
      render: (row) => (
        <TamsTableActionPopover data={actionPopoverOptions(row)} />
      ),
    },
  ]

  const statusOptions = [
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (talentRequests?.data?.length === 0 && !loading) {
      if (search?.length) {
        return emptyStates.recruitmentTalentRequests[1]
      }
      if (statusFilter) {
        return emptyStates.recruitmentTalentRequests[1]
      }
      if (workModeFilter) {
        return emptyStates.recruitmentTalentRequests[1]
      }
      if (jobTypeFilter) {
        return emptyStates.recruitmentTalentRequests[1]
      }
      if (departmentFilter) {
        return emptyStates.recruitmentTalentRequests[1]
      }
      return emptyStates.recruitmentTalentRequests[0]
    }
    return emptyStates.recruitmentTalentRequests[0]
  }, [
    talentRequests?.data,
    search,
    statusFilter,
    workModeFilter,
    jobTypeFilter,
    departmentFilter,
  ])

  return {
    columns,
    tableData: talentRequests?.data as TamsTableData[],
    loading,
    page,
    setPage,
    limit,
    search,
    setSearch,
    total: talentRequests?.total,
    statusFilter,
    setStatusFilter,
    openedConfirmation,
    closeConfirmation,
    openedDetailDrawer,
    handleRowClick,
    closeDetailDrawer,
    selectedId,
    selectedRequest: talentRequests?.requests.find(
      (item) => item.id === detailId,
    ),
    statusOptions,
    workModeFilter,
    setWorkModeFilter,
    jobTypeFilter,
    setJobTypeFilter,
    departmentFilter,
    setDepartmentFilter,
    branchId,
    setBranchId,
    organizationDepartments,
    organizationBranches,
    handleAction,
    isPending: isPendingUpdate || isPendingDelete,
    actionType,
    emptyState,
  }
}

export default useRecruitmentTalentRequestTable
