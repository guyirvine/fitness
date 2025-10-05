import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HarvestList from '../../src/components/HarvestedList.vue'

describe('HarvestedList.vue', () => {
  it('renders a list of harvested plants', () => {
    const plants = [
      { id: 1, name: 'Potato', planted: '2025-09-20', harvest: '2025-10-10' },
      { id: 2, name: 'Onion', planted: '2025-09-20', harvest: '2025-10-12' }
    ]
    const wrapper = mount(HarvestList, {
      props: { plantList: plants }
    })
    expect(wrapper.text()).toMatch('Potato')
    expect(wrapper.text()).toMatch('Onion')
  })

  it('renders empty state if no plants', () => {
    const wrapper = mount(HarvestList, {
      props: { plantList: [] }
    })
    expect(wrapper.text().toLowerCase()).toMatch('no plants')
  })
})
