# 指示書

@README.md

---

## プロジェクトの説明

開発にはISSUE駆動開発を採用しています。
各ISSUEは`_ISSUEs/`に保管されています。

貴方への依頼には、ISSUEドキュメントの執筆が含まれます。
その際は各ディレクトリのテンプレートを参照してください。

また、各テックスタックの最新リファレンスを`_REFs`に配置しています。
* Next.js v16 App Routerについて
* Tailwind CSS w/ Reactについて
* Better-SQLite3について

---

## 実装での注意点

* パッケージをインストールする必要がある場合
    * 必ず**コマンドを利用して**インストールすること。
    * パッケージ管理ファイル(package.json等)を編集して追加しないこと。

* 実装を含むTODOタスクが１つ完了する度、以下を実施する。
    * ビルドしてエラー・警告が出ないことを確認する。
    * Git Commit Rule に従い、commitする。

* ISSUE対応が完了した後、以下を実施する。
    * 対象IssueのステータスをClosedに変更する。
    * Versioning Rule に従い、バージョンを変更する。
    * Changelog Rule に従い、_ISSUEs/CHANGELOG.mdに今回の対応を記録する。
    * 実施対応に基づいて、Related WIKIを更新する。

---

## Versioning Rule

原則として、Zero Versioning（0.MINOR.PATCH）に従う。
以下の適用ルールと変更内容を照らし合わせて、妥当だと考えられる箇所を+1する。

### 適用ルール
* 後方互換性のない変更 → MINOR +1 
* 後方互換性のある機能追加 → MINOR +1
* 後方互換性のあるバグ修正・リファクタ → PATCH +1

---

## Git Commit Rule

Conventional Commitsの原則に従い、`<type>: <subject>\n<description>`の形式をとる。
すべて**日本語で**記述する。

```template
<type>: <subject>

<!-- description: 変更内容を箇条書きで列挙してください。 -->
<!-- ISSUEステータスの変更やCHANGELOGの記述はdescに含みません。 -->

Issue: IXX
Version: x.y.z
```

### <type>一覧
* feat: 機能の追加・変更
* fix: バグ修正
* docs: ドキュメントに関する変更
* style: 意味を変えないコードの整形
* refactor: 挙動を変えないコードの改善
* perf: 性能改善
* test: テスト関連の追加・修正
* build: ビルドや依存関係
* ci: CI 設定・スクリプト
* revert: 取り消しコミット
* chore: 上記に当てはまらない事象

### <subject>の書き方
変更内容を簡潔に表す。
複数種類の変更が加わっている場合、`<最も大きな変更> + etc.`とする。

### <description>の書き方
変更内容を列挙する。Issue Statusの変更、バージョンの更新は変更内容に含まない。
対応するIssue, バージョン番号がある場合、それを記述する。

---

## Changelog Rule

以下のテンプレートに従って、**日本語で**記入する。
降順に並んでおり、新しいログは上に記載する。

**template**
```
## ［YYYY-MM-DD］
<!-- 同じ日に複数の項目がある場合は、この日付見出しを再利用してください。 -->

### I{number}_{ShortTitle} - Closed

<!-- 何が変更され、どのようにユーザー体験が改善されたかを一文でまとめてください。 -->

<!-- 改善内容を箇条書きで簡潔に記載してください。 -->
<!-- Issue Statusの変更、バージョンの更新は改善内容に含まない。 -->

Version: x.y.z

---
```
