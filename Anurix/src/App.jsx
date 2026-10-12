import React from 'react'
import Sidebar from './HomePage/Sidebar'
import Main from './main/main'
import Footer from './footer/footer'
import { useMusic } from './context/MusicContext'
import Search from './HomePage/Search'
import Login from './components/Login'
import Signup from './components/Signup'

const SearchView = () => <div className="text-2xl font-bold p-6"><Search /></div>
const ExploreView = () => <div className="text-2xl font-bold p-6">🚀 Explore View (Coming Soon)</div>
const LibraryView = () => <div className="text-2xl font-bold p-6">📚 Your Library View (Coming Soon)</div>

const App = () => {
  const { currentView, setCurrentView, user } = useMusic()

  // 1. IF NOT LOGGED IN: Render full-screen Auth view
  if (!user) {
    return (
      <div className="h-screen w-screen bg-[#0b0c10] text-white flex items-center justify-center p-4">
        {currentView === 'signup' ? (
          <Signup switchToLogin={() => setCurrentView('login')} />
        ) : (
          <Login switchToSignup={() => setCurrentView('signup')} />
        )}
      </div>
    )
  }

  // 2. IF LOGGED IN: Render full Anurix Dashboard
  return (
    <div className='h-screen w-screen bg-[#0b0c10] text-white p-3 pb-0 gap-3 overflow-hidden hidden lg:grid grid-cols-[260px_1fr] grid-rows-[1fr_80px]'>
      <Sidebar />
      <main className="bg-[#12141c] rounded-2xl overflow-y-auto">
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