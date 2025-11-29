# Vercel Postgres セットアップガイド

## ✅ 変更完了

SQLiteからVercel Postgresへの移行が完了しました。

### 変更内容

1. ✅ スキーマをPostgreSQL用に変更（`src/db/schema.ts`）
2. ✅ データベースクライアントをVercel Postgres用に変更（`src/db/client.ts`）
3. ✅ Drizzle設定をPostgreSQL用に変更（`drizzle.config.ts`）
4. ✅ パッケージを更新（`@vercel/postgres`を追加、`better-sqlite3`を削除）
5. ✅ APIルートのクエリメソッドをPostgreSQL用に修正

## セットアップ手順

### ステップ1: Vercel Postgresデータベースを作成

```bash
# Vercel CLIでPostgresデータベースを作成
vercel postgres create

# または、Vercelダッシュボードから作成
# 1. https://vercel.com/dashboard にアクセス
# 2. プロジェクトを選択
# 3. "Storage"タブをクリック
# 4. "Create Database" → "Postgres"を選択
```

### ステップ2: 環境変数の確認

Vercel Postgresを作成すると、以下の環境変数が自動的に設定されます：

- `POSTGRES_URL` - データベース接続URL
- `POSTGRES_PRISMA_URL` - Prisma用接続URL（使用しない）
- `POSTGRES_URL_NON_POOLING` - マイグレーション用接続URL

### ステップ3: ローカル開発環境の設定

ローカルで開発する場合、環境変数を設定する必要があります：

```bash
# .env.local ファイルを作成
echo "POSTGRES_URL=your_postgres_url_here" > .env.local
```

Vercel Postgresの接続URLは、Vercelダッシュボードの「Storage」タブから取得できます。

### ステップ4: データベースマイグレーション

```bash
# マイグレーションファイルを生成
npm run db:reflect

# マイグレーションを実行（Vercel Postgresに接続）
# 注意: ローカルで実行する場合は、POSTGRES_URL環境変数が必要です
drizzle-kit migrate
```

または、Vercelにデプロイすると、`postinstall`スクリプトが自動的に実行されます。

### ステップ5: デプロイ

```bash
# Vercelにデプロイ
vercel --prod
```

## 重要な変更点

### 1. スキーマの変更

- `sqliteTable` → `pgTable`
- `integer().primaryKey({ autoIncrement: true })` → `serial('id').primaryKey()`
- `integer({ mode: 'timestamp' })` → `timestamp('created_at', { withTimezone: true })`
- `text()` → `varchar()` または `text()`

### 2. クエリメソッドの変更

- `.all()` → 削除（直接awaitで配列が返る）
- `.get()` → 配列の最初の要素を取得（`result[0]`）

### 3. データベースクライアント

- `better-sqlite3` → `@vercel/postgres`
- ファイルベース → クラウドデータベース

## トラブルシューティング

### マイグレーションエラー

```bash
# 環境変数を確認
echo $POSTGRES_URL

# マイグレーションを手動で実行
drizzle-kit migrate
```

### 接続エラー

- Vercel Postgresが作成されているか確認
- 環境変数`POSTGRES_URL`が正しく設定されているか確認
- Vercelダッシュボードでデータベースの状態を確認

### ビルドエラー

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
```

## 次のステップ

1. ✅ Vercel Postgresデータベースを作成
2. ✅ 環境変数を設定
3. ✅ マイグレーションを実行
4. ✅ Vercelにデプロイ

デプロイ後、すべての機能が正常に動作することを確認してください。

