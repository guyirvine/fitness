import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlantedList from '../../src/components/PlantedList.vue'

describe('PlantedList.vue', () => {
  it('renders a list of planted plants', () => {
    const plants = [
      { id: 1, name: 'Carrot', planted: '2025-10-10' },
      { id: 2, name: 'Lettuce', planted: '2025-10-12' }
    ]
    const wrapper = mount(PlantedList, {
      props: { plantList: plants }
    })
    expect(wrapper.text()).toMatch('Carrot')
    expect(wrapper.text()).toMatch('Lettuce')
  })

  it('renders empty state if no plants', () => {
    const wrapper = mount(PlantedList, {
      props: { plantList: [] }
    })
    expect(wrapper.text().toLowerCase()).toMatch('no plants')
  })
})
