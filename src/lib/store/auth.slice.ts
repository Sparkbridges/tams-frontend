import type { StateCreator } from 'zustand'
import type {
  TAuthSessionType,
  TCompanyDetailsType,
  TUser,
} from '../types/store.types'
import { USER_VIEW } from '../types/store.types'

const initialState: {
  companyDetails: TCompanyDetailsType | null
  authSession: TAuthSessionType | null
  user: TUser | null
  activeBranch: string | null
  lastPageVisited: { path: string; params?: Record<string, any> } | null
  isAdmin: boolean
  activeView: USER_VIEW | null
} = {
  companyDetails: null,
  authSession: null,
  user: null,
  lastPageVisited: null,
  isAdmin: false,
  activeView: null,
  activeBranch: 'all',
}

export type TamsAuth = typeof initialState & {
  setCompanyDetails: (companyDetails: TCompanyDetailsType | null) => void
  clearCompanyDetails: () => void
  updateCompanyDetails: (companyDetails: Partial<TCompanyDetailsType>) => void
  setAuthSession: (authSession: TAuthSessionType) => void
  clearAuthSession: () => void
  logout: (type?: 'soft') => void
  initializeUser: (user: TUser | null) => void
  setActiveView: (activeView: USER_VIEW | null) => void
  setLastPageVisited: (
    lastPageVisited: { path: string; params?: Record<string, any> } | null,
  ) => void
  setActiveBranch: (activeBranch: string | null) => void
}

export const createAuthSlice: StateCreator<TamsAuth, [], [], TamsAuth> = (
  set,
) => ({
  ...initialState,
  setCompanyDetails: (companyDetails) => set(() => ({ companyDetails })),
  clearCompanyDetails: () => set(() => ({ companyDetails: null })),
  updateCompanyDetails: (companyDetailsUpdates) =>
    set((state) => ({
      companyDetails: state.companyDetails
        ? { ...state.companyDetails, ...companyDetailsUpdates }
        : null,
    })),
  setAuthSession: (authSession) => set(() => ({ authSession })),
  clearAuthSession: () => set(() => ({ authSession: null })),
  logout: (type?: 'soft') => {
    const payload = !type
      ? {
          companyDetails: null,
          authSession: null,
          user: null,
          activeBranch: null,
        }
      : {
          authSession: null,
          user: null,
          activeBranch: null,
        }
    set(() => (payload))
  },
  setLastPageVisited: (lastPageVisited) => set(() => ({ lastPageVisited })),
  setActiveView: (activeView) => set(() => ({ activeView })),
  setActiveBranch: (activeBranch) => set(() => ({ activeBranch })),
  initializeUser: async (user: TUser | null) => {
    if (user) {
      const isAdmin = user.permissions.includes('view backend')

      const firstBranch = user.managingBranches.length > 0 ? 'all' : null
      set((state) => ({
        user,
        activeBranch: state.activeBranch ? state.activeBranch : firstBranch,
        isAdmin,
        activeView: isAdmin ? USER_VIEW.ADMIN : USER_VIEW.ESS,
      }))
    }
  },
})
