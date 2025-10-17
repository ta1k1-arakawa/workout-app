import { auth, db } from "@/lib/firebase/client"
import { WorkoutMenu, WorkoutMenuInput } from "./menuTypes"
import { addDoc, collection, getDocs, query } from "firebase/firestore"
import { orderBy } from "firebase/firestore"
import { deleteDoc, doc, getDoc } from "firebase/firestore"

// メニュー保存
export const savedMenus = async (input: WorkoutMenuInput) => {
    const user = auth.currentUser
    if (!user) {
        throw new Error("ユーザーがログインしていません。")
    }

    try {
        const menuRef = await addDoc(collection(db, 'users', user.uid, 'savedMenus'),{
            name: input.name,
            createdAt: new Date(),
            menuData: input.menuData
        })
        return menuRef.id
    } catch (error) {
        console.error('メニュー保存エラー:', error)
        throw new Error('メニューの保存に失敗しました')
    }
}

// 保存メニュー取得
export const getSavedMenus = async (): Promise<WorkoutMenu[]> => {
    const user = auth.currentUser
    if (!user) {
        throw new Error("ユーザーがログインしていません。")
    }

    try {
        const q = query(collection(db, 'users', user.uid, 'savedMenus'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt.toDate(),
            menuData: doc.data().menuData
        }))
    } catch (error) {
        console.error('メニュー取得エラー:', error)
        throw new Error('メニューの取得に失敗しました')
    }
}

// メニュー削除
export const deleteMenu = async (id: string): Promise<void> => {
    const user = auth.currentUser
    if (!user) {
        throw new Error("ユーザーがログインしていません。")
    }

    try {
        await deleteDoc(doc(db, 'users', user.uid, 'savedMenus', id))
    } catch (error) {
        console.error('メニュー削除エラー:', error)
        throw new Error('メニューの削除に失敗しました')
    }
}

export const getMenuById = async (id: string): Promise<WorkoutMenu | null> => {
    const user = auth.currentUser
    if (!user) {
        throw new Error("ユーザーがログインしていません。")
    }

    try {
        const docRef = doc(db, 'users', user.uid, 'savedMenus', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const data = docSnap.data()
            return {
                id: docSnap.id,
                name: data.name,
                createdAt: data.createdAt.toDate(),
                menuData: data.menuData
            }
        } else {
            return null
        }
    } catch (error) {
        console.error('メニュー取得エラー:', error)
        throw new Error('メニューの取得に失敗しました')
    }
}