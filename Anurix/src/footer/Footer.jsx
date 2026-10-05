import React from 'react'
import { useMusic } from '../context/MusicContext'

const Footer = () => {
  const { isPlaying, currentTrack, togglePlay, currentTime, duration, seekAudio } = useMusic()

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00"
    const minutes = Math.floor(secs / 60)
    const seconds = Math.floor(secs % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }


  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const percentage = clickX / width
    if (duration) {
      seekAudio(percentage * duration)
    }
  }

  return (
    <div className="w-full h-full px-6 flex items-center justify-between select-none">
      
      <div className="flex items-center gap-4 w-1/4">
        <div className="w-12 h-12 bg-gray-800 rounded-md overflow-hidden flex items-center justify-center shrink-0 relative">
          {currentTrack?.cover && (currentTrack.cover.startsWith('http') || currentTrack.cover.startsWith('https')) ? (
            <img 
              src={currentTrack.cover} 
              alt={currentTrack?.title || "Track Cover"} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          <span className={`text-xl ${currentTrack?.cover && (currentTrack.cover.startsWith('http') || currentTrack.cover.startsWith('https')) ? 'hidden' : 'flex'}`}>
            {currentTrack?.cover && !(currentTrack.cover.startsWith('http') || currentTrack.cover.startsWith('https')) ? currentTrack.cover : "🎵"}
          </span>
        </div>
        
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold text-white truncate">{currentTrack?.title || "Select a track"}</h4>
          <p className="text-xs text-gray-400 truncate mt-0.5">{currentTrack?.artist || "Anurix Stream"}</p>
        </div>
      </div>
      
      <div className="grid justify-items-center gap-2 w-2/4 max-w-md">
        <div className="flex items-center gap-6 text-gray-400">
          <button className="hover:text-white transition-colors cursor-pointer text-lg">🔀</button>
          <button className="hover:text-white transition-colors cursor-pointer text-lg">⏮</button>
          <button 
            onClick={togglePlay}
            className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="hover:text-white transition-colors cursor-pointer text-lg">⏭</button>
          <button className="hover:text-white transition-colors cursor-pointer text-lg">🔁</button>
        </div>
        
        <div className="w-full flex items-center gap-3 text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <div 
            onClick={duration ? handleProgressClick : undefined}
            className="h-1.5 flex-1 bg-gray-800 rounded-full overflow-hidden cursor-pointer group relative"
          >
            <div 
              className="h-full bg-[#00f2fe] rounded-full group-hover:brightness-125 transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 w-1/4 text-gray-400">
        <button className="hover:text-white transition-colors cursor-pointer text-lg">🎤</button>
        <button className="hover:text-white transition-colors cursor-pointer text-lg">🔊</button>
        <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden cursor-pointer group">
          <div className="h-full w-3/4 bg-gray-300 group-hover:bg-[#00f2fe] transition-colors"></div>
        </div>
      </div>
      
    </div>
  )
}

export default Footer