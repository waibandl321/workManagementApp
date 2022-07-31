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
  it('初期表示', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signup, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      data() {
        return {
          max_length_password: 8
        };
      },
      methods: {
        setRoutetitle: mockFunction
      }
    })
    expect(wrapper.get(".v-card__title").text()).toBe("ユーザー登録");
    expect(wrapper.get('[data-test-id="execSignup"]').element.tagName).toBe("BUTTON");
    expect(wrapper.get('[data-test-id="execSignup"]').text()).toBe("登録する");
    expect(wrapper.get('[data-test-id="otherSignup"]').text()).toBe("外部サービスでアカウント作成");
    expect((wrapper.get('[data-test-id="googleSignup"]').element.tagName)).toBe("BUTTON");
    expect(wrapper.get('[data-test-id="pageMoveSignin"]').text()).toBe("ログインはこちら");
    // router-linkのパスも確認しておく
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/auth/signin')
  })

  it('入力テスト data側 値なし', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signup, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
      data() {
        return {
          email: "",
          password: "",
          max_length_password: 8
        };
      }
    })
    const emailInput = wrapper.get('[data-test-id="inputEmail"]')
    const passwordInput = wrapper.get('[data-test-id="inputPassword"]')
    expect(emailInput.element.value).toBe("");
    expect(passwordInput.element.value).toBe("");
    
  })

  it('data値あり→input反映', async () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signup, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
      data() {
        return {
          email: "example@example.com",
          password: "exampleexample",
          max_length_password: 8
        };
      }
    })
    expect(wrapper.get('[data-test-id="inputEmail"]').element.value).toBe("example@example.com")
    expect(wrapper.get('[data-test-id="inputPassword"]').element.value).toBe("exampleexample")
  })
  it('input入力→data反映', async () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signup, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
      data() {
        return {
          max_length_password: 8
        };
      }
    })
    await wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com")
    await wrapper.get('[data-test-id="inputPassword"]').setValue("exampleexample")
    expect(wrapper.vm.email).toBe("example@example.com");
    expect(wrapper.vm.password).toBe("exampleexample");
  })

  it('認証エラーメッセージ data→DOM', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signup, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
      data() {
        return {
          max_length_password: 8,
          error: "UT認証エラーメッセージ"
        };
      }
    })
    expect(wrapper.get('.v-alert').text()).toBe("UT認証エラーメッセージ")
  });

  it('バリデーションエラー required', async () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signup, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
      data() {
        return {
          max_length_password: 8,
        };
      }
    })
    wrapper.get('[data-test-id="inputEmail"]').setValue("")
    wrapper.get('[data-test-id="inputPassword"]').setValue("")
    await flushPromises();
    expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBe("メールアドレスは必須です");
    expect(wrapper.get('[data-test-id="error-message-password"]').text()).toBe("パスワードは必須です");
    // veevalidate側の値もチェック
    expect(wrapper.vm.$refs.email_provider.errors[0]).toBe("メールアドレスは必須です");
    expect(wrapper.vm.$refs.password_provider.errors[0]).toBe("パスワードは必須です");
  });
  it('バリデーションエラー email形式不備', async () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signup, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
      data() {
        return {
          max_length_password: 8,
        };
      }
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
  it('バリデーション emailの形式OKの場合はエラーが表示されない', async () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signup, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
      data() {
        return {
          max_length_password: 8,
        };
      }
    })
    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com")
    wrapper.get('[data-test-id="inputPassword"]').setValue("exampleexample")
    await flushPromises();
    expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBe("");
    expect(wrapper.get('[data-test-id="error-message-password"]').text()).toBe("");
    expect(wrapper.vm.$refs.email_provider.errors[0]).toBeUndefined();
    expect(wrapper.vm.$refs.password_provider.errors[0]).toBeUndefined();
  });
})
/** 
 * テストケース
 * 1. 初期表示
 * ├── 「ユーザー登録」のタイトルが存在する
 * ├── 「登録する」のボタンが存在する
 * ├── 「外部サービスでアカウント作成」の文言が存在する
 * ├── Googleログイン用のボタンが存在する
 * ├── 「ログインがこちら」ボタンが存在する
 * ├──「ログインはこちら」ボタンのrouter-linkが"/auth/signin"
 * 2. 入力データテスト
 * ├── emailが空 = input要素も空
 * ├── passwordが空 = input要素も空
 * ├── emailに"example@example.com"を代入 → inputに"example@example.com"が入る
 * ├── passwordに"exampleexample"を代入 →passwordに"exampleexample"が入る
 * ├── input要素[email]に"example@example.com"を入力 → emailに"example@example.com"が格納される
 * ├── input要素[password]に"exampleexample"を入力 → passwordに"exampleexample"が格納される
 * 3. 認証エラーメッセージ
 * ├── data errorに「UT認証エラーメッセージ」がセットされる
 * ├── 「UT認証エラーメッセージ」のアラートが表示される
 * 4. バリデーションエラー
 * ├── email, passwordに空文字をセット→ エラーメッセージ「〇〇は必須です」と表示される
 * ├── email, passwordに空文字をセット→ veevalidateのerrors[0]に「〇〇は必須です」が格納される
 * ├── emailに"example"をセット→ エラーメッセージ「有効なメールアドレスではありません」と表示される
 *        veevalidateのerrors[0]に「有効なメールアドレスではありません」が格納される
 * ├── passwordに"example"をセット → エラーメッセージ「パスワードは8文字以上でなければなりません」と表示される
 *        veevalidateのerrors[0]に「パスワードは8文字以上でなければなりません」が格納される
 * ├── email, passwordに正しい形式で値をセット→ エラーメッセージは表示されない
 *        veevalidateのerrors[0]はundefinedになる
 * 5. 登録するボタン
 * MEMO:認証チェックはe2eテストで実施
 *      VeeValidateのValidationObserverの状態取得がうまくいかないので、登録ボタンの検証は一旦スキップ
 *      e2eでカバーできるならコンポーネントテストでは無理に実施しない
 *        
 * 
*/