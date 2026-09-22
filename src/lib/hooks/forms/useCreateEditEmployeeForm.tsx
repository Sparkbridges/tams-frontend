import {
  organizationClient,
  useCreateOrganizationEmployee,
  useFetchOrganizationAllEmployeeDetails,
  useFetchOrganizationBranches,
  useFetchOrganizationDepartments,
  useGetBanks,
  useGetCountries,
  useGetEmployeeCategories,
  useGetEmployeeDesignations,
  useGetEmployeeGrades,
  useGetEmployeeRoles,
  useGetEmployeeTypes,
  useGetStates,
  useUpdateOrganizationEmployee,
  useUploadOrganizationEmployeeImage,
} from '#/lib/api'
import {
  BLOOD_GROUP_TYPES,
  createEmployeeInitials,
  editEmployeeInitials,
  EMERGENCY_CONTACT_RELATIONSHIP_TYPES,
  GENDER_TYPES,
  GENOTYPE_TYPES,
  IDENTITY_TYPES,
  MARITAL_STATUS_TYPES,
  RELIGION_TYPES,
  SALUTATION_TYPES,
} from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import {
  createEmployeeSchema,
  newDayjs,
  updateEmployeeSchema,
} from '#/lib/utils'
import type { TUpdateEmployeePayload } from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'

type Props = {
  type: 'create' | 'edit'
  employeeId?: number
}

const useCreateEditEmployeeForm = ({ type, employeeId }: Props) => {
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure()

  const { data: branches } = useFetchOrganizationBranches(undefined, (data) => {
    const revamped = data.data.results.map((branch) => ({
      label: branch.station_name,
      value: branch.id.toString(),
    }))
    return [...revamped]
  })

  const { data: countries } = useGetCountries((data) =>
    data.data.map((item) => ({ label: item.name, value: item.id.toString() })),
  )

  const { data: departments } = useFetchOrganizationDepartments(
    {
      page: 1,
      perPage: 1000,
    },
    (data) =>
      data.data.results.map((department) => ({
        label: department.department_name,
        value: department.id.toString(),
      })),
  )

  const accountTypeOptions = [
    { label: 'Savings', value: 'savings' },
    { label: 'Current', value: 'current' },
  ]

  const form = useTamsForm({
    defaultValues:
      type === 'create' ? createEmployeeInitials : editEmployeeInitials,
    schema: type === 'create' ? createEmployeeSchema : updateEmployeeSchema,
    validateInputOnChange: true,
    onValuesChange: () => {
      if (form.isDirty()) {
        openActionWidget()
      } else {
        closeActionWidget()
      }
    },
    transformValues: (values) => ({
      ...values,
      qualification_date: newDayjs(values.qualification_date).toDate(),
      bank_id: Number(values.bank_id),
      country:
        countries?.find((country) => country.value === String(values.country))
          ?.label || values.country,
      state:
        states?.find(
          (state: { value: string; label: string }) =>
            state.value === String(values.state),
        )?.label || values.state,
    }),
  })

  const {
    data: employee,
    isLoading,
    isError,
  } = useFetchOrganizationAllEmployeeDetails(
    { id: Number(employeeId) },
    (data) => data.data,
  )

  const { data: states } = useGetStates(
    { country_id: Number(form.getValues().country) },
    (data) =>
      data.data.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      })),
  )
  const { data: employeeRoles } = useGetEmployeeRoles((data) =>
    data.data.map((role) => ({
      label: role.name,
      value: role.id.toString(),
    })),
  )
  useEffect(() => {
    const initializeForm = async () => {
      if (employee && employeeId) {
        const countryId = countries?.find(
          (c) => c.label === String(employee.country),
        )?.value
        const statesi = await organizationClient.fetchStates({
          country_id: Number(countryId),
        })
        const state = statesi.data
          .find((s) => s.name === employee.state)
          ?.id.toString() as string
        const initials = {
          first_name: employee.first_name,
          id: employee.id,
          last_name: employee.last_name,
          email: employee.email,
          pin: employee.pin,
          qualification_date: employee.qualification_date as unknown as Date,
          bank_id: employee.bank_id as number,
          country: countryId as string,
          city: employee.city,
          local_government: employee.local_government,
          state: state,
          salutation: employee.salutation,
          gender: employee.gender,
          date_of_birth: employee.date_of_birth as unknown as Date,
          blood_group: employee.blood_group,
          genotype: employee.genotype,
          marital_status: employee.marital_status,
          religion: employee.religion,
          nationality: employee.nationality,
          picture: employee.picture as unknown as undefined | File,
          address: employee.address,
          account_number: employee.account_number as string,
          bank_code: employee.bank_code as string,
          account_type: employee.account_type,
          employee_type_id: employee.employee_type_id,
          employee_designation_id: employee.employee_designation_id,
          employee_grade_id: employee.employee_grade_id,
          employee_category_id: employee.employee_category_id,
          mobile_number: employee.mobile_number,
          alt_mobile_number: employee.alt_mobile_number as string,
          custom_employee_id: employee.custom_employee_id as string,
          staff_id: employee.staff_id,
          branch_id: employee.station_id,
          department_id: employee.department_id,
          appointment_date: employee.appointment_date as unknown as Date,
          login_access: !!employee.user_id,
          next_of_kin: employee.next_of_kin,
          last_employment_date:
            employee.last_employment_date as unknown as Date,
          last_employer: employee.last_employer as string,
          guarantor_name: employee.guarantor_name as string,
          guarantor_phone_number: employee.guarantor_phone_number as string,
          last_qualification: employee.last_qualification as string,
          account_name: employee.account_name as unknown as string,
          roles: employee.roles.map((role) => role.id),
          pension_fund_administrator:
            employee.pension_fund_administrator as string,
          rsa_pin: employee.rsa_pin,
          tax_id: employee.tax_id,
          tax_location: employee.tax_location,
          means_of_identity: employee.means_of_identity,
          id_no: employee.id_no,
          id_expiration: employee.id_expiration as unknown as Date,
          emergency_contact_name: employee.emergency_contact_name as string,
          emergency_contact_rel: employee.emergency_contact_rel as string,
          emergency_contact_no: employee.emergency_contact_no as string,
          emergency_contact_address:
            employee.emergency_contact_address as string,
        }
        form.initialize(initials)
        closeActionWidget()
      }
    }
    initializeForm()
  }, [employee, countries, employeeId])

  const hasloginAccess = form.useWatchValue('login_access')

  const { data: banks } = useGetBanks((data) => data.data)

  const { data: employeeTypes } = useGetEmployeeTypes((data) =>
    data.data.results.map((item) => ({
      label: item.type_name,
      value: item.id.toString(),
    })),
  )

  const { data: employeeDesignations } = useGetEmployeeDesignations((data) =>
    data.data.results.map((item) => ({
      label: item.designation_name,
      value: item.id.toString(),
    })),
  )

  const { data: employeeGrades } = useGetEmployeeGrades((data) =>
    data.data.results.map((item) => ({
      label: item.grade_name,
      value: item.id.toString(),
    })),
  )

  const { data: employeeCategories } = useGetEmployeeCategories((data) =>
    data.data.results.map((item) => ({
      label: item.category_name,
      value: item.id.toString(),
    })),
  )

  const {
    mutateAsync: createOrganizationEmployeeAsync,
    isPending: isCreatingOrganizationEmployee,
  } = useCreateOrganizationEmployee()

  const {
    mutateAsync: updateOrganizationEmployeeAsync,
    isPending: isUpdatingOrganizationEmployee,
  } = useUpdateOrganizationEmployee()

  const { mutateAsync: uploadOrganizationEmployeeImageAsync } =
    useUploadOrganizationEmployeeImage()

  form.watch('bank_id', ({ value }) => {
    const bankData = banks?.find((bank) => bank.id === Number(value))
    if (bankData) {
      form.setValues({
        bank_code: bankData.bank_code,
      })
    }
  })

  /*  useEffect(() => {
    const verifyAccountNumber = async () => {
      if (
        form.getValues().account_number &&
        form.getValues().account_number.length === 10
      ) {
        const data = await payrollClient.verifyAccountNumber({
          account_number: form.getValues().account_number,
          bank_code: form.getValues().bank_code,
        })
        form.setValues({
          account_name: data.data.account_name,
        })
      }
    }

    verifyAccountNumber()
  }, [form.getValues()]) */

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Personal Information',
      fields: [
        {
          label: 'Salutation',
          name: 'salutation',
          type: 'select',
          cols: 12,
          options: SALUTATION_TYPES,
          required: true,
        },
        {
          label: 'First Name',
          name: 'first_name',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Last Name',
          name: 'last_name',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Email',
          name: 'email',
          type: 'text',
          cols: 12,
          required: true,
        },
        {
          label: 'Gender',
          name: 'gender',
          type: 'select',
          cols: 6,
          options: GENDER_TYPES,
          required: true,
        },
        {
          label: 'Date of Birth',
          name: 'date_of_birth',
          type: 'date',
          cols: 6,
          required: true,
        },
        {
          label: 'Blood Group',
          name: 'blood_group',
          type: 'select',
          cols: 6,
          options: BLOOD_GROUP_TYPES,
          required: true,
        },
        {
          label: 'Genotype',
          name: 'genotype',
          type: 'select',
          cols: 6,
          options: GENOTYPE_TYPES,
          required: true,
        },
        {
          label: 'Religion',
          name: 'religion',
          type: 'select',
          cols: 6,
          options: RELIGION_TYPES,
          required: true,
        },
        {
          label: 'Marital Status',
          name: 'marital_status',
          type: 'select',
          cols: 6,
          options: MARITAL_STATUS_TYPES,
          required: true,
        },
        {
          label: 'Nationality',
          name: 'nationality',
          type: 'text',
          cols: 12,
        },
        {
          label: 'Profile Picture',
          name: 'picture',
          type: 'file',
          cols: 12,
        },
      ],
    },
    {
      title: 'Contact Information',
      fields: [
        {
          label: 'Address',
          name: 'address',
          type: 'text',
          cols: 12,
          required: true,
        },

        {
          label: 'Country',
          name: 'country',
          type: 'select',
          cols: 6,
          options: countries,
          required: true,
        },
        {
          label: 'State',
          name: 'state',
          type: 'select',
          cols: 6,
          options: states,
          required: true,
        },
        {
          label: 'City',
          name: 'city',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Local Government',
          name: 'local_government',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Mobile Number',
          name: 'mobile_number',
          type: 'phone',
          cols: 6,
          required: true,
        },
        {
          label: 'Alternate Mobile Number',
          name: 'alt_mobile_number',
          type: 'phone',
          cols: 6,
        },
      ],
    },
    {
      title: 'Employment Information',
      fields: [
        {
          label: 'Custom Employee ID',
          name: 'custom_employee_id',
          type: 'text',
          cols: 6,
        },
        {
          label: 'Staff ID',
          name: 'staff_id',
          type: 'text',
          cols: 6,
        },
        {
          label: 'Branch',
          name: 'branch_id',
          type: 'select',
          cols: 6,
          options: branches,
          required: true,
        },
        {
          label: 'Department',
          name: 'department_id',
          type: 'select',
          cols: 6,
          options: departments,
          required: true,
        },
        {
          label: 'Employee Type',
          name: 'employee_type_id',
          type: 'select',
          options: employeeTypes,
          cols: 6,
        },
        {
          label: 'Employee Category',
          name: 'employee_category_id',
          type: 'select',
          options: employeeCategories,
          cols: 6,
        },
        {
          label: 'Employee Designation',
          name: 'employee_designation_id',
          type: 'select',
          options: employeeDesignations,
          cols: 6,
        },
        {
          label: 'Employee Grade',
          name: 'employee_grade_id',
          type: 'select',
          options: employeeGrades,
          cols: 6,
        },
        {
          label: 'Appointment Date',
          name: 'appointment_date',
          type: 'date',
          cols: 6,
          required: true,
        },
        {
          label: 'Grant Login Access',
          name: 'login_access',
          type: 'switch',
          cols: 6,
        },
      ],
    },
    {
      title: 'Previous Employment & Guarantor',
      fields: [
        {
          label: 'Last Employment Date',
          name: 'last_employment_date',
          type: 'date',
          cols: 6,
        },
        {
          label: 'Last Employer',
          name: 'last_employer',
          type: 'text',
          cols: 6,
        },
        {
          label: 'Next of Kin',
          name: 'next_of_kin',
          type: 'text',
          cols: 12,
        },
        {
          label: 'Guarantor Name',
          name: 'guarantor_name',
          type: 'text',
          cols: 6,
        },
        {
          label: 'Guarantor Phone Number',
          name: 'guarantor_phone_number',
          type: 'phone',
          cols: 6,
        },
      ],
    },
    {
      title: 'Qualification Information',
      fields: [
        {
          label: 'Last Qualification',
          name: 'last_qualification',
          type: 'text',
          cols: 6,
        },
        {
          label: 'Qualification Date',
          name: 'qualification_date',
          type: 'date',
          cols: 6,
          required: true,
        },
      ],
    },
    {
      title: 'Bank & Payroll Information',
      fields: [
        {
          label: 'Bank Name',
          name: 'bank_id',
          type: 'select',
          cols: 6,
          options: banks?.map((item) => ({
            label: item.bank_name,
            value: item.id.toString(),
          })),
          required: true,
        },
        {
          label: 'Account Number',
          name: 'account_number',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Account Name',
          name: 'account_name',
          type: 'text',
          cols: 6,
          readonly: false,
        },

        {
          label: 'Account Type',
          name: 'account_type',
          type: 'select',
          cols: 6,
          options: accountTypeOptions,
        },
        {
          label: 'Pension Fund Administrator',
          name: 'pension_fund_administrator',
          type: 'text',
          cols: 6,
        },
        {
          label: 'RSA Pin',
          name: 'rsa_pin',
          type: 'text',
          cols: 6,
        },
        {
          label: 'Tax ID',
          name: 'tax_id',
          type: 'text',
          cols: 6,
        },
        {
          label: 'Tax Location',
          name: 'tax_location',
          type: 'text',
          cols: 6,
        },
      ],
    },
    {
      title: 'Identity & Emergency Contact',
      fields: [
        {
          label: 'Means of Identity',
          name: 'means_of_identity',
          type: 'select',
          cols: 6,
          options: IDENTITY_TYPES,
          required: true,
        },
        {
          label: 'ID Number',
          name: 'id_no',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'ID Expiration',
          name: 'id_expiration',
          type: 'date',
          cols: 6,
          required: true,
        },
        {
          label: 'Emergency Contact Name',
          name: 'emergency_contact_name',
          type: 'text',
          cols: 6,
        },
        {
          label: 'Emergency Contact Relationship',
          name: 'emergency_contact_rel',
          type: 'select',
          cols: 6,
          options: EMERGENCY_CONTACT_RELATIONSHIP_TYPES,
        },
        {
          label: 'Emergency Contact Number',
          name: 'emergency_contact_no',
          type: 'phone',
          cols: 6,
        },
        {
          label: 'Emergency Contact Address',
          name: 'emergency_contact_address',
          type: 'textarea',
          cols: 12,
        },
      ],
    },
    ...(hasloginAccess
      ? ([
          {
            title: 'User Access',
            fields: [
              {
                label: 'Permission Level',
                name: 'roles',
                type: 'multi-select',
                options: employeeRoles ?? [],
                cols: 12,
                required: true,
              },
              ...(type === 'edit'
                ? [
                    {
                      label: 'Access Pin',
                      name: 'pin',
                      type: 'text',
                      cols: 6,
                      readonly: true,
                    },
                  ]
                : []),
            ],
          },
        ] as typeof fields)
      : []),
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        const payload = { ...values }
        try {
          if (values.picture && values.picture instanceof File) {
            const formData = new FormData()
            formData.append('employeePicture', values.picture)
            const response = await uploadOrganizationEmployeeImageAsync({
              image: formData,
            })
            payload.picture = response.data
          }
          if (type === 'create') {
            await createOrganizationEmployeeAsync(payload)
            form.reset()
          }
          if (type === 'edit' && employeeId) {
            await updateOrganizationEmployeeAsync({
              ...payload,
              id: employeeId,
            } as TUpdateEmployeePayload)
          }
          closeActionWidget()
        } catch (error) {
          console.error('Error submitting form', error)
        }
      },
      (errors) => {
        console.error('errors', errors)
      },
    )()
  }
  const handleCancel = () => {
    form.reset()
    closeActionWidget()
  }
  return {
    form,
    fields,
    openedActionWidget,
    openActionWidget,
    closeActionWidget,
    handleSubmit,
    handleCancel,
    loading: isLoading,
    isSubmitting:
      isCreatingOrganizationEmployee || isUpdatingOrganizationEmployee,
    isError,
  }
}

export default useCreateEditEmployeeForm
