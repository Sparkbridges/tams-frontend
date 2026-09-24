import {
  TamsButton,
  TamsDropzone,
  TamsModal2,
  TamsNumberInput,
  TamsTable,
  TamsTerminal,
  TamsTextInput,
} from '#/components/atoms'
import { TamsStatsCard, TamsTabs } from '#/components/molecules'
import { millifyValue, useHandleEmployeeUpload } from '#/lib'
import {
  Box,
  Group,
  Paper,
  Progress,
  Skeleton,
  Stepper,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { MIME_TYPES } from '@mantine/dropzone'
import { notifications } from '@mantine/notifications'
import { FileCsvIcon, FileTextIcon, FileXlsIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

type UploadEmployeeModalProps = {
  opened: boolean
  onClose: () => void
  selectedRow?: Record<string, any> | null
  onSubmit?: (updatedRow: Record<string, any>) => void
  onCompleteNextFreePin?: () => Promise<number | null>
  isFetchingNextFreePin?: boolean
}

const UploadEditEmployeeModal: React.FC<UploadEmployeeModalProps> = ({
  opened,
  onClose,
  selectedRow,
  onSubmit,
  onCompleteNextFreePin,
  isFetchingNextFreePin,
}) => {
  const [editForm, setEditForm] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    if (Array.isArray(selectedRow?.errors) && selectedRow.errors.length > 0) {
      const initial: Record<string, any> = {}
      selectedRow.errors.forEach(
        (error: { field: string; message: string }) => {
          initial[error.field] = selectedRow[error.field] ?? ''
        },
      )
      setEditForm(initial)
    }
  }, [selectedRow])

  const handleUpdate = () => {
    if (editForm) {
      const allErroredFieldsChanged = selectedRow?.errors.some(
        (key: { field: string; message: string }) =>
          editForm[key.field] !== selectedRow[key.field],
      )
      if (!allErroredFieldsChanged) {
        notifications.show({
          title: 'No Changes Detected',
          message: 'Please make changes before updating.',
          color: 'yellow',
        })
        return
      }
      onSubmit?.({
        ...editForm,
        row: selectedRow?.row ?? null,
        action:
          editForm.pin != selectedRow?.pin ? 'create' : selectedRow?.action,
      })
    }
  }

  const onCompleteNextFreePinHandler = async () => {
    if (onCompleteNextFreePin) {
      const nextPin = await onCompleteNextFreePin()
      if (nextPin !== null) {
        setEditForm((prev) => ({
          ...prev,
          pin: nextPin,
        }))
      }
    }
  }
  return (
    <TamsModal2
      opened={opened}
      onClose={onClose}
      title="Resolve Employee Row"
      centered
      size="md"
    >
      <div className="px-5 py-3 space-y-1.5">
        {selectedRow &&
          selectedRow.errors.map(
            (error: { field: string; message: string }, index: number) => {
              if (error.field === 'pin') {
                return (
                  <div key={index} className="flex items-end gap-4">
                    <TamsNumberInput
                      label={error.field}
                      value={editForm?.[error.field] ?? ''}
                      allowNegative={false}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          [error.field]: e,
                        }))
                      }
                      className="flex-1"
                    />
                    <TamsButton
                      variant="light"
                      loading={isFetchingNextFreePin}
                      disabled={isFetchingNextFreePin}
                      color="t-purple"
                      onClick={onCompleteNextFreePinHandler}
                    >
                      Generate Pin
                    </TamsButton>
                  </div>
                )
              }
              return (
                <div key={index} className="flex items-center gap-4">
                  <TamsTextInput
                    className="flex-1"
                    label={error.field}
                    value={editForm?.[error.field] ?? ''}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        [error.field]: e.target.value,
                      }))
                    }
                  />
                </div>
              )
            },
          )}
      </div>
      <div className="mt-6 p-5 rounded-md bg-gray-50">
        <p className="font-medium text-xs italic text-gray-900 mb-2">
          Note: Updating the employee access pin forces the system to treat this
          record as a new entry, potentially affecting existing access and
          synchronization states.
        </p>
      </div>
      <Group py="md" px="lg" justify="flex-end">
        <TamsButton onClick={handleUpdate}>Update</TamsButton>
      </Group>
    </TamsModal2>
  )
}

const UploadEmployeeModal = ({ opened, onClose }: UploadEmployeeModalProps) => {
  const {
    active,
    setActive,
    uploadedFiles,
    handleFileDrop,
    handleFileRemove,
    loading,
    handleDownload,
    handleActionViaStep,
    mappingColumns,
    tableData,
    buttonText,
    dashboardAnalytics,
    validationColumns,
    validatedRows,
    validationTabs,
    activeValidationTab,
    setActiveValidationTab,
    openedFixModal,
    closeFixModal,
    selectedRow,
    handleSubmitEditForm,
    completeNextFreePin,
    isFetchingNextFreePin,
    isReadyForRevalidation,
    handleRevalidation,
    handleValidation,
    uploadedStatistics,
    uploadEmployeeDataStatus,
    isLoadingUploadEmployeeDataStatus,
    resetUpload,
  } = useHandleEmployeeUpload()

  const isActionDisabled = handleValidation(true)

  return (
    <TamsModal2
      title="Upload Employees"
      centered
      size="85%"
      opened={opened}
      className="relative"
      onClose={onClose}
      closeOnClickOutside={false}
      onExitTransitionEnd={resetUpload}
    >
      <Box className="">
        <div>
          <p className="text-outline my-1 ml-5">
            Manage active enterprise staff, access tokens, and biometric synch
            states.
          </p>
        </div>
        <div>
          <Stepper
            styles={{
              steps: {
                backgroundColor: 'var(--mantine-color-t-blue-0)',
                padding: '15px 25px',
              },
            }}
            size="sm"
            active={active}
            onStepClick={setActive}
          >
            <Stepper.Step label="Upload File" description="Source dataset">
              <main className="px-5 overflow-y-auto max-h-150 pb-20">
                <section className="flex rounded-md gap-3 justify-between my-4 bg-secondary/10 py-4 px-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileTextIcon size={20} />
                      <p className="font-medium text-title-sm text-text-main">
                        Download Official CSV Template (v5.0)
                      </p>
                    </div>
                    <p className="text-xs text-secondary/60">
                      Required columns:{' '}
                      <span className="font-semibold">
                        Full Name, Work Email, Biometric PIN
                      </span>{' '}
                      (ZKTeco compliant, ≤8 digits),{' '}
                      <span className="font-semibold">
                        Branch Code, Department, Role/Designation
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2.5">
                    <TamsButton
                      onClick={handleDownload}
                      leftSection={<FileXlsIcon />}
                      variant="light"
                    >
                      Download Sample (.xlsx)
                    </TamsButton>
                  </div>
                </section>
                <TamsDropzone
                  value={uploadedFiles.files}
                  additionalText={`Total rows: ${uploadedFiles.additionalData ?? 0} detected`}
                  status={uploadedFiles.status}
                  loading={loading}
                  onremove={handleFileRemove}
                  onDrop={handleFileDrop}
                  icon={FileCsvIcon}
                  accept={[MIME_TYPES.csv]}
                  maxSize={1024 ** 2 * 5}
                  title="Drag and drop CSV file here or click to select"
                  description={`Only CSV files are accepted: Max file size: ${millifyValue(1024 ** 2 * 5, 'bytes')}`}
                />
              </main>
            </Stepper.Step>
            <Stepper.Step label="Column mapping" description="Field pairing">
              <section className="px-5 overflow-y-auto max-h-150 pb-20">
                <TamsTable
                  disableSearch
                  disablePagination
                  page={1}
                  columns={mappingColumns}
                  data={tableData}
                />
              </section>
            </Stepper.Step>
            <Stepper.Step
              label="Validation"
              description="Validate the uploaded data"
            >
              <main className="px-5 overflow-y-auto space-y-6 max-h-150 pb-20 bg-gray-50 py-3">
                <div className="grid grid-cols-4 gap-4">
                  {dashboardAnalytics.map((item, index) => (
                    <TamsStatsCard
                      key={index}
                      color={item.color}
                      icon={item.icon}
                      title={item.title}
                      value={item.value}
                      description={item.description}
                    />
                  ))}
                </div>

                <div className="bg-white p-1 rounded-md flex">
                  <TamsTabs
                    variant="pills"
                    textClassName="text-xs"
                    tabValue={activeValidationTab}
                    onTabChange={(value) =>
                      setActiveValidationTab(value as string)
                    }
                    data={validationTabs}
                  />

                  <TamsButton
                    className="ml-auto"
                    color="green.6"
                    loading={loading}
                    disabled={!isReadyForRevalidation}
                    onClick={handleRevalidation}
                  >
                    Revalidate
                  </TamsButton>
                </div>
                <div>
                  <TamsTable
                    withHeaders={false}
                    disableSearch
                    disablePagination
                    page={1}
                    columns={validationColumns}
                    data={validatedRows}
                  />
                </div>
                <UploadEditEmployeeModal
                  opened={openedFixModal}
                  onClose={closeFixModal}
                  selectedRow={selectedRow}
                  onSubmit={handleSubmitEditForm}
                  onCompleteNextFreePin={completeNextFreePin}
                  isFetchingNextFreePin={isFetchingNextFreePin}
                />
              </main>
            </Stepper.Step>
            <Stepper.Step label="Final step" description="Complete the upload">
              <main className="px-5 overflow-y-auto space-y-6 max-h-150 pb-20 bg-gray-50 py-3">
                <div className="grid grid-cols-4 gap-4">
                  {uploadedStatistics.map((item, index) => (
                    <Paper
                      radius={'md'}
                      className="px-3 py-2 flex items-center justify-between"
                      key={index}
                    >
                      <div className="space-y-0.5">
                        <Text size="sm" c={item.color}>
                          {item.title}
                        </Text>
                        {!item.loading && item.value && (
                          <Text fz={28} fw={700} c={item.color}>
                            {item.value}
                          </Text>
                        )}
                        {item.loading && <Skeleton height={28} width={80} />}
                        <Text size="xs" c={item.color}>
                          {item.description}
                        </Text>
                      </div>
                      <ThemeIcon size={'lg'} color={item.color} variant="light">
                        <item.icon />
                      </ThemeIcon>
                    </Paper>
                  ))}
                </div>
                <div className="bg-white rounded-sm p-3 ">
                  <h5 className="text-sm text-gray-600 font-semibold mb-3">
                    Additional Information
                  </h5>
                  <section>
                    <div className="flex items-center justify-between mb-2">
                      <Text fw={700}>Live Ingestion progress</Text>
                      <Text size="sm" c="green">
                        {uploadEmployeeDataStatus?.data?.progress ?? 0}%
                        completed
                      </Text>
                    </div>

                    <Progress
                      value={uploadEmployeeDataStatus?.data?.progress ?? 0}
                    />
                  </section>
                </div>
                <TamsTerminal
                  title="Live Ingestion Terminal"
                  loading={isLoadingUploadEmployeeDataStatus}
                  timeline={
                    uploadEmployeeDataStatus?.data?.result?.timeline ?? []
                  }
                />
              </main>
            </Stepper.Step>
          </Stepper>
        </div>
      </Box>
      <Paper
        withBorder
        radius={0}
        className="w-full fixed bottom-0 left-0 p-4 flex items-center justify-between"
      >
        <Link className="text-primary text-sm" to="/">
          Need help? Read CSV import guide
        </Link>
        <Group gap={'lg'}>
          <TamsButton variant="light" color="gray" onClick={onClose}>
            Cancel
          </TamsButton>
          <TamsButton
            loading={buttonText.loading}
            disabled={!isActionDisabled}
            onClick={handleActionViaStep}
          >
            {buttonText.label}
          </TamsButton>
        </Group>
      </Paper>
    </TamsModal2>
  )
}

export default UploadEmployeeModal
