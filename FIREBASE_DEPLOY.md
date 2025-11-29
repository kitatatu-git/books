# Firebase Hosting デプロイガイド

このプロジェクトをFirebase Hostingで公開するための手順です。

## ⚠️ 重要な注意事項

現在の設定では、**APIルートは動作しません**。Firebase Hostingは静的サイトホスティングのため、Next.jsのAPIルート（サーバーサイド機能）は静的エクスポートでは動作しません。

### 現在の制限事項

- ✅ 静的ページ（HTML/CSS/JavaScript）は正常に動作します
- ❌ APIルート（`/api/*`）は動作しません
- ❌ SQLiteデータベースは使用できません（Firebase Hostingは読み取り専用ファイルシステム）

### 完全な機能を利用するには

以下のいずれかの方法が必要です：

1. **Firebase Functions + Firebase Hosting**
   - Next.jsをFirebase Functionsで実行
   - データベースをFirestoreに移行
   - より複雑な設定が必要

2. **Vercel（推奨）**
   - Next.js専用ホスティング
   - APIルートとデータベースがそのまま動作
   - 最も簡単な方法

3. **その他のNext.js対応ホスティング**
   - Netlify
   - Railway
   - Render

## デプロイ手順（静的サイトとして）

### 1. Firebase CLIのインストール

```bash
npm install -g firebase-tools
```

### 2. Firebaseにログイン

```bash
firebase login
```

### 3. ビルド

```bash
npm run build:firebase
```

### 4. デプロイ

```bash
npm run deploy:firebase
```

または

```bash
firebase deploy --only hosting
```

## プロジェクト設定

- **Firebase プロジェクト**: `kitagawa-books` (`.firebaserc`で設定済み)
- **ホスティングディレクトリ**: `out` (ビルド後の出力)

## トラブルシューティング

### ビルドエラー

APIルートが原因でビルドエラーが発生する場合、`next.config.ts`で静的エクスポート設定を確認してください。

### デプロイ後の動作確認

デプロイ後、以下のURLでアクセスできます：
- `https://kitagawa-books.web.app`
- `https://kitagawa-books.firebaseapp.com`

## 次のステップ

完全な機能を利用するには、以下のいずれかを検討してください：

1. **Firebase Functionsの実装**
   - `functions/`ディレクトリを作成
   - Next.jsをFirebase Functionsで実行する設定
   - Firestoreへのデータ移行

2. **Vercelへの移行**
   - `vercel.json`の作成
   - `vercel deploy`コマンドでデプロイ

