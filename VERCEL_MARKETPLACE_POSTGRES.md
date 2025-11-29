# Vercel MarketplaceからPostgresを追加する手順

## 📋 手順

### ステップ1: Marketplaceを開く

1. Vercelダッシュボードで、プロジェクトページを開く
2. 上部のタブから「**Integrations**」または「**Marketplace**」をクリック
   - または、左サイドバーの「Integrations」をクリック

### ステップ2: Postgresを検索・追加

1. Marketplaceで「**Postgres**」を検索
2. 「**Vercel Postgres**」または「**Postgres**」を選択
3. 「**Add Integration**」または「**Install**」ボタンをクリック

### ステップ3: データベースを作成

1. プロジェクトを選択（既に選択されている場合が多い）
2. データベース設定：
   - **Database Name**: 任意の名前（例: `hackathon-db`、`books-db`）
   - **Region**: リージョンを選択
     - 推奨: `Tokyo (nrt1)` または `Osaka (kix1)`
     - または `Singapore (sin1)`
3. 「**Create**」または「**Add**」ボタンをクリック

### ステップ4: 環境変数の自動設定を確認

Postgresを追加すると、以下の環境変数が**自動的に設定**されます：

- `POSTGRES_URL` - データベース接続URL（メイン）
- `POSTGRES_PRISMA_URL` - Prisma用（使用しない）
- `POSTGRES_URL_NON_POOLING` - マイグレーション用

**確認方法：**
1. プロジェクトページで「Settings」→「Environment Variables」を開く
2. 上記の環境変数が表示されていることを確認

### ステップ5: 再デプロイ（マイグレーション実行）

データベースを作成した後、テーブルを作成するために再デプロイします：

1. プロジェクトページで「**Deployments**」タブを開く
2. 最新のデプロイメントの右側にある「**...**」メニューをクリック
3. 「**Redeploy**」を選択
4. 「Redeploy」ボタンをクリック

これにより：
- `postinstall`スクリプトが実行される
- `npm run db:reflect`でマイグレーションファイルが生成される
- `drizzle-kit migrate`でデータベースにテーブルが作成される

## 🔍 別の方法：Storageタブから

もしまだ「Storage」タブが表示されている場合：

1. 「Storage」タブを開く
2. 「**Browse Marketplace**」または「**Add from Marketplace**」をクリック
3. 「Postgres」を検索して追加

## ✅ 完了の確認

デプロイが完了したら：

1. プロジェクトのURL（例: `https://your-project.vercel.app`）にアクセス
2. アプリケーションが正常に表示されることを確認
3. ユーザー登録やログインなどの機能をテスト

## 🆘 トラブルシューティング

### Marketplaceが見つからない

- プロジェクトページの上部タブを確認
- 「Integrations」タブを探す
- または、Vercelダッシュボードの左サイドバーから「Integrations」を選択

### Postgresが見つからない

- Marketplaceで「Postgres」または「PostgreSQL」で検索
- 「Vercel Postgres」という名前で表示される場合があります

### 環境変数が設定されない

- Postgresの追加が完了しているか確認
- 「Settings」→「Environment Variables」で確認
- 再デプロイを実行してみる

---

**次のアクション**: Vercelダッシュボードで「Integrations」または「Marketplace」タブを開いて、Postgresを追加してください！

