# 次のステップ - Vercelデプロイ

## ✅ 完了した作業

1. ✅ SQLiteからVercel Postgresへの移行
2. ✅ すべてのコードをPostgreSQL用に更新
3. ✅ ビルドが成功することを確認
4. ✅ GitHubにプッシュ完了

## 📋 これから行う手順

### ステップ1: Vercelにプロジェクトをインポート

1. **Vercelにアクセス**
   - https://vercel.com を開く
   - GitHubアカウントでログイン（まだの場合）

2. **プロジェクトをインポート**
   - ダッシュボードで「Add New...」→「Project」をクリック
   - リポジトリ一覧から `kitatatu-git/books` を選択
   - または「Import Git Repository」で検索

3. **プロジェクト設定を確認**
   - **Framework Preset**: Next.js（自動検出されるはず）
   - **Root Directory**: `./`（そのまま）
   - **Build Command**: `npm run build`（自動設定）
   - **Output Directory**: `.next`（自動設定）
   - **Install Command**: `npm install`（自動設定）

4. **環境変数（この時点では不要）**
   - 後でVercel Postgresを作成すると自動的に設定されます

5. **「Deploy」をクリック**
   - 初回デプロイが開始されます
   - 数分かかります

### ステップ2: Vercel Postgresデータベースを作成

1. **デプロイ完了後**
   - プロジェクトページに移動
   - 上部のタブから「Storage」をクリック

2. **データベースを作成**
   - 「Create Database」ボタンをクリック
   - 「Postgres」を選択
   - データベース名を入力（例: `hackathon-db`）
   - リージョンを選択：
     - 推奨: `Tokyo (nrt1)` または `Osaka (kix1)`
     - または `Singapore (sin1)`
   - 「Create」をクリック

3. **環境変数の自動設定**
   - 以下の環境変数が自動的に設定されます：
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`
   - 手動で設定する必要はありません

### ステップ3: マイグレーションの実行

Vercel Postgresを作成した後、データベースにテーブルを作成する必要があります。

**方法A: 自動実行（推奨）**

1. Vercelダッシュボードで「Deployments」タブを開く
2. 最新のデプロイメントの「...」メニューから「Redeploy」をクリック
3. これにより、`postinstall`スクリプトが実行され、マイグレーションが自動的に実行されます

**方法B: 手動実行（必要に応じて）**

1. Vercelダッシュボードで「Settings」→「Environment Variables」を開く
2. `POSTGRES_URL`の値をコピー
3. ローカルで`.env.local`ファイルを作成：
   ```bash
   echo "POSTGRES_URL=your_postgres_url_here" > .env.local
   ```
4. マイグレーションを実行：
   ```bash
   npm run db:reflect
   drizzle-kit migrate
   ```

### ステップ4: 動作確認

1. **デプロイ完了後**
   - Vercelが提供するURL（例: `https://your-project.vercel.app`）にアクセス
   - アプリケーションが正常に表示されることを確認

2. **機能テスト**
   - ユーザー登録
   - ログイン
   - データの作成・読み取り・更新・削除

## 🔗 リポジトリ情報

- **GitHub**: https://github.com/kitatatu-git/books
- **ブランチ**: `main`

## 📝 注意事項

- 初回デプロイ時は、Vercel Postgresがまだ作成されていないため、データベース関連のエラーが発生する可能性があります
- Vercel Postgresを作成して再デプロイすると、正常に動作します
- マイグレーションは`postinstall`スクリプトで自動実行されますが、環境変数が設定されていない場合はスキップされます

## 🆘 トラブルシューティング

### デプロイエラー

- ビルドログを確認
- ローカルで`npm run build`が成功するか確認

### データベース接続エラー

- Vercel Postgresが作成されているか確認
- 環境変数が設定されているか確認（Settings → Environment Variables）

### マイグレーションエラー

- Vercelダッシュボードで「Redeploy」を実行
- または、ローカルで環境変数を設定してマイグレーションを実行

---

**次のアクション**: Vercelダッシュボード（https://vercel.com）にアクセスして、プロジェクトをインポートしてください！

