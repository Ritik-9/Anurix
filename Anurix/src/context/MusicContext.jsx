import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

const MusicContext = createContext()

const DEFAULT_SONGS = [
  {
    _id: "1",
    title: "Midnight Drive",
    artist: "Synthwave Collective",
    cover: "🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    _id: "2",
    title: "Focus Flow",
    artist: "Ambient Soundscapes",
    cover: "🎹",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    _id: "3",
    title: "Neon Bloom",
    artist: "Cyber Pulse",
    cover: "🌆",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    _id: "4",
    title: "Starlight Echo",
    artist: "Luna Phase",
    cover: "✨",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  }
]

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null) 

  // --- Toast Notification State ---
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const [currentTrack, setCurrentTrack] = useState(() => {
    try {
      const savedTrack = localStorage.getItem('anurix_last_track')
      return savedTrack ? JSON.parse(savedTrack) : DEFAULT_SONGS[0]
    } catch {
      return DEFAULT_SONGS[0]
    }
  })

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('anurix_history')
      if (savedHistory) return JSON.parse(savedHistory)
      return [...DEFAULT_SONGS].sort(() => Math.random() - 0.5)
    } catch {
      return DEFAULT_SONGS
    }
  })

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('anurix_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('anurix_token') || null)

  const [queue, setQueue] = useState(DEFAULT_SONGS)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Playlist Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const openCreatePlaylistModal = () => {
    setCurrentView('playlists')
    setIsCreateModalOpen(true)
  }

  const closeCreatePlaylistModal = () => {
    setIsCreateModalOpen(false)
  }

  // --- Add Song to Playlist Function ---
  const addSongToPlaylist = async (playlistId, track) => {
  try {
    const res = await fetch(`http://localhost:3000/api/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ song: track })
    })

    const data = await res.json()
    if (!res.ok) {
      showToast(data.message || 'Failed to add song to playlist')
      return false
    }

    // Update active selectedPlaylist in real-time if selected
    if (selectedPlaylist && selectedPlaylist._id === playlistId) {
      setSelectedPlaylist(data)
    }

    showToast('Song added successfully!')
    return true
  } catch (err) {
    console.error('Error adding song to playlist:', err)
    showToast('Server error while adding song')
    return false
  }
}

  // --- Remove Song from Playlist Function ---
  const removeSongFromPlaylist = async (playlistId, songIdentifier) => {
    try {
      const res = await fetch(`http://localhost:3000/api/playlists/${playlistId}/songs/${songIdentifier}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      })

      const data = await res.json()
      if (!res.ok) {
        showToast(data.message || 'Failed to remove song')
        return false
      }

      // Update active selectedPlaylist instantly in real-time
      if (selectedPlaylist && selectedPlaylist._id === playlistId) {
        setSelectedPlaylist(data)
      }

      showToast('Song removed from playlist')
      return true
    } catch (err) {
      console.error('Error removing song:', err)
      showToast('Server error removing song')
      return false
    }
  }

  const queueRef = useRef(queue)
  const currentIndexRef = useRef(currentIndex)

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [currentView, setCurrentView] = useState('home')

  const audioRef = useRef(new Audio())

  const loginUser = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('anurix_user', JSON.stringify(userData))
    localStorage.setItem('anurix_token', userToken)
  }

  const logoutUser = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      })
    } catch (err) {
      console.error("Logout error:", err)
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem('anurix_user')
    localStorage.removeItem('anurix_token')
  }

  const addToHistory = (track) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter(t => {
        const isSameId = t._id && track._id && t._id === track._id
        const isSameUrl = t.audioUrl && track.audioUrl && t.audioUrl === track.audioUrl
        return !(isSameId || isSameUrl)
      })
      const updated = [track, ...filtered].slice(0, 8) 
      
      try {
        localStorage.setItem('anurix_history', JSON.stringify(updated))
      } catch (e) {
        console.error("Failed to save history", e)
      }
      return updated
    })
  }

  const nextTrack = () => {
    const currentQueue = queueRef.current
    if (!currentQueue || currentQueue.length === 0) return
    const currentIdx = currentIndexRef.current
    const nextIdx = (currentIdx + 1) % currentQueue.length
    const nextSong = currentQueue[nextIdx]

    if (nextSong) {
      setCurrentIndex(nextIdx)
      currentIndexRef.current = nextIdx 
      setCurrentTrack(nextSong)
      addToHistory(nextSong)
    }
    setIsPlaying(true)
  }

  const prevTrack = () => {
    const currentQueue = queueRef.current
    if (!currentQueue || currentQueue.length === 0) return

    const currentIdx = currentIndexRef.current
    const prevIdxCalc = (currentIdx - 1 + currentQueue.length) % currentQueue.length
    const prevSong = currentQueue[prevIdxCalc]

    if (prevSong) {
      setCurrentIndex(prevIdxCalc)
      currentIndexRef.current = prevIdxCalc 
      setCurrentTrack(prevSong)
      addToHistory(prevSong)
    }
    setIsPlaying(true)
  }
  const nextTrackRef = useRef(nextTrack)
  useEffect(() => {
    nextTrackRef.current = nextTrack
  }, [nextTrack])

  useEffect(() => {
    const audio = audioRef.current

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => {
      if (nextTrackRef.current) {
        nextTrackRef.current()
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    if (currentTrack && currentTrack.audioUrl && currentTrack.audioUrl !== "#") {
      audioRef.current.src = currentTrack.audioUrl
      
      localStorage.setItem('anurix_last_track', JSON.stringify(currentTrack))

      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback error:", err))
      }
    }
  }, [currentTrack])

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Playback error:", err))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const togglePlay = () => setIsPlaying(prev => !prev)

  const playTrack = (track, customQueue = null) => {
    addToHistory(track)

    setQueue(prevQueue => {
      const activeQueue = customQueue && customQueue.length > 0 ? customQueue : prevQueue
      
      let existingIndex = activeQueue.findIndex(t => 
        (t._id && t._id === track._id) || (t.audioUrl && t.audioUrl === track.audioUrl)
      )

      let targetIndex = existingIndex
      let finalQueue = activeQueue

      if (existingIndex === -1) {
        finalQueue = [...activeQueue, track]
        targetIndex = finalQueue.length - 1
      }

      setCurrentIndex(targetIndex)
      currentIndexRef.current = targetIndex 
      setCurrentTrack(finalQueue[targetIndex])
      
      return finalQueue
    })
    
    setIsPlaying(true)
  }

  const seekAudio = (time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const changeVolume = (val) => {
    setVolume(val)
    audioRef.current.volume = val
  }

  return (
    <MusicContext.Provider value={{
      isPlaying,
      currentTrack,
      currentTime,
      duration,
      volume,
      recentlyPlayed,
      togglePlay,
      playTrack,
      nextTrack,
      prevTrack,
      seekAudio,
      changeVolume,
      currentView,
      setCurrentView,
      user,
      token,
      loginUser,
      logoutUser,
      isCreateModalOpen,
      setIsCreateModalOpen,
      openCreatePlaylistModal,
      closeCreatePlaylistModal,
      selectedPlaylist,
      setSelectedPlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist
    }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#00f2fe] text-black font-bold px-5 py-3 rounded-xl shadow-2xl z-50 text-xs flex items-center gap-2 animate-bounce">
          <span>🎵</span> {toastMessage}
        </div>
      )}
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => useContext(MusicContext)