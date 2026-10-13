import React, { useState, useEffect } from 'react'
import { useMusic } from '../context/MusicContext'

const Main = () => {
    const { playTrack, recentlyPlayed, currentTrack, isPlaying, togglePlay } = useMusic()

    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3000/api/music')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const shuffled = [...data].sort(() => Math.random() - 0.5)
                    setSongs(shuffled)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch songs:", err)
                setLoading(false)
            })
    }, [])

    const renderCover = (item) => {
        const imageUrl = item.coverUrl || item.cover || item.albumArt || item.img

        const isUrl = imageUrl && typeof imageUrl === 'string' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))

        return (
            <div className="w-full h-36 bg-linear-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                {isUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={item.title || "Cover"} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-3xl">
                        {typeof item.cover === 'string' && !item.cover.startsWith('http') ? item.cover : '🎵'}
                    </span>
                )}
            </div>
        )
    }

    return (
        <div className="bg-[#12141c] rounded-2xl p-6 overflow-y-auto flex flex-col gap-8">
            <div className="relative w-full h-70 rounded-2xl overflow-hidden p-8 flex flex-col justify-end bg-linear-to-r from-[#1a2332] to-[#0f141f] border border-gray-800/50 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col gap-3">
                    <span className="text-xs uppercase tracking-widest text-[#00f2fe] font-semibold">Featured Album</span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">Midnight Drive</h1>
                    <p className="text-sm text-gray-400 font-medium">SYNTHWAVE COLLECTIVE • 12 Songs</p>
                    <div>
                        <button 
                            onClick={() => {
                                if (songs.length > 0) {
                                    const featuredSong = songs[0]
                                    const isCurrent = currentTrack?._id === featuredSong._id || currentTrack?.audioUrl === featuredSong.audioUrl
                                    if (isCurrent) {
                                        togglePlay()
                                    } else {
                                        playTrack(featuredSong)
                                    }
                                }
                            }} 
                            className="mt-3 bg-[#00f2fe] text-black font-bold px-7 py-3 rounded-xl flex items-center gap-2 hover:bg-[#35f5ff] transition-all shadow-[0_0_25px_rgba(0,242,254,0.3)] cursor-pointer"
                        >
                            {isPlaying ? '⏸ Pause' : '▶ Play Now'}
                        </button>
                    </div>
                </div>
            </div>

            {/* SECTION 1: RECENTLY PLAYED */}
            {recentlyPlayed && recentlyPlayed.length > 0 && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight text-white">Recently Played</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recentlyPlayed.map((item, index) => {
                            const isCurrent = (currentTrack?._id && currentTrack._id === item._id) || 
                                              (currentTrack?.audioUrl && currentTrack.audioUrl === item.audioUrl)

                            return (
                                <div 
                                    key={item._id || index} 
                                    onClick={() => isCurrent ? togglePlay() : playTrack(item)} 
                                    className={`bg-[#161922] p-4 rounded-xl flex flex-col gap-3 group hover:bg-[#1c202d] transition-all cursor-pointer border ${
                                        isCurrent ? 'border-[#00f2fe] bg-[#1c2233]' : 'border-gray-800/40 hover:border-gray-700'
                                    }`}
                                >
                                    {renderCover(item)}
                                    <div>
                                        <h3 className={`text-sm font-semibold truncate ${isCurrent ? 'text-[#00f2fe]' : 'text-white'}`}>
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{item.artist}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-white">Made For You</h2>
                </div>

                {loading ? (
                    <div className="text-gray-400 text-sm py-4">Loading tracks from database...</div>
                ) : songs.length === 0 ? (
                    <div className="text-gray-500 text-sm py-2">No additional tracks found in database.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {songs.map((item, index) => {
                            const isCurrent = (currentTrack?._id && currentTrack._id === item._id) || 
                                              (currentTrack?.audioUrl && currentTrack.audioUrl === item.audioUrl)

                            return (
                                <div 
                                    key={item._id || index} 
                                    onClick={() => isCurrent ? togglePlay() : playTrack(item)} 
                                    className={`bg-[#161922] p-4 rounded-xl flex flex-col gap-3 group hover:bg-[#1c202d] transition-all cursor-pointer border ${
                                        isCurrent ? 'border-[#00f2fe] bg-[#1c2233]' : 'border-gray-800/40 hover:border-gray-700'
                                    }`}
                                >
                                    {renderCover(item)}
                                    <div>
                                        <h3 className={`text-sm font-semibold truncate ${isCurrent ? 'text-[#00f2fe]' : 'text-white'}`}>
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{item.artist}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Main