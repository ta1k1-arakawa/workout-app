"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Play,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  Timer,
  Target,
  Weight,
  Clock,
  Trophy,
  Sparkles,
  Activity,
} from "lucide-react"

interface MenuItem {
  name: string
  sets: string
  reps: string
  weight?: string
  rest?: string
}

interface MenuData {
  menu: MenuItem[]
  tips?: string
  totalTime?: string
}

export default function ResultPage() {
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    const storedMenu = localStorage.getItem("workout-menu")
    if (storedMenu) {
      try {
        setMenuData(JSON.parse(storedMenu))
      } catch {
        setError("メニューの解析に失敗しました。")
      }
    } else {
      setError("メニューデータが見つかりません。")
    }
  }, [])

  const toggleCompleted = (index: number) => {
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(index)) {
      newCompleted.delete(index)
    } else {
      newCompleted.add(index)
    }
    setCompletedItems(newCompleted)
  }

  const getProgressPercentage = () => {
    if (!menuData) return 0
    return Math.round((completedItems.size / menuData.menu.length) * 100)
  }

  if (error) {
    return (
      <div className="min-h-screen hero-gradient py-12 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Card className="w-full shadow-2xl card">
            <CardContent className="pt-12 pb-8">
              <div className="text-destructive mb-6">
                <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-12 w-12 text-destructive" />
                </div>
                <h1 className="text-3xl font-bold mb-4">エラーが発生しました</h1>
                <p className="text-muted-foreground mb-8 text-lg">{error}</p>
                <Link href="/input">
                  <Button className="btn-primary px-8 py-4 text-lg">
                    <ArrowLeft className="h-5 w-5 mr-3" />
                    もう一度試す
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!menuData) {
    return (
      <div className="min-h-screen hero-gradient py-12 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="animate-pulse-slow">
            <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">メニューを読み込み中...</h2>
            <p className="text-muted-foreground text-lg">AIがあなた専用のメニューを準備しています</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient py-12 px-4">
      <div className="mx-auto max-w-5xl">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 rounded-full glass-effect px-6 py-3 text-sm font-medium text-primary shadow-lg mb-6">
            <Sparkles className="h-4 w-4" />
            あなた専用のメニューが完成しました
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 md:text-5xl">あなたのトレーニングメニュー</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            今日のトレーニングを完了させましょう！
          </p>
          {menuData.totalTime && (
            <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-lg font-semibold border border-primary/20">
              <Clock className="h-5 w-5" />
              予想時間: {menuData.totalTime}分
            </div>
          )}
        </div>

        {/* 進捗バー */}
        <Card className="mb-8 shadow-xl card">
          <CardContent className="pt-8 pb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-foreground">進捗状況</span>
              <span className="text-2xl font-bold text-primary">{getProgressPercentage()}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${getProgressPercentage()}%` }}></div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">
                {completedItems.size} / {menuData.menu.length} 項目完了
              </span>
            </div>
          </CardContent>
        </Card>

        {/* トレーニングのポイント */}
        {menuData.tips && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-xl card">
            <CardContent className="pt-8 pb-6">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-3 text-xl">
                <Target className="h-6 w-6" />
                トレーニングのポイント
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed text-balance">{menuData.tips}</p>
            </CardContent>
          </Card>
        )}

        {/* メニューリスト */}
        <div className="grid gap-6 mb-12">
          {menuData.menu.map((item, index) => (
            <Card
              key={index}
              className={`menu-item ${completedItems.has(index) ? "menu-item-completed" : "menu-item-active"}`}
            >
              <CardContent className="pt-8 pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={() => toggleCompleted(index)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          completedItems.has(index)
                            ? "border-success bg-success text-white shadow-lg"
                            : "border-muted-foreground/30 hover:border-primary/50 hover:shadow-md"
                        }`}
                      >
                        {completedItems.has(index) && <CheckCircle className="h-5 w-5" />}
                      </button>
                      <h3
                        className={`text-xl font-bold ${
                          completedItems.has(index) ? "line-through text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {item.name}
                      </h3>
                      {completedItems.has(index) && (
                        <div className="flex items-center gap-2 text-success text-sm font-semibold achievement-badge">
                          <Trophy className="h-4 w-4" />
                          完了！
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-base text-muted-foreground">
                      <span className="workout-stat">
                        <Timer className="h-5 w-5" />
                        <span className="font-semibold">{item.sets}</span>
                      </span>
                      <span className="workout-stat">
                        <Activity className="h-5 w-5" />
                        <span className="font-semibold">{item.reps}</span>
                      </span>
                      {item.weight && (
                        <span className="workout-stat">
                          <Weight className="h-5 w-5" />
                          <span className="font-semibold">{item.weight}</span>
                        </span>
                      )}
                    </div>
                    {item.rest && (
                      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-lg w-fit">
                        <Clock className="h-4 w-4 text-secondary" />
                        セット間休憩: {item.rest}
                      </div>
                    )}
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.name + " やり方")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline px-6 py-3 text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300 ml-6"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    動画を見る
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 完了メッセージ */}
        {getProgressPercentage() === 100 && (
          <Card className="mb-8 border-success/20 bg-gradient-to-br from-success/5 to-success/10 shadow-xl card">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-12 w-12 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-success mb-2">お疲れ様でした！</h2>
              <p className="text-lg text-muted-foreground">今日のトレーニングを完了しました。素晴らしい成果です！</p>
            </CardContent>
          </Card>
        )}

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/input">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold btn-outline bg-transparent"
            >
              <RefreshCw className="h-5 w-5 mr-3" />
              新しいメニューを作成
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold btn-primary">
              <ArrowLeft className="h-5 w-5 mr-3" />
              ホームに戻る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
