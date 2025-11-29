<template>
---
title: <!-- title -->
description: <!-- desc -->
---

<!--
## Template philosophy

この記述はテンプレート用であり、清書時には削除すべきである。
このファイルは単一ファイルのライブラリリファレンスである。  
主な理念は以下の通り：

* Single entry point（単一入口）
  * ライブラリを使ったコード生成に必要な情報を、この1枚に集約する。
  * 外部ファイル（`api_schema.d.ts`, `api_index.json` など）は任意。

* Intent → Code への一直線ルート

  * ユーザーの自然言語の意図（Intent）から、
    1. 関連する概念
    2. 正しいコードパターン
       を、この文書のみで辿れるようにする。

* 高密度・型・パターン重視
  * 冗長な説明より、型／制約／例外／具体例／Bad vs Good Pattern を優先する。

* チャンク前提の自己完結セクション
  * どの小節も単独で意味が通るように記述し、重要情報は必要な範囲で重複させる。

* `> `はテンプレ用の指示を示している。清書時には削除すべき。
-->

# {{LIBRARY_NAME}} Reference

## 1. Overview & Quickstart

> 目的：ライブラリの役割・主要ユースケース・最小コード例・よく使うAPIの概要を、
> コンテキスト少なめでもエージェントが把握できるようにする。

### 1.1 Library summary

* Library name: `{{LIBRARY_NAME}}`

* Primary domain / purpose (1–2 sentences):
  {{LIBRARY_PURPOSE_SHORT}}
  例: “High-performance batch inference pipelines for Python 3.10+.”

* Typical tasks (up to 5 items):
  * {{TASK_1}}
  * {{TASK_2}}
  * {{TASK_3}}
  * {{TASK_4_OPTIONAL}}
  * {{TASK_5_OPTIONAL}}

### 1.2 Minimal working example

> コピペで動作する、最小・自己完結なコード例を1つだけ置く。
> import からエントリポイントまで含めること。

```{{PRIMARY_LANGUAGE}}
{{MINIMAL_EXAMPLE_CODE}}
```

### 1.3 API quick reference (top N frequently used APIs)

> 詳細APIセクション (§3) の「索引」として機能させる。
> 高頻度で使うAPI 5個に絞る。

<apiQuickReference>
  <api>
    <name>{{API_1_NAME}}</name>
    <kind>function</kind> <!-- function / class / method ... -->
    <summary>{{API_1_SHORT_SUMMARY}}</summary>
    <sectionRef>3.x</sectionRef>
  </api>
  <api>
    <name>{{API_2_NAME}}</name>
    <kind>class</kind>
    <summary>{{API_2_SHORT_SUMMARY}}</summary>
    <sectionRef>3.x</sectionRef>
  </api>
  <api>
    <name>{{API_3_NAME}}</name>
    <kind>function</kind>
    <summary>{{API_3_SHORT_SUMMARY}}</summary>
    <sectionRef>3.x</sectionRef>
  </api>
  <api>
    <name>{{API_4_NAME}}</name>
    <kind>class</kind>
    <summary>{{API_4_SHORT_SUMMARY}}</summary>
    <sectionRef>3.x</sectionRef>
  </api>
  <api>
    <name>{{API_5_NAME}}</name>
    <kind>function</kind>
    <summary>{{API_5_SHORT_SUMMARY}}</summary>
    <sectionRef>3.x</sectionRef>
  </api>
</apiQuickReference>

---

## 2. Core Concepts & Natural Language Mapping

> 目的：ライブラリ固有の「世界観（概念モデル）」と、自然言語からAPIへの対応を明示する。

### 2.1 Core concepts (mental model)

> ライブラリを理解するうえで中核となる概念 3〜7個を列挙する。

<coreConcepts>
  <concept>
    <name>{{CONCEPT_1}}</name>
    <category>{{TYPE_1}}</category> <!-- e.g. "entity", "resource", "operation" -->
    <description>{{CONCEPT_1_DESCRIPTION}}</description>
    <relatedTypes>
      <typeRef>{{RELATED_CLASS_1}}</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>{{CONCEPT_2}}</name>
    <category>{{TYPE_2}}</category>
    <description>{{CONCEPT_2_DESCRIPTION}}</description>
    <relatedTypes>
      <typeRef>{{RELATED_CLASS_2}}</typeRef>
    </relatedTypes>
  </concept>
  <concept>
    <name>{{CONCEPT_3}}</name>
    <category>{{TYPE_3}}</category>
    <description>{{CONCEPT_3_DESCRIPTION}}</description>
    <relatedTypes>
      <typeRef>{{RELATED_CLASS_3}}</typeRef>
    </relatedTypes>
  </concept>
</coreConcepts>

### 2.2 Concept–type mapping

> 自然言語の用語が、どのクラス/型/モジュールと結びつくかを明文化。

<termToTypeMapping>
  <entry>
    <term>{{NL_TERM_1}}</term>
    <meaning>{{NL_TERM_1_MEANING}}</meaning>
    <primaryType>{{TYPE_OR_CLASS_1}}</primaryType>
  </entry>
  <entry>
    <term>{{NL_TERM_2}}</term>
    <meaning>{{NL_TERM_2_MEANING}}</meaning>
    <primaryType>{{TYPE_OR_CLASS_2}}</primaryType>
  </entry>
  <entry>
    <term>{{NL_TERM_3}}</term>
    <meaning>{{NL_TERM_3_MEANING}}</meaning>
    <primaryType>{{TYPE_OR_CLASS_3}}</primaryType>
  </entry>
</termToTypeMapping>

### 2.3 Natural language → API candidates

> ユーザーの質問文からAPI候補を引き当てるためのジャンプテーブル。

* Intent group: "{{INTENT_GROUP_1}}"

  * Example user phrases:

    * "{{INTENT_PHRASE_1A}}"
    * "{{INTENT_PHRASE_1B}}"
  * Typical APIs:

    * `{{API_NAME_A}}`
    * `{{API_NAME_B}}`

* Intent group: "{{INTENT_GROUP_2}}"

  * Example user phrases:

    * "{{INTENT_PHRASE_2A}}"
    * "{{INTENT_PHRASE_2B}}`
  * Typical APIs:

    * `{{API_NAME_C}}`
    * `{{API_NAME_D}}`

### 2.4 Terminology disambiguation

> 一般的な意味と、このライブラリ内での意味が食い違う用語を明示する。

* Term: "{{AMBIG_TERM_1}}"

  * General meaning: {{GENERAL_MEANING_1}}
  * In this library: {{LIBRARY_SPECIFIC_MEANING_1}}

* Term: "{{AMBIG_TERM_2}}"

  * General meaning: {{GENERAL_MEANING_2}}
  * In this library: {{LIBRARY_SPECIFIC_MEANING_2}}

---

## 3. Patterns (Intent → Code Cookbook)

> 目的：ユーザーの自然言語タスク（Intent）を起点に、正しいコードパターンへ誘導するFew-shot集として機能させる。

### 3.x Task: {{TASK_TITLE}}

#### 3.x.1 User intents (examples)

> ユーザーが実際に言いそうな自然言語を複数列挙する。

* "{{USER_INTENT_PHRASE_1}}"
* "{{USER_INTENT_PHRASE_2}}"
* "{{USER_INTENT_PHRASE_3}}"

#### 3.x.2 Correct pattern (Good)

```{{PRIMARY_LANGUAGE}}
{{GOOD_PATTERN_CODE}}
```

* Explanation (why this is correct):
  {{GOOD_PATTERN_REASON}}

#### 3.x.3 Typical mistake (Bad)

```{{PRIMARY_LANGUAGE}}
{{BAD_PATTERN_CODE}}
```

* Why this is wrong:
  {{BAD_PATTERN_REASON}}

#### 3.x.4 Variations

* Variation A: {{VARIATION_DESC_A}}

  ```{{PRIMARY_LANGUAGE}}
  {{VARIATION_CODE_A}}
  ```
* Variation B: {{VARIATION_DESC_B}}

  ```{{PRIMARY_LANGUAGE}}
  {{VARIATION_CODE_B}}
  ```

#### 3.x.5 Related APIs

* `{{RELATED_API_1}}`
* `{{RELATED_API_2}}`

---

## 4. Troubleshooting & Anti-Patterns

> 目的：エラーメッセージや「うまく動かない」という報告から、修正コードを導くための逆引き集。

### 4.1 Error catalogue

#### 4.1.x Error: `{{ERROR_MESSAGE_OR_CODE}}`

* Symptom: {{ERROR_SYMPTOM_DESCRIPTION}}
* Cause: {{ERROR_CAUSE_DESCRIPTION}}

Before (causes error):

```{{PRIMARY_LANGUAGE}}
{{ERROR_BEFORE_CODE}}
```

After (fixed):

```{{PRIMARY_LANGUAGE}}
{{ERROR_AFTER_CODE}}
```

### 4.2 Global anti-patterns

> ライブラリを使う上で、特に避けるべき共通のNGパターン。

* ❌ Anti-pattern: {{ANTI_PATTERN_1_SHORT}}

  * Why it's bad: {{ANTI_PATTERN_1_REASON}}
  * ✅ Use instead:

    ```{{PRIMARY_LANGUAGE}}
    {{ANTI_PATTERN_1_REPLACEMENT_CODE}}
    ```

* ❌ Anti-pattern: {{ANTI_PATTERN_2_SHORT}}

  * Why it's bad: {{ANTI_PATTERN_2_REASON}}
  * ✅ Use instead:

    ```{{PRIMARY_LANGUAGE}}
    {{ANTI_PATTERN_2_REPLACEMENT_CODE}}
    ```

---

## 5. Design Notes & Constraints

> 目的：設計思想・サポート範囲・非対応ユースケースなどを明確化し、
> LLMが「無茶な使い方を提案しない」ように制約条件を共有する。

### 5.1 Design philosophy

* Goals:
  * {{GOAL_1}}
  * {{GOAL_2}}

* Non-goals (explicitly not supported):
  * {{NONGOAL_1}}
  * {{NONGOAL_2}}

### 5.2 Supported vs unsupported use cases

* Supported use cases:
  * {{SUPPORTED_USE_CASE_1}}
  * {{SUPPORTED_USE_CASE_2}}

* Not supported / discouraged use cases:
  * {{UNSUPPORTED_USE_CASE_1}}
  * {{UNSUPPORTED_USE_CASE_2}}
</template>
