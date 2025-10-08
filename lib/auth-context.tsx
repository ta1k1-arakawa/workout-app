"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,   
  reload,         
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore"
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
  deleteAccount: (password?: string) => Promise<void> // ← 変更
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

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


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          if (!u.displayName) {
            await reload(u) 
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

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
     
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
            displayName: fallbackName, 
            photoURL: user.photoURL ?? null,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          },
          { merge: true }
        )
      } catch (e) {
        console.warn("setDoc(users) failed:", e) 
      }
    } catch (e) {
      throw e 
    }
  }


  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('ログアウトエラー:', error)
      throw error
    }
  }

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!user) throw new Error('ユーザーがログインしていません')
    
    try {
      await updateProfile(user, {
        displayName,
        photoURL
      })

      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL,
        updatedAt: new Date()
      }, { merge: true })

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

  const reauthenticate = async (password: string) => {
    if (!user || !user.email) throw new Error("ユーザー情報が不正です")
    const credential = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, credential)
  }

  const deleteAccount = async (password?: string) => {
    if (!user) throw new Error("ユーザーがログインしていません")
    try {
      if (password) {
        await reauthenticate(password)
      }
      await deleteDoc(doc(db, "users", user.uid))
      await deleteUser(user)
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error("アカウント削除エラー:", error)
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
    updateUserProfile,
    deleteAccount, 
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
