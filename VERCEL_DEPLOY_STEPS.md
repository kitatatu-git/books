# Vercelデプロイ手順

## ✅ 設定完了

以下の設定が完了しました：

1. ✅ `next.config.ts`をVercel用に更新（静的エクスポート設定を削除）
2. ✅ `vercel.json`を作成
3. ✅ すべてのAPIルートから静的エクスポート用の設定を削除
4. ✅ ビルドが成功することを確認
5. ✅ Vercel CLIをインストール

## デプロイ手順

### ステップ1: Vercelにログイン

ターミナルで以下のコマンドを実行：

```bash
vercel login
```

ブラウザが開き、GitHub、GitLab、またはBitbucketアカウントでログインします。

### ステップ2: プロジェクトをデプロイ

```bash
# 初回デプロイ（対話形式で設定）
vercel

# または本番環境に直接デプロイ
vercel --prod
```

対話形式では以下の質問に答えます：

1. **Set up and deploy?** → `Y`
2. **Which scope?** → あなたのアカウントを選択
3. **Link to existing project?** → `N`（新規プロジェクトの場合）
4. **What's your project's name?** → プロジェクト名を入力（例: `hackathon-template`）
5. **In which directory is your code located?** → `./`（現在のディレクトリ）

### ステップ3: デプロイ完了

デプロイが完了すると、以下のようなURLが表示されます：

```
✅ Production: https://your-project.vercel.app
```

## 重要な注意事項

### ⚠️ SQLiteデータベースについて

**Vercelのサーバーレス環境では、SQLiteは動作しません。**

理由：
- 読み取り専用ファイルシステム（`/tmp`のみ書き込み可能）
- 各リクエストごとに新しい環境が作成される
- データが永続化されない

### 解決策

1. **Vercel Postgres**（推奨）
   ```bash
   vercel postgres create
   ```
   - Vercelが提供するマネージドPostgreSQL
   - 無料プランあり
   - 簡単に統合可能

2. **外部データベースサービス**
   - Supabase（PostgreSQL）
   - PlanetScale（MySQL）
   - MongoDB Atlas

3. **一時的な解決策**
   - `/tmp`ディレクトリを使用（データは永続化されない）
   - 開発・テスト用途のみ

## デプロイ後の確認

デプロイ後、以下のURLでアクセスできます：

- **本番環境**: `https://your-project.vercel.app`
- **プレビュー環境**: 各コミットごとに自動生成

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドを確認
npm run build
```

### データベースエラー

SQLiteを使用している場合、Vercelでは動作しません。上記の解決策を参照してください。

## 次のステップ

1. ✅ Vercelにログイン
2. ✅ デプロイを実行
3. ⚠️ SQLiteをVercel Postgresまたは外部データベースに移行（必要に応じて）

