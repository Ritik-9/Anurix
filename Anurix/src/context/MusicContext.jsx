import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

const MusicContext = createContext()

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState({
    title: "Midnight Drive",
    artist: "Synthwave Collective",
    cover: "🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
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

  const [queue, setQueue] = useState([
    {
      title: "Midnight Drive",
      artist: "Synthwave Collective",
      cover: "🎵",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      title: "Focus Flow",
      artist: "Ambient Soundscapes",
      cover: "🎹",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    }
  ])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1) // 0 to 1
  const [currentView, setCurrentView] = useState('home')

  const audioRef = useRef(new Audio())

  // Auth Methods
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

  // Audio Event Listeners
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

  // Track & Playback Handlers
  useEffect(() => {
    if (currentTrack && currentTrack.audioUrl && currentTrack.audioUrl !== "#") {
      audioRef.current.src = currentTrack.audioUrl
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
      setCurrentTrack(queue[nextIdx])
      return nextIdx
    })
    setIsPlaying(true)
  }

  const prevTrack = () => {
    if (queue.length === 0) return
    setCurrentIndex(prevIdx => {
      const prevIdxCalc = (prevIdx - 1 + queue.length) % queue.length
      setCurrentTrack(queue[prevIdxCalc])
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