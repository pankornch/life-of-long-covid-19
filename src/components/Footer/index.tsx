import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <footer className="container flex flex-wrap items-center justify-between gap-3 py-4 text-white">
      <div className="flex items-center gap-x-2">
        <Image src="/logo.png" width={24} height={24} alt="logo" />
        <p className="text-sm font-medium">Life of long COVID-19</p>
      </div>
      <p className="text-xs">© 2022 All rights reserved.</p>
    </footer>
  )
}

export default Footer
