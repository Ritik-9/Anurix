import React, { useState } from 'react'
import { House, Search, Telescope, Library, ListPlus, LogOut } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const Sidebar = () => {
  const [showPlaylist, setshowPlaylist] = useState(false)
  const { currentView, setCurrentView, user, logoutUser } = useMusic()

  const getBtnClass = (viewName) => {
    return `w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
      currentView === viewName 
        ? 'bg-[#1a1d29] text-white font-medium shadow-inner' 
        : 'text-gray-400 hover:text-white hover:bg-[#1a1d29]/50'
    }`
  }

  return (
    <div className="h-full flex flex-col justify-between py-2">
      <div className="flex flex-col gap-2">
        <div className="text-white font-bold tracking-wider text-xl flex items-center gap-3 px-2 mb-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00f2fe]">
            <rect x="2" y="7" width="3" height="10" rx="1.5" fill="currentColor"/>
            <rect x="7" y="3" width="3" height="18" rx="1.5" fill="currentColor"/>
            <rect x="12" y="9" width="3" height="6" rx="1.5" fill="currentColor"/>
            <rect x="17" y="5" width="3" height="14" rx="1.5" fill="currentColor"/>
          </svg>
          <span>Anurix</span>
        </div>

        <button onClick={() => setCurrentView('home')} className={getBtnClass('home')}>
          <span><House size={20} /></span>Home
        </button>
        <button onClick={() => setCurrentView('search')} className={getBtnClass('search')}>
          <span><Search size={20} /></span>Search
        </button>
        <button onClick={() => setCurrentView('explore')} className={getBtnClass('explore')}>
          <span><Telescope size={20} /></span>Explore
        </button>
        <button onClick={() => setCurrentView('library')} className={getBtnClass('library')}>
          <span><Library size={20} /></span>Your Library
        </button>

        {/* Playlists */}
        <div className="flex flex-col gap-2 border-t border-gray-800/60 pt-4">
          <button 
            onClick={() => setshowPlaylist(!showPlaylist)} 
            className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <span><ListPlus size={20} /></span>Playlist
          </button>
          
          {showPlaylist && (
            <div className="flex flex-col gap-2">
              <button className="text-left py-2 px-9 rounded-lg hover:text-white hover:bg-[#1a1d29]/40 transition-colors">Chill</button>
              <button className="text-left py-2 px-9 rounded-lg hover:text-white hover:bg-[#1a1d29]/40 transition-colors">Focus Vibes</button>
              <button className="text-left py-2 px-9 rounded-lg hover:text-white hover:bg-[#1a1d29]/40 transition-colors">Workout</button>
              <button className="text-left py-2 px-9 rounded-lg hover:text-white hover:bg-[#1a1d29]/40 transition-colors">Study</button>
              <button className="text-left py-2 px-9 rounded-lg hover:text-white hover:bg-[#1a1d29]/40 transition-colors">Sleep</button>
            </div>
          )}
        </div>
      </div>

      {user && (
        <div className="border-t border-gray-800/60 pt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-[#161922] p-2.5 rounded-xl border border-gray-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] flex items-center justify-center text-black font-bold text-sm">
              {user.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[10px] text-gray-400">Logged in as</span>
              <span className="text-xs font-semibold text-white truncate">{user.userName}</span>
            </div>
          </div>

          <button 
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      )}
    </div>
  )
}

export default Sidebar