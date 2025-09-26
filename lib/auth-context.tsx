"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
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
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // ユーザープロフィールをFirestoreから取得
  const fetchUserProfile = async (user: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const profileData = userDoc.data()
        setUserProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: profileData.displayName || user.displayName || '',
          photoURL: profileData.photoURL || user.photoURL || undefined,
          createdAt: profileData.createdAt?.toDate() || new Date(),
          lastLoginAt: new Date()
        })
      } else {
        // 新規ユーザーの場合、プロフィールを作成
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || undefined,
          createdAt: new Date(),
          lastLoginAt: new Date()
        }
        await setDoc(doc(db, 'users', user.uid), {
          ...newProfile,
          createdAt: new Date(),
          lastLoginAt: new Date()
        })
        setUserProfile(newProfile)
      }
    } catch (error) {
      console.error('ユーザープロフィールの取得に失敗:', error)
    }
  }

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        await fetchUserProfile(user)
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
      // ログイン時刻を更新
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        lastLoginAt: new Date()
      }, { merge: true })
    } catch (error) {
      console.error('サインインエラー:', error)
      throw error
    }
  }

  // サインアップ
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // プロフィールを更新
      await updateProfile(userCredential.user, {
        displayName: displayName
      })

      // Firestoreにユーザー情報を保存
      const userProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: displayName,
        photoURL: userCredential.user.photoURL || undefined,
        createdAt: new Date(),
        lastLoginAt: new Date()
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userProfile,
        createdAt: new Date(),
        lastLoginAt: new Date()
      })
    } catch (error) {
      console.error('サインアップエラー:', error)
      throw error
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
