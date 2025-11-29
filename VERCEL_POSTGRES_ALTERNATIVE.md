# Vercel Postgres 追加方法（代替案）

## 🔍 方法1: Storageタブから直接作成

1. プロジェクトページで「**Storage**」タブを開く
2. 「**Create Database**」または「**+ New Database**」ボタンを探す
3. データベースタイプを選択する画面で「**Postgres**」を探す
4. もしくは「**Browse all databases**」や「**View all**」をクリック

## 🔍 方法2: プロジェクト設定から

1. プロジェクトページで「**Settings**」タブを開く
2. 左サイドバーで「**Storage**」または「**Databases**」を探す
3. 「**Create Database**」ボタンをクリック

## 🔍 方法3: Vercel CLIから作成

ターミナルで以下のコマンドを実行：

```bash
# プロジェクトにリンク（まだの場合）
vercel link

# Postgresデータベースを作成
vercel postgres create
```

対話形式で以下を設定：
- データベース名
- リージョン

## 🔍 方法4: ダッシュボードのトップレベルから

1. Vercelダッシュボードのトップページ（プロジェクト一覧）に移動
2. 上部の「**Storage**」タブをクリック
3. 「**Create Database**」をクリック
4. 「**Postgres**」を選択

## 🔍 方法5: 外部PostgreSQLサービスを使用

もしVercel Postgresが利用できない場合、外部サービスを使用することもできます：

### Supabase（推奨・無料プランあり）

1. https://supabase.com でアカウント作成
2. 新しいプロジェクトを作成
3. 「Settings」→「Database」で接続文字列を取得
4. Vercelの環境変数に `POSTGRES_URL` を設定

### Neon（推奨・無料プランあり）

1. https://neon.tech でアカウント作成
2. 新しいプロジェクトを作成
3. 接続文字列を取得
4. Vercelの環境変数に `POSTGRES_URL` を設定

## 📸 確認事項

Vercelダッシュボードで以下を確認してください：

1. **プロジェクトページの上部タブ**
   - Overview, Deployments, Analytics, **Storage**, Settings など

2. **左サイドバー**
   - Storage や Databases の項目があるか

3. **Storageタブの中**
   - 「Create Database」ボタン
   - 「+ New」ボタン
   - 「Browse Marketplace」リンク

## 💡 推奨：Vercel CLIを使用

最も確実な方法は、Vercel CLIを使用することです：

```bash
# 1. Vercelにログイン（まだの場合）
vercel login

# 2. プロジェクトにリンク
vercel link

# 3. Postgresを作成
vercel postgres create
```

これで対話形式でデータベースを作成できます。

---

**次のアクション**: 
1. まずVercel CLIで試してみる（最も確実）
2. または、Storageタブの詳細を確認
3. それでも見つからない場合は、Supabaseなどの外部サービスを使用

