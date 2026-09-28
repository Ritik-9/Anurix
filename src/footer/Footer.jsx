import React from 'react'
import { useMusic } from '../context/MusicContext'

const Footer = () => {
  const {isPlaying, currentTrack, togglePlay}=useMusic()
  return (
    <div className="w-full h-full px-6 flex items-center justify-between select-none">
      
      <div className="flex items-center gap-4 w-1/4">
        <div className="w-12 h-12 bg-linear-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center shrink-0 border border-gray-800/60">
          {currentTrack.cover}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
          <p className="text-xs text-gray-400 truncate mt-0.5">{currentTrack.artist}</p>
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
          <span>1:24</span>
          <div className="h-1.5 flex-1 bg-gray-800 rounded-full overflow-hidden cursor-pointer group">
            <div className="h-full w-1/3 bg-[#00f2fe] rounded-full group-hover:brightness-125 transition-all"></div>
          </div>
          <span>3:45</span>
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
