import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import App from '@/App.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)

describe('App.vue', () => {
  it('renders test', () => {
    const wrapper = shallowMount(App, {
      localVue
    })
    expect(wrapper.isVueInstance).toBeTruthy()
  })
})
