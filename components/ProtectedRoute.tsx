"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // ローディング中
  if (loading) {
    return (
      <div className="min-h-screen hero-gradient py-12 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="animate-pulse-slow">
            <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">認証中...</h2>
            <p className="text-muted-foreground">ユーザー情報を確認しています</p>
          </div>
        </div>
      </div>
    )
  }

  // ユーザーがログインしていない場合
  if (!user) {
    return null
  }

  // ユーザーがログインしている場合、子コンポーネントを表示
  return <>{children}</>
}
