# Supabaseを使用したPostgreSQLセットアップ（代替案）

Vercel Postgresが見つからない場合、**Supabase**を使用する方法です。無料プランがあり、設定も簡単です。

## 📋 手順

### ステップ1: Supabaseアカウントを作成

1. https://supabase.com にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでログイン

### ステップ2: 新しいプロジェクトを作成

1. 「New Project」をクリック
2. プロジェクト設定：
   - **Name**: 任意の名前（例: `hackathon-db`）
   - **Database Password**: 強力なパスワードを設定（後で使用します）
   - **Region**: 日本に近いリージョンを選択
     - 推奨: `Northeast Asia (Tokyo)` または `Southeast Asia (Singapore)`
3. 「Create new project」をクリック
4. プロジェクトの作成完了を待つ（数分かかります）

### ステップ3: 接続文字列を取得

1. プロジェクトページで「**Settings**」（歯車アイコン）をクリック
2. 左サイドバーで「**Database**」を選択
3. 「**Connection string**」セクションを開く
4. 「**URI**」タブを選択
5. 接続文字列をコピー（例: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`）
   - `[YOUR-PASSWORD]`の部分を、ステップ2で設定したパスワードに置き換える

### ステップ4: Vercelに環境変数を設定

1. Vercelダッシュボードでプロジェクトを開く
2. 「**Settings**」タブを開く
3. 左サイドバーで「**Environment Variables**」を選択
4. 新しい環境変数を追加：
   - **Key**: `POSTGRES_URL`
   - **Value**: Supabaseからコピーした接続文字列（パスワードを置き換えたもの）
   - **Environment**: Production, Preview, Development すべてにチェック
5. 「**Save**」をクリック

### ステップ5: マイグレーションを実行

#### 方法A: ローカルで実行（推奨）

1. ローカルで`.env.local`ファイルを作成：
   ```bash
   echo "POSTGRES_URL=your_supabase_connection_string" > .env.local
   ```
   （`your_supabase_connection_string`を実際の接続文字列に置き換える）

2. マイグレーションを実行：
   ```bash
   npm run db:reflect
   drizzle-kit migrate
   ```

#### 方法B: Vercelで実行

1. Vercelダッシュボードで「**Deployments**」タブを開く
2. 最新のデプロイメントの「**...**」メニューから「**Redeploy**」を選択
3. これにより、`postinstall`スクリプトが実行されます

### ステップ6: 動作確認

1. デプロイが完了したら、プロジェクトのURLにアクセス
2. アプリケーションが正常に動作することを確認

## ✅ メリット

- ✅ 無料プランあり（500MBデータベース、2GB転送）
- ✅ 設定が簡単
- ✅ ダッシュボードでデータを確認できる
- ✅ Vercel Postgresが見つからない場合の代替として最適

## 🔍 Supabaseダッシュボード

Supabaseのダッシュボードから：
- テーブルを確認
- データを直接編集
- SQLエディタでクエリを実行
- APIドキュメントを確認

## 🆘 トラブルシューティング

### 接続エラー

- パスワードが正しく置き換えられているか確認
- 接続文字列が正しいか確認
- Supabaseプロジェクトが作成完了しているか確認

### マイグレーションエラー

- 環境変数が正しく設定されているか確認
- ローカルで`.env.local`ファイルが正しく作成されているか確認

---

**この方法で、Vercel Postgresが見つからない場合でも、PostgreSQLデータベースを使用できます！**

