import React from 'react'
import Sidebar from './HomePage/Sidebar'
import Main from './main/main'
import Footer from './footer/footer'

const App = () => {
  return (
    <div className='h-screen w-screen bg-[#0b0c10] text-white p-3 pb-0 gap-3 overflow-hidden hidden lg:grid grid-cols-[260px_1fr] grid-rows-[1fr_80px]'>
      <Sidebar />
      <Main />
      <div className="col-span-full -mx-3 bg-[#12141c] border-t border-gray-800/40 flex items-center">
        <Footer />
      </div>
    </div>
  )
}

export default App
