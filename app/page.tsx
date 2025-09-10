import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Target,
  Users,
  ArrowRight,
  Sparkles,
  Clock,
  Activity,
  Award,
  BarChart3,
  Dumbbell,
  Zap,
  TrendingUp,
} from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient px-6 py-24 text-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-accent/5 rounded-full blur-2xl animate-pulse-slow"></div>
          <div className="absolute top-1/4 right-1/3 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-bounce-gentle"></div>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full glass-effect px-8 py-4 text-sm font-semibold text-primary shadow-xl border border-primary/20">
            <div className="flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full">
              <Sparkles className="h-3 w-3" />
            </div>
            AI搭載フィットネスパートナー
          </div>

          <h1 className="mb-8 text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl">
            <span className="gradient-text text-balance">AI筋トレパートナー</span>
          </h1>

          <div className="mb-8 flex items-center justify-center gap-3">
            <Dumbbell className="h-8 w-8 text-primary" />
            <p className="text-xl text-muted-foreground md:text-2xl lg:text-3xl font-medium">
              ジムでの「次、何をしよう？」をなくす
            </p>
            <Zap className="h-8 w-8 text-secondary" />
          </div>

          <p className="mb-16 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance">
            あなた専用のAIトレーナーが、目標に合わせた最適なワークアウトメニューを瞬時に作成。
            もう迷うことはありません。
          </p>

          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center items-center">
            <Link href="/input">
              <Button
                size="lg"
                className="px-12 py-8 text-xl font-bold h-16 btn-primary hover:translate-x-1 transition-all duration-300 shadow-2xl hover:shadow-primary/25"
              >
                <Dumbbell className="mr-3 h-6 w-6" />
                無料でメニュー作成を開始する
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
        </div>
      </section>

      {/* Features Section */}
      <section className="section-gradient px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl text-balance">
              なぜAI筋トレパートナーなのか？
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              科学的根拠に基づいたAIが、あなたの目標達成をサポートします
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="feature-card">
              <CardContent className="p-10">
                <div className="icon-container mb-6">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-card-foreground">パーソナライズされたメニュー</h3>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  あなたの体力レベル、目標、利用可能な時間に基づいて、最適なワークアウトプランを自動生成
                </p>
              </CardContent>
            </Card>
            
            <Card className="feature-card">
              <CardContent className="p-10">
                <div className="icon-container mb-6">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-card-foreground">いつでもどこでも</h3>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  ジムでも自宅でも、あなたの環境に合わせたトレーニングメニューを提供
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardContent className="p-10">
                <div className="icon-container mb-6">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-card-foreground">進捗トラッキング</h3>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  あなたの進歩を可視化し、モチベーションを維持できます
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardContent className="p-10">
                <div className="icon-container mb-6">
                  <Clock className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-card-foreground">時間効率</h3>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  メニュー作成に時間を無駄にせず、すぐにトレーニングに集中できます
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardContent className="p-10">
                <div className="icon-container mb-6">
                  <Award className="h-7 w-7" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-card-foreground">継続サポート</h3>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  長期的な目標達成に向けて、継続的なサポートを提供します
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl text-balance">使い方は簡単</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              3つのステップで、あなた専用のトレーニングメニューが完成します
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">情報を入力</h3>
              <p className="text-muted-foreground leading-relaxed">目標、レベル、利用可能な時間などを簡単に入力</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">AIが分析</h3>
              <p className="text-muted-foreground leading-relaxed">AIがあなたの情報を分析し、最適なメニューを生成</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">トレーニング開始</h3>
              <p className="text-muted-foreground leading-relaxed">生成されたメニューで効率的なトレーニングを開始</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 hero-gradient">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-foreground md:text-5xl text-balance">
            今すぐ始めて、理想の体を手に入れよう
          </h2>
          <p className="mb-12 text-xl text-muted-foreground text-balance">
            AIがあなた専用のワークアウトメニューを作成します
          </p>
          <Link href="/input">
            <Button
              size="lg"
              className="px-16 py-8 text-2xl font-bold h-20 btn-primary hover:translate-x-1 transition-transform"
            >
              無料で今すぐ始める
              <ArrowRight className="ml-3 h-7 w-7" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
