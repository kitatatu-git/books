# Hackathon Template

## テックスタック

- **Claude Code** - コーディングエージェント（プログラミングに特化したAI）
- **Next.js 16** - Reactフレームワーク（App Router）
- **Tailwind CSS 4** - CSSフレームワーク
- **SQLite (better-sqlite3)** - 軽量データベース
- **Vitest** - テストフレームワーク

## セットアップ

```bash
# 1. プロジェクトのダウンロード
git clone https://github.com/crandim-ai-hackathon/hackathon-template.git

cd hackathon-template

# 2. パッケージ等のインストール
npm install

# 3. サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くとアプリケーションが表示されます。
`src/app/page.tsx` を編集すると、自動的に変更が反映されます。

## ディレクトリ構造

```
./
├─ _ISSUEs/  # 開発タスクを整理するためのメモ群
├─ _REFs/    # ライブラリの使い方などのリファレンスメモ群
│
├─ public/    # 静的ファイル(画像など)を置く場所
│
├─ src/       # ソースコードを置く場所
│  ├─ app/          # ページ・API 定義（App Router）
│  ├─ components/   # 再利用可能な UI コンポーネント
│  ├─ lib/          # サーバーロジック・ユーティリティ
│  ├─ db/           # データベース関連
│  └─ types/        # 型定義
│
└─ CLAUDE.md  # Claudeに伝える定型指示文
```

## データベース

SQLite を使用しています。データベースファイルは `storage/` フォルダに保存されます。

スキーマの変更時は以下の手順を実行：

1. `src/db/schema.ts` を編集
2. `npm run db:reflect` でマイグレーションを生成・適用
