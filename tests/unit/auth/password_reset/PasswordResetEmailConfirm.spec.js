import PasswordResetEmailConfirm from '@/components/pages/auth/password_reset/PasswordResetEmailConfirm.vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, RouterLinkStub, config } from '@vue/test-utils'

config.showDeprecationWarnings = false
jest.useFakeTimers();

describe('Signin.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })
  it('1. 初期表示', () => {
    const wrapper = mount(PasswordResetEmailConfirm, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      }
    })
    expect(wrapper.get('.v-card__title').text()).toBe("パスワード再設定");
    expect(wrapper.get('.v-card__text').text()).toContain("入力されたメールアドレスに再設定用のリンクを送付しました。");
    // 遷移先の確認も
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe("/auth/signin");
  })
})
/** 
 * テストケース
 * 1. 初期表示
 * ├── 「パスワード再設定」のタイトルが存在する
 * ├── 「入力されたメールアドレスに再設定用のリンクを送付しました。」のテキストが存在する
 * ├── 「サインイン画面に戻る」ボタンが存在する
 * ├── 「サインイン画面に戻る」ボタンのリンク先は"/auth/signin"である
*/