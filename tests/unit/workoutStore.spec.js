import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useWorkoutStore } from '../../src/stores/workout'

vi.mock('uuid', () => ({ v4: () => 'workout-uuid' }))

describe('workout store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('loads empty workouts when none in localStorage', async () => {
    const store = useWorkoutStore()
    await store.loadWorkoutsFromAPI()
    expect(store.workoutList).toBeTruthy()
    expect(store.workoutList.length).toBe(0)
  })

  it('saves workout and assigns id and persists', async () => {
    const store = useWorkoutStore()
    const w = { name: 'Bench', notes: '' }
    await store.saveWorkoutToAPI(w)
    expect(w.id).toBe('workout-uuid')
    expect(store.workoutList.length).toBe(1)
    const stored = JSON.parse(localStorage.workoutList)
    expect(stored[0].id).toBe('workout-uuid')
  })

  it('deletes a workout and persists', async () => {
    const store = useWorkoutStore()
    store.workoutList = [{ id: 'x', name: 'A' }, { id: 'y', name: 'B' }]
    await store.deleteWorkoutFromAPI({ id: 'x' })
    expect(store.workoutList.find((w) => w.id === 'x')).toBeUndefined()
    const stored = JSON.parse(localStorage.workoutList)
    expect(stored.find((w) => w.id === 'x')).toBeUndefined()
  })
})
