---
title: SQLite + better-sqlite3 リファレンス
description: Node.js から SQLite を同期的に扱うための最小限の実践リファレンス。
---

# better-sqlite3 Reference

## 1. Overview & Quickstart

### 1.1 Library summary

* Library name: `better-sqlite3`

* Primary domain / purpose (1–2 sentences):
  Node.js から SQLite データベースファイルへ **同期的に** 高速アクセスするためのライブラリ。サーバープロセス不要の組み込み DB を、小さなアプリやツールからシンプルに使うための薄いラッパー。

* Typical tasks (up to 5 items):

  * SQLite ファイルへの接続・初期化（`CREATE TABLE` など）
  * プリペアドステートメントでの `INSERT / UPDATE / DELETE`
  * 1件/複数件の `SELECT` 実行と結果取得
  * トランザクションで複数クエリをまとめて実行
  * PRAGMA による動作モード調整（WAL など）

### 1.2 Minimal working example

```js
// app.js
const Database = require('better-sqlite3');
const db = new Database('app.db');

// 初期化
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);

// INSERT
const insert = db.prepare(
  'INSERT INTO users (name, email) VALUES (?, ?)'
);
const info = insert.run('Alice', '[email protected]');

// SELECT 1件
const getUser = db.prepare('SELECT * FROM users WHERE id = ?');
const user = getUser.get(info.lastInsertRowid);
console.log(user);

db.close();
```

### 1.3 API quick reference (top N frequently used APIs)

<apiQuickReference>
  <api>
    <name>new Database(path, options?)</name>
    <kind>class</kind>
    <summary>SQLite ファイルに同期接続するエントリポイント。戻り値が Database オブジェクト。</summary>
    <sectionRef>3.1</sectionRef>
  </api>
  <api>
    <name>db.prepare(sql)</name>
    <kind>method</kind>
    <summary>SQL 文字列からプリペアドステートメントを生成して Statement を返す。</summary>
    <sectionRef>3.1</sectionRef>
  </api>
  <api>
    <name>stmt.run(params...)</name>
    <kind>method</kind>
    <summary>結果セットを返さないクエリ（INSERT/UPDATE/DELETE）を実行し、changes / lastInsertRowid を返す。</summary>
    <sectionRef>3.1</sectionRef>
  </api>
  <api>
    <name>stmt.get(params...)</name>
    <kind>method</kind>
    <summary>SELECT 結果から 1 行だけ取得。見つからなければ undefined。</summary>
    <sectionRef>3.1</sectionRef>
  </api>
  <api>
    <name>db.transaction(fn)</name>
    <kind>method</kind>
    <summary>fn 内の処理を 1 トランザクションとして実行するラッパ関数を生成。</summary>
    <sectionRef>3.2</sectionRef>
  </api>
</apiQuickReference>

---

## 2. Core Concepts & Natural Language Mapping

### 2.1 Core concepts (mental model)

<coreConcepts>
  <concept>
    <name>Database</name>
    <category>entity</category>
    <description>SQLite ファイルへの 1 つの接続。`new Database(...)` の戻り値で、クエリ実行の入口になる。</description>
    <relatedTypes>
      <typeRef>Database</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>Statement</name>
    <category>entity</category>
    <description>`db.prepare(sql)` で作られるプリペアドステートメント。`run/get/all` などでパラメータを与えて実行する。</description>
    <relatedTypes>
      <typeRef>Statement</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>Transaction</name>
    <category>operation</category>
    <description>`db.transaction(fn)` で作られる、複数クエリをまとめて成功/失敗させる単位。途中で例外が出ると自動ロールバックされる。</description>
    <relatedTypes>
      <typeRef>Function &lt;T&gt;(args) =&gt; T</typeRef>
    </relatedTypes>
  </concept>
</coreConcepts>

### 2.2 Concept–type mapping

<termToTypeMapping>
  <entry>
    <term>DB接続</term>
    <meaning>SQLite ファイルを開き、以降のクエリ実行に使うオブジェクト。</meaning>
    <primaryType>Database</primaryType>
  </entry>
  <entry>
    <term>ステートメント</term>
    <meaning>SQL をコンパイルした実行準備済みオブジェクト。パラメータを変えながら繰り返し使える。</meaning>
    <primaryType>Statement</primaryType>
  </entry>
  <entry>
    <term>トランザクション</term>
    <meaning>複数の更新系クエリを 1 まとまりとして扱う処理単位。</meaning>
    <primaryType>ReturnType&lt;Database["transaction"]&gt;</primaryType>
  </entry>
</termToTypeMapping>

### 2.3 Natural language → API candidates

* Intent group: 「DB ファイルを開いてシンプルに CRUD したい」

  * Example user phrases:

    * 「SQLite ファイルを開いてテーブルを作りたい」
    * 「ユーザーを追加して 1 件取得するコードがほしい」
  * Typical APIs:

    * `new Database(path, options?)`
    * `db.exec`, `db.prepare`, `stmt.run`, `stmt.get`

* Intent group: 「複数行の更新をまとめて安全に行いたい」

  * Example user phrases:

    * 「複数ユーザーを 1 トランザクションで登録したい」
    * 「途中で失敗したら全部ロールバックしてほしい」
  * Typical APIs:

    * `db.transaction`
    * `db.prepare`, `stmt.run`

### 2.4 Terminology disambiguation

* Term: 「トランザクション」

  * General meaning: 一連の処理を 1 単位として扱うこと全般。
  * In this library: `db.transaction(fn)` で作られる「ラップ関数」の中で実行される SQLite のトランザクション単位。fn 内で例外が投げられると自動ロールバックされる。

* Term: 「rowid」

  * General meaning: テーブルの行を一意に識別する内部 ID。
  * In this library: `stmt.run()` の戻り値 `lastInsertRowid` として参照できる、最後に挿入された行の ID。`INTEGER PRIMARY KEY` カラムにもマップされる。

---

## 3. Patterns (Intent → Code Cookbook)

### 3.1 Task: SQLite ファイルの基本 CRUD

#### 3.1.1 User intents (examples)

* 「SQLite ファイルに接続して、テーブル作って 1 行入れて読みたい」
* 「Node.js から同期的に INSERT / SELECT したい」
* 「プリペアドステートメントの最小例が知りたい」

#### 3.1.2 Correct pattern (Good)

```js
const Database = require('better-sqlite3');
const db = new Database('app.db');

// 初期化は exec で一括
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);

// prepare は 1 回だけ
const insertUser = db.prepare(
  'INSERT INTO users (name, email) VALUES (?, ?)'
);
const getUserById = db.prepare(
  'SELECT * FROM users WHERE id = ?'
);

// パラメータはバインドで渡す（?）
const info = insertUser.run('Alice', '[email protected]');
const user = getUserById.get(info.lastInsertRowid);

console.log(user);
db.close();
```

* Explanation (why this is correct):

  * `Database` を 1 度だけ生成してアプリ全体で共有している。
  * `db.prepare` を 1 度だけ呼び、`run/get` だけを繰り返すので高速。
  * 値は `?` でバインドしており、SQL 文字列に直接連結していないため、安全（SQL インジェクション対策）。

#### 3.1.3 Typical mistake (Bad)

```js
const Database = require('better-sqlite3');

function createUser(name, email) {
  // ❌ 毎回 DB を開く
  const db = new Database('app.db');

  // ❌ 値をそのまま連結（危険 & 遅い）
  const sql = `
    INSERT INTO users (name, email)
    VALUES ('${name}', '${email}')
  `;
  db.exec(sql);

  db.close();
}
```

* Why this is wrong:

  * 毎回 `new Database` / `close` していて非常に遅いし、複数箇所から呼ぶとロック競合の原因になる。
  * SQL に文字列連結しており、エスケープミスや SQL インジェクションの温床になる。
  * プリペアドステートメントを使っていないため、クエリのコンパイルも毎回やり直しで非効率。

#### 3.1.4 Variations

* Variation A: 名前付きパラメータで可読性を上げる

  ```js
  const insertUser = db.prepare(
    'INSERT INTO users (name, email) VALUES (@name, @email)'
  );

  insertUser.run({
    name: 'Bob',
    email: '[email protected]',
  });
  ```

* Variation B: 複数 INSERT を 1 トランザクションにまとめる

  ```js
  const insertMany = db.transaction((users) => {
    const stmt = db.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?)'
    );
    for (const u of users) {
      stmt.run(u.name, u.email);
    }
  });

  insertMany([
    { name: 'Carol', email: '[email protected]' },
    { name: 'Dave',  email: '[email protected]' },
  ]);
  ```

#### 3.1.5 Related APIs

* `Database` コンストラクタ
* `db.exec`
* `db.prepare`
* `Statement.run`
* `Statement.get`
* `db.transaction`

---

## 4. Troubleshooting & Anti-Patterns

### 4.1 Error catalogue

#### 4.1.1 Error: `SQLITE_ERROR: no such table: users`

* Symptom: `SELECT * FROM users` などを実行した際に、テーブルが存在しないと言われる。
* Cause: アプリ起動時の `CREATE TABLE` が実行されていない、または別 DB ファイルを見ている。

Before (causes error):

```js
const db = new Database('app.db');

const rows = db.prepare('SELECT * FROM users').all();
// ここで "no such table: users"
```

After (fixed):

```js
const db = new Database('app.db');

// 先に初期化を必ず実行
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);

const rows = db.prepare('SELECT * FROM users').all();
```

### 4.2 Global anti-patterns

* ❌ Anti-pattern: 毎回新しい `Database` を生成する

  * Why it's bad:
    接続オーバーヘッドが大きく、ファイルロックの競合やパフォーマンス悪化を招く。マルチプロセスでの同時書き込みが増えると `SQLITE_BUSY` の原因にもなりやすい。
  * ✅ Use instead:

    ```js
    // アプリ起動時に 1 回だけ生成し、共有する
    const Database = require('better-sqlite3');
    const db = new Database('app.db');

    module.exports = db;
    ```

* ❌ Anti-pattern: SQL 文に文字列連結でパラメータを埋め込む

  * Why it's bad:
    クオート漏れでエラーになりやすく、ユーザー入力をそのまま連結すると SQL インジェクションのリスクも高い。
  * ✅ Use instead:

    ```js
    const stmt = db.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?)'
    );
    stmt.run(name, email); // or stmt.run({ name, email }) with named params
    ```

---

## 5. Design Notes & Constraints

### 5.1 Design philosophy

* Goals:

  * Node.js から SQLite を **同期 API** でシンプルに扱えるようにする。
  * プリペアドステートメントとトランザクションを前提に、正しいパターンを最小のコードで表現する。

* Non-goals (explicitly not supported):

  * 高負荷なマルチプロセス/マルチノード構成での大規模トラフィック処理。
  * ORM 的な高度な抽象化（自動マイグレーション、モデル定義など）はカバーしない。

### 5.2 Supported vs unsupported use cases

* Supported use cases:

  * CLI ツール・デスクトップアプリ・小型 Web サービスのローカルストレージ。
  * 単一プロセス（もしくは少数プロセス）からの軽〜中規模な読み書き。

* Not supported / discouraged use cases:

  * 水平スケール前提の巨大トラフィック（専用 RDBMS を検討すべき領域）。
  * 多数プロセスが同一 SQLite ファイルに頻繁に書き込む構成（ロック競合でパフォーマンスが出にくい）。
