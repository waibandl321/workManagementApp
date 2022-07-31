
/** 
 * テストケース
 * 1. 初期表示
 * ├── 「サインイン」のタイトルが存在する
 * ├── 「サインイン」のボタンが存在する
 * ├── 「パスワード再設定」のボタンが存在する
 * ├── 「外部サービスでサインイン」の文言が存在する
 * ├── Googleログイン用のボタンが存在する
 * ├── 「ユーザー登録がまだの方はこちら」ボタンが存在する
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
 * 4. リンク先チェック
 * ├──「ユーザー登録がまだの方はこちら」ボタン
 * ├── 「パスワード再設定」ボタン
 * // リンク先の確認だけ。
 * 
 * // MEMO: フォームのバリデーション、認証チェックはe2eテストで実施
*/