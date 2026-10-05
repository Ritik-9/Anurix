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

  const [currentView, setCurrentView] = useState('home')
  

  const audioRef = useRef(new Audio())

  useEffect(() => {
    if (currentTrack && currentTrack.audioUrl && currentTrack.audioUrl !== "#") {
      audioRef.current.src = currentTrack.audioUrl
      if (isPlaying) {
        audioRef.current.play()
          .catch(err => console.error("Playback error:", err))
      }
    }
  }, [currentTrack])

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
        .catch(err => console.error("Playback error:", err))
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const togglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  const playTrack = (track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  return (
    <MusicContext.Provider value={{ isPlaying, currentTrack, togglePlay, playTrack, currentView, setCurrentView }}>
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => useContext(MusicContext)