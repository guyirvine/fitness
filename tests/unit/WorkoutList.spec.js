import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

const loadWorkoutsFromAPI = vi.fn()

const workoutList = [
  { id: 'w-1', name: 'Alpha', notes: 'notes' },
  { id: 'w-2', name: 'Beta', notes: '' }
]

vi.mock('../../src/stores/workout', () => ({
  useWorkoutStore: () => ({ workoutList, loadWorkoutsFromAPI })
}))

import WorkoutList from '../../src/components/WorkoutList.vue'

describe('WorkoutList.vue', () => {
  let router

  beforeEach(() => {
    loadWorkoutsFromAPI.mockClear()
    router = { push: vi.fn() }
  })

  it('calls loadWorkoutsFromAPI on mount and renders list', () => {
    const wrapper = mount(WorkoutList, { props: { router } })
    expect(loadWorkoutsFromAPI).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Alpha')
    expect(wrapper.text()).toContain('Beta')
  })

  it('navigates to edit workout when an item is clicked', async () => {
    const wrapper = mount(WorkoutList, { props: { router } })
    const item = wrapper.find('li')
    await item.trigger('click')
    expect(router.push).toHaveBeenCalled()
  })

  it('navigates to new workout route when + is clicked', async () => {
    const wrapper = mount(WorkoutList, { props: { router } })
    const plus = wrapper.find('.newWorkout')
    await plus.trigger('click')
    expect(router.push).toHaveBeenCalledWith('/newworkout')
  })
})
