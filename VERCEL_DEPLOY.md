# Vercelデプロイガイド

## ✅ 設定完了

Vercel用の設定が完了しました。

## デプロイ方法

### 方法1: Vercel CLIを使用（推奨）

```bash
# Vercelにログイン（初回のみ）
vercel login

# デプロイ（初回は対話形式で設定）
vercel

# 本番環境にデプロイ
vercel --prod
```

または

```bash
npm run deploy:vercel
```

### 方法2: Vercelダッシュボードを使用

1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでログイン
3. "New Project"をクリック
4. このリポジトリを選択
5. 自動的に設定が検出されます
6. "Deploy"をクリック

## 注意事項

### SQLiteデータベースについて

Vercelのサーバーレス環境では、**SQLiteは適していません**。理由：

1. **読み取り専用ファイルシステム**: `/tmp`ディレクトリのみ書き込み可能
2. **一時的な環境**: 各リクエストごとに新しい環境が作成される
3. **データの永続化不可**: リクエスト間でデータが保持されない

### 推奨される解決策

1. **Vercel Postgres**（推奨）
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

## 現在の状態

- ✅ Next.js設定をVercel用に更新
- ✅ APIルートが正常に動作
- ✅ ビルドが成功
- ⚠️ SQLiteデータベースは動作しない可能性あり

## 次のステップ

1. Vercelにデプロイ
2. SQLiteをVercel Postgresまたは外部データベースに移行
3. データベース接続設定を更新

