import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Create spies and mocked store data before the component is imported
const updateSessionInAPI = vi.fn(() => Promise.resolve())
const deleteSessionFromAPI = vi.fn(() => Promise.resolve())

// Provide a single session that matches the test id
const sessionList = [
  {
    id: 1,
    name: 'Morning Session',
    notes: 'Some notes',
    performedAt: '2025-10-09',
    workoutNotes: ''
  }
]

vi.mock('../../src/stores/session', () => {
  return {
    useSessionStore: () => ({
      sessionList,
      updateSessionInAPI,
      deleteSessionFromAPI
    })
  }
})

import EditSession from '../../src/components/EditSession.vue'

describe('EditSession.vue', () => {
  let router

  beforeEach(() => {
    // reset mocks
    updateSessionInAPI.mockClear()
    deleteSessionFromAPI.mockClear()

    router = {
      push: vi.fn(),
      go: vi.fn()
    }
  })

  it('renders session data into the form', async () => {
    const wrapper = mount(EditSession, {
      props: { router, id: '1' }
    })

    // Title should contain the session name
    expect(wrapper.text()).toContain('Morning Session')

    const inputs = wrapper.findAll('input')
    // first input is the name field
    expect(inputs[0].element.value).toBe('Morning Session')
    // notes field should contain the notes
    expect(inputs[1].element.value).toBe('2025-10-09')


    const textAreas = wrapper.findAll('textarea')
    expect(textAreas[0].element.value).toBe('Some notes')
  })

  it('submits updated session and navigates back to /session', async () => {
    const wrapper = mount(EditSession, {
      props: { router, id: '1' }
    })

    const nameInput = wrapper.findAll('input')[0]
    await nameInput.setValue('Evening Session')

    await wrapper.find('form').trigger('submit.prevent')

    // ensure the store API was called with the updated name
    expect(updateSessionInAPI).toHaveBeenCalled()
    const calledWith = updateSessionInAPI.mock.calls[0][0]
    expect(calledWith).toMatchObject({ name: 'Evening Session' })

    // ensure navigation happened
    expect(router.push).toHaveBeenCalledWith('/session')
  })

  it('deletes session and navigates back to /session', async () => {
    const wrapper = mount(EditSession, {
      props: { router, id: '1' }
    })

    // find the delete link by text
    const links = wrapper.findAll('a')
    const deleteLink = links.find((l) => l.text().includes('Delete Session'))
    expect(deleteLink).toBeTruthy()

    await deleteLink.trigger('click')

    expect(deleteSessionFromAPI).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('/session')
  })

  it('cancel/back action calls router.go(-1)', async () => {
    const wrapper = mount(EditSession, {
      props: { router, id: '1' }
    })

    const back = wrapper.find('a.action')
    expect(back.exists()).toBe(true)

    await back.trigger('click')

    expect(router.go).toHaveBeenCalledWith(-1)
  })
})
