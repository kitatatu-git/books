---
title: Next.js 16 App Router Reference
description: Next.js 16 App Router の初心者向けリファレンス
---

# Next.js 16 App Router Reference

## 1. Overview & Quickstart

### 1.1 Library summary

* Library name: `Next.js 16 App Router`

* Primary domain / purpose (1–2 sentences):
  React ベースのフルスタック Web フレームワーク。`app/` ディレクトリと React Server Components を使って、ルーティング・データ取得・API・プリレンダリングを一体的に扱う。

* Typical tasks (up to 5 items):

  * ページとレイアウトの定義（`app/` ルーティング）
  * Server Component でのデータ取得とプリレンダリング、および Server Actions による書き込み処理
  * Route Handler による API エンドポイントの実装
  * メタデータ・OG 画像・アイコンの管理
  * キャッシュ・再検証（`next.revalidate`, `"use cache"` など）

### 1.2 Minimal working example

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

// app/page.tsx  → "/"
export default function Page() {
  return <h1>Hello Next.js 16 App Router</h1>;
}
```

### 1.3 API quick reference (top N frequently used APIs)

<apiQuickReference>
  <api>
    <name>app/layout.tsx (RootLayout)</name>
    <kind>component</kind>
    <summary>全ルートを包むルートレイアウト。`&lt;html&gt;` / `&lt;body&gt;` を定義。</summary>
    <sectionRef>3.1</sectionRef>
  </api>
  <api>
    <name>app/**/page.tsx</name>
    <kind>component</kind>
    <summary>各 URL パスに対応するページコンポーネント（Server Component が基本）。</summary>
    <sectionRef>3.1</sectionRef>
  </api>
  <api>
    <name>Link (from "next/link")</name>
    <kind>component</kind>
    <summary>クライアントサイド遷移とプリフェッチ付きナビゲーションリンク。</summary>
    <sectionRef>3.2</sectionRef>
  </api>
  <api>
    <name>useRouter (from "next/navigation")</name>
    <kind>function</kind>
    <summary>クライアントコンポーネントからのルーター操作（push/replace/refresh 等）。</summary>
    <sectionRef>3.2</sectionRef>
  </api>
  <api>
    <name>Route Handlers (route.ts)</name>
    <kind>function</kind>
    <summary>`GET`/`POST` など HTTP メソッド関数を export して API ルートを定義。</summary>
    <sectionRef>3.3</sectionRef>
  </api>
  <api>
    <name>Server Actions (`"use server"`)</name>
    <kind>function</kind>
    <summary>フォーム送信やボタン操作から直接呼び出すサーバー専用関数。DB 更新などのミューテーションを API ルートなしで実装。</summary>
    <sectionRef>3.3</sectionRef>
  </api>
</apiQuickReference>

---

## 2. Core Concepts & Natural Language Mapping

### 2.1 Core concepts (mental model)

<coreConcepts>
  <concept>
    <name>App Router</name>
    <category>routing system</category>
    <description>`app/` ディレクトリを使うファイルベースルーティング。レイアウト・ページ・エラー・ローディングを階層的に構成する。</description>
    <relatedTypes>
      <typeRef>app/layout.tsx</typeRef>
      <typeRef>app/**/page.tsx</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>Server Component</name>
    <category>component kind</category>
    <description>デフォルトのコンポーネント種別。サーバーで実行され、DB・外部 API へのアクセスや `fetch` が可能。</description>
    <relatedTypes>
      <typeRef>app/**/page.tsx</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>Client Component</name>
    <category>component kind</category>
    <description>`"use client"` を先頭に付けたコンポーネント。ブラウザ側で実行され、`useState` などの React Hooks と DOM 操作が可能。</description>
    <relatedTypes>
      <typeRef>components/**.tsx</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>Route Handler</name>
    <category>operation</category>
    <description>`app/**/route.ts` に定義する HTTP ハンドラ。API エンドポイントとして動作する。</description>
    <relatedTypes>
      <typeRef>GET/POST 関数</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>Server Action</name>
    <category>operation</category>
    <description>`"use server"` を付けたサーバー専用関数。フォームやクライアントコンポーネントから呼び出し、DB 更新やキャッシュ再検証などのミューテーションを行う。</description>
    <relatedTypes>
      <typeRef>`"use server"` 関数</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>Metadata</name>
    <category>configuration</category>
    <description>`export const metadata` や `generateMetadata` によってページごとのタイトル・説明・OG 画像などを定義。</description>
    <relatedTypes>
      <typeRef>Metadata 型</typeRef>
    </relatedTypes>
  </concept>
</coreConcepts>

### 2.2 Concept–type mapping

<termToTypeMapping>
  <entry>
    <term>ページ</term>
    <meaning>特定の URL に対応する画面</meaning>
    <primaryType>`app/**/page.tsx`</primaryType>
  </entry>
  <entry>
    <term>レイアウト</term>
    <meaning>複数ページを包む共通枠組み</meaning>
    <primaryType>`app/**/layout.tsx`</primaryType>
  </entry>
  <entry>
    <term>API ルート</term>
    <meaning>JSON 等を返すバックエンドエンドポイント</meaning>
    <primaryType>`app/**/route.ts` の HTTP 関数</primaryType>
  </entry>
  <entry>
    <term>書き込み / ミューテーション</term>
    <meaning>フォーム送信やボタン操作によるデータ更新</meaning>
    <primaryType>Server Actions（`"use server"` 関数）と、外部クライアント向けには Route Handlers</primaryType>
  </entry>
</termToTypeMapping>

### 2.3 Natural language → API candidates

* Intent group: 「ページやルートを追加したい」

  * Example user phrases:

    * 「`/about` ページを作りたい」
    * 「共通ヘッダー付きのダッシュボード配下ページが欲しい」
  * Typical APIs:

    * `app/about/page.tsx`
    * `app/dashboard/layout.tsx`
    * `app/dashboard/page.tsx`

* Intent group: 「画面から遷移・API を呼びたい」

  * Example user phrases:

    * 「ボタン押下で `/dashboard` に遷移したい」
    * 「`/api/hello` を実装したい」
  * Typical APIs:

    * `Link` / `useRouter`
    * `app/api/hello/route.ts` の `GET()` 関数

* Intent group: 「フォームからデータを保存・更新したい」

  * Example user phrases:

    * 「入力フォームから DB に保存したい」
    * 「ボタン押下でサーバー側の処理を実行したい」
  * Typical APIs:

    * Server Actions（`"use server"` 関数を `<form action={...}>` などから呼び出す）
    * `useActionState`（クライアント側のフォーム状態管理）
    * 必要に応じて `revalidateTag` / `updateTag` などのキャッシュ再検証

### 2.4 Terminology disambiguation

* Term: 「コンポーネント」

  * General meaning: React の再利用可能な UI 部品全般。
  * In this library: Server Component と Client Component の 2 種があり、動作環境と使える API が異なる。

* Term: 「キャッシュ」

  * General meaning: データやレスポンスの一時保存。
  * In this library: `fetch` のキャッシュ（Data Cache）と、ルートのプリレンダリングキャッシュ、`"use cache"` による関数・コンポーネントのキャッシュが別々に存在する。

---

## 3. Patterns (Intent → Code Cookbook)

### 3.1 Task: 新しいページとレイアウトを作る

#### 3.1.1 User intents (examples)

* 「トップページと共通レイアウトを定義したい」
* 「`/dashboard` 配下をサイドバー付きにしたい」
* 「App Router の最小構成を知りたい」

#### 3.1.2 Correct pattern (Good)

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header>My App</header>
        <main>{children}</main>
      </body>
    </html>
  );
}

// app/page.tsx  → "/"
export default function Page() {
  return <h1>Home</h1>;
}

// app/dashboard/layout.tsx  → "/dashboard" 配下レイアウト
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <section>{children}</section>
    </div>
  );
}

// app/dashboard/page.tsx  → "/dashboard"
export default function DashboardPage() {
  return <p>Dashboard</p>;
}
```

* Explanation (why this is correct):
  URL セグメントごとにフォルダを切り、`layout.tsx` で共通枠を定義し、`page.tsx` で実際のページを定義している。`RootLayout` はアプリ全体を一つだけ包み、子レイアウトはその配下パスのみに作用する。

#### 3.1.3 Typical mistake (Bad)

```tsx
// app/page.tsx
export default function Page() {
  // ❌ ページの中で <html> / <body> を定義してしまう
  return (
    <html>
      <body>
        <h1>Home</h1>
      </body>
    </html>
  );
}
```

* Why this is wrong:
  `<html>` / `<body>` は `RootLayout` でのみ定義する必要があり、ページ内で定義すると DOM 構造と App Router の前提が崩れる。

#### 3.1.4 Variations

* Variation A: 動的ルート (`/blog/[slug]`)

  ```tsx
  // app/blog/[slug]/page.tsx
  type Params = { slug: string };

  export default async function BlogPostPage({
    params,
  }: {
    params: Promise<Params>;
  }) {
    const { slug } = await params;
    return <h1>Post: {slug}</h1>;
  }
  ```

* Variation B: ネストしたレイアウトのみを追加

  ```tsx
  // app/settings/layout.tsx
  import type { ReactNode } from 'react';

  export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
      <div>
        <h2>Settings</h2>
        {children}
      </div>
    );
  }
  ```

#### 3.1.5 Related APIs

* `app/layout.tsx`
* `app/**/layout.tsx`
* `app/**/page.tsx`

---

### 3.2 Task: クライアントからの遷移と API ルート実装

#### 3.2.1 User intents (examples)

* 「リンクでページ間を移動したい」
* 「ボタンでプログラム的に別ページへ遷移したい」
* 「`/api/hello` で JSON を返したい」

#### 3.2.2 Correct pattern (Good)

```tsx
// app/components/Nav.tsx
import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}

// app/components/GoDashboardButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function GoDashboardButton() {
  const router = useRouter();
  return <button onClick={() => router.push('/dashboard')}>Go</button>;
}

// app/api/hello/route.ts  → "/api/hello"
export async function GET() {
  return Response.json({ message: 'Hello' });
}
```

* Explanation (why this is correct):
  表示専用リンクには `Link` を使い、イベントハンドラからの遷移には Client Component + `useRouter` を使う。API ルートは `app/api/**/route.ts` に HTTP メソッド関数を export して定義する。JSON API が必要なときや外部クライアントから叩かれる場合は Route Handler、アプリ内部のフォーム送信だけで完結する場合は Server Actions を使うと整理しやすい。

#### 3.2.3 Typical mistake (Bad)

```tsx
// ❌ クライアントコンポーネントで生の fetch で自前の遷移やフルリロードを行う
'use client';

export default function Bad() {
  return (
    <button
      onClick={() => {
        window.location.href = '/dashboard'; // SPA のメリットを失う
      }}
    >
      Go
    </button>
  );
}
```

* Why this is wrong:
  `window.location.href` はフルリロードとなり、Next.js のルーターやプリフェッチを活かせない。`useRouter` や `Link` を使う方が、高速で一貫した遷移になる。

#### 3.2.4 Variations

* Variation A: Route Handler でクエリパラメータを扱う

  ```tsx
  // app/api/echo/route.ts
  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text') ?? '';
    return Response.json({ text });
  }
  ```

* Variation B: 動的セグメント付き API (`/api/post/[id]`)

  ```tsx
  // app/api/post/[id]/route.ts
  export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const { id } = await params;
    return Response.json({ id });
  }
  ```

#### 3.2.5 Related APIs

* `Link` (`next/link`)
* `useRouter` (`next/navigation`)
* Route Handlers (`app/**/route.ts`)

---

### 3.3 Task: フォームからサーバー側でデータを処理する（Server Actions の最小例）

#### 3.3.1 Correct pattern (Good)

```ts
// app/actions.ts
'use server';

export async function createTodo(formData: FormData) {
  const title = (formData.get('title') as string | null) ?? '';
  if (!title.trim()) return { ok: false };

  // ここで DB や外部サービスに保存する
  // await db.todo.create({ data: { title } });

  return { ok: true };
}
```

```tsx
// app/page.tsx
import { createTodo } from './actions';

export default function Page() {
  return (
    <form action={createTodo}>
      <input name="title" />
      <button type="submit">追加</button>
    </form>
  );
}
```

* Explanation (why this is correct):
  `"use server"` 付きの関数を Server Action として定義し、その関数を `<form>` の `action` に渡している。HTTP API のエンドポイント（Route Handler）を別途作らなくても、フォーム送信に応じてサーバー側で直接処理を実行できる。処理は常にサーバーで実行され、クライアントには実装詳細が送られない。

---

## 4. Troubleshooting & Anti-Patterns

### 4.1 Error catalogue

#### 4.1.1 Error: `Error: useState can only be used in a Client Component`

* Symptom: `useState` や `useEffect` を使ったページが、このエラーメッセージとともにビルド/実行エラーになる。
* Cause: Server Component（`"use client"` がないファイル）内でクライアント専用 Hooks を使っている。

Before (causes error):

```tsx
// app/page.tsx
import { useState } from 'react';

export default function Page() {
  const [count, setCount] = useState(0); // ❌ Server Component で useState
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

After (fixed):

```tsx
// app/components/Counter.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// app/page.tsx
import Counter from './components/Counter';

export default function Page() {
  return <Counter />;
}
```

### 4.2 Global anti-patterns

* ❌ Anti-pattern: すべてを Client Component にしてしまう

  * Why it's bad: サーバーで処理できる部分までクライアントに送られ、バンドルサイズや初期描画が重くなる。
  * ✅ Use instead:

    ```tsx
    // データ取得やレイアウトは Server Component で行い、
    // 本当に必要なインタラクティブ部分だけ 'use client' に分離する。
    ```

* ❌ Anti-pattern: ページごとにバラバラな `<html>` / `<body>` を定義する

  * Why it's bad: App Router の構造と矛盾し、エラーや予期しない DOM になる。
  * ✅ Use instead:

    ```tsx
    // app/layout.tsx で一度だけ <html> / <body> を定義する。
    ```

---

## 5. Design Notes & Constraints

### 5.1 Design philosophy

* Goals:

  * Next.js 16 App Router ベースのコード生成を、1 ファイルの参照で完結させる。
  * サーバー/クライアントの役割分担と、ファイル構造 → URL の対応を明確にする。

* Non-goals (explicitly not supported):

  * Pages Router (`pages/` + `getServerSideProps` 等) の詳細なパターン。
  * Next.js 12 以前の古い SSR/SSG API のサポート。

### 5.2 Supported vs unsupported use cases

* Supported use cases:

  * `app/` ディレクトリを使った新規 Next.js 16 プロジェクトのページ・レイアウト・API 定義。
  * Server/Client コンポーネントを分けた基本的な UI・ナビゲーション・データ取得。

* Not supported / discouraged use cases:

  * `pages/` と `app/` を混在させた複雑な移行戦略の詳細設計。
  * 低レベルなビルドパイプライン拡張や、非推奨オプションに依存した構成。
