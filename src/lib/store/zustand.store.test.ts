import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const storageKey = 'tams-storage'
const session = {
  access_token: 'test-token',
  refresh_token: 'test-refresh',
  token_type: 'Bearer',
  expires_in: 3600,
}

beforeEach(() => {
  const entries = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => entries.set(key, value),
    removeItem: (key: string) => entries.delete(key),
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('store persistence', () => {
  it('does not save toast state, while keeping auth and branch data', async () => {
    const { useTamsStore } = await import('./zustand.store')
    useTamsStore.getState().setAuthSession(session)
    useTamsStore.getState().setActiveBranch('3')
    useTamsStore.getState().setLastPageVisited({
      path: '/test',
      params: { items: new Map([['a', 1]]) },
    })
    useTamsStore.getState().setToast({ message: 'Copied!', type: 'success' })

    const saved = JSON.parse(localStorage.getItem(storageKey)!)
    expect(saved.state).not.toHaveProperty('opened')
    expect(saved.state).not.toHaveProperty('data')
    expect(saved.state.authSession).toEqual(session)
    expect(saved.state.activeBranch).toBe('3')

    vi.resetModules()
    const { useTamsStore: reloaded } = await import('./zustand.store')
    expect(reloaded.getState().authSession).toEqual(session)
    expect(reloaded.getState().activeBranch).toBe('3')
    expect(reloaded.getState().lastPageVisited?.params?.items).toEqual(
      new Map([['a', 1]]),
    )
    expect(reloaded.getState().opened).toBe(false)
  })

  it('ignores a previously persisted toast without discarding other state', async () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        state: {
          authSession: session,
          activeBranch: '4',
          opened: true,
          data: { message: 'Old toast', type: 'success' },
        },
        version: 0,
      }),
    )
    const { useTamsStore } = await import('./zustand.store')
    expect(useTamsStore.getState().authSession).toEqual(session)
    expect(useTamsStore.getState().activeBranch).toBe('4')
    expect(useTamsStore.getState().opened).toBe(false)
    expect(useTamsStore.getState().data).toEqual({ message: '', type: 'info' })
    useTamsStore.getState().setToast({ message: 'New toast', type: 'info' })
    expect(useTamsStore.getState().opened).toBe(true)
    useTamsStore.getState().clearToast()
    expect(useTamsStore.getState().opened).toBe(false)
  })
})
