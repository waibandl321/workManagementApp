import { shallowMount } from '@vue/test-utils'
import AppComponent from '@/App.vue'

describe('App.vue', () => {
  it('renders test', () => {
    const wrapper = shallowMount(AppComponent)
    expect(wrapper.isVueInstance).toBeTruthy()
  })
})
