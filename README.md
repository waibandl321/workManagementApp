# task_app
プロジェクト・タスク管理、チャット、掲示板、オンラインファイル管理などの、業務管理に必要な機能を一通り実装中

### 開発環境
- ソースコード管理 : GitHub(当リポジトリ)
- データベース・ストレージ
[Firebase Realtime Database](https://firebase.google.com/docs/database?hl=ja) : データベースとして使用
[Firebase Storage](https://firebase.google.com/docs/storage?hl=ja) : ファイルなどのコンテンツ保存用
- 認証
[Firebase Authentication](https://firebase.google.com/docs/auth?hl=ja)
- エディタ
[Vue.jsで世界で一番有名なリッチテキストエディタを使う「tinymce-vue」](https://www.kabanoki.net/6211/)

## ファイル管理機能
ファイル管理は、アプリケーション利用ユーザーがドキュメントや画像を参照できるストレージの役割を果たす。（具体的なイメージ：Googleドライブ）

### 機能要求
#### ファイルアップロード
- 画面全体にドラッグ&ドロップできる。
- エクスプローラーやfinderから選択可能
- 複数ファイル選択可能
- 画像サイズ圧縮
- 拡張子制限(jpg, png, gif, svg, pdf)

#### ディレクトリシステム
- 任意のディレクトリ（フォルダ）を作成し、階層移動ができる
- 最上位ディレクトリIDは固定(例：0)
- ディレクトリ作成時・ファイルアップ時にdir_idを起点にファイルシステムを構築する
- パンくず移動もdir_id起点：dir_idを有するファイルアイテムをリスト表示する

#### 検索・ソート
- アップロード日順でソートできる
- ファイル名でリスト検索できる

#### 削除・ダウンロード
- ファイル・フォルダの削除ができる
- レコードを選択して削除、ダウンロードができる
- 全てのファイルを一括で削除できる

#### ゴミ箱
- ゴミ箱を参照できる
- ゴミ箱から復元ができる
- ゴミ箱を完全に削除できる

#### ストレージ
- ストレージ容量の上限と、現在の使用状況を確認できる(例：922KB / 50GB→*%使用中)
- ストレージ容量上限に達した場合、新たにファイルをアップできない（エラーメッセージも表示する）

#### プレビュー
- 画像の場合：Firebase StorageのDownload URLを参照用に活用
- PDFの場合：document.location.href = “XXX.pdf”の手法でOKそう？
- 高機能にする場合は、pdf.jsなどのPDF用ライブラリの使用を検討する
- ※タスク管理機能にアップされたファイルの扱いをどうするか？
- ファイル共有機能でまとめて管理できた方が便利。


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
