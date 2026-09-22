import { TamsButton, TamsTextInput } from '#/components'
import TamsPasswordInput from '#/components/atoms/forms/TamsPasswordInput'
import type { AllLoginSchemaType } from '#/lib'
import {
  loginFormInitials,
  useAuth,
  useTamsForm,
  AllLoginSchema,
  useTamsStore,
} from '#/lib'
import { validateStepForms } from '#/lib/utils/helpers/helpers'
import { Paper, Stepper } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import type { AxiosError } from 'axios'
import { useEffect } from 'react'

const TAuthForm = () => {
  const { companyDetails, setCompanyDetails, clearCompanyDetails } =
    useTamsStore()
  const {
    active,
    setActive,
    handleNext,
    handleBack,
    stepsCount,
    verifyCompanyUrlAsync,
    currentSchema,
    loading,
    handleLogin,
  } = useAuth()

  const form = useTamsForm<AllLoginSchemaType>({
    schema: AllLoginSchema,
    defaultValues: loginFormInitials,
  })

  useEffect(() => {
    form.setInitialValues({
      ...form.getValues(),
      company_id: companyDetails?.slug || '',
    })
    form.setValues({
      ...form.getValues(),
      company_id: companyDetails?.slug || '',
    })
  }, [companyDetails])

  const goBackAction = () => {
    handleBack()
    clearCompanyDetails()
  }

  const handleVerifyCompanyUrl = async () => {
    if (validateStepForms(currentSchema, form as any)) {
      try {
        const response = await verifyCompanyUrlAsync({
          company_id: form.getValues().company_id,
        })
        setCompanyDetails(response.data)
        handleNext()
      } catch (error) {
        const axiosError = error as AxiosError & {
          response?: {
            data?: {
              message: string
            }
          }
        }
        notifications.show({
          title: axiosError.response?.data?.message || 'An error occurred',
          message: axiosError.message,
          color: 'red',
        })
      }
    }
  }

  const handleError = (errors: typeof form.errors) => {
    if (errors.company_id) {
      notifications.show({
        title: 'Form Validation Error',
        message: errors.company_id,
        color: 'red',
      })
    }
  }

  return (
    <Paper radius="lg" p="xl" withBorder>
      <form
        className="space-y-3"
        onSubmit={form.onSubmit(
          async (values) =>
            await handleLogin(values as unknown as AllLoginSchemaType),
          handleError,
        )}
      >
        <Stepper
          size="sm"
          active={active - 1}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="Step 1" description="Verify company url">
            <h1 className="text-3xl font-bold text-center mt-3 mb-4">
              Identify Your Workspace
            </h1>
            <p className="text-sm mb-6 text-center">
              Kindly input your company URL to proceed
            </p>
            <div>
              <TamsTextInput
                key={form.key('company_id')}
                {...form.getInputProps('company_id')}
                placeholder="Company Url"
                className={'overflow-hidden'}
                rightSection={
                  <div className="mr-25 h-full flex rounded-r-md items-center bg-gray-100 px-3">
                    .tams.com.ng
                  </div>
                }
              />
            </div>
          </Stepper.Step>
          <Stepper.Step label="Step 2" description="Login to your account">
            <h1 className="text-3xl font-bold text-center mt-3 mb-4">
              Welcome Back
            </h1>
            <p className="text-sm mb-6 text-center">
              Login to access your account
            </p>
            <div className="space-y-4">
              <TamsTextInput
                key={form.key('email')}
                {...form.getInputProps('email')}
                placeholder="Email Address"
              />
              <TamsPasswordInput
                key={form.key('password')}
                {...form.getInputProps('password')}
                placeholder="Password"
              />
            </div>
          </Stepper.Step>
        </Stepper>
        {active === stepsCount ? (
          <TamsButton type="submit" fullWidth size="md" loading={loading}>
            Login
          </TamsButton>
        ) : (
          <TamsButton
            type="button"
            fullWidth
            loading={loading}
            size="md"
            onClick={handleVerifyCompanyUrl}
          >
            Next
          </TamsButton>
        )}
        {active === stepsCount && (
          <div className="flex justify-between items-center mt-2">
            <TamsButton
              leftSection={<ArrowLeftIcon />}
              variant="transparent"
              size="sm"
              onClick={goBackAction}
              type="button"
            >
              Back
            </TamsButton>
            <TamsButton type="button" variant="transparent" size="sm">
              Forgot password?
            </TamsButton>
          </div>
        )}
      </form>
    </Paper>
  )
}

export default TAuthForm
