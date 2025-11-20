import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock the stores to observe calls
const loadWorkoutsFromAPI = vi.fn()
const loadSessionsFromAPI = vi.fn()

vi.mock('../../src/stores/workout', () => ({
  useWorkoutStore: () => ({ loadWorkoutsFromAPI })
}))

vi.mock('../../src/stores/session', () => ({
  useSessionStore: () => ({ loadSessionsFromAPI })
}))

// Mock vue-router's useRouter and useRoute
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn() }),
    useRoute: () => ({ name: 'workout' })
  }
})

import Fitness from '../../src/components/Fitness.vue'

describe('Fitness.vue', () => {
  beforeEach(() => {
    loadWorkoutsFromAPI.mockClear()
    loadSessionsFromAPI.mockClear()
  })

  it('loads stores on mount', async () => {
    mount(Fitness, {
      global: {
        stubs: {
          'router-view': {
            template: '<div><slot :Component="{}"></slot></div>'
          },
          'router-link': true
        }
      }
    })
    expect(loadWorkoutsFromAPI).toHaveBeenCalled()
    expect(loadSessionsFromAPI).toHaveBeenCalled()
  })
})
