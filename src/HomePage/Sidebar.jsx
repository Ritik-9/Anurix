import React, { useState } from 'react'
import { House,Search,Telescope,Library,ListPlus} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const Sidebar = () => {
    const [showPlaylist,setshowPlaylist]=useState(false)
    const { currentView, setCurrentView } = useMusic()

    const getBtnClass = (viewName) => {
        return `w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
            currentView === viewName 
                ? 'bg-[#1a1d29] text-white font-medium shadow-inner' 
                : 'text-gray-400 hover:text-white hover:bg-[#1a1d29]/50'
        }`
    }


  return (
    <div >
      <div className='flex flex-col gap-2'>
        <div className="text-white font-bold tracking-wider text-xl flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00f2fe]">
            <rect x="2" y="7" width="3" height="10" rx="1.5" fill="currentColor"/>
            <rect x="7" y="3" width="3" height="18" rx="1.5" fill="currentColor"/>
            <rect x="12" y="9" width="3" height="6" rx="1.5" fill="currentColor"/>
            <rect x="17" y="5" width="3" height="14" rx="1.5" fill="currentColor"/>
            </svg>
            <span>Anurix</span>
        </div>
        <button onClick={() => setCurrentView('home')} className='flex items-center gap-4 px-4 py-3 rounded-xl text-white hover:bg-[#1a1d29] font-medium transition-colors'><span><House size={20} /></span>Home</button>
        <button onClick={() => setCurrentView('search')} className='flex items-center gap-4 px-4 py-3 rounded-xl hover:text-white hover:bg-[#1a1d29]/50 transition-colors'><span><Search size={20} /></span>Search</button>
        <button onClick={() => setCurrentView('explore')} className='flex items-center gap-4 px-4 py-3 rounded-xl hover:text-white hover:bg-[#1a1d29]/50 transition-colors'><span><Telescope size={20} /></span>Explore</button>
        <button onClick={() => setCurrentView('library')} className='flex items-center gap-4 px-4 py-3 rounded-xl hover:text-white hover:bg-[#1a1d29]/50 transition-colors'><span><Library size={20} /></span>Your Library</button>
        <div className="flex flex-col gap-2 border-t border-gray-800/60 pt-4">
             <button onClick={()=>{
                setshowPlaylist(!showPlaylist)
            }} className='flex items-center gap-4  px-4 py-3'><span><ListPlus size={20} /></span>Playlist
            </button>
            {showPlaylist && (
                <div className='flex flex-col gap-2'>
                    <button className='text-left py-2 px-9 rounded-lg hover:text-white hover:bg-[#1a1d29]/40 transition-colors'>Chill</button>
                    <button className='text-left py-2 px-9 rounded-lg hover:text-white hover:bg-[#1a1d29]/40 transition-colors'>Focus Vibes</button>
                    <button className='text-left py-2 px-9 rounded-lg hover:text-white hover:bg-[#1a1d29]/40 transition-colors'>Workout</button>
                    <button className='text-left py-2 px-9 rounded-lg hover:text-white hover:bg-[#1a1d29]/40 transition-colors'>Study</button>
                    <button className='text-left py-2 px-9 rounded-lg hover:text-white hover:bg-[#1a1d29]/40 transition-colors'>Sleep</button>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
