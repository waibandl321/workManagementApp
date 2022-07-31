import PasswordReset from '@/components/pages/auth/password_reset/PasswordReset.vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount, config } from '@vue/test-utils'

config.showDeprecationWarnings = false

describe('PasswordReset.vue', () => {
  const localVue = createLocalVue()
  let vuetify
  const mockFunction = jest.fn();
  
  const mountFunction = options => {
    return shallowMount(PasswordReset, {
      localVue,
      vuetify,
      methods: {
        setRoutetitle: mockFunction
      },
      ...options
    })
  }

  beforeEach(() => {
    vuetify = new Vuetify()
  })
  it('コンポーネント描画 メールアドレス入力画面', () => {    
    const wrapper = mountFunction({
      stubs: ['passwordresetemailset'],
      data() {
        return {
          params: {
            mode: "input"
          }
        };
      },
    })
    expect(wrapper.findComponent({ ref: "password_reset_input" }).exists()).toBeTruthy()
  })
  it('コンポーネント描画 確認画面', () => {
    const wrapper = mountFunction({
      stubs: ['passwordresetemailconfirm'],
      data() {
        return {
          params: {
            mode: "confirm"
          }
        };
      },
    })
    expect(wrapper.findComponent({ ref: "password_reset_confirm" }).exists()).toBeTruthy()
  })
})
/** 
 * テストケース
 * 1. コンポーネント描画
 * ├── inputモードの場合は、PasswordResetEmailSet.vueが描画される
 * ├── confirmモードの場合は、PasswordResetEmailConfirm.vueが描画される
*/