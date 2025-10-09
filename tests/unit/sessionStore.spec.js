import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSessionStore } from '../../src/stores/session'

// Mock uuid to return a deterministic id
vi.mock('uuid', () => ({ v4: () => 'fixed-uuid' }))

describe('session store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('loads empty sessions when none in localStorage', async () => {
    const store = useSessionStore()
    await store.loadSessionsFromAPI()
    expect(store.sessionList).toBeTruthy()
    expect(store.sessionList.length).toBe(0)
  })

  it('saves a session and writes to localStorage and assigns id', async () => {
    const store = useSessionStore()
    const s = { name: 'Test Session', notes: '' }
    await store.saveSessionToAPI(s)
    expect(s.id).toBe('fixed-uuid')
    expect(store.sessionList.length).toBe(1)
    const stored = JSON.parse(localStorage.sessionList)
    expect(stored[0].id).toBe('fixed-uuid')
  })

  it('updates a session and persists', async () => {
    const store = useSessionStore()
    // seed
    store.sessionList = [{ id: 'a', name: 'Old', notes: '' }]
    await store.updateSessionInAPI({ id: 'a', name: 'New', notes: 'changed' })
    expect(store.sessionList[0].name).toBe('New')
    const stored = JSON.parse(localStorage.sessionList)
    expect(stored[0].name).toBe('New')
  })

  it('deletes a session and persists', async () => {
    const store = useSessionStore()
    store.sessionList = [{ id: 'to-delete', name: 'X' }, { id: 'keep', name: 'Y' }]
    await store.deleteSessionFromAPI({ id: 'to-delete' })
    expect(store.sessionList.find((s) => s.id === 'to-delete')).toBeUndefined()
    const stored = JSON.parse(localStorage.sessionList)
    expect(stored.find((s) => s.id === 'to-delete')).toBeUndefined()
  })
})
