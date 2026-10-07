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

  // Audio event listeners for time progression and auto-advance
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

  // Handle source updates
  useEffect(() => {
    if (currentTrack && currentTrack.audioUrl && currentTrack.audioUrl !== "#") {
      audioRef.current.src = currentTrack.audioUrl
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback error:", err))
      }
    }
  }, [currentTrack])

  // Handle play/pause toggle
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Playback error:", err))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const togglePlay = () => setIsPlaying(prev => !prev)

  const playTrack = (track) => {
    // Check if the track already exists in the queue
    let existingIndex = queue.findIndex(t => 
      (t._id && t._id === track._id) || (t.audioUrl && t.audioUrl === track.audioUrl)
    )

    if (existingIndex === -1) {
      // If it's a new track, append it to the queue and jump to it
      const updatedQueue = [...queue, track]
      setQueue(updatedQueue)
      const newIdx = updatedQueue.length - 1
      setCurrentIndex(newIdx)
      setCurrentTrack(updatedQueue[newIdx])
    } else {
      // If it's already in the queue, just switch to its index
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
      setCurrentView
    }}>
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => useContext(MusicContext)