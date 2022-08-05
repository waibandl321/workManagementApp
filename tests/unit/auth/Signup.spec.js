import Signup from '@/components/pages/auth/Signup.vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, RouterLinkStub, config } from '@vue/test-utils'
import flushPromises from 'flush-promises';

config.showDeprecationWarnings = false

describe('Signup.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mockFunction = jest.fn();
  const mountFunction = options => {
    return mount(Signup, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
      ...options
    })
  }

  it('1-1-a 初期表示', () => {
    const wrapper = mountFunction({
      data() {
        return {
          max_length_password: 8
        };
      },
    })

    expect(wrapper.get(".v-card__title").text()).toBe("ユーザー登録");
    expect(wrapper.get('[data-test-id="execSignup"]').element.tagName).toBe("BUTTON");
    expect(wrapper.get('[data-test-id="execSignup"]').text()).toBe("登録する");
    expect(wrapper.get('[data-test-id="otherSignup"]').text()).toBe("外部サービスでアカウント作成");
    expect((wrapper.get('[data-test-id="googleSignup"]').element.tagName)).toBe("BUTTON");
    expect(wrapper.get('[data-test-id="pageMoveSignin"]').text()).toBe("サインインはこちら");
    // router-linkのパスも確認しておく
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/auth/signin')
  })

  it('2-a-1, 2-a-2. 入力テスト data側 値なし', () => {
    const wrapper = mountFunction({
      data() {
        return {
          email: "",
          password: "",
          max_length_password: 8
        };
      },
    })

    const emailInput = wrapper.get('[data-test-id="inputEmail"]')
    const passwordInput = wrapper.get('[data-test-id="inputPassword"]')
    expect(emailInput.element.value).toBe("");
    expect(passwordInput.element.value).toBe("");
    
  })

  it('2-a-3, 2-a-4. data値あり→input反映', async () => {
    const wrapper = mountFunction({
      data() {
        return {
          email: "example@example.com",
          password: "exampleexample",
          max_length_password: 8
        };
      },
    })
    expect(wrapper.get('[data-test-id="inputEmail"]').element.value).toBe("example@example.com")
    expect(wrapper.get('[data-test-id="inputPassword"]').element.value).toBe("exampleexample")
  })
  it('2-a-5, 2-a-6. input入力→data反映', async () => {
    const wrapper = mountFunction({
      data() {
        return {
          max_length_password: 8
        };
      },
    })
    await wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com")
    await wrapper.get('[data-test-id="inputPassword"]').setValue("exampleexample")
    expect(wrapper.vm.email).toBe("example@example.com");
    expect(wrapper.vm.password).toBe("exampleexample");
  })

  it('2-b-1 認証エラーメッセージ', () => {
    const wrapper = mountFunction({
      data() {
        return {
          max_length_password: 8,
          error: "UT認証エラーメッセージ"
        };
      },
    })
    expect(wrapper.get('.v-alert').text()).toBe("UT認証エラーメッセージ")
  });

  it('2-c-1 バリデーションエラー required', () => {
    const wrapper = mountFunction({
      data() {
        return {
          max_length_password: 8,
        };
      },
    })
    wrapper.get('[data-test-id="inputEmail"]').setValue("")
    wrapper.get('[data-test-id="inputPassword"]').setValue("")
    // 登録ボタンチェック
    // MEMO: VeeValidateのobserver判定に16msかかるので時間差でテスト
    setTimeout(() => {
      expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBe("メールアドレスは必須です");
      expect(wrapper.get('[data-test-id="error-message-password"]').text()).toBe("パスワードは必須です");
      // veevalidate側の値もチェック
      expect(wrapper.vm.$refs.email_provider.errors[0]).toBe("メールアドレスは必須です");
      expect(wrapper.vm.$refs.password_provider.errors[0]).toBe("パスワードは必須です");
      // ボタン非活性
      expect(wrapper.findComponent('[data-test-id="execSignup"]').exists()).toBe(false);
    }, 500)
    // await flushPromises();
    
  });
  it('2-c-2, 2-c-3. バリデーションエラー 形式不備', async () => {
    const wrapper = mountFunction({
      data() {
        return {
          max_length_password: 8,
        };
      },
    })

    wrapper.get('[data-test-id="inputEmail"]').setValue("example")
    wrapper.get('[data-test-id="inputPassword"]').setValue("example")
    await flushPromises();
    expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBe("有効なメールアドレスではありません");
    expect(wrapper.get('[data-test-id="error-message-password"]').text()).toBe("パスワードは8文字以上でなければなりません");
    // veevalidate側の値もチェック
    expect(wrapper.vm.$refs.email_provider.errors[0]).toBe("有効なメールアドレスではありません");
    expect(wrapper.vm.$refs.password_provider.errors[0]).toBe("パスワードは8文字以上でなければなりません");
  });
  it('2-c-4 email, passwordに正しい形式で値をセット', async () => {
    const wrapper = mountFunction({
      data() {
        return {
          max_length_password: 8,
        };
      },
    })
    
    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com")
    wrapper.get('[data-test-id="inputPassword"]').setValue("exampleexample")
    expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBe("");
    expect(wrapper.get('[data-test-id="error-message-password"]').text()).toBe("");
    expect(wrapper.vm.$refs.email_provider.errors[0]).toBeUndefined();
    expect(wrapper.vm.$refs.password_provider.errors[0]).toBeUndefined();
  });

  it('2-e-1 登録', () => {
    const _mockFunction = jest.fn(() => "dummy signup")
    const wrapper = mountFunction({
      data() {
        return {
          max_length_password: 8,
        };
      },
    })
    wrapper.vm.signup = _mockFunction;
    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com")
    wrapper.get('[data-test-id="inputPassword"]').setValue("exampleexample")
    // 2-e-1 登録ボタンクリックできる→関数コール
    // MEMO: VeeValidateのobserver判定に16msかかるので時間差でテスト
    setTimeout(() => {
      expect(wrapper.findComponent('[data-test-id="execSignup"]').exists()).toBe(true);
      wrapper.get('[data-test-id="execSignup"]').trigger("click");
      expect(_mockFunction).toHaveBeenCalled()
      expect(wrapper.vm.signup()).toBe("dummy signup")
    }, 500)
  });

  it('3-a-1. 外部認証', () => {
    const _mockFunction = jest.fn(() => "dummy google signin")
    const wrapper = mountFunction();
    wrapper.vm.externalSigninByGoogle = _mockFunction
    wrapper.get('[data-test-id="googleSignup"]').trigger('click');
    expect(_mockFunction).toHaveBeenCalled()
    expect(wrapper.vm.externalSigninByGoogle()).toBe("dummy google signin");
  });
})

// 5. 登録するボタン
// MEMO:認証チェックはe2eテストで実施するので以下を検証
// （１）バリデーションが通過した際にボタンがクリックできるか
// （２）サインアップ用の関数がコールされるか
