import { firestore } from '@src/configs/firebase'
import { ECollection, ERole, IForm } from '@src/types'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { v1 } from 'uuid'
import bcrypt from 'bcryptjs'

export const formSubmit = async (values: IForm) => {
  const formRef = doc(firestore, ECollection.FORMS, values.id || v1())
  const res = await setDoc(formRef, { ...values, createdAt: new Date() })
  return res
}

export const adminRegister = async (
  tel: string,
  password: string,
  fullName: string
) => {
  const id = v1()
  password = bcrypt.hashSync(password, 10)

  const payload = {
    id,
    password,
    fullName,
    tel,
    role: ERole.ADMIN,
    createdAt: new Date(),
  }

  const userRef = doc(firestore, ECollection.USERS, id)
  const res = await setDoc(userRef, payload)
  return res
}

export const adminLogin = async (tel: string, password: string) => {
  const userRef = collection(firestore, ECollection.USERS)
  const q = query(userRef, where('tel', '==', tel))
  const res = await getDocs(q)
  if (res.empty) return false

  const [doc] = res.docs

  if (!bcrypt.compareSync(password, doc.data().password)) return false
  return doc.data()
}

export const getResponses = async () => {
  const formRef = collection(firestore, ECollection.FORMS)
  const q = query(formRef, orderBy('createdAt', 'desc'))
  const res = await getDocs(q)
  if (res.empty) return []
  return res.docs.map((e) => ({
    ...e.data(),
    createdAt: e.data().createdAt.toDate(),
  }))
}

export const getResponseById = async (id: string) => {
  const formRef = doc(firestore, ECollection.FORMS, id)
  const res = await getDoc(formRef)

  const data = res.data()
  if (!res.exists || !data) return null

  return {
    ...data,
    createdAt: data.createdAt.toDate(),
  }
}

export const getAdminAccounts = async () => {
  const userRef = collection(firestore, ECollection.USERS)
  const q = query(userRef)
  const res = await getDocs(q)
  if (res.empty) return []
  return res.docs.map((e) => ({
    ...e.data(),
    createdAt: e.data().createdAt.toDate(),
  }))
}

export const adminDelete = async (id: number) => {
  const userRef = doc(firestore, ECollection.USERS, id.toString())
  return await deleteDoc(userRef)
}
