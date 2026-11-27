import type { StateCreator } from 'zustand'

const initialState: {
  opened: boolean
  data: {
    message: string
    type?: 'success' | 'error' | 'info'
  }
} = {
  opened: false,
  data: {
    message: '',
    type: 'info',
  },
}

export type TamsToast = typeof initialState & {
  setToast: (data: {
    message: string
    type: 'success' | 'error' | 'info'
  }) => void
  clearToast: () => void
}

export const createToastSlice: StateCreator<TamsToast, [], [], TamsToast> = (
  set,
) => ({
  ...initialState,
  setToast: (data) => set(() => ({ opened: true, data })),
  clearToast: () =>
    set(() => ({ opened: false, data: { message: '', type: undefined } })),
})
