import React, { useState, useEffect } from 'react'
import { useMusic } from '../context/MusicContext'
import AddToPlaylistMenu from './AddToPlaylistMenu'
import UploadTrackModal from './UploadTrackModal'

const YourCreationsView = () => {
  const { playTrack, currentTrack, isPlaying, togglePlay, user } = useMusic()
  const [myUploads, setMyUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const userId = user?._id || user?.id || user?.userId

  const fetchMyUploads = () => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetch(`http://localhost:3000/api/creatorupload/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMyUploads(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch user creations:", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchMyUploads()
  }, [userId])

  const renderCover = (item) => {
    const imageUrl = item.coverUrl || item.cover || item.albumArt || item.img
    const isUrl = imageUrl && typeof imageUrl === 'string' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))

    return (
      <div className="w-full h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative">
        {isUrl ? (
          <img src={imageUrl} alt={item.title || "Cover"} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">{typeof item.cover === 'string' && !item.cover.startsWith('http') ? item.cover : '🎵'}</span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-[#12141c] rounded-2xl p-8 overflow-y-auto flex flex-col gap-6 min-w-0 w-full h-full text-white">
      {/* Header & Upload Button */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Creations</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your uploaded tracks, audio files, and privacy settings.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-[#00f2fe] text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#35f5ff] transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)] cursor-pointer flex items-center gap-2"
        >
          <span>+</span> Upload New Track
        </button>
      </div>

      {/* Uploads Grid */}
      {loading ? (
        <div className="text-gray-400 text-sm py-8">Loading your creations...</div>
      ) : !userId ? (
        <div className="text-gray-500 text-sm py-8">Please log in to view your uploaded tracks.</div>
      ) : myUploads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center border border-dashed border-gray-800 rounded-2xl">
          <span className="text-5xl">🎶</span>
          <div>
            <h3 className="text-lg font-bold text-white">No tracks uploaded yet</h3>
            <p className="text-sm text-gray-400 mt-1">Upload your original music or audio files to get started.</p>
          </div>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="mt-2 bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-semibold px-4 py-2 rounded-xl text-xs hover:bg-[#00f2fe] hover:text-black transition-all cursor-pointer"
          >
            Upload Your First Track
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myUploads.map((item, index) => {
            const isCurrent = (currentTrack?._id && currentTrack._id === item._id) || 
                              (currentTrack?.audioUrl && currentTrack.audioUrl === item.audioUrl)

            return (
              <div 
                key={item._id || index}
                onClick={() => isCurrent ? togglePlay() : playTrack(item, myUploads)}
                className={`bg-[#161922] p-4 rounded-2xl flex flex-col gap-3 group hover:bg-[#1c202d] transition-all duration-300 cursor-pointer border ${
                  isCurrent ? 'border-[#00f2fe] bg-[#1c2233]' : 'border-gray-800/40 hover:border-gray-700'
                }`}
              >
                <div className="relative">
                  {renderCover(item)}
                  <span className={`absolute top-2 right-2 backdrop-blur-md text-[10px] px-2 py-0.5 rounded-md border ${
                    item.isPublic ? 'bg-black/70 text-[#00f2fe] border-[#00f2fe]/40' : 'bg-black/70 text-gray-300 border-gray-700'
                  }`}>
                    {item.isPublic ? '🌐 Public' : '🔒 Private'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                  <div className="truncate">
                    <h3 className={`text-sm font-semibold truncate ${isCurrent ? 'text-[#00f2fe]' : 'text-white'}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{item.artist}</p>
                  </div>
                  <AddToPlaylistMenu track={item} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upload Modal */}
      <UploadTrackModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSongUploaded={(newUpload) => setMyUploads(prev => [newUpload, ...prev])} 
      />
    </div>
  )
}

export default YourCreationsView