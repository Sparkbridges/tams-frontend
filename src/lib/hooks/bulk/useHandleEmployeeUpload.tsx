import {
  TamsButton,
  TamsSelectInput,
  TamsTableActionPopover,
} from '#/components'
import {
  useGetFieldsFromCsv,
  useGetNextFreePin,
  useGetUploadEmployeeDataStatus,
  useReValidateEmployeeData,
  useUploadEmployeeData,
  useValidateEmployeeData,
} from '#/lib/api'
import type {
  TamsActionPopoverOption,
  TamsTableColumn,
  TamsTableData,
  TGetFieldSampleRow,
  TTamsTabs,
  TValidateEmployeeDataRow,
} from '#/lib/types'
import { autoMatch } from '#/lib/utils'
import { ActionIcon, Badge } from '@mantine/core'
import type { FileWithPath } from '@mantine/dropzone'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  ArrowBendUpLeftIcon,
  BugIcon,
  CheckCircleIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { FileIcon, WarningIcon } from '@phosphor-icons/react/dist/ssr'
import { useCallback, useEffect, useMemo, useState } from 'react'

const useHandleEmployeeUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{
    files: FileWithPath[]
    status: 'idle' | 'uploading' | 'uploaded'
    additionalData?: number
  }>({ files: [], status: 'idle' })

  const [active, setActive] = useState<number>(0)

  const [fieldsFromResponse, setFieldsFromResponse] = useState<{
    employeeUploadFields: {
      label: string
      value: string
    }[]
    fieldsFromCSV: string[]
    sampleRows: TGetFieldSampleRow
  } | null>(null)

  const [tableData, setTableData] = useState<TamsTableData[]>([])
  const [tableDataInitial, setTableDataInitial] = useState<TamsTableData[]>([])

  const [validationAnalysis, setValidationAnalysis] = useState<{
    totalRows: number
    validCount: number
    errorCount: number
    pinCollisionCount: number
  }>({
    totalRows: 0,
    validCount: 0,
    errorCount: 0,
    pinCollisionCount: 0,
  })

  const [validatedRows, setValidatedRows] = useState<TamsTableData[]>([])
  const [validatedRowsInitial, setValidatedRowsInitial] = useState<
    TamsTableData[]
  >([])

  const [activeValidationTab, setActiveValidationTab] = useState<string>('all')

  const [openedFixModal, { open: openFixModal, close: closeFixModal }] =
    useDisclosure()
  const [selectedRow, setSelectedRow] = useState<TamsTableData | null>(null)
  const [uploadJobId, setUploadJobId] = useState<string | null>(null)

  const requiredFields = [
    'first_name',
    'last_name',
    'account_number',
    'account_name',
    'pin',
    'company_id',
    'email',
    'bank_name',
    'bank_code',
  ]

  const rowLevelError = useMemo(() => {
    return tableData.some((row) => {
      const isMapped = row.tamsSystemField === row.csvColumnHeader
      const hasError = row.isRequired && !isMapped
      return hasError
    })
  }, [tableData, tableDataInitial])

  useEffect(() => {
    if (
      fieldsFromResponse?.employeeUploadFields &&
      fieldsFromResponse.fieldsFromCSV
    ) {
      const tableData = fieldsFromResponse.employeeUploadFields.map(
        (field, _, array) => {
          const sampleData =
            fieldsFromResponse.sampleRows[
              field.value as keyof TGetFieldSampleRow
            ] ?? ''
          const isRequired = requiredFields.includes(field.value)
          const csvColumnHeader =
            fieldsFromResponse.fieldsFromCSV.find(
              (header) => header === field.value,
            ) ?? ''
          const isSensitiveField = ['pin', 'code', 'id'].some((keyword) =>
            field.value.includes(keyword),
          )
          return {
            csvColumnHeader,
            systemField: field.label,
            sampleData:
              !isNaN(Number(sampleData.replace(/,/g, ''))) &&
              sampleData !== '' &&
              isSensitiveField
                ? Number(sampleData.replace(/,/g, ''))
                : sampleData,
            options: array,
            tamsSystemField: field.value,
            isRequired,
          }
        },
      )
      setTableData(tableData as unknown as TamsTableData[])
      setTableDataInitial(tableData as unknown as TamsTableData[])
    }
  }, [fieldsFromResponse])

  const { mutateAsync: getFieldsFromCsv, isPending: isUploading } =
    useGetFieldsFromCsv()

  const { mutateAsync: validateEmployeeData, isPending: isValidating } =
    useValidateEmployeeData()

  const { mutateAsync: reValidateEmployeeData, isPending: isReValidating } =
    useReValidateEmployeeData()

  const { mutateAsync: getNextFreePin, isPending: isFetchingNextFreePin } =
    useGetNextFreePin()

  const {
    data: uploadEmployeeDataStatus,
    isLoading: isLoadingUploadEmployeeDataStatus,
  } = useGetUploadEmployeeDataStatus(uploadJobId as string)

  const {
    mutateAsync: uploadEmployeeData,
    isPending: isUploadingEmployeeData,
  } = useUploadEmployeeData()

  const completeNextFreePin = async () => {
    try {
      const response = await getNextFreePin({
        excludePins: JSON.stringify(validatedRows.map((row) => row.pin)),
      })
      return response.data.pin
    } catch (error) {
      console.error('Error fetching next free pin:', error)
      return null
    }
  }

  const handleValidation = (disableNotification?: boolean) => {
    switch (active) {
      case 0:
        if (!fieldsFromResponse) {
          !disableNotification &&
            notifications.show({
              title: 'Validation Error',
              message: 'Fields from CSV are not available.',
              color: 'red',
            })
          return false
        }
        if (!uploadedFiles.files.length) {
          !disableNotification &&
            notifications.show({
              title: 'Validation Error',
              message: 'No files have been uploaded.',
              color: 'red',
            })
          return false
        }
        return true
      case 1:
        if (uploadedFiles.additionalData === 0) {
          !disableNotification &&
            notifications.show({
              title: 'No Data',
              message: 'No records found for validation.',
              color: 'yellow',
            })
          return false
        }
        if (rowLevelError)
          !disableNotification &&
            notifications.show({
              title: 'Validation Error',
              message: 'There are errors in the mapping.',
              color: 'red',
            })
        return !rowLevelError
      case 2:
        const isAllFieldsValid = validatedRows.every(
          (row) => row.status === 'valid',
        )
        if (!isAllFieldsValid)
          !disableNotification &&
            notifications.show({
              title: 'Validation Error',
              message: 'Not all fields are valid.',
              color: 'red',
            })
        return isAllFieldsValid
        break
      case 3:
        // Validation logic for step 3
        break
      default:
        break
    }
  }

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current))
  /*   const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current)) */

  const handleFileDrop = async (files: FileWithPath[]) => {
    try {
      const formData = new FormData()
      formData.append('employeesFile', files[0])
      const response = await getFieldsFromCsv({ employeesFile: formData })
      setUploadedFiles({
        files,
        status: 'uploaded',
        additionalData: response.data.total,
      })
      setFieldsFromResponse({
        employeeUploadFields: response.data.employeeUploadFields,
        fieldsFromCSV: response.data.fieldsFromCSV,
        sampleRows: response.data.sampleRows[0],
      })
    } catch (error) {
      console.error('Error uploading files', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to upload employee file.',
        color: 'red',
      })
    }
  }

  const handleFileRemove = (file: FileWithPath | string) => {
    setUploadedFiles((prev) => {
      const updatedFiles = prev.files.filter((f) => f !== file)
      return {
        files: updatedFiles,
        status: updatedFiles.length > 0 ? 'uploaded' : 'idle',
        additionalData:
          updatedFiles.length > 0 ? prev.additionalData : undefined,
      }
    })
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/files/sample_sheet.xlsx'
    link.download = 'sample_sheet.xlsx'

    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleGotoMapping = () => {
    if (handleValidation()) {
      nextStep()
    }
  }

  const getValidationReport = async () => {
    const formData = new FormData()
    formData.append('employeesFile', uploadedFiles.files[0])
    const fields = autoMatch(
      fieldsFromResponse?.fieldsFromCSV ?? [],
      fieldsFromResponse?.employeeUploadFields ?? [],
    )
    formData.append('fields', JSON.stringify(fields))
    formData.append('options', 'demo')
    try {
      const response = await validateEmployeeData({
        employeesFile: formData,
      })
      setValidationAnalysis({
        totalRows: response.data.totalRows,
        validCount: response.data.validCount,
        errorCount: response.data.errorCount,
        pinCollisionCount: response.data.pinCollisionCount,
      })
      const mapped = response.data.rows.map((row) => {
        return {
          ...row.data,
          action: row.action,
          errors: row.errors,
          row: row.row,
          status: row.status,
          pinWasAutoGenerated: row.pinWasAutoGenerated,
        }
      })
      setValidatedRows(mapped as unknown as TamsTableData[])
      setValidatedRowsInitial(mapped as unknown as TamsTableData[])
      nextStep()
    } catch (error) {
      console.error('Error validating employee data', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to validate employee data.',
        color: 'red',
      })
    }
  }

  const handleDataValidation = async () => {
    if (handleValidation()) {
      console.log(await getValidationReport())
      // nextStep()
    }
  }

  const handleCommitUpload = async () => {
    const formData = new FormData()
    formData.append('employeesFile', JSON.stringify(validatedRows))
    const fields = autoMatch(
      fieldsFromResponse?.fieldsFromCSV ?? [],
      fieldsFromResponse?.employeeUploadFields ?? [],
    )
    formData.append('fields', JSON.stringify(fields))
    formData.append('options', 'demo')
    try {
      const response = await uploadEmployeeData({
        employeesFile: formData,
      })
      setUploadJobId(response.data.jobId)
      nextStep()
    } catch (error) {
      console.error(error)
      notifications.show({
        title: 'Error',
        message: 'Failed to queue commit job.',
        color: 'red',
      })
    }
  }

  const handleActionViaStep = useCallback(() => {
    switch (active) {
      case 0:
        handleGotoMapping()
        break
      case 1:
        handleDataValidation()
        break
      case 2:
        handleCommitUpload()
        break
      default:
        break
    }
  }, [active, handleGotoMapping, handleDataValidation, handleCommitUpload])

  const handleOpenEditForm = (
    e: React.MouseEvent<HTMLButtonElement>,
    row: TamsTableData,
  ) => {
    e.stopPropagation()
    setSelectedRow(row)
    openFixModal()
  }

  const handleSubmitEditForm = (updatedRow: Record<string, any>) => {
    if (!updatedRow) return
    const doesEmailOrPinAlreadyExist = validatedRows.some(
      (row) =>
        (row.email === updatedRow['email'] || row.pin === updatedRow['pin']) &&
        row.row !== updatedRow.row,
    )
    if (doesEmailOrPinAlreadyExist) {
      notifications.show({
        title: 'Duplicate Field',
        message: `${doesEmailOrPinAlreadyExist ? (validatedRows.some((row) => row.email === updatedRow['email'] && row.row !== updatedRow.row) ? 'Email' : 'Pin') : ''} is duplicate. Please make changes before updating.`,
        color: 'yellow',
      })
      return
    }
    const updatedRows = validatedRows.map((row) =>
      row.row === updatedRow.row
        ? { ...row, ...updatedRow, status: 'resolved' }
        : row,
    )
    setValidatedRows(updatedRows)
    closeFixModal()
  }

  const conflictHandlingOptions = [
    { value: 'skip', label: 'Skip' },
    { value: 'overwrite', label: 'Overwrite' },
  ]

  const mappingColumns: TamsTableColumn[] = [
    {
      label: 'Csv Column Header (Source)',
      accessor: 'csvColumnHeader',
    },
    {
      label: 'Sample Data',
      accessor: 'sampleData',
    },
    {
      label: 'Tams System Field (Target)',
      accessor: 'tamsSystemField',
      width: 250,
      render: (row: TamsTableData) => {
        const isMapped = row.tamsSystemField === row.csvColumnHeader
        const notMapped = !isMapped && row.csvColumnHeader !== ''
        return (
          <section>
            <div className="flex items-center gap-3">
              {isMapped ? (
                <CheckCircleIcon size={20} color="green" />
              ) : notMapped ? (
                <WarningIcon size={20} color="gold" />
              ) : null}
              <TamsSelectInput
                data={fieldsFromResponse?.employeeUploadFields ?? []}
                value={row.tamsSystemField as string}
                onChange={(value) => {
                  const updatedData = tableData.map((r) =>
                    r.csvColumnHeader === row.csvColumnHeader
                      ? { ...r, tamsSystemField: value }
                      : r,
                  )
                  setTableData(updatedData)
                }}
              />
            </div>
            {notMapped && (
              <span className="text-yellow-500 text-xs">
                Mapping does not match
              </span>
            )}
          </section>
        )
      },
    },
    {
      label: 'Status / Requirement',
      accessor: 'statusRequirement',

      render: (row: TamsTableData) => {
        return (
          <Badge color={row.isRequired ? 'red' : 'gray'} variant="light">
            {row.isRequired ? 'Required' : 'Optional'}
          </Badge>
        )
      },
    },
    {
      label: '',
      accessor: '',
      width: 25,
      render: (row: TamsTableData) => {
        const hasChanged = tableDataInitial.some(
          (r) =>
            r.csvColumnHeader === row.csvColumnHeader &&
            r.tamsSystemField !== row.tamsSystemField,
        )

        const handleReset = () => {
          const updatedData = tableData.map((r) =>
            r.csvColumnHeader === row.csvColumnHeader
              ? {
                  ...r,
                  tamsSystemField:
                    tableDataInitial.find(
                      (init) => init.csvColumnHeader === r.csvColumnHeader,
                    )?.tamsSystemField ?? '',
                }
              : r,
          )
          setTableData(updatedData)
        }
        return (
          <ActionIcon
            onClick={handleReset}
            size="sm"
            variant="subtle"
            className={hasChanged ? 'block' : 'hidden'}
          >
            <ArrowBendUpLeftIcon size={20} />
          </ActionIcon>
        )
      },
    },
  ]

  const actionPopoverOptions = (
    row: TamsTableData,
  ): TamsActionPopoverOption[] => {
    const options: TamsActionPopoverOption[] = [
      {
        label: 'Delete Row',
        action: () =>
          setValidatedRows((prev) => prev.filter((r) => r.id !== row.id)),
        color: 'red',
        icon: TrashIcon,
      },
    ]

    return options
  }

  const validationColumns: TamsTableColumn[] = [
    { label: 'Row', accessor: 'row', enableSorting: true },
    {
      label: 'Employee Name',
      accessor: 'employeeName',
      render: (row: TamsTableData) => row.first_name + ' ' + row.last_name,
    },
    ...(activeValidationTab === 'valid'
      ? [
          {
            label: 'Pin',
            accessor: 'pin',
            enableSorting: true,
          },
          {
            label: 'Email',
            accessor: 'email',
            enableSorting: true,
          },
        ]
      : [
          {
            label: 'Field in CSV',
            accessor: 'fieldInCSV',
            render: (row: TamsTableData) => (
              <div>
                {(row.errors as unknown as TValidateEmployeeDataRow['errors'])
                  .map((error: any) => error.field)
                  .join(', ')}
                <div>
                  {(row.errors as unknown as TValidateEmployeeDataRow['errors'])
                    .map((error: any) => row[error.field])
                    .join(', ')}
                </div>
              </div>
            ),
          },
          {
            label: 'Validation Issues',
            accessor: 'issues',
            render: (row: TamsTableData) => {
              return (
                <div className="space-y-0.5">
                  {row.status === 'error' &&
                    (
                      row.errors as unknown as TValidateEmployeeDataRow['errors']
                    ).map((error: any, index: number) => (
                      <div
                        className="text-red-500 text-wrap text-xs"
                        key={index}
                      >
                        {index + 1}. {error.message}
                      </div>
                    ))}
                  {row.status === 'resolved' && (
                    <div className="text-yellow-700 text-wrap text-xs">
                      Row has been resolved
                    </div>
                  )}
                </div>
              )
            },
          },
        ]),
    {
      label: 'Interactive fix/ Correction',
      accessor: 'fix',
      render: (row: TamsTableData) => {
        return (
          <div className="space-y-0.5">
            {['error', 'warning', 'resolved'].includes(row.status as string) ? (
              <TamsButton
                color={row.status === 'error' ? 'red' : 'yellow'}
                size="sm"
                onClick={(e) => handleOpenEditForm(e, row)}
                variant="subtle"
              >
                {row.status === 'error' ? 'Fix now' : 'Review'}
              </TamsButton>
            ) : (
              <Badge size="sm" color="green" variant="transparent">
                Looks good!
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      label: '',
      accessor: 'actions',
      render: (row: TamsTableData) => {
        return <TamsTableActionPopover data={actionPopoverOptions(row)} />
      },
    },
  ]

  const buttonText = useMemo(() => {
    switch (active) {
      case 0:
        return { label: 'Continue to Column Mapping', loading: false }
      case 1:
        return {
          label: `Proceed to Data validation (${uploadedFiles.additionalData ?? 0} records)`,
          loading: isValidating,
        }
      case 2:
        return {
          label: 'Import only valid records',
          loading: isUploadingEmployeeData,
        }
      default:
        return { label: 'Continue', loading: false }
    }
  }, [
    active,
    uploadedFiles.additionalData,
    isValidating,
    isUploadingEmployeeData,
  ])

  const dashboardAnalytics = useMemo(() => {
    return [
      {
        title: 'Total Parsed',
        value: validationAnalysis.totalRows ?? 0,
        icon: FileIcon,
        color: 'gray',
        description: 'Total number of parsed rows',
      },
      {
        title: 'Valid & Ready',
        value: validationAnalysis.validCount ?? 0,
        icon: CheckCircleIcon,
        color: 'green',
        description: `${((validationAnalysis.validCount / validationAnalysis.totalRows) * 100).toFixed(1)}% batch clearance`,
      },
      {
        title: 'Errors reported',
        value: validationAnalysis.errorCount ?? 0,
        icon: BugIcon,
        color: 'red',
        description: 'Total number of errors reported',
      },
      {
        title: 'Pin collision',
        value: validationAnalysis.pinCollisionCount ?? 0,
        icon: WarningIcon,
        color: 'yellow',
        description: 'Total number of pin collisions',
      },
    ]
  }, [validationAnalysis])

  const validationTabs: TTamsTabs[] = useMemo(() => {
    return [
      {
        label: 'All',
        value: 'all',
        value2: validatedRows.length ?? 0,
        color2: 'gray',
      },
      {
        label: 'Errors',
        value: 'error',
        value2:
          validatedRows.filter((row) =>
            ['error', 'warning'].includes(
              (row as unknown as TValidateEmployeeDataRow).status,
            ),
          ).length ?? 0,
        color2: 'red',
      },
      {
        label: 'Valid & Ready',
        value: 'valid',
        value2:
          validatedRows.filter((row) =>
            ['valid', 'resolved'].includes(
              (row as unknown as TValidateEmployeeDataRow).status,
            ),
          ).length ?? 0,
        color2: 'green',
      },
    ]
  }, [validatedRows])

  const filteredRows = useMemo(() => {
    if (activeValidationTab !== 'all') {
      const checks =
        activeValidationTab === 'error'
          ? ['error', 'warning']
          : [activeValidationTab, 'resolved']
      return validatedRows.filter((row) =>
        checks.includes((row as unknown as TValidateEmployeeDataRow).status),
      )
    }
    return validatedRows
  }, [activeValidationTab, validatedRows])

  const isReadyForRevalidation = useMemo(() => {
    return (
      validatedRows.filter((row) =>
        ['resolved'].includes(
          (row as unknown as TValidateEmployeeDataRow).status,
        ),
      ).length ===
        validatedRowsInitial.filter((row) =>
          ['error', 'warning'].includes(
            (row as unknown as TValidateEmployeeDataRow).status,
          ),
        ).length &&
      validatedRowsInitial.filter((item) => item.status === 'valid').length !=
        validatedRowsInitial.length
    )
  }, [validatedRows, validatedRowsInitial])

  const handleRevalidation = useCallback(async () => {
    const formData = new FormData()
    formData.append('employeesFile', JSON.stringify(validatedRows))
    const fields = autoMatch(
      fieldsFromResponse?.fieldsFromCSV ?? [],
      fieldsFromResponse?.employeeUploadFields ?? [],
    )
    formData.append('fields', JSON.stringify(fields))
    formData.append('options', 'demo')
    try {
      const response = await reValidateEmployeeData({
        employeesFile: formData,
      })
      setValidationAnalysis({
        totalRows: response.data.totalRows,
        validCount: response.data.validCount,
        errorCount: response.data.errorCount,
        pinCollisionCount: response.data.pinCollisionCount,
      })
      const mapped = response.data.rows.map((row) => {
        return {
          ...row.data,
          action: row.action,
          errors: row.errors,
          row: row.row,
          status: row.status,
          pinWasAutoGenerated: row.pinWasAutoGenerated,
        }
      })
      setValidatedRows(mapped as unknown as TamsTableData[])
      setValidatedRowsInitial(mapped as unknown as TamsTableData[])
    } catch (error) {
      console.error('Error revalidating employee data', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to revalidate employee data.',
        color: 'red',
      })
    }
  }, [validatedRows, validatedRowsInitial])

  const uploadedStatistics = useMemo(() => {
    if (!uploadEmployeeDataStatus) return []
    const data = uploadEmployeeDataStatus.data
    return [
      {
        title: 'Total Uploaded',
        value: validationAnalysis.totalRows ?? 0,
        icon: FileIcon,
        color: 'gray',
        description: 'Total number of parsed rows',
        loading: isLoadingUploadEmployeeDataStatus,
      },
      {
        title: 'Total Employee Created',
        value: data.result?.createdCount ?? 0,
        icon: CheckCircleIcon,
        color: 'green',
        description: `${(((data.result?.createdCount as number) / validationAnalysis.totalRows) * 100).toFixed(1)}% records created successfully`,
        loading: isLoadingUploadEmployeeDataStatus,
      },
      {
        title: 'Total Employees updated',
        value: data.result?.updatedCount ?? 0,
        icon: CheckCircleIcon,
        color: 'green',
        description: 'Total number of employees updated',
        loading: isLoadingUploadEmployeeDataStatus,
      },
      {
        title: 'Errors Reported',
        value: data.result?.failedCount ?? 0,
        icon: WarningIcon,
        color: 'red',
        description: 'Total number of failed records',
        loading: isLoadingUploadEmployeeDataStatus,
      },
    ]
  }, [
    uploadEmployeeDataStatus,
    validationAnalysis,
    isLoadingUploadEmployeeDataStatus,
  ])

  const resetUpload = () => {
    setUploadedFiles({ files: [], additionalData: 0, status: 'idle' })
    setValidatedRows([])
    setValidatedRowsInitial([])
    setActive(0)
  }

  return {
    resetUpload,
    isReadyForRevalidation,
    active,
    setActive,
    uploadedFiles,
    handleFileDrop,
    handleFileRemove,
    loading: isUploading || isReValidating,
    conflictHandlingOptions,
    handleDownload,
    handleActionViaStep,
    handleValidation,
    mappingColumns,
    tableData,
    buttonText,
    dashboardAnalytics,
    validationColumns,
    validatedRows: filteredRows,
    validationTabs,
    activeValidationTab,
    setActiveValidationTab,
    openedFixModal,
    selectedRow,
    closeFixModal,
    handleSubmitEditForm,
    completeNextFreePin,
    isFetchingNextFreePin,
    handleRevalidation,
    uploadedStatistics,
    uploadEmployeeDataStatus,
    isLoadingUploadEmployeeDataStatus,
  }
}

export default useHandleEmployeeUpload
