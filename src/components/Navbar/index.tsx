import React, { FC } from 'react'
import { MenuAlt3Icon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Props {
  title?: React.ReactNode
}
const Navbar: FC<Props> = ({ title = 'Life of long COVID-19' }) => {
  const router = useRouter()
  const handleClick = () => {
    const uid = localStorage.getItem('uid')

    if (!uid) router.push('/login')
    router.push('/admin')
  }

  return (
    <header className="container bg-primary pb-4 pt-6 text-white">
      <nav className="flex justify-between">
        <Link href="/">
          <h1 className="">{title}</h1>
        </Link>
        <MenuAlt3Icon className="h-14" onClick={handleClick} />
      </nav>
    </header>
  )
}

export default Navbar
