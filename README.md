# 筋トレメニュー自動生成サービス

## 概要
ユーザーの体格、目標、所有器具に応じて、AI（Gemini API）が最適な1週間の筋トレメニューを自動で生成するWebアプリケーションです。

---

## 🚀 デモURL & 主要機能

実際に触れるデモはこちら →https://workout-app-vzo5.vercel.app/
## テスト用アカウント
mail　address : test@example.com　　
password : password123

### GIFデモ
[ここにアプリを操作しているGIF画像を貼り付けます]

### 主な機能
* **AIによるメニュー生成**: 身長・体重・目標などを入力すると、Gemini APIがパーソナライズされたメニューをJSON形式で返却します。
* **ユーザー認証**: Firebase Authenticationによるログイン・新規登録機能。
* **データ保存**: 生成したお気に入りのメニューをFirestoreに保存し、いつでも見返すことができます。

---

## ✨ 工夫した点・アピールポイント

このポートフォリオを作成する上で、特にこだわった点です。

1.  **AI出力の安定化**: プロンプトエンジニアリングにより、AIの出力を必ずJSON形式に整形。サーバー側でZodを用いた厳密なバリデーションを行い、予期せぬエラーを防いでいます。
2.  **セキュリティ**: Firestoreのセキュリティルールを設定し、ユーザーは自身のデータにしかアクセスできないように制御しています。APIキーなどの秘密鍵は全てサーバーサイドでのみ扱い、クライアントには漏洩させません。
3.  **堅牢なAPI設計**: APIのエンドポイントではZodによる入力値検証を導入し、不正なリクエストをブロックすることで、AIの無駄な呼び出しやコストの暴走を防いでいます。
4.  **モダンな開発環境**: Next.js (App Router) を採用し、サーバーコンポーネントとクライアントコンポーネントを適切に使い分けることでパフォーマンスを意識しました。また、GitHub ActionsによるCI（継続的インテグレーション）を導入し、コード品質を自動で担保しています。

---

## 🛠️ 使用技術

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_API-8E44AD?logo=google&logoColor=white)

---

## 📂 ローカルでの起動方法

1.  **リポジトリをクローン**
    ```bash
    git clone [あなたのリポジトリURL]
    cd [リポジトリ名]
    ```

2.  **依存関係をインストール**
    ```bash
    npm install
    ```

3.  **環境変数の設定**
    `.env.local.example` ファイルをコピーして `.env.local` を作成し、必要なAPIキーなどを設定してください。
    ```bash
    cp .env.local.example .env.local
    ```

4.  **開発サーバーを起動**
    ```bash
    npm run dev
    ```
    ブラウザで `http://localhost:3000` を開きます。
