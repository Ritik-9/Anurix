import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

const AddToPlaylistMenu = ({ track }) => {
  const { user, addSongToPlaylist } = useMusic()
  const [playlists, setPlaylists] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const userId = user?._id || user?.id || user?.userId

  useEffect(() => {
    if (isOpen && userId) {
      fetch(`http://localhost:3000/api/playlists/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setPlaylists(data)
        })
        .catch(err => console.error(err))
    }
  }, [isOpen, userId])

  if (!userId) return null

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
        title="Add to playlist"
      >
        <Plus size={16} />
      </button>

      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-48 bg-[#161922] border border-gray-800 rounded-xl shadow-2xl py-2 z-50 text-xs"
        >
          <div className="px-3 py-1 font-semibold text-gray-400 border-b border-gray-800 mb-1">
            Add to Playlist
          </div>
          {playlists.length === 0 ? (
            <p className="px-3 py-2 text-gray-500">No playlists found</p>
          ) : (
            playlists.map((pl) => (
              <button
                key={pl._id}
                onClick={async () => {
                  const success = await addSongToPlaylist(pl._id, track)
                  if (success) setIsOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-[#1c202d] truncate cursor-pointer flex items-center justify-between"
              >
                <span className="truncate">{pl.name}</span>
                <Plus size={12} className="text-[#00f2fe]" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default AddToPlaylistMenu