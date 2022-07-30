import AppBtn from '../AppBtn.vue'
import Vuetify from 'vuetify'

// Utilities
import { createLocalVue, mount } from '@vue/test-utils'

describe('Signup.vue', () => {
  // DO NOT use Vuetify on the localInstance
  // This is bootstrapped in the jest setup
  // file located in ./tests/setup.js
  //
  // localVue.use(Vuetify)

  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('初期表示', () => {
    //
  })
})
/** 
 * テストケース
 * 1. 初期表示
 * ├── 「ユーザー登録」のタイトルが存在する
 * ├── 「登録する」のボタンが存在する
 * ├── 「外部サービスでアカウント作成」の文言が存在する
 * ├── Googleログイン用のボタンが存在する
 * ├── 「ログインがこちら」ボタンが存在する
 * 2. 入力テスト
 * ├── emailが空 = input要素も空
 * ├── passwordが空 = input要素も空
 * ├── emailに"example@example.com"を代入 → inputに"example@example.com"が入る
 * ├── passwordに"example"を代入 →passwordに"example"が入る
 * ├── input要素[email]に"example@example.com"を入力 → emailに"example@example.com"が格納される
 * ├── input要素[password]に"example"を入力 → passwordに"example"が格納される
 * 3. 送信テスト 
 * ├── emailOK + password空 = 「登録する」ボタン disabled="disabled"
 * ├── passwordOK + email空  = 「登録する」ボタン disabled="disabled"
 * ├── input要素[email]に"example@example.com"を入力 → emailに"example@example.com"が格納される
 * ├── input要素[password]に"example"を入力 → passwordに"example"が格納される
 * ├──「登録する」ボタンがアクティブになる
 * 4. 「ログインはこちら」ボタンのリンク先確認？
 * 
 * // MEMO: フォームのバリデーション、認証チェックはe2eテストで実施
*/