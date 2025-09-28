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

interface DayMenu {
  type: string
  menu: MenuItem[]
  tips?: string
  totalTime?: string
}

interface MenuData {
  weeklyMenu: Record<string, DayMenu>
  weeklyTips?: string
}

export default function ResultPage() {
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [completedItems, setCompletedItems] = useState<Record<string, Set<number>>>({})
  const [selectedDay, setSelectedDay] = useState<string>("")

  useEffect(() => {
    const storedMenu = localStorage.getItem("workout-menu")
    if (storedMenu) {
      try {
        const data = JSON.parse(storedMenu)
        
        // データの検証
        if (!data.weeklyMenu || typeof data.weeklyMenu !== 'object') {
          setError("メニューデータの形式が正しくありません。")
          return
        }
        
        setMenuData(data)
        // 最初の曜日を選択状態にする
        const firstDay = Object.keys(data.weeklyMenu || {})[0]
        if (firstDay) {
          setSelectedDay(firstDay)
        }
      } catch (parseError) {
        console.error('JSON解析エラー:', parseError)
        setError("メニューの解析に失敗しました。データが破損している可能性があります。")
      }
    } else {
      setError("メニューデータが見つかりません。")
    }
  }, [])

  const toggleCompleted = (day: string, index: number) => {
    const newCompleted = { ...completedItems }
    if (!newCompleted[day]) {
      newCompleted[day] = new Set()
    }
    
    const dayCompleted = new Set(newCompleted[day])
    if (dayCompleted.has(index)) {
      dayCompleted.delete(index)
    } else {
      dayCompleted.add(index)
    }
    newCompleted[day] = dayCompleted
    setCompletedItems(newCompleted)
  }

  const getProgressPercentage = (day: string) => {
    if (!menuData || !menuData.weeklyMenu[day]) return 0
    const dayCompleted = completedItems[day] || new Set()
    return Math.round((dayCompleted.size / menuData.weeklyMenu[day].menu.length) * 100)
  }

  const getWeeklyProgressPercentage = () => {
    if (!menuData) return 0
    const totalItems = Object.values(menuData.weeklyMenu).reduce((sum, day) => sum + day.menu.length, 0)
    const totalCompleted = Object.values(completedItems).reduce((sum, daySet) => sum + daySet.size, 0)
    return Math.round((totalCompleted / totalItems) * 100)
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
            あなた専用の週間メニューが完成しました
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 md:text-5xl">あなたの週間トレーニングメニュー</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            曜日別に最適化されたトレーニングメニューで目標達成を目指しましょう！
          </p>
        </div>

        {/* 週間進捗バー */}
        <Card className="mb-8 shadow-xl card">
          <CardContent className="pt-8 pb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-foreground">週間進捗状況</span>
              <span className="text-2xl font-bold text-primary">{getWeeklyProgressPercentage()}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${getWeeklyProgressPercentage()}%` }}></div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">
                {Object.values(completedItems).reduce((sum, daySet) => sum + daySet.size, 0)} / {Object.values(menuData.weeklyMenu).reduce((sum, day) => sum + day.menu.length, 0)} 項目完了
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 曜日選択タブ */}
        <Card className="mb-8 shadow-xl card">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.keys(menuData.weeklyMenu).map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedDay === day
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {day}曜日
                  <div className="text-xs mt-1">
                    {getProgressPercentage(day)}% 完了
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* 選択された曜日のメニュー */}
        {selectedDay && menuData.weeklyMenu[selectedDay] && (
          <>
            {/* 曜日別のトレーニングタイプとポイント */}
            <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-xl card">
              <CardContent className="pt-8 pb-6">
                <h3 className="font-bold text-primary mb-4 flex items-center gap-3 text-xl">
                  <Target className="h-6 w-6" />
                  {selectedDay}曜日 - {menuData.weeklyMenu[selectedDay].type}
                </h3>
                {menuData.weeklyMenu[selectedDay].totalTime && (
                  <div className="mb-4 inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                    <Clock className="h-4 w-4" />
                    予想時間: {menuData.weeklyMenu[selectedDay].totalTime}分
                  </div>
                )}
                {menuData.weeklyMenu[selectedDay].tips && (
                  <p className="text-lg text-muted-foreground leading-relaxed text-balance">{menuData.weeklyMenu[selectedDay].tips}</p>
                )}
              </CardContent>
            </Card>

            {/* 曜日別進捗バー */}
            <Card className="mb-8 shadow-xl card">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-foreground">{selectedDay}曜日の進捗</span>
                  <span className="text-2xl font-bold text-primary">{getProgressPercentage(selectedDay)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${getProgressPercentage(selectedDay)}%` }}></div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-muted-foreground">
                    {(completedItems[selectedDay] || new Set()).size} / {menuData.weeklyMenu[selectedDay].menu.length} 項目完了
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* 選択された曜日のメニューリスト */}
        {selectedDay && menuData.weeklyMenu[selectedDay] && (
          <div className="grid gap-6 mb-12">
            {menuData.weeklyMenu[selectedDay].menu.map((item, index) => (
              <Card
                key={index}
                className={`menu-item ${(completedItems[selectedDay] || new Set()).has(index) ? "menu-item-completed" : "menu-item-active"}`}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <button
                          onClick={() => toggleCompleted(selectedDay, index)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            (completedItems[selectedDay] || new Set()).has(index)
                              ? "border-success bg-success text-white shadow-lg"
                              : "border-muted-foreground/30 hover:border-primary/50 hover:shadow-md"
                          }`}
                        >
                          {(completedItems[selectedDay] || new Set()).has(index) && <CheckCircle className="h-5 w-5" />}
                        </button>
                        <h3
                          className={`text-xl font-bold ${
                            (completedItems[selectedDay] || new Set()).has(index) ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {item.name}
                        </h3>
                        {(completedItems[selectedDay] || new Set()).has(index) && (
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
        )}

        {/* 完了メッセージ */}
        {selectedDay && getProgressPercentage(selectedDay) === 100 && (
          <Card className="mb-8 border-success/20 bg-gradient-to-br from-success/5 to-success/10 shadow-xl card">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-12 w-12 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-success mb-2">お疲れ様でした！</h2>
              <p className="text-lg text-muted-foreground">{selectedDay}曜日のトレーニングを完了しました。素晴らしい成果です！</p>
            </CardContent>
          </Card>
        )}

        {/* 週間完了メッセージ */}
        {getWeeklyProgressPercentage() === 100 && (
          <Card className="mb-8 border-success/20 bg-gradient-to-br from-success/5 to-success/10 shadow-xl card">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-12 w-12 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-success mb-2">週間目標達成！</h2>
              <p className="text-lg text-muted-foreground">今週のトレーニングを全て完了しました。素晴らしい成果です！</p>
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
