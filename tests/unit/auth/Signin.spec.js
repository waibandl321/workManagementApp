import Signin from '@/components/pages/auth/Signin.vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, RouterLinkStub, config } from '@vue/test-utils'

config.showDeprecationWarnings = false

describe('Signin.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })
  
  const mockFunction = jest.fn();
  const mountFunction = options => {
    return mount(Signin, {
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

  // 1-a 初期表示
  it('1-a-1 初期表示', () => {
    const wrapper = mountFunction()

    expect(wrapper.get(".v-card__title").text()).toBe("サインイン");
    expect(wrapper.get('[data-test-id="execSignin"]').element.tagName).toBe("BUTTON");
    expect(wrapper.get('[data-test-id="execSignin"]').text()).toBe("サインイン");
    expect(wrapper.get('[data-test-id="other-signin"]').text()).toBe("外部サービスでサインイン");
    expect((wrapper.get('[data-test-id="googleSignin"]').element.tagName)).toBe("BUTTON");
    expect(wrapper.get('[data-test-id="pageMoveSignup"]').text()).toBe("ユーザー登録がまだの方はこちら");
  })

  it('1-a-2 router-link確認 ', () => {
    const wrapper = mountFunction()
    expect(wrapper.findAllComponents(RouterLinkStub).at(0).props().to).toBe('/auth/password_reset')
    expect(wrapper.findAllComponents(RouterLinkStub).at(1).props().to).toBe('/auth/signup')
  });

  // 2-a 入力
  it('2-a-1, 2-a-2. 入力テスト data側 値なし', () => {
    const wrapper = mountFunction({
      data() {
        return {
          email: "",
          password: "",
        };
      },
    })

    const emailInput = wrapper.get('[data-test-id="inputEmail"]')
    const passwordInput = wrapper.get('[data-test-id="inputPassword"]')
    expect(emailInput.element.value).toBe("");
    expect(passwordInput.element.value).toBe("");
  })
  it('2-a-3, 2-a-4. data値あり→input反映', () => {
    const wrapper = mountFunction({
      data() {
        return {
          email: "example@example.com",
          password: "exampleexample",
        };
      }
    })
    expect(wrapper.get('[data-test-id="inputEmail"]').element.value).toBe("example@example.com")
    expect(wrapper.get('[data-test-id="inputPassword"]').element.value).toBe("exampleexample")
  });
  it('2-a-5, 2-a-6. input入力→data反映', () => {
    const wrapper = mountFunction()
    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com")
    wrapper.get('[data-test-id="inputPassword"]').setValue("exampleexample")
    expect(wrapper.vm.email).toBe("example@example.com");
    expect(wrapper.vm.password).toBe("exampleexample");
  });

  // 2-b 認証エラー
  it('2-b-1. 認証エラーメッセージ data→DOM', () => {
    const wrapper = mountFunction({
      data() {
        return {
          error: "UT認証エラーメッセージ"
        };
      }
    })

    expect(wrapper.get(".v-alert").text()).toBe("UT認証エラーメッセージ");
  });

  // バリデーションエラー
  it('2-c-1. バリデーションエラー required', async () => {
    const wrapper = mountFunction()
    wrapper.get('[data-test-id="inputEmail"]').setValue("")
    wrapper.get('[data-test-id="inputPassword"]').setValue("")
    // MEMO: VeeValidateのobserver判定に16msかかるので時間差でテスト
    setTimeout(() => {
      expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBe("メールアドレスは必須です");
      expect(wrapper.get('[data-test-id="error-message-password"]').text()).toBe("パスワードは必須です");
      expect(wrapper.vm.$refs.email_provider.errors[0]).toBe("メールアドレスは必須です")
      expect(wrapper.vm.$refs.password_provider.errors[0]).toBe("パスワードは必須です")
      // ボタン非活性
      expect(wrapper.findComponent('[data-test-id="execSignin"]').exists()).toBe(false);
    }, 500)
  });
  it('2-c-2. バリデーションエラー email形式不備', async () => {
    const wrapper = mountFunction()
    ;
    wrapper.get('[data-test-id="inputEmail"]').setValue("example");
    // nextTickも使ってみる(非同期DOMの更新確認) 
    wrapper.vm.$nextTick(() => {
      expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBe("有効なメールアドレスではありません");
      expect(wrapper.vm.$refs.email_provider.errors[0]).toBe("有効なメールアドレスではありません")
    })
  });
  it('2-c-4. バリデーション emailの形式OKの場合はエラーが表示されない', () => {
    const wrapper = mountFunction();
    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com");
    wrapper.vm.$nextTick(() => {
      expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBeFalsy()
      expect(wrapper.vm.$refs.email_provider.errors[0]).toBeUndefined();
    });
  });

  it('2-e 登録', () => {
    const _mockFunction = jest.fn(() => "dummy signin")
    const wrapper = mountFunction();
    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com")
    wrapper.get('[data-test-id="inputPassword"]').setValue("exampleexample")
    wrapper.vm.execSignin = _mockFunction
    // MEMO: VeeValidateのobserver判定に16msかかるので時間差でテスト
    setTimeout(() => {
      expect(wrapper.findComponent('[data-test-id="execSignin"]').exists()).toBe(true);
      expect(_mockFunction).toHaveBeenCalled()
      expect(wrapper.vm.execSignin()).toBe("dummy signin");
    })
  });

  it('3-a-1. 外部認証', () => {
    const _mockFunction = jest.fn(() => "dummy google signin")
    const wrapper = mountFunction();
    wrapper.vm.externalSigninByGoogle = _mockFunction
    wrapper.get('[data-test-id="googleSignin"]').trigger('click');
    expect(_mockFunction).toHaveBeenCalled()
    expect(wrapper.vm.externalSigninByGoogle()).toBe("dummy google signin");
  });
})