/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from '@components/Navbar'
import { adminDelete, getAdminAccounts } from '@src/services/firebase'
import React, { useEffect, useState } from 'react'
import { RefreshIcon } from '@heroicons/react/solid'
import FlatList from '@components/FlatList'
import Swal from 'sweetalert2'
import Link from 'next/link'

interface IAccount {
  id: number
  tel: string
  fullName: string
}

const ViewPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<IAccount[]>([])

  const fetchAccounts = () => {
    setLoading(true)
    getAdminAccounts().then((data) => {
      setLoading(false)
      setAccounts(data as any)
    })
  }
  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleDelete = async (account: IAccount) => {
    const { isConfirmed } = await Swal.fire({
      title: `ต้องการจะลบ ${account.fullName} หรือไม่`,
      showConfirmButton: true,
      showCancelButton: true,
    })

    if (!isConfirmed) return
    setLoading(true)
    await adminDelete(account.id)
    fetchAccounts()
  }

  const isMe = (id: string) => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('uid') === id
  }

  return (
    <div>
      <Navbar />
      <div className="container py-12 ">
        {loading && <RefreshIcon className="mx-auto w-12 animate-spin" />}
        <h3 className="mb-12 text-center">
          บัญชีแอดมิน /
          <Link href="/admin/account/add">
            <span className="underline ml-1">เพิ่ม</span>
          </Link>
        </h3>
        <FlatList
          className="space-y-6"
          data={accounts}
          renderItem={(item) => (
            <div className="flex justify-between rounded-lg border-2 border-gray-300 py-2 px-4 shadow-md">
              <div>{item.fullName}</div>
              <div>{item.tel}</div>
              <button
                className="rounded-md bg-red-400 px-2 text-white disabled:bg-opacity-50"
                disabled={isMe(item.id.toString())}
                onClick={handleDelete.bind(null, item)}
              >
                ลบ
              </button>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default ViewPage
