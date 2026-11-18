import {
  TamsButton,
  TamsModal2,
  TamsMultiSelect,
  TamsSelectInput,
} from '#/components/atoms'
import { Tams2ColsForm2, TamsBanner } from '#/components/molecules'
import {
  useAppraisalPeopleSetting,
  useFetchOrganizationBranches,
  useFetchOrganizationDepartments,
  useGetEmployeeGrades,
  useSaveAppraisalPeopleSetting,
  useSearchOrganizationEmployees,
} from '#/lib/api'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import type {
  AppraisalApprovalType,
  AppraisalAssignmentCategory,
  AppraisalPeopleKind,
  AppraisalPersonType,
  TAppraisalPeopleSetting,
} from '#/lib/types/api/performance'
import { getErrorMessage } from '#/lib/utils'
import { ActionIcon, Alert, Group, Paper, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

const dynamicAppraisalPeople = [
  { value: '1', label: 'Employee Himself/Herself' },
  { value: '2', label: "Employee's Head of Department" },
  { value: '3', label: "Employee's Finance Manager" },
  { value: '4', label: "Employee's HR Manager" },
  { value: '5', label: "Employee's Branch Manager" },
]

type PersonValues = {
  personId: string
  personType: AppraisalPersonType
  alternateId: string
  alternateType: AppraisalPersonType
}

type FormValues = {
  name: string
  description: string
  approvalType: AppraisalApprovalType
  category: AppraisalAssignmentCategory
  branchId: string
  assignmentIds: string[]
  persons: PersonValues[]
}

const emptyPerson = (): PersonValues => ({
  personId: '',
  personType: 'static',
  alternateId: '',
  alternateType: 'static',
})

const initialValues = (setting?: TAppraisalPeopleSetting): FormValues => ({
  name: setting?.name ?? '',
  description: setting?.description ?? '',
  approvalType: setting?.approvalType ?? 'sequential',
  category: setting?.category ?? 'employees',
  branchId: setting ? String(setting.branchId) : '',
  assignmentIds: setting?.assignments.map((item) => item.value) ?? [],
  persons: setting?.persons.map((person) => ({
    personId: String(person.personId),
    personType: person.personType,
    alternateId: person.alternateId ? String(person.alternateId) : '',
    alternateType: person.alternateType ?? 'static',
  })) ?? [emptyPerson()],
})

type Props = {
  opened: boolean
  onClose: () => void
  kind: AppraisalPeopleKind
  selectedId?: number
}

const AppraisalPeopleSettingModal = ({
  opened,
  onClose,
  kind,
  selectedId,
}: Props) => {
  const label = kind === 'appraiser' ? 'Appraiser' : 'Approver'
  const detail = useAppraisalPeopleSetting(kind, selectedId)
  const save = useSaveAppraisalPeopleSetting()
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [knownEmployees, setKnownEmployees] = useState<
    { value: string; label: string }[]
  >([])
  const form = useForm<FormValues>({
    initialValues: initialValues(),
    validate: {
      name: (value) => (value.trim() ? null : 'Enter a setting name.'),
      description: (value) =>
        kind === 'approver' && value.length > 500
          ? 'Description must be at most 500 characters.'
          : null,
      assignmentIds: (value) =>
        kind === 'appraiser' && !value.length
          ? 'Select at least one assignment.'
          : null,
      branchId: (value, values) =>
        kind === 'appraiser' &&
        ['department', 'station_grade'].includes(values.category) &&
        !value
          ? 'Select a branch.'
          : null,
      persons: {
        personId: (value) =>
          value ? null : `Select an ${label.toLowerCase()}.`,
      },
    },
  })

  const { data: branches } = useFetchOrganizationBranches(
    undefined,
    (response) =>
      response.data.results.map((branch) => ({
        value: String(branch.id),
        label: branch.station_name,
      })),
  )
  const { data: departments } = useFetchOrganizationDepartments(
    undefined,
    (response) => response.data.results,
  )
  const { data: grades } = useGetEmployeeGrades(
    (response) => response.data.results,
  )
  const { data: employees } = useSearchOrganizationEmployees(
    { query: employeeSearch },
    (response) =>
      response.data.map((employee) => ({
        value: String(employee.id),
        label: employee.name,
      })),
  )

  useEffect(() => {
    if (detail.data) {
      const values = initialValues(detail.data)
      form.setValues(values)
      form.resetDirty(values)
      const selectedEmployees = [
        ...(kind === 'appraiser' && detail.data.category === 'employees'
          ? detail.data.assignments
          : []),
        ...detail.data.persons.flatMap((person) => [
          ...(person.personType === 'static'
            ? [{ value: String(person.personId), label: person.name }]
            : []),
          ...(person.alternateId && person.alternateType === 'static'
            ? [
                {
                  value: String(person.alternateId),
                  label: person.alternateName || String(person.alternateId),
                },
              ]
            : []),
        ]),
      ]
      setKnownEmployees(
        Array.from(
          new Map(selectedEmployees.map((item) => [item.value, item])).values(),
        ),
      )
    }
  }, [detail.data, kind])

  useEffect(() => {
    if (employees) {
      setKnownEmployees((previous) =>
        Array.from(
          new Map(
            [...previous, ...employees].map((item) => [item.value, item]),
          ).values(),
        ),
      )
    }
  }, [employees])

  const assignments =
    form.values.category === 'employees'
      ? knownEmployees
      : form.values.category === 'branch'
        ? branches
        : form.values.category === 'department'
          ? departments
              ?.filter(
                (item) => item.station_id === Number(form.values.branchId),
              )
              .map((item) => ({
                value: String(item.id),
                label: item.department_name,
              }))
          : grades
              ?.filter(
                (item) => item.station_id === Number(form.values.branchId),
              )
              .map((item) => ({
                value: String(item.id),
                label: item.grade_name,
              }))

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: `${label} Settings`,
      fields: [
        { name: 'name', label: 'Name', type: 'text', cols: 6, required: true },
        {
          name: 'approvalType',
          label: 'Approval Type',
          type: 'select',
          cols: 6,
          required: true,
          disabled: kind === 'appraiser',
          options: [
            { value: 'sequential', label: 'Sequential' },
            ...(kind === 'approver'
              ? [{ value: 'concurrent', label: 'Concurrent' }]
              : []),
          ],
        },
        ...(kind === 'approver'
          ? [
              {
                name: 'description',
                label: 'Description',
                type: 'textarea' as const,
                cols: 12,
              },
            ]
          : []),
      ],
    },
  ]

  const handleSubmit = form.onSubmit(async (values) => {
    const persons = values.persons
    try {
      if (kind === 'appraiser') {
        const ids = values.assignmentIds.map(Number)
        await save.mutateAsync({
          kind,
          id: selectedId,
          data: {
            description: values.name.trim(),
            approval_types: 'Sequential',
            no_approvals: persons.length,
            category_type: values.category,
            ...(['department', 'station_grade'].includes(values.category)
              ? { branch_id: Number(values.branchId) }
              : {}),
            ...(values.category === 'employees' ? { employees: ids } : {}),
            ...(values.category === 'department' ? { departments: ids } : {}),
            ...(values.category === 'station_grade' ? { grades: ids } : {}),
            ...(values.category === 'branch' ? { branches: ids } : {}),
            appraiser_details: persons.map((person) => ({
              appraiser_person_id: Number(person.personId),
              alt_appraiser_person_id: person.alternateId
                ? Number(person.alternateId)
                : undefined,
            })),
          },
        })
      } else {
        await save.mutateAsync({
          kind,
          id: selectedId,
          data: {
            name: values.name.trim(),
            description: values.description.trim(),
            approval_type: values.approvalType,
            approver_persons: persons.map((person) => ({
              approver_person_id: Number(person.personId),
              approver_person_type: person.personType,
              ...(person.alternateId
                ? {
                    alt_approver_person_id: Number(person.alternateId),
                    alt_approver_person_type: person.alternateType,
                  }
                : {}),
            })),
          },
        })
      }
      onClose()
    } catch (error) {
      console.error(`Failed to save ${kind} settings`, error)
    }
  })

  return (
    <TamsModal2
      opened={opened}
      onClose={onClose}
      title={`${selectedId ? 'Edit' : 'Add'} ${label} Settings`}
      centered
      size="xl"
      bodyClassName="px-0 pb-0 flex !flex-col"
    >
      {selectedId && detail.isPending ? (
        <Text p="md" role="status">
          Loading settings...
        </Text>
      ) : selectedId && detail.isError ? (
        <Alert color="red" title="Unable to load settings">
          {getErrorMessage(detail.error)}
          <TamsButton onClick={() => detail.refetch()}>Try again</TamsButton>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <section className="bg-gray-100 space-y-3 pb-4 overflow-y-auto max-h-150">
            <Text size="sm" p="md">
              Define {label.toLowerCase()} settings and the people responsible
              at each level.
            </Text>
            <TamsBanner />
            <div className="px-3.5 space-y-4">
              <Tams2ColsForm2 form={form} fields={fields} />
              {kind === 'appraiser' && (
                <Paper withBorder p="lg">
                  <Stack>
                    <TamsSelectInput
                      label="Assign by"
                      required
                      data={[
                        { value: 'employees', label: 'Employees' },
                        { value: 'department', label: 'Departments' },
                        { value: 'station_grade', label: 'Grades' },
                        { value: 'branch', label: 'Branches' },
                      ]}
                      value={form.values.category}
                      onChange={(value) => {
                        if (
                          value === 'employees' ||
                          value === 'department' ||
                          value === 'station_grade' ||
                          value === 'branch'
                        ) {
                          form.setFieldValue('category', value)
                          form.setFieldValue('assignmentIds', [])
                        }
                      }}
                    />
                    {['department', 'station_grade'].includes(
                      form.values.category,
                    ) && (
                      <TamsSelectInput
                        label="Branch"
                        required
                        data={branches}
                        {...form.getInputProps('branchId')}
                        onChange={(value) => {
                          form.setFieldValue('branchId', value ?? '')
                          form.setFieldValue('assignmentIds', [])
                        }}
                      />
                    )}
                    <TamsMultiSelect
                      label="Assignments"
                      required
                      searchable
                      data={assignments}
                      value={form.values.assignmentIds}
                      onChange={(value) =>
                        form.setFieldValue('assignmentIds', value)
                      }
                      onSearchChange={setEmployeeSearch}
                      error={form.errors.assignmentIds}
                    />
                  </Stack>
                </Paper>
              )}
              <Paper withBorder p="lg">
                <Stack>
                  <Text fw={600}>{label} Levels</Text>
                  {form.values.persons.map((person, index) => (
                    <Stack key={index} gap="xs">
                      <Text size="sm" fw={600}>
                        Level {index + 1}
                      </Text>
                      {kind === 'approver' && (
                        <TamsSelectInput
                          label="Approver Type"
                          data={['static', 'dynamic']}
                          {...form.getInputProps(`persons.${index}.personType`)}
                          onChange={(value) => {
                            if (value === 'static' || value === 'dynamic') {
                              form.setFieldValue(
                                `persons.${index}.personType`,
                                value,
                              )
                              form.setFieldValue(
                                `persons.${index}.personId`,
                                '',
                              )
                            }
                          }}
                        />
                      )}
                      <TamsSelectInput
                        label={label}
                        required
                        searchable
                        data={
                          person.personType === 'dynamic'
                            ? dynamicAppraisalPeople
                            : knownEmployees
                        }
                        onSearchChange={
                          person.personType === 'static'
                            ? setEmployeeSearch
                            : undefined
                        }
                        {...form.getInputProps(`persons.${index}.personId`)}
                      />
                      {kind === 'approver' && (
                        <TamsSelectInput
                          label="Alternate Approver Type"
                          data={['static', 'dynamic']}
                          {...form.getInputProps(
                            `persons.${index}.alternateType`,
                          )}
                          onChange={(value) => {
                            if (value === 'static' || value === 'dynamic') {
                              form.setFieldValue(
                                `persons.${index}.alternateType`,
                                value,
                              )
                              form.setFieldValue(
                                `persons.${index}.alternateId`,
                                '',
                              )
                            }
                          }}
                        />
                      )}
                      <Group align="flex-end">
                        <TamsSelectInput
                          label={`Alternate ${label}`}
                          searchable
                          clearable
                          style={{ flex: 1 }}
                          data={
                            person.alternateType === 'dynamic'
                              ? dynamicAppraisalPeople
                              : knownEmployees
                          }
                          onSearchChange={
                            person.alternateType === 'static'
                              ? setEmployeeSearch
                              : undefined
                          }
                          {...form.getInputProps(
                            `persons.${index}.alternateId`,
                          )}
                          onChange={(value) =>
                            form.setFieldValue(
                              `persons.${index}.alternateId`,
                              value ?? '',
                            )
                          }
                        />
                        <ActionIcon
                          color="red"
                          aria-label={`Remove level ${index + 1}`}
                          disabled={form.values.persons.length === 1}
                          onClick={() => form.removeListItem('persons', index)}
                        >
                          <TrashIcon />
                        </ActionIcon>
                      </Group>
                    </Stack>
                  ))}
                  <TamsButton
                    variant="outline"
                    leftSection={<PlusIcon />}
                    onClick={() =>
                      form.insertListItem('persons', emptyPerson())
                    }
                  >
                    Add Level
                  </TamsButton>
                </Stack>
              </Paper>
              {save.isError && (
                <Alert color="red">{getErrorMessage(save.error)}</Alert>
              )}
            </div>
          </section>
          <Paper p="md" className="flex justify-end" withBorder radius={0}>
            <TamsButton
              type="submit"
              loading={save.isPending}
              disabled={!form.isDirty()}
              size="md"
              radius="xl"
            >
              Save
            </TamsButton>
          </Paper>
        </form>
      )}
    </TamsModal2>
  )
}

export default AppraisalPeopleSettingModal
