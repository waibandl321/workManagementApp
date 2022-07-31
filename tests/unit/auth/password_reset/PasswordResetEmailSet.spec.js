/** 
 * テストケース
 * 1. 初期表示
 * ├── 「パスワード再設定」のタイトルが存在する
 * ├── 「パスワード再設定用のメールアドレスを入力してください。」のテキストが存在する
 * ├── 「サインイン画面に戻る」ボタンが存在する
 * ├── 「送信」のボタンが存在する
 * ├── 「送信」ボタンはdisabled
 * 2. 入力テスト
 * ├── emailが空 = input要素も空
 * ├── emailに"example@example.com"を代入 → inputに"example@example.com"が入る
 * ├── input要素[email]に"example@example.com"を入力 → emailに"example@example.com"が格納される
 * 3. 送信テスト 
 * ├── emailOK + password空 = 「登録する」ボタン disabled="disabled"
 * ├── passwordOK + email空  = 「登録する」ボタン disabled="disabled"
 * ├── input要素[email]に"example@example.com"を入力 → emailに"example@example.com"が格納される
 * ├── input要素[password]に"exampleexample"を入力 → passwordに"exampleexample"が格納される
 * ├──「送信」ボタンがアクティブになる
 * 4. リンク先チェック
 * ├──「サインイン画面に戻る」ボタン
 * // リンク先の確認だけ。
 * 
 * // MEMO: フォームのバリデーション、認証チェックはe2eテストで実施
*/