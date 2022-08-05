# タスク管理アプリ

## 開発環境
### フロントエンド(FW、ライブラリ)
vue@2.6.1  
└ vue/cli@4.5.15  
└ vuetify@2.6.3  
└ vue-router@3.5.3  
└ vuex@3.6.2  
└ vue-head@2.2.0  
└ vue-apexcharts@1.6.2：グラフ用  
└ vue-pdf@4.3.0：PDFプレビュー用  
└ vue-quill-editor@3.0,6：リッチテキストエディタ用  
└ vuedeaggable@2.24.3：リストをドラッグで並べ替え用  
└ vee-validate@3.4.5：バリデーション用  

### インフラ
Firebase  
└ Authentication：認証  
└ Realtime Database：DB  
└ Storage：ファイルなどのコンテンツ管理  
└ Firebase Hosting：ホスティング  

### テスト
#### E2Eテスト
└ Cypress  
【方針】  
画面単位でユーザーの操作を再現し、イベントに応じた望ましい結果が得られるかを検証  
ソース：cypressディレクトリ参照  

#### コンポーネントテスト
└ Vue Test Utils  
└ Jest  
【方針】  
コンポーネントのデータとDOMの関連性にフォーカスして検証  
各関数一行一行の内部ロジック検証はコンポーネントテストでは行わない  
・コンポーネントの描画  
・dataが変わったらDOMが更新されるか（逆も）  
・ボタンがクリックされたら関数がコールされるか など  
ソース：testsディレクトリ参照  

## 機能
・ユーザー認証  
・アカウント設定  
・ダッシュボード  
・ファイル管理  
・タスク管理  

### ユーザー認証
Firebase Authenticationを使用  
・ユーザー登録  
・ログイン  
・外部認証（Googleログイン)  
・パスワード再設定  
・ログアウト  
・アカウント削除  

### アカウント設定
アプリケーション内部で使用する情報設定  
・ユーザー情報登録  
・ユーザー情報編集  
・アカウント削除（認証と連動）  

### ダッシュボード
・週間、月間単位でタスク完了率と期限切れ率を算出  
【算出方法】  
タスク完了率：期間内（7日間 or 1ヶ月）の完了タスク数 ÷ 期間内（7日間 or 1ヶ月）に作成されたタスク数 * 100  
期限切れ率 = 期間内（7日間 or 1ヶ月）の期限切れタスク数 / 期間内（7日間 or 1ヶ月）のタスク作成数 * 100  
期限切れタスクの定義：ステータスが完了＋完了日付が期日を超過しているタスク  

・カテゴリ別タスク数の表示  
└ アクティブタスク数（未完了のタスク）  
└ 期限が切れているタスク数（未完了のタスク）  
└ 完了タスク数  
今自分がどれだけの数のタスクを抱えているのかを把握できる  

・タスクリストの表示  
└ 期限が7日以内のタスク  
└ 期限切れのタスク  
└ 本日期限のタスク  
└ 完了タスク  
リストから詳細表示ができ、ダッシュボードから直接タスク詳細の変更ができる  

### ファイル管理
・ファイルアップロード  
・ディレクトリシステム  
・ファイル更新  
・ファイルプレビュー  
・ファイルダウンロード  
・ファイル削除  

##### ファイルアップロード
アップロードできるファイル形式は画像とPDFのみで、厳密な拡張子チェックを実装  
例えば元ファイルの拡張子が.xmlだが、ファイル名変更で.pdfになった場合でもチェックで弾かれるように実装  
##### ディレクトリシステム
Finderやエクスプローラのようにフォルダを自由に作成して移動できる。  
ファイルのみをアップする使用だと大量のファイルで管理が大変になるので、ディレクトリシステムを導入  
##### ファイル更新
ディレクトリに存在するファイルと同じ名称のファイルがアップされた場合、上書き保存する。  
ただし、ファイル名が同じでも元データが改竄されているファイルは拡張子チェックでエラーになる  
##### ファイルプレビュー
画像とPDFでプレビュー形式を分けている
PDFプレビューには「vue-pdf」というライブラリを使用しており、モーダルウィンドウ内でPDFの閲覧ができる  
閲覧頻度の高いPDFファイルを「ファイル管理」にアップロードしておいて、アプリの利用中に閲覧できるイメージ  
アプリとローカルPCを行き来しなくていいように  
##### ファイルダウンロード
一度アップロードしたファイルをダウンロードする場面を想定して実装  


### タスク管理

#### タスク一覧・詳細
【設定項目】  
・ステータス  
・優先度  
・タスク期日  
・サブタスク  
・タスク詳細  
・添付ファイル  

【アラート機能】  
タスクの期日設定がされている場合、期日が本日だった場合は「本日期日のタスクです」、  
タスクの期日が期限切れになっている場合は、「期限が過ぎています」と常時表示される。  
詳細画面は常に編集可能な状態にしているので、どの項目が変更されたのかも随時アラートを出すように実装。  




## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
