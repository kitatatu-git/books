# データベース選択ガイド

## ✅ 正しい選択：通常の「Postgres」

このプロジェクトは**Drizzle ORM**を使用しているため、**通常の「Postgres」**を選択してください。

## 📋 選択肢の違い

### 「Postgres」（推奨・こちらを選択）
- ✅ 汎用的なPostgreSQLデータベース
- ✅ Drizzle ORMと互換性あり
- ✅ このプロジェクトに最適
- ✅ 環境変数: `POSTGRES_URL`が自動設定される

### 「Prisma Postgres」（選択しない）
- ❌ Prisma専用のデータベース
- ❌ Prisma ORMを使用している場合のみ
- ❌ このプロジェクトでは使用しない

## 🔍 確認方法

VercelのStorageタブで：
- 「**Postgres**」を選択（Prisma Postgresではない）
- または「**PostgreSQL**」と表示されている場合も同じ

## ✅ 正しい手順

1. Vercelダッシュボードで「Storage」タブを開く
2. 「Create Database」をクリック
3. **「Postgres」**を選択（Prisma Postgresではない）
4. データベース名とリージョンを設定
5. 「Create」をクリック

これで、`POSTGRES_URL`環境変数が自動的に設定され、Drizzle ORMが正常に動作します。

---

**結論**: 「**Postgres**」（通常のPostgres）を選択してください！

