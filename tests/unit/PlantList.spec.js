import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlantList from '../../src/components/PlantList.vue'

describe('PlantList.vue', () => {
  it('renders a list of plants', () => {
    const plants = [
      { id: 1, name: 'Tomato' },
      { id: 2, name: 'Basil' }
    ]
    const wrapper = mount(PlantList, {
      props: { plantList: plants }
    })
    expect(wrapper.text()).toMatch('Tomato')
    expect(wrapper.text()).toMatch('Basil')
  })

  it('renders empty state if no plants', () => {
    const wrapper = mount(PlantList, {
      props: { plantList: [] }
    })
    expect(wrapper.text().toLowerCase()).toMatch('no plants')
  })
})
