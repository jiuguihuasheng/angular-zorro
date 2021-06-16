# Contents
- [Dependencies](#dependencies)
- [Development](#development)
- [Naming](#naming)
- [Build](#build)
- [Deployment](#deployment)
- [Directories](#directories)

# Dependencies
- [angular](https://angular.jp/)  
  SPAフレームワーク

# Development
## 開発ガイドライン
Angular公式サイトから参照  
英語版　：https://angular.io/guide/styleguide  
日本語版：https://angular.jp/guide/styleguide  

## 開発環境構築
Angular公式サイトから参照
英語版　：https://angular.io/guide/setup-local  
日本語版：https://angular.jp/guide/setup-local  

## ソースチェック
ソースプッシュする前に絶対下記コマンドでチェック必要  
```
node_modules/tslint/bin/tslint -c tslint.json 'src/**/*.ts'
```

# Naming
## Route Path命名規約
```
/機能名/画面名１階層/画面名２階層
   │     │            │
   │     │            └──必要に応じて、作成する
   │　　　│
   │     └───────────────画面名
   │
   └─────────────────────メニュー名
```
### Routing時パラメータの渡すかた
画面間データを渡す時URLの`query`で必要なパラメータを渡す
```
例：/XXX/YYY?id=100
```

# Build
## 設定ファイル修正
ビルド環境によって、下記ファイルを修正する
```
src/environments/environment.XX.ts
```
各設定ファイルの詳細は各設定ファイルを参照する

## DA WEBアプリビルド
### CI環境
```
npm run build:ci-da
```

## DAP WEBアプリビルド
### CI環境
```
npm run build:ci-dap
```

## TMNF WEBアプリビルド
### CI環境
```
npm run build:ci-tmnf
```

# Deployment
## ビルド後のパッケージ
```
.
└──dist
   ├──da     # DA WEBアプリ
   ├──dap    # DAP WEBアプリ
   └──tmnf   # TMNF WEBアプリ
```
## 配布
上記`/dist/xxx`をウェブサーバに配布する。

# Directories
## Point  
* 開発時DA／DAP／TMNF３つWebアプリの画面を１プロジェクトにする
* ビルド時[３つアプリそれぞれビルドする](#build)

## 構成
_※付けるモジュールビルド時に自動的に切り替えられる_
```
.
├── api_document                         # RestAPI定義（Swagger）
│   ├── BackEnd.yaml                     # BackEnd API設計
│   ├── DA.yaml                          # DA Webアプリ用
│   ├── DAP.yaml                         # DAP Webアプリ用
│   ├── TMNF.yaml                        # TMNF Webアプリ用
│   └── word.json                        # 用語辞書
├── src                                  # ソース
│   ├── app                              # TSプログラム
│   │   ├── common                       # DA,DAP,TMNFの共通部品
│   │   │   ├── core-base                # 親クラス
│   │   │   ├── core-components          # 共通コンポーネント
│   │   │   ├── core-service             # 共通サービス
│   │   │   ├── rest-api.service.ts      # RestAPIサービス
│   │   │   └── restapi.ts               # RestAPI定義
│   │   ├── da                           # DA Webアプリ※
│   │   │   ...
│   │   │   ├── constants.ts             # 定数定義
│   │   │   ├── layout                   # Header,Footer,Siderbarなど全体のレイアウト
│   │   │   ├── routes　　　              
│   │   │   │   ├── XXX                  # 各画面のソースを管理する
│   │   │   │   │   └── modals           # 各画面のモーダル
│   │   │   │   └── ...
│   │   │   └── shared                   # アプリ毎の全画面用共通部品
│   │   ├── dap                          # DA Webアプリ※
│   │   │   ...
│   │   │   ├── constants.ts             # 定数定義
│   │   │   ├── layout                   # Header,Footer,Siderbarなど全体のレイアウト
│   │   │   ├── routes　　　              
│   │   │   │   ├── XXX                  # 各画面のソースを管理する
│   │   │   │   │   └── modals           # 各画面のモーダル
│   │   │   │   └── ...
│   │   │   └── shared                   # アプリ毎の全画面用共通部品
│   │   ├── tmnf                         # DA Webアプリ※
│   │   │   ...
│   │   │   ├── constants.ts             # 定数定義
│   │   │   ├── layout                   # Header,Footer,Siderbarなど全体のレイアウト
│   │   │   ├── routes　　　              
│   │   │   │   ├── XXX                  # 各画面のソースを管理する
│   │   │   │   │   └── modals           # 各画面のモーダル
│   │   │   │   └── ...
│   │   │   └── shared                   # アプリ毎の全画面用共通部品
│   ├── assets                           # デザイン資材（CSS、アイコンなど）
│   │   ├── da                           # DA Webアプリ用（仮）※
│   │   ├── dap                          # DAP Webアプリ用（仮）※
│   │   ├── tmnf                         # TMNF Webアプリ用（仮）※
│   │   ├── json                         # プロタイプ用ダミーデータ（APIごとにJSONファイルを用意する）
│   ├── environments                     # 環境設定ファイル
│   │   ├── environment.ci.ts            # CI環境用
│   │   ├── environment.prod.ts          # 本番環境用
│   │   └── environment.ts               # 開発環境用
│   ├── resources                        # 多言語リソース
│   │   └── i18n
│   │       └── JP
│   │           └── commons
│   │               └── message.ts       # メッセージ定義
│   │           └── README.md
│   ├── favicon.ico
│   ├── index-da.html                    # DA Webプログラム入り口※
│   ├── index-dap.html                   # DAP Webプログラム入り口※
│   ├── index-tmnf.html                  # TMNF Webプログラム入り口※
│   ├── index.html                       # プログラム入り口
│   ├── main-da.ts                       # DA Webアプリ用入り口※
│   ├── main-dap.ts                      # DAP Webアプリ用入り口※
│   ├── main-tmnf.ts                     # TMNF Webアプリ用入り口※
│   ├── main.ts                          # アプリ用入り口
│   ├── polyfills.ts
│   ├── styles-da.scss                   # DA Webアプリ CSS入り口（仮）※
│   ├── styles-dap.scss                  # DAP Webアプリ CSS入り口（仮）※
│   ├── styles-tmnf.scss                 # TMNF Webアプリ CSS入り口（仮）※
│   ├── styles.scss                      # CSS入り口
│   ├── tsconfig.app.json
│   └── tsconfig.spec.json
├── angular.json                         # ビルド設定
├── package-lock.json                    # 依頼ライブラリー管理
├── package.json                         # 依頼ライブラリー管理
├── README.md                            # README
├── tsconfig.json
└── tslint.json                          # 静的なソースチェック用設定ファイル
```

