import { create } from 'zustand'
import type { ExtractState } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createAuthSlice } from './auth.slice'
import type { TamsAuth } from './auth.slice'
import { createToastSlice } from './toast.slice'
import type { TamsToast } from './toast.slice'

type TamsStore = TamsAuth & TamsToast

export const useTamsStore = create<TamsStore>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createToastSlice(...a),
    }),
    {
      name: 'tams-storage',
      partialize: ({ opened, data, setToast, clearToast, ...state }) => state,
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<TamsStore>),
        opened: current.opened,
        data: current.data,
      }),
      storage: createJSONStorage(() => localStorage, {
        replacer: (_, value) => {
          if (value instanceof Map) {
            return { __type: 'Map', entries: [...value.entries()] }
          }
          return value
        },
        reviver: (_, value) => {
          if (value && typeof value === 'object' && '__type' in value) {
            const typedValue = value as {
              __type: string
              entries?: [string, unknown][]
            }

            if (
              typedValue.__type === 'Map' &&
              Array.isArray(typedValue.entries)
            ) {
              return new Map(typedValue.entries)
            }
          }

          return value
        },
      }),
      onRehydrateStorage: () => () => {
        /* if (state && !(state.cart instanceof Map)) {
          state.cart = new Map(Object.entries(state.cart));
        } */
      },
    },
  ),
)

export type TamsState = ExtractState<typeof useTamsStore>
