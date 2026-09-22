import { create } from 'zustand'
import type { ExtractState } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createAuthSlice } from './auth.slice'
import type { TamsAuth } from './auth.slice'

type TamsStore = TamsAuth

export const useTamsStore = create<TamsStore>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    {
      name: 'tams-storage',
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
