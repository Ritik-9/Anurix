import React, { createContext, useContext, useState } from 'react'

const MusicContext = createContext()

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState({
    title: "Midnight Drive",
    artist: "Synthwave Collective",
    cover: "🎵"
  })

  const [currentView, setCurrentView] = useState('home')

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