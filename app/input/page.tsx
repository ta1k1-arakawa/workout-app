"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Target, Clock, Calendar, Ruler, Weight, Settings, Sparkles, TrendingUp, Zap } from "lucide-react"

export default function InputPage() {
  const router = useRouter()

  const [goal, setGoal] = useState("筋力アップ")
  const [level, setLevel] = useState("初心者")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [frequency, setFrequency] = useState("2")
  const [duration, setDuration] = useState("60")
  const [equipment, setEquipment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          level,
          height,
          weight,
          frequency,
          duration,
          equipment,
        }),
      })

      if (!response.ok) {
        throw new Error("メニューの生成に失敗しました。")
      }

      const result = await response.json()
      localStorage.setItem("workout-menu", JSON.stringify(result))
      router.push("/result")
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert(String(error))
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-gradient py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 rounded-full glass-effect px-6 py-3 text-sm font-medium text-primary shadow-lg mb-6">
            <Sparkles className="h-4 w-4" />
            AIトレーナーがあなたを待っています
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 md:text-5xl">トレーニング情報を入力</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            AIがあなたに最適なワークアウトメニューを作成します
          </p>
        </div>

        <Card className="w-full shadow-2xl card">
          <CardHeader className="text-center pb-8">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <Target className="h-6 w-6 text-primary" />
              目標設定
            </CardTitle>
            <p className="text-muted-foreground mt-2">あなたの目標に合わせて、最適なトレーニングメニューを作成します</p>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-8">
            {/* 目標 */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                あなたの目標は何ですか？
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={isLoading}
                className="select-field"
              >
                <option value="筋力アップ">💪 筋力アップ</option>
                <option value="ダイエット">🔥 ダイエット</option>
                <option value="健康維持・体力向上">❤️ 健康維持・体力向上</option>
              </select>
            </div>

            {/* レベル */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                あなたのトレーニングレベルは？
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                disabled={isLoading}
                className="select-field"
              >
                <option value="初心者">🌱 初心者</option>
                <option value="中級者">🚀 中級者</option>
                <option value="上級者">🏆 上級者</option>
              </select>
            </div>

            {/* 身体情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-primary" />
                  身長 (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="例: 170"
                  disabled={isLoading}
                  className="input-field"
                />
              </div>

              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Weight className="h-5 w-5 text-primary" />
                  体重 (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="例: 65"
                  disabled={isLoading}
                  className="input-field"
                />
              </div>
            </div>

            {/* トレーニング設定 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  週のトレーニング頻度
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  disabled={isLoading}
                  className="select-field"
                >
                  <option value="1">📅 1回</option>
                  <option value="2">📅 2回</option>
                  <option value="3">📅 3回</option>
                  <option value="4">📅 4回</option>
                  <option value="5">📅 5回以上</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  1回のトレーニング時間
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={isLoading}
                  className="select-field"
                >
                  <option value="30">⏰ 〜30分</option>
                  <option value="60">⏰ 〜60分</option>
                  <option value="90">⏰ 〜90分</option>
                  <option value="120">⏰ 90分以上</option>
                </select>
              </div>
            </div>

            {/* 器具 */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                利用できるジムの器具
              </label>
              <textarea
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="例: ダンベル, バーベル, レッグプレスマシン, ラットプルダウンマシン"
                disabled={isLoading}
                className="input-field min-h-[100px] resize-none"
              />
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                利用できる器具を入力すると、より適切なメニューが作成されます
              </p>
            </div>

            {/* 送信ボタン */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              size="lg"
              className="w-full h-16 text-xl font-bold mt-8 btn-primary"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  メニューを生成中...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6" />
                  メニューを作成
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
