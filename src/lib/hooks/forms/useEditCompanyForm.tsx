import {
  useGetAccountSettings,
  useGetCities,
  useGetCountries,
  useGetStates,
  useUpdateAccountSettings,
  useUploadOrganizationEmployeeImage,
} from '#/lib/api'
import { CURRENCY_SIGNS, editCompanyInitials } from '#/lib/constants'
import type { TamsBy2ColsFormFields } from '#/lib/types'
import { editCompanySchema, resolvePhoneNumber } from '#/lib/utils'
import { useDisclosure } from '@mantine/hooks'
import useTamsForm from '../useTamsForm'
import { useEffect } from 'react'

const useEditCompanyForm = () => {
  const [
    openedActionWidget,
    { open: openActionWidget, close: closeActionWidget },
  ] = useDisclosure()

  const {
    data: accountSettings,
    isLoading: isAccountSettingsLoading,
    isError: isAccountSettingsError,
  } = useGetAccountSettings()

  const { data: countries } = useGetCountries((data) =>
    data.data.map((item) => ({ label: item.name, value: item.id.toString() })),
  )

  const form = useTamsForm({
    defaultValues: editCompanyInitials,
    schema: editCompanySchema,
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
      zip_code: Number(values.zip_code),
    }),
  })

  const { data: states } = useGetStates(
    { country_id: Number(form.getValues().country) },
    (data) =>
      data.data.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      })),
  )

  const { data: cities } = useGetCities(
    { state_id: Number(form.getValues().state) },
    (data) =>
      data.data.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      })),
  )

  useEffect(() => {
    const initializeForm = async () => {
      const details = accountSettings?.data
      if (details) {
        const initials = {
          company_name: details.company_name,
          legal_name: details.legal_name,
          slug: details.slug,
          company_logo: details.company_logo,
          contact_person_name: details.contact_person_name,
          contact_person_designation: details.contact_person_designation,
          company_phone_no: resolvePhoneNumber(details.company_phone_no),
          company_alt_phone_no: resolvePhoneNumber(
            details.company_alt_phone_no as string,
          ),
          email: details.email,
          website: details.website,
          address: details.address,
          city: Number(details.city),
          state: Number(details.state),
          zip_code: details.zip_code,
          country: Number(details.country),
          additional_info: details.additional_info,
          currency_sign: details.currency_sign,
        }
        form.initialize(initials)
        closeActionWidget()
      }
    }
    initializeForm()
  }, [accountSettings, countries])

  const {
    mutateAsync: updateAccountSettingsAsync,
    isPending: isUpdatingAccountSettings,
  } = useUpdateAccountSettings()

  const { mutateAsync: uploadOrganizationEmployeeImageAsync } =
    useUploadOrganizationEmployeeImage()

  const fields: TamsBy2ColsFormFields[] = [
    {
      title: 'Organization Information',
      fields: [
        {
          label: 'Organization name',
          name: 'company_name',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Legal Name',
          name: 'legal_name',
          type: 'text',
          cols: 6,
          required: false,
        },
        {
          label: 'Organization URL',
          name: 'slug',
          type: 'url',
          suffix: '.tams.com.ng',
          cols: 6,
          required: true,
        },
        {
          label: 'Website Url',
          name: 'website',
          type: 'text',
          cols: 6,
          required: false,
        },
        {
          label: 'Currency',
          name: 'currency_sign',
          type: 'select',
          cols: 6,
          options: CURRENCY_SIGNS,
        },
      ],
    },
    {
      title: 'Contact Information',
      fields: [
        {
          label: 'Email',
          name: 'email',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Company Phone Number',
          name: 'company_phone_no',
          type: 'phone',
          cols: 6,
          required: true,
        },
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
          type: 'select',
          cols: 6,
          options: cities,
        },
        {
          label: 'Zip Code',
          name: 'zip_code',
          type: 'text',
          cols: 6,
        },
        {
          label: 'Contact Person Name',
          name: 'contact_person_name',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Contact Person Designation',
          name: 'contact_person_designation',
          type: 'text',
          cols: 6,
          required: true,
        },
        {
          label: 'Alternate Company Phone Number',
          name: 'company_alt_phone_no',
          type: 'phone',
          cols: 6,
        },
      ],
    },
  ]

  const rightSection: TamsBy2ColsFormFields[] = [
    {
      title: 'Media Information',
      fields: [
        {
          label: 'Organization Logo',
          name: 'company_logo',
          type: 'file',
          cols: 12,
          maxSize: 2 * 1024 ** 2, // 2MB
        },
      ],
    },
  ]
  const handleSubmit = async () => {
    form.onSubmit(
      async (values: any) => {
        const payload = { ...values }
        try {
          if (values.company_logo && values.company_logo instanceof File) {
            const formData = new FormData()
            formData.append('employeePicture', values.company_logo)
            const response = await uploadOrganizationEmployeeImageAsync({
              image: formData,
            })
            payload.company_logo = response.data
          }
          await updateAccountSettingsAsync(payload)
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
    rightSection,
    openedActionWidget,
    openActionWidget,
    closeActionWidget,
    handleSubmit,
    handleCancel,
    loading: isAccountSettingsLoading,
    isSubmitting: isUpdatingAccountSettings,
    isError: isAccountSettingsError,
  }
}

export default useEditCompanyForm
