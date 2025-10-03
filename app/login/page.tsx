"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Sparkles,
  AlertCircle
} from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async function(e: React.FormEvent){
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signIn(email, password)
      router.push("/")
    } catch (error: any) {
      console.error("ログインエラー:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-gradient py-12 px-4">
      <div className="mx-auto max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 rounded-full glass-effect px-6 py-3 text-sm font-medium text-primary shadow-lg mb-6">
            <Sparkles className="h-4 w-4" />
            ログインして続行
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ログイン</h1>
          <p className="text-muted-foreground">
            アカウントにログインして、あなた専用のワークアウトメニューを利用しましょう
          </p>
        </div>

        <Card className="w-full shadow-2xl card">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <LogIn className="h-6 w-6 text-primary" />
              ログイン
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* エラーメッセージ */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* メールアドレス */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  disabled={isLoading}
                  required
                  className="input-field"
                />
              </div>

              {/* パスワード */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  パスワード
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワードを入力"
                    disabled={isLoading}
                    required
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* ログインボタン */}
              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                size="lg"
                className="w-full h-14 text-lg font-bold btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ログイン中...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <LogIn className="h-6 w-6" />
                    ログイン
                  </div>
                )}
              </Button>
            </form>

            {/* リンク */}
            <div className="mt-8 space-y-4 text-center">
              <div className="text-sm text-muted-foreground">
                アカウントをお持ちでない方は{" "}
                <Link 
                  href="/signup" 
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  新規登録
                </Link>
              </div>
              
              <div className="pt-4 border-t border-muted-foreground/20">
                <Link href="/">
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-outline"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    ホームに戻る
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
