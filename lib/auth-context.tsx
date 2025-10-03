"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,   // ← 追加
  reload,          // ← 追加
  type User,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from './firebase/client'

interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Date
  lastLoginAt: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void> // ← 引数を2つに
  logout: () => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // ユーザープロフィール取得（Firestoreが無ければ作る＆displayName補完）
  const fetchUserProfile = async (user: User) => {
    try {
      const ref = doc(db, "users", user.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data() as any
        setUserProfile({
          uid: user.uid,
          email: user.email ?? "",
          displayName: data.displayName || user.displayName || (user.email?.split("@")[0] ?? ""),
          photoURL: user.photoURL ?? undefined,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
          lastLoginAt: data.lastLoginAt?.toDate?.() ?? new Date(),
        })
      } else {
        const fallbackName = user.displayName || (user.email?.split("@")[0] ?? "")
        const profile = {
          uid: user.uid,
          email: user.email,
          displayName: fallbackName,
          photoURL: user.photoURL ?? null,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        }
        await setDoc(ref, profile, { merge: true })
        setUserProfile({
          uid: user.uid,
          email: user.email ?? "",
          displayName: fallbackName,
          photoURL: user.photoURL ?? undefined,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        })
      }
    } catch (error) {
      console.warn("ユーザープロフィールの取得に失敗:", error)
    }
  }

  // 認証状態の監視：必要に応じて reload してから反映
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          if (!u.displayName) {
            await reload(u) // 最新プロフィールを反映
          }
        } catch {}
        setUser(u)
        await fetchUserProfile(u)
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // サインイン
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // ログイン時刻を更新（serverTimestamp に統一）
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        { lastLoginAt: serverTimestamp() },
        { merge: true }
      )
    } catch (error) {
      console.error('サインインエラー:', error)
      throw error
    }
  }

  // サインアップ：displayNameは使わず、メールのローカル部を既定名にする
  const signUp = async (email: string, password: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      const fallbackName = user.displayName || (user.email?.split("@")[0] ?? "")

      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            email: user.email,
            displayName: fallbackName, // ← 既定の表示名
            photoURL: user.photoURL ?? null,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          },
          { merge: true }
        )
      } catch (e) {
        console.warn("setDoc(users) failed:", e) // 致命扱いにしない
      }
    } catch (e) {
      throw e // アカウント作成そのものが失敗したときのみthrow
    }
  }

  // ログアウト
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('ログアウトエラー:', error)
      throw error
    }
  }

  // プロフィール更新
  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!user) throw new Error('ユーザーがログインしていません')
    
    try {
      await updateProfile(user, {
        displayName,
        photoURL
      })

      // Firestoreも更新
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL,
        updatedAt: new Date()
      }, { merge: true })

      // ローカル状態も更新
      setUserProfile(prev => prev ? {
        ...prev,
        displayName,
        photoURL
      } : null)
    } catch (error) {
      console.error('プロフィール更新エラー:', error)
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
