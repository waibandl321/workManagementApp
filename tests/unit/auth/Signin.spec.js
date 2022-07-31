import Signin from '@/components/pages/auth/Signin.vue'
import Vuetify from 'vuetify'
import { createLocalVue, mount, RouterLinkStub, config } from '@vue/test-utils'
import flushPromises from 'flush-promises';

config.showDeprecationWarnings = false

describe('Signin.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })
  it('初期表示', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signin, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      }
    })
    expect(wrapper.get(".v-card__title").text()).toBe("サインイン");
    expect(wrapper.get('[data-test-id="execSignin"]').element.tagName).toBe("BUTTON");
    expect(wrapper.get('[data-test-id="execSignin"]').text()).toBe("サインイン");
    expect(wrapper.get('[data-test-id="other-signin"]').text()).toBe("外部サービスでサインイン");
    expect((wrapper.get('[data-test-id="googleSignin"]').element.tagName)).toBe("BUTTON");
    expect(wrapper.get('[data-test-id="pageMoveSignup"]').text()).toBe("ユーザー登録がまだの方はこちら");
    // router-linkのパスも確認しておく
    expect(wrapper.findAllComponents(RouterLinkStub).at(0).props().to).toBe('/auth/password_reset')
    expect(wrapper.findAllComponents(RouterLinkStub).at(1).props().to).toBe('/auth/signup')
  })
  it('input入力→data反映', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signin, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
    })
    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com")
    wrapper.get('[data-test-id="inputPassword"]').setValue("exampleexample")
    expect(wrapper.vm.email).toBe("example@example.com");
    expect(wrapper.vm.password).toBe("exampleexample");
  });
  it('data値あり→input反映', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signin, {
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
        };
      }
    })
    expect(wrapper.get('[data-test-id="inputEmail"]').element.value).toBe("example@example.com")
    expect(wrapper.get('[data-test-id="inputPassword"]').element.value).toBe("exampleexample")
  });
  it('input入力→data反映', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signin, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
    })
    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com");
    wrapper.get('[data-test-id="inputPassword"]').setValue("exampleexample");
    // await flushPromises();
    expect(wrapper.vm.email).toBe("example@example.com");
    expect(wrapper.vm.password).toBe("exampleexample");
    
  });
  it('認証エラーメッセージ data→DOM', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signin, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      data() {
        return {
          error: "UT認証エラーメッセージ"
        };
      },
      methods: {
        setRoutetitle: mockFunction
      },
    })
    expect(wrapper.get(".v-alert").text()).toBe("UT認証エラーメッセージ");
  });
  it('バリデーションエラー required', async () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signin, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
    });
    wrapper.get('[data-test-id="inputEmail"]').setValue("")
    wrapper.get('[data-test-id="inputPassword"]').setValue("")
    await flushPromises()
    expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBe("メールアドレスは必須です");
    expect(wrapper.get('[data-test-id="error-message-password"]').text()).toBe("パスワードは必須です");
    expect(wrapper.vm.$refs.email_provider.errors[0]).toBe("メールアドレスは必須です")
    expect(wrapper.vm.$refs.password_provider.errors[0]).toBe("パスワードは必須です")
  });
  it('バリデーションエラー email形式不備', async () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signin, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
    });
    wrapper.get('[data-test-id="inputEmail"]').setValue("example");
    // nextTickもノリで使ってみる
    wrapper.vm.$nextTick(() => {
      expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBe("有効なメールアドレスではありません");
      expect(wrapper.vm.$refs.email_provider.errors[0]).toBe("有効なメールアドレスではありません")
    })
  });
  it('バリデーション emailの形式OKの場合はエラーが表示されない', () => {
    const mockFunction = jest.fn();
    const wrapper = mount(Signin, {
      localVue,
      vuetify,
      stubs: {
        RouterLink: RouterLinkStub
      },
      methods: {
        setRoutetitle: mockFunction
      },
    });
    wrapper.get('[data-test-id="inputEmail"]').setValue("example@example.com");
    wrapper.vm.$nextTick(() => {
      expect(wrapper.get('[data-test-id="error-message-email"]').text()).toBeFalsy()
      expect(wrapper.vm.$refs.email_provider.errors[0]).toBeUndefined();
    });
  });
})
/** 
 * テストケース
 * 1. 初期表示
 * ├── 「サインイン」のタイトルが存在する
 * ├── 「サインイン」のボタンが存在する
 * ├── 「パスワード再設定」のボタンが存在する
 * ├── 「外部サービスでサインイン」の文言が存在する
 * ├── Googleログイン用のボタンが存在する
 * ├── 「ユーザー登録がまだの方はこちら」ボタンが存在する
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
 * 4. リンク先チェック
 * ├──「ユーザー登録がまだの方はこちら」ボタン
 * ├── 「パスワード再設定」ボタン
 * // リンク先の確認だけ。
 * 
 * // MEMO: 認証チェックはe2eテストで実施
 * パスワード画面、ユーザー登録画面への遷移（ルーティング）についてもe2eテストで実施
*/