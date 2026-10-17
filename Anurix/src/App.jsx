import React, { useState, useEffect } from 'react'
import Sidebar from './HomePage/Sidebar'
import Main from './main/main'
import Footer from './footer/footer'
import { useMusic } from './context/MusicContext'
import Search from './HomePage/Search'
import Login from './components/Login'
import Signup from './components/Signup'
import SplashScreen from './components/Splashscreen'

const SearchView = () => <div className="text-2xl font-bold p-6"><Search /></div>
const ExploreView = () => <div className="text-2xl font-bold p-6">🚀 Explore View (Coming Soon)</div>
const LibraryView = () => <div className="text-2xl font-bold p-6">📚 Your Library View (Coming Soon)</div>

const App = () => {
  const { currentView, setCurrentView, user } = useMusic()
  const [loadingApp, setLoadingApp] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingApp(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  if (loadingApp) {
    return <SplashScreen />
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-[#0b0c10] text-white flex items-center justify-center p-4 animate-fadeIn">
        {currentView === 'signup' ? (
          <Signup switchToLogin={() => setCurrentView('login')} />
        ) : (
          <Login switchToSignup={() => setCurrentView('signup')} />
        )}
      </div>
    )
  }

  return (
    <div className='h-screen w-screen bg-[#0b0c10] text-white p-3 pb-0 gap-3 overflow-hidden hidden lg:grid grid-cols-[260px_1fr] grid-rows-[1fr_80px] animate-fadeIn'>
      <Sidebar />
      <main className="bg-[#12141c] rounded-2xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {currentView === 'home' && <Main />}
        {currentView === 'search' && <SearchView />}
        {currentView === 'explore' && <ExploreView />}
        {currentView === 'library' && <LibraryView />}
      </main>
      <div className="col-span-full -mx-3 bg-[#12141c] border-t border-gray-800/40 flex items-center">
        <Footer />
      </div>
    </div>
  )
}

export default App