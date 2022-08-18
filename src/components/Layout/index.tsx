import Footer from '@components/Footer'
import Navbar from '@components/Navbar'
import React, { FC } from 'react'

interface Props {
  children: React.ReactNode
  title: React.ReactNode
}

const Layout: FC<Props> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar title={title} />
      <main className="container mt-6 flex h-auto min-h-screen flex-col rounded-t-[2rem] bg-white px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
