---
title: Tailwind CSS v4 (React) Reference
description: React＋ビルド環境前提の Tailwind CSS v4 初心者向けリファレンス
---

# Tailwind CSS v4 Reference

## 1. Overview & Quickstart

### 1.1 Library summary

* Library name: `Tailwind CSS v4`

* Primary domain / purpose (1–2 sentences):
  React などのコンポーネントベース UI 向けの、ユーティリティクラス中心の CSS フレームワーク。
  v4 では設定を CSS（`@import "tailwindcss";` と `@theme`）に寄せ、デザインシステムと実装をシンプルに接続する。

* Typical tasks (up to 5 items):

  * React コンポーネントのレイアウト・色・タイポグラフィのスタイリング
  * レスポンシブレイアウト（モバイル優先）の実装
  * hover / focus / disabled など状態に応じたスタイルの定義
  * ダークモードやブランドカラーを含むデザインシステムの構築（`@theme`）
  * ボタン / カード等のスタイル付き共通コンポーネントの実装

### 1.2 Minimal working example

```tsx
// src/index.css
@import "tailwindcss";

:root {
  color-scheme: light dark;
}

// src/App.tsx
export default function App() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50 flex items-center justify-center">
      <button
        className="
          inline-flex items-center justify-center
          rounded-lg bg-sky-500 px-6 py-3
          text-sm font-semibold text-white shadow-md
          hover:bg-sky-600
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        Tailwind v4 + React
      </button>
    </main>
  );
}
```

### 1.3 API quick reference (top N frequently used APIs)

<apiQuickReference>
  <api>
    <name>Utility classes (layout & spacing)</name>
    <kind>module</kind>
    <summary>flex / grid・余白・サイズを指定するユーティリティ群。</summary>
    <sectionRef>3.1</sectionRef>
  </api>
  <api>
    <name>Variant prefixes</name>
    <kind>module</kind>
    <summary>`hover:` / `focus-visible:` / `sm:` など条件付きスタイル用プレフィックス。</summary>
    <sectionRef>3.1</sectionRef>
  </api>
  <api>
    <name>Dark mode (`dark:`)</name>
    <kind>module</kind>
    <summary>システム or クラスに連動したダークモード用バリアント。</summary>
    <sectionRef>3.3</sectionRef>
  </api>
  <api>
    <name>@theme</name>
    <kind>module</kind>
    <summary>色・フォント・スペーシングなどのテーマトークンを定義する CSS ルール。</summary>
    <sectionRef>3.3</sectionRef>
  </api>
  <api>
    <name>@custom-variant</name>
    <kind>module</kind>
    <summary>`dark` など独自バリアントを CSS から定義する仕組み。</summary>
    <sectionRef>3.3</sectionRef>
  </api>
</apiQuickReference>

---

## 2. Core Concepts & Natural Language Mapping

### 2.1 Core concepts (mental model)

<coreConcepts>
  <concept>
    <name>Utility class</name>
    <category>operation</category>
    <description>単一または少数の CSS プロパティを表すクラス（例: `flex`, `text-sm`, `bg-sky-500`）。組み合わせて UI を構成する基本単位。</description>
    <relatedTypes>
      <typeRef>UtilityClass</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>Variant</name>
    <category>operation</category>
    <description>`hover:` や `md:` のように、状態・メディア条件を表すプレフィックス。`variant:utility` という形でユーティリティに条件を付与する。</description>
    <relatedTypes>
      <typeRef>VariantPrefix</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>Theme token</name>
    <category>entity</category>
    <description>`@theme` 内で定義される CSS 変数（例: `--color-brand-500`, `--spacing`）。`bg-brand-500` や `p-4` などのクラス名として表面化する。</description>
    <relatedTypes>
      <typeRef>ThemeConfig</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>Styled React component</name>
    <category>entity</category>
    <description>`className` に Tailwind ユーティリティを付与した React コンポーネント。ロジックとスタイルを 1 ファイル内に近接させる。</description>
    <relatedTypes>
      <typeRef>ReactComponent</typeRef>
    </relatedTypes>
  </concept>
</coreConcepts>

### 2.2 Concept–type mapping

<termToTypeMapping>
  <entry>
    <term>ボタンコンポーネント</term>
    <meaning>クリック可能な UI 要素全般。</meaning>
    <primaryType>ReactComponent</primaryType>
  </entry>
  <entry>
    <term>レスポンシブ</term>
    <meaning>画面幅に応じてレイアウトが変わる UI。</meaning>
    <primaryType>VariantPrefix</primaryType>
  </entry>
  <entry>
    <term>ブランドカラー</term>
    <meaning>プロダクト固有の色セット。</meaning>
    <primaryType>ThemeConfig</primaryType>
  </entry>
</termToTypeMapping>

### 2.3 Natural language → API candidates

* Intent group: "コンポーネントにそれっぽいスタイルを当てたい"

  * Example user phrases:

    * "このボタンをいい感じにスタイリングしたい"
    * "縦並びから横並びに切り替えたい"

  * Typical APIs:

    * `Utility classes (layout & spacing)`
    * `Variant prefixes`（`hover:`, `md:` など）

* Intent group: "テーマ・ダークモードを制御したい"

  * Example user phrases:

    * "ダークモードで背景と文字色を反転させたい"
    * "ブランドカラーを定義してクラス名で使いたい"

  * Typical APIs:

    * `@theme`
    * `@custom-variant`
    * `dark:` バリアント

### 2.4 Terminology disambiguation

* Term: "テーマ"

  * General meaning: 見た目や雰囲気のセット全般。
  * In this library: `@theme` 内で宣言する CSS 変数群（色・フォント・スペーシング）と、それに対応するユーティリティクラス。

* Term: "コンポーネント"

  * General meaning: UI を構成する再利用可能な部品。
  * In this library: `className` に Tailwind ユーティリティを持つ React コンポーネント（スタイルとロジックが近接した単位）を指すことが多い。

---

## 3. Patterns (Intent → Code Cookbook)

### 3.1 Task: プライマリボタンを実装する

#### 3.1.1 User intents (examples)

* "プライマリボタンを Tailwind で書きたい"
* "hover / focus / disabled の状態までちゃんと定義したい"
* "Button コンポーネントを 1 個作って共通化したい"

#### 3.1.2 Correct pattern (Good)

```tsx
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({ className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={
        [
          'inline-flex items-center justify-center',
          'rounded-md bg-sky-500 px-4 py-2',
          'text-sm font-semibold text-white shadow-sm',
          'hover:bg-sky-600',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          className,
        ].join(' ')
      }
    />
  );
}
```

* Explanation (why this is correct):
  状態ごとに `hover:` / `focus-visible:` / `disabled:` のバリアントを定義し、`className` 末尾に外部からの追記用クラスを受けることで拡張しやすい構造にしている。

#### 3.1.3 Typical mistake (Bad)

```tsx
export function PrimaryButton(props: any) {
  return (
    <button
      {...props}
      className="bg-sky-500 text-white px-4 py-2"
    >
      {props.children}
    </button>
  );
}
```

* Why this is wrong:
  hover / focus / disabled を考慮しておらず、アクセシビリティ面で弱い。`inline-flex` や `rounded` もないため、ボタンとしての一貫した見た目を再利用しづらい。

#### 3.1.4 Variations

* Variation A: アウトラインボタン

  ```tsx
  export function OutlineButton(props: ButtonProps) {
    return (
      <button
        {...props}
        className="
          inline-flex items-center justify-center
          rounded-md border border-sky-500 px-4 py-2
          text-sm font-medium text-sky-600
          hover:bg-sky-50
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
        "
      />
    );
  }
  ```

* Variation B: 危険操作用のデストラクトボタン

  ```tsx
  export function DestructiveButton(props: ButtonProps) {
    return (
      <button
        {...props}
        className="
          inline-flex items-center justify-center
          rounded-md bg-red-600 px-4 py-2
          text-sm font-semibold text-white
          hover:bg-red-700
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500
        "
      />
    );
  }
  ```

#### 3.1.5 Related APIs

* `Utility classes (layout & spacing)`
* `Variant prefixes`（`hover:` / `focus-visible:` / `disabled:`）

---

### 3.2 Task: レスポンシブな 2 カラムレイアウトを作る

#### 3.2.1 User intents (examples)

* "スマホでは縦並び、PC では 2 カラムにしたい"
* "カードをいい感じにグリッドで並べたい"
* "画面幅に応じてカラム数を変えたい"

#### 3.2.2 Correct pattern (Good)

```tsx
export function TwoColumnLayout() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
        左カラム
      </section>
      <section className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
        右カラム
      </section>
    </div>
  );
}
```

* Explanation (why this is correct):
  モバイルをデフォルト（1 カラム）とし、`md:grid-cols-2` で md 以上のみ 2 カラム化している。`gap-4` でカラム間の余白を一括制御しており、ダークモードも `dark:` で同時に対応している。

#### 3.2.3 Typical mistake (Bad)

```tsx
export function TwoColumnLayout() {
  return (
    <div className="md:grid-cols-2">
      <section>左カラム</section>
      <section>右カラム</section>
    </div>
  );
}
```

* Why this is wrong:
  親に `grid` クラスがないため `md:grid-cols-2` が効かない。`gap` や余白も定義されておらず、狙ったレイアウトにならない。

#### 3.2.4 Variations

* Variation A: 3 カラム（lg 以上）

  ```tsx
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {/* カードたち */}
  </div>
  ```

* Variation B: 1 カラム中央寄せ（最大幅指定）

  ```tsx
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 md:flex-row">
    {/* 左右カラム */}
  </div>
  ```

#### 3.2.5 Related APIs

* `Utility classes (layout & spacing)`
* `Variant prefixes`（`md:` / `lg:`）

---

### 3.3 Task: ダークモードとブランドカラーを定義する

#### 3.3.1 User intents (examples)

* "ダークモードで背景と文字色を反転させたい"
* "ブランドカラーを `bg-brand-500` みたいに使いたい"
* "ボタンやリンクの色をトークンで管理したい"

#### 3.3.2 Correct pattern (Good)

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-brand-50:  oklch(0.98 0.03 260);
  --color-brand-500: oklch(0.70 0.15 260);
  --color-brand-700: oklch(0.55 0.18 260);
}

@custom-variant dark (&:where(.dark, .dark *));
```

```tsx
// ルートのどこかで .dark クラスを制御する
export function ThemeToggle() {
  const toggle = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggle}
      className="rounded-full border px-3 py-1 text-xs
                 bg-white text-slate-800
                 dark:bg-slate-800 dark:text-slate-50"
    >
      Toggle Theme
    </button>
  );
}

// ブランドカラーを利用
export function BrandHeading() {
  return (
    <h1 className="text-2xl font-bold text-brand-700">
      Brand Themed Heading
    </h1>
  );
}
```

* Explanation (why this is correct):
  色スケールを `@theme` で宣言し、`text-brand-700` / `bg-brand-500` として利用している。`@custom-variant dark` を使うことで `html.dark` クラスの有無で `dark:` バリアントを切り替え可能にしている。

#### 3.3.3 Typical mistake (Bad)

```css
@import "tailwindcss";

@theme {
  --brand-color: #4f46e5;
}
```

```tsx
// ユーティリティではなく直接 var() に依存
export function BrandHeading() {
  return (
    <h1 style={{ color: 'var(--brand-color)' }}>
      Brand Heading
    </h1>
  );
}
```

* Why this is wrong:
  `--brand-color` をユーティリティクラスと結びつけておらず、Tailwind の `text-*` / `bg-*` 経由で再利用できない。任意の `style` 依存が増えるとデザインの一貫性が崩れやすい。

#### 3.3.4 Variations

* Variation A: システム設定に追従するだけのシンプルなダークモード

  ```tsx
  <div className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50">
    システムのダークモードに連動
  </div>
  ```

* Variation B: ブランド色をボタンに適用

  ```tsx
  <button className="rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-700">
    ブランドボタン
  </button>
  ```

#### 3.3.5 Related APIs

* `@theme`
* `@custom-variant`
* `dark:` バリアント

---

## 4. Troubleshooting & Anti-Patterns

### 4.1 Error catalogue

#### 4.1.1 Error: `Warning: Invalid DOM property 'class'. Did you mean 'className'?`

* Symptom: React で警告が出る／スタイルが効かない。
* Cause: JSX 内で `class` 属性を使っており、`className` にすべきところを誤っている。

Before (causes error):

```tsx
export function BadComponent() {
  return (
    <div class="bg-slate-100 p-4">
      invalid JSX
    </div>
  );
}
```

After (fixed):

```tsx
export function GoodComponent() {
  return (
    <div className="bg-slate-100 p-4">
      valid JSX
    </div>
  );
}
```

### 4.2 Global anti-patterns

* ❌ Anti-pattern: 任意値だらけでスケールを無視する

  * Why it's bad:
    `text-[13px]` や `px-[11px]` を多用すると、スケールがバラバラになり、UI 全体のリズムが失われる。

  * ✅ Use instead:

    ```tsx
    <p className="text-sm">
      まずは `text-xs` / `text-sm` / `text-base` / `text-lg` 等の既存スケールを使う
    </p>
    ```

* ❌ Anti-pattern: 同じユーティリティ列をコピペ乱用する

  * Why it's bad:
    ボタン・カードなどでほぼ同じクラス名をコピペすると、修正時に漏れが出る。デザインの一貫性を維持しづらい。

  * ✅ Use instead:

    ```tsx
    function Card({ children }: { children: React.ReactNode }) {
      return (
        <div className="rounded-lg bg-white dark:bg-slate-800 p-4 shadow-sm">
          {children}
        </div>
      );
    }

    // 利用側
    <Card>コンテンツ</Card>
    ```

---

## 5. Design Notes & Constraints

### 5.1 Design philosophy

* Goals:

  * React コンポーネントとスタイルを近接させ、UI の変更サイクルを高速化する。
  * デザインシステム（色・余白・フォント）を `@theme` で一元管理し、ユーティリティクラス経由で安全に利用する。

* Non-goals (explicitly not supported):

  * CDN の `<link>` だけで完結させる使い方（本リファレンスの範囲外）。
  * CSS-in-JS ランタイム（スタイルを JS 実行時に生成する仕組み）の代替。

### 5.2 Supported vs unsupported use cases

* Supported use cases:

  * React＋ビルドツール（Vite 等）で構築する SPA / MPA のスタイリング
  * 小〜中規模プロダクトの UI プロトタイピング〜本番までの一貫したデザイン適用

* Not supported / discouraged use cases:

  * ビルド無し環境での CDN 利用のみを前提とした構成
  * 大量のレガシー手書き CSS / BEM と Tailwind の無計画な混在（責務が曖昧になりがち）
