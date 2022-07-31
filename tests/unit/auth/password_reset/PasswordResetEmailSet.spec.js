import PasswordResetEmailSet from '@/components/pages/auth/password_reset/PasswordResetEmailSet.vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, RouterLinkStub, config } from '@vue/test-utils'
import flushPromises from 'flush-promises';

config.showDeprecationWarnings = false
jest.useFakeTimers();

describe('Signin.vue', () => {
  const localVue = createLocalVue()
  let vuetify
  
  const mountFunction = options => {
    return mount(PasswordResetEmailSet, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      propsData: {
        params: {
          success: "",
          error: ""
        },
      },
      ...options
    })
  }

  beforeEach(() => {
    vuetify = new Vuetify()
  })
  it('1. 初期表示', () => {
    const wrapper = mountFunction()
    expect(wrapper.get('.v-card__title').text()).toBe("パスワード再設定");
    expect(wrapper.get('.v-card__text').text()).toContain("パスワード再設定用のメールアドレスを入力してください。");
    expect(wrapper.get('[data-test-id="passwordResetEmailSend"]').text()).toBe("送信");
    expect(wrapper.get('[data-test-id="backSigninFromPasswordReset"]').text()).toBe("サインイン画面に戻る");
    // 遷移先の確認も
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe("/auth/signin");
  })

  it('2-1. 入力テスト 空値', () => {
    const wrapper = mountFunction({
      data() {
        return {
          email: ""
        }
      }
    })
    expect(wrapper.get('[data-test-id="inputEmail"]').element.value).toBeFalsy()
  });
  it('2-2. 入力テスト data→input', () => {
    const wrapper = mountFunction({
      data() {
        return {
          email: "example@example.com"
        }
      }
    })
    expect(wrapper.get('[data-test-id="inputEmail"]').element.value).toBe("example@example.com")
  });
  it('2-3. 入力テスト input→data', () => {
    const wrapper = mountFunction()

    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com")
    expect(wrapper.vm.email).toBe("example@example.com")
  });
  it('3. バリデーションエラー 空値', async () => {
    const wrapper = mountFunction()

    wrapper.get('[data-test-id="inputEmail"]').setValue("")
    await flushPromises()
    expect(wrapper.get('.input-error-message').text()).toBe("メールアドレスは必須です")
    expect(wrapper.vm.$refs.email_provider.errors[0]).toBe("メールアドレスは必須です")
  });
  it('3. バリデーションエラー 形式不備', async () => {
    const wrapper = mountFunction()

    wrapper.get('[data-test-id="inputEmail"]').setValue("example")
    await flushPromises()
    expect(wrapper.get('.input-error-message').text()).toBe("有効なメールアドレスではありません")
    expect(wrapper.vm.$refs.email_provider.errors[0]).toBe("有効なメールアドレスではありません")
  });
  it('3. バリデーションエラー 正常値の場合バリデーションエラー出ない', async () => {
    const wrapper = mountFunction()

    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com")
    await flushPromises()
    expect(wrapper.get('.input-error-message').text()).toBeFalsy()
    expect(wrapper.vm.$refs.email_provider.errors[0]).toBeUndefined()
  });

  it('4. 認証エラーメッセージ', () => {
    const wrapper = mount(PasswordResetEmailSet, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      propsData: {
        params: {
          success: "",
          error: "UTエラー"
        },
      },
    })
    expect(wrapper.get(".v-alert").text()).toBe("UTエラー");
  });  
})
/** 
 * テストケース
 * 1. 初期表示
 * ├── 「パスワード再設定」のタイトルが存在する
 * ├── 「パスワード再設定用のメールアドレスを入力してください。」のテキストが存在する
 * ├── 「サインイン画面に戻る」ボタンが存在する
 * ├── 「送信」のボタンが存在する
 * 2. 入力テスト
 * ├── emailが空 = input要素も空
 * ├── emailに"example@example.com"を代入 → inputに"example@example.com"が入る
 * ├── input要素[email]に"example@example.com"を入力 → emailに"example@example.com"が格納される
 * 3. バリデーションエラー
 * ├── 空値: 「メールアドレスは必須です」
 * ├── 形式不備: 「有効なメールアドレスではありません」
 * 4. 認証エラーメッセージ
 * ├── params.errorに「UTエラー」をセット→DOMのアラートに「UTエラー」が表示される
 * 5. 送信テスト 
*/