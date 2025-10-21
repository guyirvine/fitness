import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

const saveSessionToAPI = vi.fn(() => Promise.resolve())

const workoutList = [
  { id: 'w-1', name: 'Yoga', notes: 'Stretch' },
  { id: 'w-2', name: 'Run', notes: '' }
]

const sessionList = [
  { id: 's-1', name: 'Morning Yoga', notes: 'Relaxed', performedAt: '2025-10-08' }
]

vi.mock('../../src/stores/workout', () => ({
  useWorkoutStore: () => ({ workoutList })
}))

vi.mock('../../src/stores/session', () => ({
  useSessionStore: () => ({ sessionList, saveSessionToAPI, updateSessionInAPI: vi.fn(), deleteSessionFromAPI: vi.fn() })
}))

import SessionList from '../../src/components/SessionList.vue'

describe('SessionList.vue', () => {
  let router

  beforeEach(() => {
    saveSessionToAPI.mockClear()
    router = { push: vi.fn() }
  })

  it('renders available workouts as new session buttons', () => {
    const wrapper = mount(SessionList, { props: { router } })
    expect(wrapper.text()).toContain('Yoga')
    expect(wrapper.text()).toContain('Run')
  })

  it('adds a new session when clicking a workout', async () => {
    const wrapper = mount(SessionList, { props: { router } })
    const workouts = wrapper.findAll('.workout')
    await workouts[0].trigger('click')
    expect(saveSessionToAPI).toHaveBeenCalled()
  })

  it('renders existing sessions grouped by date', () => {
    const wrapper = mount(SessionList, { props: { router } })
    expect(wrapper.text()).toContain('Morning Yoga')
  })

  it('navigates to edit session when a session is clicked', async () => {
    const wrapper = mount(SessionList, { props: { router } })
    // find the session list item by its text so test is robust
    const items = wrapper.findAll('li')
    const sessionItem = items.find((i) => i.text().includes('Morning Yoga'))
    expect(sessionItem).toBeTruthy()
    await sessionItem.trigger('click')
    expect(router.push).toHaveBeenCalled()
  })
})
