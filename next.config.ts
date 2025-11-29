import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Firestore使用時の設定
  // 注意: このアプリはAPIルートを使用しているため、
  // Cloud RunまたはVercelへのデプロイが推奨されます。
  // Firebase Hosting単体では動作しません。
};

export default nextConfig;
