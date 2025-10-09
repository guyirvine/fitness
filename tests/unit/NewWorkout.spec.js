import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

const saveWorkoutToAPI = vi.fn(() => Promise.resolve())

vi.mock('../../src/stores/workout', () => ({
  useWorkoutStore: () => ({ saveWorkoutToAPI })
}))

import NewWorkout from '../../src/components/NewWorkout.vue'

describe('NewWorkout.vue', () => {
  let router

  beforeEach(() => {
    saveWorkoutToAPI.mockClear()
    router = { push: vi.fn(), go: vi.fn() }
  })

  it('renders and allows adding a workout', async () => {
    const wrapper = mount(NewWorkout, { props: { router } })

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Cardio')

    await wrapper.find('form').trigger('submit.prevent')

    expect(saveWorkoutToAPI).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('/workout')
  })

  it('cancel/back calls router.go(-1)', async () => {
    const wrapper = mount(NewWorkout, { props: { router } })
    const back = wrapper.find('a.action')
    await back.trigger('click')
    expect(router.go).toHaveBeenCalledWith(-1)
  })
})
