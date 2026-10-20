import React, { useState, useEffect } from 'react'
import { House, Search, Telescope, Library, ListPlus, LogOut, Plus, Music, Sparkles } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

const Sidebar = () => {
  const [showPlaylist, setShowPlaylist] = useState(true)
  const [userPlaylists, setUserPlaylists] = useState([])
  
  const { currentView, setCurrentView, user, logoutUser, openCreatePlaylistModal, setSelectedPlaylist } = useMusic()

  // Fetch playlists for the sidebar dropdown
  useEffect(() => {
    const userId = user?._id || user?.id || user?.userId
    if (!userId) {
      setUserPlaylists([])
      return
    }

    fetch(`http://localhost:3000/api/playlists/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUserPlaylists(data)
        }
      })
      .catch(err => console.error("Failed to fetch sidebar playlists:", err))
  }, [user, currentView])

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

        <button onClick={() => { setSelectedPlaylist(null); setCurrentView('home'); }} className={getBtnClass('home')}>
          <span><House size={20} /></span>Home
        </button>
        <button onClick={() => { setSelectedPlaylist(null); setCurrentView('search'); }} className={getBtnClass('search')}>
          <span><Search size={20} /></span>Search
        </button>
        <button onClick={() => { setSelectedPlaylist(null); setCurrentView('explore'); }} className={getBtnClass('explore')}>
          <span><Telescope size={20} /></span>Explore
        </button>
        <button onClick={() => { setSelectedPlaylist(null); setCurrentView('library'); }} className={getBtnClass('library')}>
          <span><Library size={20} /></span>Your Library
        </button>

        {/* Updated Your Creations Button */}
        <button 
          onClick={() => { setSelectedPlaylist(null); setCurrentView('creations'); }} 
          className={getBtnClass('creations')}
        >
          <span><Sparkles size={20} className="text-[#00f2fe]" /></span>Your Creations
        </button>

        {/* Playlists Dropdown Section */}
        <div className="flex flex-col gap-2 border-t border-gray-800/60 pt-4">
          <button 
            onClick={() => {
              setSelectedPlaylist(null)
              setCurrentView('playlists')
              setShowPlaylist(!showPlaylist)
            }} 
            className={getBtnClass('playlists')}
          >
            <span><ListPlus size={20} /></span>Playlists
          </button>

          {showPlaylist && (
            <div className="flex flex-col gap-1 pl-4 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden">
              <button 
                type="button"
                onClick={() => {
                  setSelectedPlaylist(null)
                  setCurrentView('playlists')
                  openCreatePlaylistModal()
                }} 
                className="flex items-center gap-2 text-left py-2 px-3 rounded-xl text-xs font-semibold text-[#00f2fe] hover:bg-[#00f2fe]/10 transition-all cursor-pointer border border-[#00f2fe]/20 hover:border-[#00f2fe]/50 mt-1"
              >
                <Plus size={14} /> Create Playlist
              </button>

              {/* Dynamic User Playlists List */}
              {userPlaylists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => {
                    setSelectedPlaylist(playlist)
                    setCurrentView('playlists')
                  }}
                  className="flex items-center gap-2 text-left py-1.5 px-3 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-[#1a1d29]/50 transition-all cursor-pointer truncate"
                >
                  <Music size={12} className="text-gray-500 shrink-0" />
                  <span className="truncate">{playlist.name}</span>
                </button>
              ))}
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