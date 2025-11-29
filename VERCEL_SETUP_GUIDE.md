# Vercel セットアップ完全ガイド

## 方法1: Vercelダッシュボードから設定（推奨・最も簡単）

### ステップ1: Vercelにログイン

1. https://vercel.com にアクセス
2. GitHub、GitLab、またはBitbucketアカウントでログイン

### ステップ2: プロジェクトをインポート

1. ダッシュボードで「Add New...」→「Project」をクリック
2. このリポジトリを選択（GitHubにプッシュ済みの場合）
   - または「Import Git Repository」でリポジトリを選択
3. プロジェクト設定：
   - **Framework Preset**: Next.js（自動検出）
   - **Root Directory**: `./`（そのまま）
   - **Build Command**: `npm run build`（自動設定）
   - **Output Directory**: `.next`（自動設定）
4. 「Deploy」をクリック

### ステップ3: Vercel Postgresデータベースを作成

1. デプロイ完了後、プロジェクトページに移動
2. 上部の「Storage」タブをクリック
3. 「Create Database」をクリック
4. 「Postgres」を選択
5. データベース名を入力（例: `hackathon-db`）
6. リージョンを選択（推奨: `Tokyo (nrt1)` または `Osaka (kix1)`）
7. 「Create」をクリック

### ステップ4: 環境変数の確認

Vercel Postgresを作成すると、以下の環境変数が自動的に設定されます：

- `POSTGRES_URL` - データベース接続URL
- `POSTGRES_PRISMA_URL` - Prisma用（使用しない）
- `POSTGRES_URL_NON_POOLING` - マイグレーション用

これらは自動的に設定されるため、手動で設定する必要はありません。

### ステップ5: マイグレーションの実行

Vercelにデプロイすると、`postinstall`スクリプトが自動的に実行されますが、環境変数が設定されていない場合はスキップされます。

**手動でマイグレーションを実行する方法：**

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Environment Variables」で`POSTGRES_URL`を確認
3. ローカルで環境変数を設定：

```bash
# .env.local ファイルを作成
echo "POSTGRES_URL=your_postgres_url_here" > .env.local
```

4. マイグレーションを実行：

```bash
npm run db:reflect
drizzle-kit migrate
```

または、Vercelの「Deployments」タブから「Redeploy」を実行すると、`postinstall`スクリプトが実行されます。

### ステップ6: 再デプロイ

マイグレーション後、再デプロイ：

1. Vercelダッシュボードで「Deployments」タブを開く
2. 最新のデプロイメントの「...」メニューから「Redeploy」をクリック

---

## 方法2: Vercel CLIを使用（上級者向け）

### ステップ1: Vercelにログイン

```bash
vercel login
```

ブラウザが開くので、GitHubアカウントでログインします。

### ステップ2: プロジェクトをリンク

```bash
vercel link
```

対話形式で以下を設定：
- **Set up and deploy?** → `Y`
- **Which scope?** → あなたのアカウントを選択
- **Link to existing project?** → `N`（新規の場合）
- **What's your project's name?** → プロジェクト名を入力
- **In which directory is your code located?** → `./`

### ステップ3: 初回デプロイ

```bash
vercel --prod
```

### ステップ4: Vercel Postgresを作成

Vercelダッシュボードから作成するか、CLIで：

```bash
vercel postgres create
```

### ステップ5: 環境変数をローカルに取得

```bash
vercel env pull .env.local
```

### ステップ6: マイグレーション

```bash
npm run db:reflect
drizzle-kit migrate
```

### ステップ7: 再デプロイ

```bash
vercel --prod
```

---

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドを確認
npm run build
```

### データベース接続エラー

- Vercel Postgresが作成されているか確認
- 環境変数`POSTGRES_URL`が設定されているか確認
- Vercelダッシュボードの「Storage」タブでデータベースの状態を確認

### マイグレーションエラー

```bash
# 環境変数を確認
cat .env.local

# マイグレーションを手動で実行
drizzle-kit migrate
```

---

## 推奨手順（最も簡単）

1. ✅ GitHubにリポジトリをプッシュ（まだの場合）
2. ✅ Vercelダッシュボードからプロジェクトをインポート
3. ✅ 初回デプロイを実行
4. ✅ Vercel Postgresを作成（Storageタブから）
5. ✅ 再デプロイ（マイグレーションが自動実行される）

この方法が最も簡単で確実です！

