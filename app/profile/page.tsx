"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/ProtectedRoute"
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Sparkles,
  LogOut,
  Trash2
} from "lucide-react"

// プロフィールページ
export default function ProfilePage() {
  const { user, userProfile, logout, deleteAccount } = useAuth() 
  const router = useRouter()

  // 表示名をメールローカル部で統一
  const displayName = user?.email ? user.email.split("@")[0] : ""

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
  }, [user, router])

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("ログアウトエラー:", error)
    }
  }

  // アカウント削除処理
  const handleDeleteAccount = async () => {
    if (window.confirm("本当にアカウントを削除しますか？この操作は取り消せません。")) {
      try {
        await deleteAccount() 
        router.push("/")
      } catch (error) {
        console.error("アカウント削除エラー:", error)
      }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen hero-gradient py-12 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="animate-pulse-slow">
            <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">読み込み中...</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen hero-gradient py-12 px-4">
        <div className="mx-auto max-w-2xl">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">プロフィール</h1>
            <p className="text-muted-foreground">
              あなたのアカウント情報を管理できます
            </p>
          </div>

          <Card className="w-full shadow-2xl card">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <User className="h-6 w-6 text-primary" />
                アカウント情報
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              {/* 表示名（メールローカル部で統一） */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  表示名
                </label>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <span className="text-lg font-medium">
                    {displayName}
                  </span>
                </div>
              </div>

              {/* メールアドレス */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  メールアドレス
                </label>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <span className="text-lg font-medium">{user.email}</span>
                </div>
              </div>

              {/* アカウント作成日 */}
              {userProfile?.createdAt && (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    アカウント作成日
                  </label>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <span className="text-lg font-medium">
                      {userProfile.createdAt.toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* 最終ログイン */}
              {userProfile?.lastLoginAt && (
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    最終ログイン
                  </label>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <span className="text-lg font-medium">
                      {userProfile.lastLoginAt.toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* アクションボタン */}
              <div className="pt-6 space-y-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="lg"
                  className="w-full btn-outline"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  ログアウト
                </Button>

                {/* アカウント削除ボタン（赤色） */}
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  size="lg"
                  className="w-full"
                >
                  <Trash2 className="h-5 w-5 mr-3" />
                  アカウント削除
                </Button>

                <div className="pt-4 border-t border-muted-foreground/20">
                  <Link href="/">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full btn-outline"
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
    </ProtectedRoute>
  )
}
