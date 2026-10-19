import React, { useState, useEffect } from 'react'
import { useMusic } from '../context/MusicContext'

const PlaylistsView = () => {
  const { 
    user, 
    token,
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    isCreateModalOpen, 
    setIsCreateModalOpen, 
    closeCreatePlaylistModal,
    selectedPlaylist,
    setSelectedPlaylist,
    removeSongFromPlaylist,
    currentView // <--- ADD THIS HERE
  } = useMusic()

  const [playlists, setPlaylists] = useState([])
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch user playlists whenever user or currentView changes
  useEffect(() => {
    const userId = user?._id || user?.id || user?.userId
    if (!userId) {
      setLoading(false)
      return
    }

    // Always fetch latest state from server
    fetch(`http://localhost:3000/api/playlists/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPlaylists(data)
          
          // If a playlist is currently selected, sync its updated songs list in real-time
          if (selectedPlaylist) {
            const updatedSelected = data.find(p => p._id === selectedPlaylist._id)
            if (updatedSelected) {
              setSelectedPlaylist(updatedSelected)
            }
          }
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch playlists:", err)
        setLoading(false)
      })
  }, [user, currentView]) // <--- RE-FETCH ON VIEW SWITCH

  const handleCloseModal = () => {
    setNewPlaylistName('')
    setNewPlaylistDesc('')
    if (closeCreatePlaylistModal) {
      closeCreatePlaylistModal()
    } else if (setIsCreateModalOpen) {
      setIsCreateModalOpen(false)
    }
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    if (!newPlaylistName.trim()) return

    const userId = user?._id || user?.id || user?.userId
    if (!userId) {
      return
    }

    try {
      const res = await fetch('http://localhost:3000/api/playlists', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: newPlaylistName,
          description: newPlaylistDesc,
          userId: userId
        })
      })
      const data = await res.json()
      if (res.ok) {
        setPlaylists(prev => [...prev, data])
        handleCloseModal()
      } else {
        console.error("Backend error:", data)
      }
    } catch (err) {
      console.error("Network or Backend Error:", err)
    }
  }

  if (!user) {
    return (
      <div className="bg-[#12141c] rounded-2xl p-8 flex flex-col items-center justify-center h-full text-center text-gray-400">
        <h2 className="text-2xl font-bold text-white mb-2">Playlists Locked</h2>
        <p>Please log in to create and manage your personal playlists.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#12141c] rounded-2xl p-6 overflow-y-auto flex flex-col gap-6 text-white h-full">
      {/* Header & Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Playlists</h1>
          <p className="text-sm text-gray-400 mt-0.5">Organize your favorite tracks and custom audio</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen && setIsCreateModalOpen(true)}
          className="bg-[#00f2fe] text-black font-bold px-5 py-2.5 rounded-xl hover:bg-[#35f5ff] transition-all shadow-[0_0_20px_rgba(0,242,254,0.2)] cursor-pointer text-sm"
        >
          + New Playlist
        </button>
      </div>

      {/* Playlist Details View or Grid View */}
      {selectedPlaylist ? (
        <div className="flex flex-col gap-6">
          <button 
            onClick={() => setSelectedPlaylist(null)}
            className="text-sm text-[#00f2fe] hover:underline w-fit cursor-pointer flex items-center gap-1"
          >
            ← Back to Playlists
          </button>
          
          <div className="bg-gradient-to-r from-[#1a2332] to-[#0f141f] p-6 rounded-2xl border border-gray-800 flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold">{selectedPlaylist.name}</h2>
            <p className="text-sm text-gray-400">{selectedPlaylist.description || "No description provided."}</p>
            <p className="text-xs text-[#00f2fe] font-mono mt-2">{selectedPlaylist.songs?.length || 0} tracks</p>
          </div>

          <div className="flex flex-col gap-2">
            {selectedPlaylist.songs?.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">This playlist is empty. Add songs from discovery or your history!</p>
            ) : (
              selectedPlaylist.songs.map((song, index) => {
                const isCurrent = currentTrack?._id === song._id || currentTrack?.audioUrl === song.audioUrl
                return (
                  <div 
                    key={song._id || index}
                    onClick={() => isCurrent ? togglePlay() : playTrack(song, selectedPlaylist.songs)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                      isCurrent ? 'bg-[#1c2233] border-[#00f2fe]' : 'bg-[#161922] border-gray-800/40 hover:bg-[#1c202d]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-mono w-6">{index + 1}</span>
                      <div>
                        <h4 className={`text-sm font-semibold ${isCurrent ? 'text-[#00f2fe]' : 'text-white'}`}>{song.title}</h4>
                        <p className="text-xs text-gray-400">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">{isCurrent && isPlaying ? 'Playing...' : 'Play'}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeSongFromPlaylist(selectedPlaylist._id, song._id || song.audioUrl)
                        }}
                        className="text-xs text-red-400 hover:text-red-300 hover:underline px-2 py-1 cursor-pointer"
                        title="Remove from playlist"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading playlists...</p>
          ) : playlists.length === 0 ? (
            <p className="text-gray-500 text-sm col-span-full py-8 text-center">No playlists created yet. Click "+ New Playlist" to start!</p>
          ) : (
            playlists.map((playlist) => (
              <div 
                key={playlist._id}
                onClick={() => setSelectedPlaylist(playlist)}
                className="bg-[#161922] p-5 rounded-xl border border-gray-800/40 hover:border-gray-700 hover:bg-[#1c202d] transition-all cursor-pointer flex flex-col justify-between h-36"
              >
                <div>
                  <h3 className="text-base font-bold text-white truncate">{playlist.name}</h3>
                  <p className="text-xs text-gray-400 truncate mt-1">{playlist.description || "Custom Playlist"}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span>{playlist.songs?.length || 0} songs</span>
                  <span className="text-[#00f2fe]">View →</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreatePlaylist} className="bg-[#161922] border border-gray-800 p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New Playlist</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium">Playlist Name</label>
              <input 
                type="text" 
                value={newPlaylistName} 
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="e.g., Late Night Vibe"
                required
                className="bg-[#0f141f] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f2fe]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium">Description (Optional)</label>
              <textarea 
                value={newPlaylistDesc} 
                onChange={(e) => setNewPlaylistDesc(e.target.value)}
                placeholder="Add a short description..."
                rows="2"
                className="bg-[#0f141f] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f2fe] resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-[#00f2fe] text-black font-bold px-5 py-2 rounded-xl text-sm hover:bg-[#35f5ff] transition-all cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default PlaylistsView