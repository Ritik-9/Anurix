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

  // Queue & Player States
  const [queue, setQueue] = useState(DEFAULT_SONGS)
  const [currentIndex, setCurrentIndex] = useState(0)

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
      const filtered = prev.filter(t => (t._id && t._id === track._id) || (t.audioUrl && t.audioUrl === track.audioUrl))
      const updated = [track, ...filtered].slice(0, 8) // Keep top 8 recently played
      try {
        localStorage.setItem('anurix_history', JSON.stringify(updated))
      } catch (e) {
        console.error("Failed to save history", e)
      }
      return updated
    })
  }

  useEffect(() => {
    const audio = audioRef.current

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => nextTrack()

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [queue, currentIndex])

  // Track Handlers
  useEffect(() => {
    if (currentTrack && currentTrack.audioUrl && currentTrack.audioUrl !== "#") {
      audioRef.current.src = currentTrack.audioUrl
      
      // Save last listened track
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

  const playTrack = (track) => {
    addToHistory(track)

    let existingIndex = queue.findIndex(t => 
      (t._id && t._id === track._id) || (t.audioUrl && t.audioUrl === track.audioUrl)
    )

    if (existingIndex === -1) {
      const updatedQueue = [...queue, track]
      setQueue(updatedQueue)
      const newIdx = updatedQueue.length - 1
      setCurrentIndex(newIdx)
      setCurrentTrack(updatedQueue[newIdx])
    } else {
      setCurrentIndex(existingIndex)
      setCurrentTrack(queue[existingIndex])
    }
    
    setIsPlaying(true)
  }

  const nextTrack = () => {
    if (queue.length === 0) return
    setCurrentIndex(prevIdx => {
      const nextIdx = (prevIdx + 1) % queue.length
      const nextSong = queue[nextIdx]
      setCurrentTrack(nextSong)
      addToHistory(nextSong)
      return nextIdx
    })
    setIsPlaying(true)
  }

  const prevTrack = () => {
    if (queue.length === 0) return
    setCurrentIndex(prevIdx => {
      const prevIdxCalc = (prevIdx - 1 + queue.length) % queue.length
      const prevSong = queue[prevIdxCalc]
      setCurrentTrack(prevSong)
      addToHistory(prevSong)
      return prevIdxCalc
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
      logoutUser
    }}>
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => useContext(MusicContext)