import { useEffect, useState } from 'react'
import { loginSteps } from '../utils'
import type { AllLoginSchemaType } from '../utils'
import { authClient, useLogin, useLogout, useVerifyCompanyUrl } from '../api'
import { useTamsStore } from '../store'
import { notifications } from '@mantine/notifications'
import type { AxiosError } from 'axios'
import { useNavigate } from '@tanstack/react-router'

const useAuth = () => {
  const {
    companyDetails,
    setAuthSession,
    initializeUser,
    lastPageVisited,
    setLastPageVisited,
    logout,
  } = useTamsStore()
  const navigate = useNavigate()
  const [active, setActive] = useState(1)
  const stepsCount = loginSteps.length

  useEffect(() => {
    setActive(companyDetails ? stepsCount : 1)
  }, [companyDetails])

  const {
    mutateAsync: verifyCompanyUrlAsync,
    isPending: verifyCompanyUrlLoading,
  } = useVerifyCompanyUrl()

  const { mutateAsync: loginAsync, isPending: loginLoading } = useLogin()
  const { mutateAsync: logoutAsync, isPending: logoutLoading } = useLogout()

  const handleNext = () => {
    setActive((current) => (current < stepsCount ? current + 1 : current))
  }

  const handleBack = () => {
    setActive((current) => (current > 1 ? current - 1 : current))
  }

  const handleLogin = async (values: AllLoginSchemaType) => {
    try {
      const response = await loginAsync({
        company_id: values.company_id,
        username: values.email,
        password: values.password,
        client_id: import.meta.env.VITE_API_CLIENT_ID,
        client_secret: import.meta.env.VITE_API_CLIENT_SECRET,
        grant_type: import.meta.env.VITE_API_GRANT_TYPE,
      })
      setAuthSession(response)
      const { data } = await authClient.getUser()
      initializeUser(data)
      const {
        employee_has_invite,
        employee_profile_completed,
        is_user_first_signin,
        permissions,
      } = data

      if (employee_has_invite && !employee_profile_completed) {
        navigate({ to: '/get-started' })
        return
      }

      if (is_user_first_signin) {
        navigate({ to: '/change-password-first-signin' })
        return
      }

      if (lastPageVisited && typeof lastPageVisited === 'object') {
        navigate({ to: lastPageVisited.path, params: lastPageVisited.params })
        setLastPageVisited(null)
      } else {
        navigate({
          to: permissions.includes('view backend')
            ? '/admin-dashboard'
            : '/ess',
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError & {
        response?: {
          data?: {
            message?: string
            error?: string
          }
        }
      }

      notifications.show({
        title: 'Login Failed',
        message:
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.message ||
          'Unable to login at the moment',
        color: 'red',
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAsync()
      logout()
      navigate({ to: '/login' })
    } catch (error) {
      const axiosError = error as AxiosError & {
        response?: {
          data?: {
            message?: string
          }
        }
      }
      notifications.show({
        title: 'Logout Warning',
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          'Could not revoke session on server. Local session will be cleared.',
        color: 'yellow',
      })
    }
  }

  return {
    active,
    setActive,
    handleNext,
    handleBack,
    stepsCount,
    verifyCompanyUrlAsync,
    currentSchema: loginSteps[active - 1],
    loading: verifyCompanyUrlLoading || loginLoading || logoutLoading,
    handleLogin,
    handleLogout,
  }
}

export default useAuth
