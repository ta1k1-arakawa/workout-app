import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist } from "next/font/google"
import { GeistMono } from "geist/font/mono"
// 学習用なのでAnalyticsは削除
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

// 学習用のシンプルなメタデータ設定
export const metadata: Metadata = {
  title: "AI筋トレパートナー - 学習版",
  description: "AIがあなたの目標とレベルに合わせて最適なトレーニングメニューを作成。学習用アプリケーションです。",
  keywords: ["AI", "筋トレ", "ワークアウト", "フィットネス", "学習", "Next.js"],
  authors: [{ name: "学習者" }],
  creator: "学習者",
  publisher: "学習者",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#15803d" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`font-sans ${inter.variable} ${geist.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </body>
    </html>
  )
}
