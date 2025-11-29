# Firebase セットアップガイド

このアプリケーションはFirebase Firestoreをデータベースとして使用するように変換されました。

## ⚠️ 重要な注意事項

このアプリケーションはNext.js APIルートを使用しているため、**Firebase Hosting単体では動作しません**。
以下のいずれかの方法でデプロイしてください：

### 推奨デプロイ方法

1. **Vercel (推奨)** - Next.jsアプリに最適化されており、Firestoreと簡単に連携
2. **Google Cloud Run** - Dockerコンテナとして実行、Firebase製品と統合が容易

## 🔧 セットアップ手順

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. Firestoreデータベースを有効化（本番モードまたはテストモードで開始）

### 2. Firebase設定の取得

#### クライアント側設定
1. Firebase Console > プロジェクト設定 > 全般
2. 「アプリを追加」> Webアプリを選択
3. Firebase SDKの設定値をコピー

#### サーバー側設定（Firebase Admin SDK）
1. Firebase Console > プロジェクト設定 > サービスアカウント
2. 「新しい秘密鍵の生成」をクリック
3. ダウンロードしたJSONファイルをプロジェクトルートに配置
   - ファイル名: `firebase-service-account-key.json`
   - **注意**: このファイルは秘密情報です。Gitにコミットしないでください

### 3. 環境変数の設定

`.env.local`ファイルをプロジェクトルートに作成：

```bash
cp .env.local.example .env.local
```

以下の値を設定：

```env
# クライアント側設定（公開されても問題ない）
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# サーバー側設定（秘密にする必要あり）
FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account-key.json
```

### 4. Firestoreルールのデプロイ

```bash
# Firebase CLIでログイン
npx firebase login

# プロジェクトを初期化（既存のfirebase.jsonがあるので、既に設定済み）
# プロジェクトIDを.firebasercに設定
echo '{"projects": {"default": "your-project-id"}}' > .firebaserc

# Firestoreルールとインデックスをデプロイ
npx firebase deploy --only firestore:rules,firestore:indexes
```

## 📦 デプロイ方法

### Vercelへのデプロイ（推奨）

1. [Vercel](https://vercel.com/)にログイン
2. GitHubリポジトリを接続
3. 環境変数を設定（上記の`.env.local`の内容）
4. デプロイ

または、CLIを使用：

```bash
# Vercel CLIをインストール（初回のみ）
npm install -g vercel

# デプロイ
vercel

# 本番環境へデプロイ
vercel --prod
```

### Google Cloud Runへのデプロイ

1. プロジェクトルートに`Dockerfile`を作成

```dockerfile
FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

2. Cloud Runにデプロイ

```bash
# Google Cloud CLIでログイン
gcloud auth login

# プロジェクトを設定
gcloud config set project your-project-id

# Cloud Runにデプロイ
gcloud run deploy reading-log-app \
  --source . \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

## 🗄️ データベース構造

### Firestoreコレクション

#### users
- `name` (string): ユーザー名
- `password` (string): ハッシュ化されたパスワード
- `createdAt` (timestamp): 作成日時

#### books
- `googleBooksId` (string): Google Books API ID
- `title` (string): 書籍タイトル
- `authors` (string): 著者リスト（JSON文字列）
- `description` (string): 書籍の説明
- `thumbnail` (string): カバー画像URL
- `publishedDate` (string): 発行日
- `pageCount` (number): ページ数
- `categories` (string): カテゴリリスト（JSON文字列）
- `createdAt` (timestamp): 作成日時

#### reading_records
- `userId` (string): ユーザーID（usersドキュメントのID）
- `bookId` (string): 書籍ID（booksドキュメントのID）
- `rating` (number): 評価（0.5-5.0）
- `review` (string): 感想
- `tags` (string): タグリスト（JSON文字列）
- `finishedDate` (string): 読了日（YYYY-MM-DD形式）
- `createdAt` (timestamp): 作成日時
- `updatedAt` (timestamp): 更新日時

#### attendance
- `userId` (string): ユーザーID（usersドキュメントのID）
- `date` (string): 日付（YYYY-MM-DD形式）
- `status` (string): 出勤状態（'present', 'vacation', 'am_off', 'pm_off'）
- `location` (string): 勤務場所
- `tasks` (string): 作業内容
- `consultation` (string): 相談事項
- `createdAt` (timestamp): 作成日時
- `updatedAt` (timestamp): 更新日時

## 🔐 セキュリティルール

`firestore.rules`ファイルに定義されているセキュリティルールを確認してください。
現在の設定では：

- **users**: 全ユーザーが読み取り可能（他のユーザーの書庫を見るため）
- **books**: 全ユーザーが読み取り可能、ログインユーザーが書き込み可能
- **reading_records**: 全ユーザーが読み取り可能、自分の記録のみ編集・削除可能

## 🚀 ローカル開発

```bash
# 開発サーバーの起動
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 📝 変更内容

このFirebase移行で変更された主な内容：

1. **データベース**: Vercel Postgres → Firebase Firestore
2. **認証**: Cookie認証（変更なし）
3. **データアクセス**: Drizzle ORM → Firebase Admin SDK
4. **IDの型**: integer → string（FirestoreのドキュメントID）

## ⚠️ 既存データの移行

Vercel Postgresから既存のデータを移行する場合は、別途マイグレーションスクリプトが必要です。

## 📚 参考資料

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Next.js on Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service)
