import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

const updateWorkoutInAPI = vi.fn(() => Promise.resolve())
const deleteWorkoutFromAPI = vi.fn(() => Promise.resolve())

const workoutList = [
  { id: 'w-1', name: 'Strength', notes: 'Upper body' }
]

vi.mock('../../src/stores/workout', () => ({
  useWorkoutStore: () => ({
    workoutList,
    updateWorkoutInAPI,
    deleteWorkoutFromAPI
  })
}))

import EditWorkout from '../../src/components/EditWorkout.vue'

describe('EditWorkout.vue', () => {
  let router

  beforeEach(() => {
    updateWorkoutInAPI.mockClear()
    deleteWorkoutFromAPI.mockClear()
    router = { push: vi.fn(), go: vi.fn() }
  })

  it('renders workout name in form', () => {
    const wrapper = mount(EditWorkout, {
      props: { router, id: 'w-1' }
    })

    expect(wrapper.text()).toContain('Strength')
    const input = wrapper.find('input')
    expect(input.element.value).toBe('Strength')
  })

  it('submits updated workout and navigates back', async () => {
    const wrapper = mount(EditWorkout, {
      props: { router, id: 'w-1' }
    })

    const input = wrapper.find('input')
    await input.setValue('Strength II')

    await wrapper.find('form').trigger('submit.prevent')

    expect(updateWorkoutInAPI).toHaveBeenCalled()
    const calledWith = updateWorkoutInAPI.mock.calls[0][0]
    expect(calledWith).toMatchObject({ name: 'Strength II' })
    expect(router.push).toHaveBeenCalledWith('/workout')
  })

  it('deletes workout and navigates back', async () => {
    const wrapper = mount(EditWorkout, {
      props: { router, id: 'w-1' }
    })

    const links = wrapper.findAll('a')
    const deleteLink = links.find((l) => l.text().includes('Delete Workout'))
    expect(deleteLink).toBeTruthy()

    await deleteLink.trigger('click')

    expect(deleteWorkoutFromAPI).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('/workout')
  })

  it('cancel/back calls router.go(-1)', async () => {
    const wrapper = mount(EditWorkout, { props: { router, id: 'w-1' } })
    const back = wrapper.find('a.action')
    await back.trigger('click')
    expect(router.go).toHaveBeenCalledWith(-1)
  })
})
