import React, { useState, useEffect } from 'react'
import Sidebar from './HomePage/Sidebar'
import Main from './main/main'
import Footer from './footer/footer'
import { useMusic } from './context/MusicContext'
import Search from './HomePage/Search'
import PlaylistsView from './components/PlaylistsView'
import Login from './components/Login'
import Signup from './components/Signup'
import SplashScreen from './components/Splashscreen'
import YourCreationsView from './components/YourCreationsView'

const SearchView = () => <div className="text-2xl font-bold p-6"><Search /></div>
const ExploreView = () => <div className="text-2xl font-bold p-6">🚀 Explore View (Coming Soon)</div>
const LibraryView = () => <div className="text-2xl font-bold p-6">📚 Your Library View (Coming Soon)</div>

const App = () => {
  // Destructure toastMessage here
  const { currentView, setCurrentView, user, toastMessage } = useMusic()
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
    <div className='h-screen w-screen bg-[#0b0c10] text-white p-3 pb-0 gap-3 overflow-hidden hidden lg:grid grid-cols-[260px_minmax(0,1fr)] grid-rows-[1fr_80px] animate-fadeIn relative'>
      <Sidebar />
      <main className="bg-[#12141c] rounded-2xl overflow-y-auto min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {currentView === 'home' && <Main />}
        {currentView === 'search' && <SearchView />}
        {currentView === 'explore' && <ExploreView />}
        {currentView === 'library' && <LibraryView />}
        {currentView === 'playlists' && <PlaylistsView />}
        {currentView === 'creations' && <YourCreationsView />}
      </main>
      <div className="col-span-full -mx-3 bg-[#12141c] border-t border-gray-800/40 flex items-center">
        <Footer />
      </div>

      {/* Toast Banner Banner */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 bg-[#00f2fe] text-black font-bold px-4 py-3 rounded-xl shadow-2xl z-50 text-xs flex items-center gap-2 animate-bounce">
          <span>🎵</span> {toastMessage}
        </div>
      )}
    </div>
  )
}

export default App