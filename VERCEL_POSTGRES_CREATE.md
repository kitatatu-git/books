# Vercel Postgres データベース作成手順

## ✅ プロジェクトインポート完了

次のステップ：Vercel Postgresデータベースを作成します。

## 📋 手順

### ステップ1: Storageタブを開く

1. Vercelダッシュボードで、インポートしたプロジェクトを開く
2. 上部のタブから「**Storage**」をクリック
   - または、左サイドバーの「Storage」をクリック

### ステップ2: Postgresデータベースを作成

1. 「**Create Database**」ボタンをクリック
2. データベースタイプを選択：
   - 「**Postgres**」を選択
3. データベース設定：
   - **Database Name**: 任意の名前（例: `hackathon-db`、`books-db`）
   - **Region**: リージョンを選択
     - 推奨: `Tokyo (nrt1)` または `Osaka (kix1)`
     - または `Singapore (sin1)`
4. 「**Create**」ボタンをクリック

### ステップ3: 環境変数の自動設定を確認

Vercel Postgresを作成すると、以下の環境変数が**自動的に設定**されます：

- `POSTGRES_URL` - データベース接続URL（メイン）
- `POSTGRES_PRISMA_URL` - Prisma用（使用しない）
- `POSTGRES_URL_NON_POOLING` - マイグレーション用

**確認方法：**
1. プロジェクトページで「Settings」→「Environment Variables」を開く
2. 上記の環境変数が表示されていることを確認

### ステップ4: 再デプロイ（マイグレーション実行）

データベースを作成した後、テーブルを作成するために再デプロイします：

1. プロジェクトページで「**Deployments**」タブを開く
2. 最新のデプロイメントの右側にある「**...**」メニューをクリック
3. 「**Redeploy**」を選択
4. 「Redeploy」ボタンをクリック

これにより：
- `postinstall`スクリプトが実行される
- `npm run db:reflect`でマイグレーションファイルが生成される
- `drizzle-kit migrate`でデータベースにテーブルが作成される

### ステップ5: デプロイ完了を待つ

- デプロイには数分かかります
- デプロイが完了すると、アプリケーションが正常に動作します

## ✅ 完了の確認

デプロイが完了したら：

1. プロジェクトのURL（例: `https://your-project.vercel.app`）にアクセス
2. アプリケーションが正常に表示されることを確認
3. ユーザー登録やログインなどの機能をテスト

## 🆘 トラブルシューティング

### デプロイエラー

- ビルドログを確認
- エラーメッセージを確認

### データベース接続エラー

- Vercel Postgresが作成されているか確認
- 環境変数が設定されているか確認（Settings → Environment Variables）

### マイグレーションエラー

- 「Deployments」タブで「Redeploy」を再実行
- ビルドログでマイグレーションの実行状況を確認

---

**次のアクション**: Vercelダッシュボードで「Storage」タブを開いて、Postgresデータベースを作成してください！

