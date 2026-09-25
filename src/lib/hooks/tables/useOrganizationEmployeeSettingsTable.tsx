import { TamsTableActionPopover } from '#/components/molecules'
import {
  useDeleteEmployeeCategory,
  useGetEmployeeCategories,
  useGetEmployeeDesignations,
  useGetEmployeeGrades,
  useGetEmployeeTypes,
} from '#/lib/api'
import { emptyStates } from '#/lib/constants'
import type {
  TamsActionPopoverOption,
  TamsTableColumn,
  TamsTableData,
  TamsTableEmptyState,
} from '#/lib/types'
import { capitalize, newDayjs } from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { PenIcon, TrashIcon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  activeTab: 'types' | 'designation' | 'category' | 'grades' | null
  setTabCounts: (counts: { [key: string]: number }) => void
}
const useOrganizationEmployeeSettingsTable = ({
  activeTab,
  setTabCounts,
}: Props) => {
  const navigate = useNavigate()
  const [tableData, setTableData] = useState<TamsTableData[]>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState<string | undefined>()
  const [selectedId, setSelectedId] = useState<string | number | null>(null)

  const [
    openedConfirmation,
    { open: openConfirmation, close: closeConfirmation },
  ] = useDisclosure(false)

  const limit = 10

  const { data: employeesTypes, isLoading: isLoadingEmployeesTypes } =
    useGetEmployeeTypes((data) => data.data, {
      page: page,
      perPage: limit,
      search_query: search?.length ? search : undefined,
    })

  const {
    data: employeeDesignations,
    isLoading: isLoadingEmployeeDesignations,
  } = useGetEmployeeDesignations((data) => data.data, {
    page: page,
    perPage: limit,
    search_query: search?.length ? search : undefined,
  })

  const { data: employeeCategories, isLoading: isLoadingEmployeeCategories } =
    useGetEmployeeCategories((data) => data.data, {
      page: page,
      perPage: limit,
      search_query: search?.length ? search : undefined,
    })

  const { data: employeeGrades, isLoading: isLoadingEmployeeGrades } =
    useGetEmployeeGrades((data) => data.data, {
      page: page,
      perPage: limit,
      search_query: search?.length ? search : undefined,
    })

  const deleteEmployeeCategoryMutation = useDeleteEmployeeCategory()

  const isLoading =
    isLoadingEmployeesTypes ||
    isLoadingEmployeeDesignations ||
    isLoadingEmployeeCategories ||
    isLoadingEmployeeGrades

  useEffect(() => {
    let formattedData: TamsTableData[] = []
    const employeesTypesData = employeesTypes?.results
    const employeeDesignationsData = employeeDesignations?.results
    const employeeCategoriesData = employeeCategories?.results
    const employeeGradesData = employeeGrades?.results
    if (activeTab === 'types' && employeesTypesData) {
      formattedData = employeesTypesData.map((employee) => ({
        type: employee.type_name,
        id: employee.id,
      }))
    } else if (activeTab === 'designation' && employeeDesignations) {
      formattedData = employeeDesignationsData?.map((employee) => ({
        designation: employee.designation_name || '-',
        id: employee.id,
        dateCreated:
          newDayjs(employee.created_at).format('MMM, ddd MM, YYYY') || '-',
      })) as TamsTableData[]
    } else if (activeTab === 'category' && employeeCategoriesData) {
      formattedData = employeeCategoriesData?.map((employee) => ({
        category: employee.category_name || '-',
        id: employee.id,
        dateCreated:
          newDayjs(employee.created_at).format('MMM, ddd MM, YYYY') || '-',
      }))
    } else if (activeTab === 'grades' && employeeGradesData) {
      formattedData = employeeGradesData?.map((employee) => ({
        grade: employee.grade_name || '-',
        id: employee.id,
        dateCreated:
          newDayjs(employee.created_at).format('MMM, ddd MM, YYYY') || '-',
      }))
    }
    setTableData(formattedData)
    setTotal(
      activeTab === 'types'
        ? employeesTypes?.total || 0
        : activeTab === 'designation'
          ? employeeDesignations?.total || 0
          : activeTab === 'category'
            ? employeeCategories?.total || 0
            : activeTab === 'grades'
              ? employeeGrades?.total || 0
              : 0,
    )
    setTabCounts({
      types: employeesTypes?.total || 0,
      designation: employeeDesignations?.total || 0,
      category: employeeCategories?.total || 0,
      grades: employeeGrades?.total || 0,
    })
  }, [
    employeesTypes,
    setTableData,
    setTotal,
    activeTab,
    employeeDesignations,
    employeeCategories,
    employeeGrades,
    setTabCounts,
  ])

  useEffect(() => {
    setSearch(undefined)
    setPage(1)
  }, [activeTab])

  const emptyState: TamsTableEmptyState = useMemo(() => {
    if (tableData?.length === 0 && !isLoading) {
      if (search?.length) {
        return emptyStates[activeTab as keyof typeof emptyStates][1]
      }
      if (activeTab) {
        return emptyStates[activeTab as keyof typeof emptyStates][0]
      }
    }
    return emptyStates[activeTab as keyof typeof emptyStates][0]
  }, [tableData, search, activeTab, isLoading])

  const handleDelete = async (
    type: 'types' | 'designation' | 'category' | 'grades' | null,
  ) => {
    try {
      if (type === 'category') {
        await deleteEmployeeCategoryMutation.mutateAsync(selectedId as number)
      }
      closeConfirmation()
    } catch (error) {
      console.error('Failed to delete archived organization employees', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete archived organization employees',
        color: 'red',
      })
    }
  }

  const handleRowClick = (row: TamsTableData) => {
    navigate({
      to: `/admin-dashboard/organization/employees/details/$id`,
      params: { id: row.id?.toString() ?? '' },
    })
  }

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => {
    const options: TamsActionPopoverOption[] = [
      {
        label: 'Edit',
        action: () =>
          navigate({
            to: `/admin-dashboard/organization/employees/edit`,
            search: { employeeId: row.id as number },
          }),
        color: 'gray',
        icon: PenIcon,
      },
      {
        label: 'Delete',
        action: () => {
          setSelectedId(row.id as number)
          openConfirmation()
        },
        color: 'red',
        icon: TrashIcon,
      },
    ]

    return options
  }

  const columns: TamsTableColumn[] = useMemo(() => {
    const cols: TamsTableColumn[] = [
      {
        label: 'Id',
        accessor: 'id',
        enableSorting: true,
        width: 150,
      },
      {
        label: 'Types',
        accessor: 'type',
        enableSorting: true,
        width: 200,
      },
      {
        label: '',
        accessor: 'actions',
        render: (row) => (
          <TamsTableActionPopover data={actionPopoverOptions(row)} />
        ),
      },
    ]
    if (activeTab === 'designation') {
      cols.splice(1, 1, {
        label: 'Designation',
        accessor: 'designation',
        enableSorting: true,
      })
      cols.splice(2, 0, {
        label: 'Date Created',
        accessor: 'dateCreated',
        enableSorting: true,
      })
      return cols
    }

    if (activeTab === 'grades') {
      cols.splice(1, 1, {
        label: 'Grades',
        accessor: 'grade',
        enableSorting: true,
      })
      cols.splice(2, 0, {
        label: 'Date Created',
        accessor: 'dateCreated',
        enableSorting: true,
      })
      return cols
    }

    if (activeTab === 'category') {
      cols.splice(1, 1, {
        label: 'Category',
        accessor: 'category',
        enableSorting: true,
      })
      cols.splice(2, 0, {
        label: 'Date Created',
        accessor: 'dateCreated',
        enableSorting: true,
      })
      return cols
    }
    return cols
  }, [activeTab])

  const modalDeleteAction = {
    title: `Delete ${capitalize(activeTab ?? '')}`,
    message: `Are you sure you want to delete this ${capitalize(activeTab ?? '')} permanently?`,
    action: () => handleDelete(activeTab),
    loading: deleteEmployeeCategoryMutation.isPending,
  }
  return {
    columns,
    tableData,
    isLoading,
    page,
    setPage,
    limit,
    search,
    setSearch,
    total,
    setTotal,
    openedConfirmation,
    closeConfirmation,
    handleDelete,
    handleRowClick,
    selectedId,
    emptyState,
    modalInfo: modalDeleteAction,
  }
}

export default useOrganizationEmployeeSettingsTable
