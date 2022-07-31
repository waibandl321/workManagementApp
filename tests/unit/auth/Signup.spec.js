import Signup from '@/components/pages/auth/Signup.vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount, mount, RouterLinkStub, config } from '@vue/test-utils'
// import flushPromises from 'flush-promises';

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
    // パスも確認しておく
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

  it('入力テスト data側 値あり', async () => {
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
  it('入力テスト input側 値あり', async () => {
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

  it('email,passwordの値がない場合は送信ボタン非活性', async () => {
    
  });
  it('送信OK', async () => {
    
  });
  it('emailバリデーションエラー', () => {
    
  });

  it('passwordバリデーションエラー', () => {
    
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
 * 2. 入力テスト
 * ├── emailが空 = input要素も空
 * ├── passwordが空 = input要素も空
 * ├── emailに"example@example.com"を代入 → inputに"example@example.com"が入る
 * ├── passwordに"exampleexample"を代入 →passwordに"exampleexample"が入る
 * ├── input要素[email]に"example@example.com"を入力 → emailに"example@example.com"が格納される
 * ├── input要素[password]に"exampleexample"を入力 → passwordに"exampleexample"が格納される
 * 3. 送信テスト 
 * ├── emailOK + password空 = 「登録する」ボタン disabled="disabled"
 * ├── passwordOK + email空  = 「登録する」ボタン disabled="disabled"
 * ├── input要素[email]に"example@example.com"を入力 → emailに"example@example.com"が格納される
 * ├── input要素[password]に"exampleexample"を入力 → passwordに"exampleexample"が格納される
 * ├──「登録する」ボタンがアクティブになる
 * 
 * // MEMO: フォームのバリデーション、認証チェックはe2eテストで実施
*/