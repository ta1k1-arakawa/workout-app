"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSavedMenus, deleteMenu } from "@/lib/database/menuService"
import { WorkoutMenu } from "@/lib/database/menuTypes"
import { useAuth } from "@/lib/auth-context"
import { Sparkles, Save, Trash2, ArrowLeft } from "lucide-react"

export default function MenuListPage() {
  const { user } = useAuth()
  const [menus, setMenus] = useState<WorkoutMenu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchMenus = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSavedMenus()
      setMenus(data)
    } catch (e: any) {
      setError(e?.message || "メニューの取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchMenus()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!window.confirm("このメニューを削除しますか？")) return
    setDeletingId(id)
    try {
      await deleteMenu(id)
      setMenus((prev) => prev.filter((m) => m.id !== id))
    } catch (e: any) {
      alert(e?.message || "削除に失敗しました")
    } finally {
      setDeletingId(null)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">メニューリストの閲覧にはログインが必要です</p>
          <Link href="/login">
            <Button className="btn-primary px-8 py-4 text-lg">ログイン</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 rounded-full glass-effect px-6 py-3 text-sm font-medium text-primary shadow-lg mb-6">
            <Save className="h-4 w-4" />
            保存済みメニュー一覧
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">メニューリスト</h1>
          <p className="text-muted-foreground">保存したトレーニングメニューを確認・管理できます</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground">読み込み中...</p>
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-20">{error}</div>
        ) : menus.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">保存されたメニューがありません</p>
            <Link href="/input">
              <Button className="btn-primary px-8 py-4 text-lg">新しいメニューを作成</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            {menus.map((menu) => (
              <Card key={menu.id} className="menu-item">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <Save className="h-5 w-5 text-primary" />
                    {menu.name}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {menu.createdAt.toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-muted-foreground text-sm">
                      曜日数: {Object.keys(menu.menuData.weeklyMenu).length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={{
                        pathname: "/result",
                        query: { menuid: menu.id },
                      }}
                      className="btn-outline px-6 py-2 text-base"
                    >
                      詳細を見る
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="px-6 py-2"
                      disabled={deletingId === menu.id}
                      onClick={() => handleDelete(menu.id)}
                    >
                      {deletingId === menu.id ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          削除中...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
                          削除
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline" size="sm" className="btn-outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ホームに戻る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}