import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth-context"
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

export const metadata: Metadata = {
  title: "AI筋トレパートナー - あなた専用のワークアウトメニュー作成",
  description:
    "AIがあなたの目標とレベルに合わせて最適なトレーニングメニューを作成。筋力アップ、ダイエット、健康維持に最適なワークアウトプランを提供します。",
  keywords: ["AI", "筋トレ", "ワークアウト", "フィットネス", "トレーニング", "メニュー作成"],
  authors: [{ name: "AI筋トレパートナー" }],
  creator: "AI筋トレパートナー",
  publisher: "AI筋トレパートナー",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ai-workout-partner.vercel.app"),
  openGraph: {
    title: "AI筋トレパートナー - あなた専用のワークアウトメニュー作成",
    description:
      "AIがあなたの目標とレベルに合わせて最適なトレーニングメニューを作成。筋力アップ、ダイエット、健康維持に最適なワークアウトプランを提供します。",
    url: "https://ai-workout-partner.vercel.app",
    siteName: "AI筋トレパートナー",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI筋トレパートナー",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
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
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
