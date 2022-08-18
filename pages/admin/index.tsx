import FlatList from '@components/FlatList'
import Navbar from '@components/Navbar'
import { RefreshIcon } from '@heroicons/react/solid'
import { getResponses } from '@src/services/firebase'
import { IForm } from '@src/types'
import { dateFormatter } from '@src/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const AdminIndexPage = () => {
  const [responses, setResponses] = useState<IForm[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    getResponses().then((data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setResponses(data as any)
      setLoading(false)
    })
  }, [])

  const handleLogOut = () => {
    localStorage.removeItem('uid')
    router.replace('/')
  }

  return (
    <div>
      <div className="bg-primary">
        <Navbar title="Life of long COVID-19" />
      </div>
      <div className="container relative mt-12">
        <Link href="/admin/account">
          <h2 className='underline text-center mb-6'>จัดการบัญชีแอดมิน</h2>
        </Link>
        <h3 className="mb-6 text-center">จำนวนแบบประเมิน {responses.length}</h3>
        {loading && <RefreshIcon className="mx-auto w-12 animate-spin" />}
        <FlatList
          className="grid grid-cols-1 gap-12"
          data={responses}
          renderItem={(item) => (
            <Link href={`/admin/response/${item.id}`}>
              <div className="rounded-lg border border-gray-200 px-6 py-4 shadow-lg hover:shadow-xl">
                <div className="flex justify-between text-lg">
                  <p>{item.userInfo.fullName}</p>
                  <p> {item.userInfo.occupation}</p>
                </div>
                <p>{item.syndrom.topic}</p>
                <p className="text-right text-xs">
                  {dateFormatter(item.createdAt)}
                </p>
              </div>
            </Link>
          )}
        />
        <div className="container fixed inset-x-0 bottom-12">
          <button className="btn  bg-red-400 text-white" onClick={handleLogOut}>
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminIndexPage
