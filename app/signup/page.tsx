"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle
} from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // バリデーション
    if (password !== confirmPassword) {
      setError("パスワードが一致しません。")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください。")
      setIsLoading(false)
      return
    }

    if (!displayName.trim()) {
      setError("表示名を入力してください。")
      setIsLoading(false)
      return
    }

    try {
      await signUp(email, password, displayName.trim())
      router.push("/")
    } catch (error: any) {
      console.error("サインアップエラー:", error)
      
      // エラーメッセージを日本語に変換
      let errorMessage = "アカウント作成に失敗しました。"
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "このメールアドレスは既に使用されています。"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "メールアドレスの形式が正しくありません。"
      } else if (error.code === "auth/weak-password") {
        errorMessage = "パスワードが弱すぎます。より強力なパスワードを設定してください。"
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "ネットワークエラーが発生しました。インターネット接続を確認してください。"
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = email && password && confirmPassword && displayName && password === confirmPassword && password.length >= 6

  return (
    <div className="min-h-screen hero-gradient py-12 px-4">
      <div className="mx-auto max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 rounded-full glass-effect px-6 py-3 text-sm font-medium text-primary shadow-lg mb-6">
            <Sparkles className="h-4 w-4" />
            新規アカウント作成
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">新規登録</h1>
          <p className="text-muted-foreground">
            無料でアカウントを作成して、あなた専用のワークアウトメニューを利用しましょう
          </p>
        </div>

        <Card className="w-full shadow-2xl card">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <UserPlus className="h-6 w-6 text-primary" />
              新規登録
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

              {/* 表示名 */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  表示名（英数字）
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="taro-yamada"
                  disabled={isLoading}
                  required
                  className="input-field"
                />
              </div>

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
                    placeholder="6文字以上のパスワード"
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
                {password && (
                  <div className="flex items-center gap-2 text-sm">
                    {password.length >= 6 ? (
                      <div className="flex items-center gap-1 text-success">
                        <CheckCircle className="h-4 w-4" />
                        <span>パスワードの長さは適切です</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span>6文字以上で入力してください</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* パスワード確認 */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  パスワード確認
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="パスワードを再入力"
                    disabled={isLoading}
                    required
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-2 text-sm">
                    {password === confirmPassword ? (
                      <div className="flex items-center gap-1 text-success">
                        <CheckCircle className="h-4 w-4" />
                        <span>パスワードが一致しています</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span>パスワードが一致しません</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 登録ボタン */}
              <Button
                type="submit"
                disabled={isLoading || !isFormValid}
                size="lg"
                className="w-full h-14 text-lg font-bold btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    アカウント作成中...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-6 w-6" />
                    アカウントを作成
                  </div>
                )}
              </Button>
            </form>

            {/* リンク */}
            <div className="mt-8 space-y-4 text-center">
              <div className="text-sm text-muted-foreground">
                既にアカウントをお持ちの方は{" "}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  ログイン
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
