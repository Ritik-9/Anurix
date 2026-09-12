import React from 'react'
import Sidebar from './HomePage/Sidebar'
import Main from './main/main'
import Footer from './footer/footer'

const App = () => {
  return (
    <div className='h-screen w-screen bg-[#0b0c10] text-white p-3 gap-3 overflow-hidden hidden lg:grid grid-cols-[260px_1fr] grid-rows-[1fr_90px]'>
      <Sidebar />
      <Main />
      <Footer />
    </div>
  )
}

export default App
