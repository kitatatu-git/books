# Supabase クイックスタートガイド

## 📋 ステップバイステップ手順

### ステップ1: Supabaseアカウント作成

1. **Supabaseにアクセス**
   - https://supabase.com を開く
   - 「Start your project」ボタンをクリック

2. **GitHubアカウントでログイン**
   - 「Continue with GitHub」をクリック
   - GitHubアカウントで認証

### ステップ2: 新しいプロジェクトを作成

1. **「New Project」をクリック**

2. **組織を選択または作成**
   - 既存の組織を選択、または新しい組織を作成

3. **プロジェクト設定を入力**
   - **Name**: `hackathon-db` または任意の名前
   - **Database Password**: **強力なパスワードを設定**（必ずメモしてください！）
     - 例: `MySecurePassword123!@#`
   - **Region**: `Northeast Asia (Tokyo)` を選択（日本に近い）
   - **Pricing Plan**: Free を選択（無料プラン）

4. **「Create new project」をクリック**
   - プロジェクトの作成には2-3分かかります
   - 「Setting up your project...」と表示されます

### ステップ3: 接続文字列を取得

プロジェクトが作成されたら：

1. **左サイドバーで「Settings」（歯車アイコン）をクリック**

2. **「Database」を選択**

3. **「Connection string」セクションを開く**

4. **「URI」タブを選択**

5. **接続文字列をコピー**
   - 例: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - **重要**: `[YOUR-PASSWORD]`の部分を、ステップ2で設定したパスワードに**置き換える**
   - 例: `postgresql://postgres:MySecurePassword123!@#@db.xxxxx.supabase.co:5432/postgres`

### ステップ4: Vercelに環境変数を設定

1. **Vercelダッシュボードでプロジェクトを開く**

2. **「Settings」タブを開く**

3. **左サイドバーで「Environment Variables」を選択**

4. **新しい環境変数を追加**
   - **Key**: `POSTGRES_URL`
   - **Value**: ステップ3で取得した接続文字列（パスワードを置き換えたもの）
   - **Environment**: 以下すべてにチェック
     - ✅ Production
     - ✅ Preview
     - ✅ Development

5. **「Save」をクリック**

### ステップ5: マイグレーションを実行

#### 方法A: ローカルで実行（推奨）

1. **`.env.local`ファイルを作成**
   ```bash
   echo "POSTGRES_URL=your_supabase_connection_string" > .env.local
   ```
   （`your_supabase_connection_string`を実際の接続文字列に置き換える）

2. **マイグレーションを実行**
   ```bash
   npm run db:reflect
   drizzle-kit migrate
   ```

#### 方法B: Vercelで自動実行

1. **Vercelダッシュボードで「Deployments」タブを開く**

2. **最新のデプロイメントの「...」メニューから「Redeploy」を選択**

3. **デプロイが完了するのを待つ**
   - `postinstall`スクリプトが自動的に実行されます

### ステップ6: 動作確認

1. **デプロイが完了したら、プロジェクトのURLにアクセス**
   - 例: `https://your-project.vercel.app`

2. **アプリケーションが正常に表示されることを確認**

3. **機能をテスト**
   - ユーザー登録
   - ログイン
   - データの作成・読み取り・更新・削除

## ✅ 完了チェックリスト

- [ ] Supabaseアカウントを作成
- [ ] プロジェクトを作成
- [ ] 接続文字列を取得（パスワードを置き換える）
- [ ] Vercelに環境変数`POSTGRES_URL`を設定
- [ ] マイグレーションを実行
- [ ] デプロイが完了
- [ ] アプリケーションが正常に動作

## 🆘 トラブルシューティング

### 接続エラー

- パスワードが正しく置き換えられているか確認
- 接続文字列に特殊文字が含まれている場合、URLエンコードが必要な場合があります
- Supabaseプロジェクトが作成完了しているか確認（2-3分かかります）

### マイグレーションエラー

- 環境変数が正しく設定されているか確認
- ローカルで`.env.local`ファイルが正しく作成されているか確認
- 接続文字列が正しいか確認

### デプロイエラー

- Vercelのビルドログを確認
- 環境変数が設定されているか確認

---

**次のアクション**: Supabaseにアクセスして、アカウントを作成してください！
https://supabase.com

