import axios from 'axios'
import type {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios'
import { useTamsStore } from '../store'
import { notifications } from '@mantine/notifications'
import { getRouter } from '#/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: import.meta.env.VITE_HTTP_TIMEOUT || 200000,
  // withCredentials: true,
  /* headers: {
    ...(user.getToken() && {
      Authorization: `Bearer ${user.getToken().access_token}`,
    }),
    ...(user.getActiveBranch() && { 'active-branch': user.getActiveBranch() }),
  }, */
})

let count = 0;

/*
let refreshPromise: Promise<void> | null = null

 function getRefreshPromise() {
  if (!refreshPromise) {
    refreshPromise = api
      .get('/auth/refresh')
      .then((res) => {
        // update store with fresh user data
        useMealJetStore.getState().setUser(res.data.data.user)
      })
      .catch((err) => {
        // both tokens are dead — now we clear and let router redirect
        useMealJetStore.getState().clearUser()
        return Promise.reject(err)
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useTamsStore.getState().authSession?.access_token

    const currentBranch = useTamsStore.getState().activeBranch

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    } else if (config.headers.Authorization) {
      delete config.headers.Authorization
    }

    if (currentBranch) {
      config.headers['active-branch'] = currentBranch.toString()
    } else if (config.headers['active-branch']) {
      delete config.headers['active-branch']
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // both tokens are dead — now we clear and let router redirect
      count++
      useTamsStore.getState().logout('soft')
      if (count === 1) {
        notifications.show({
          title: 'Session Expired',
          message: 'Your session has expired. Redirecting to login.',
          color: 'red',
          loading: true,
        })
      }
      getRouter().navigate({ to: '/login' })
      return Promise.reject(error)
    }

    return Promise.reject(error)
  },
)

/* const SKIP_REFRESH_URLS = ['/auth/login', '/auth/register', '/auth/refresh'] // Add any other auth-related endpoints that shouldn't trigger refresh logic

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    const shouldSkip = SKIP_REFRESH_URLS.some((url) =>
      originalRequest.url?.includes(url),
    )
    if (shouldSkip) return Promise.reject(error)

    // for all other 401s mid-session, clear user and let
    // the router's beforeLoad handle the redirect on next navigation
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // silently reissues accessToken via your isAuthenticated middleware
        // user never knows their token expired
        await getRefreshPromise()
        // retry the original request with the new access token
        return api(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
) */
export default class Client {
  static async get<T>(url: string, options?: AxiosRequestConfig<unknown>) {
    const response = await api.get<T>(url, options)
    return response.data
  }
  static async post<T>(
    url: string,
    data?: unknown,
    options?: AxiosRequestConfig<unknown>,
  ) {
    const response = await api.post<T>(url, data, options)
    return response.data
  }
  static async put<T>(url: string, data?: unknown) {
    const response = await api.put<T>(url, data)
    return response.data
  }
  static async patch<T>(
    url: string,
    data?: unknown,
    options?: AxiosRequestConfig<unknown>,
  ) {
    const response = await api.patch<T>(url, data, options)
    return response.data
  }
  static async delete<T>(url: string, options?: AxiosRequestConfig<unknown>) {
    const response = await api.delete<T>(url, options)
    return response.data
  }
}
