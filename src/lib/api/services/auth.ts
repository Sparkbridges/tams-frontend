import { useMutation } from '@tanstack/react-query'
import { authClient } from '../client'
import { notifications } from '@mantine/notifications'

export const useVerifyCompanyUrl = () => {
  return useMutation({
    mutationFn: authClient.verifyCompanyUrl,
    onSuccess: (data) => {
      notifications.show({
        color: 'green',
        title: 'Company URL Verified',
        message: data.message || 'Company URL has been verified.',
      })
    },
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: authClient.login,
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Login Successful',
        message: 'You have successfully logged in.',
      })
    },
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: authClient.logout,
  })
}
