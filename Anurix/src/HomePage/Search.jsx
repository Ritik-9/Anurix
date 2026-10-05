import React, { useState, useEffect } from 'react'
import { useMusic } from '../context/MusicContext'

const Search = () => {
    const { playTrack } = useMusic()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const delayDebounce = setTimeout(() => {
            setLoading(true)
            fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    setResults(data.results || [])
                    setLoading(false)
                })
                .catch(err => {
                    console.error("Search error:", err)
                    setLoading(false)
                })
        }, 300) 

        return () => clearTimeout(delayDebounce)
    }, [query])

    return (
        <div className="bg-[#12141c] rounded-2xl p-6 overflow-y-auto h-full text-white">
            <h1 className="text-3xl font-extrabold tracking-tight mb-6">Explore & Search</h1>
            
        
            <div className="relative mb-8">
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by song title, artist, or vibe..."
                    className="w-full bg-[#161922] border border-gray-800 rounded-xl px-5 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00f2fe] transition-colors shadow-inner"
                />
            </div>

            
            {loading && <p className="text-sm text-gray-400">Searching the ocean of music...</p>}

            {!loading && results.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                    {results.map((item) => (
                        <div 
                            key={item._id} 
                            onClick={() => playTrack(item)}
                            className="bg-[#161922] p-4 rounded-xl flex flex-col gap-3 group hover:bg-[#1c202d] transition-all cursor-pointer border border-gray-800/40"
                        >
                            <div className="w-full h-36 bg-[#161922] rounded-lg overflow-hidden flex items-center justify-center relative shadow-md border border-gray-800/50">
                                {item.cover && (item.cover.startsWith('http') || item.cover.startsWith('https')) ? (
                                    <img 
                                        src={item.cover} 
                                        alt={`Album cover for ${item.title}`} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                        onError={(e) => {
                                           
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                
                                
                                <span 
                                    className={`text-4xl group-hover:scale-110 transition-transform duration-300 ${item.cover && (item.cover.startsWith('http') || item.cover.startsWith('https')) ? 'hidden' : 'flex'}`}
                                >
                                    {item.cover && !(item.cover.startsWith('http') || item.cover.startsWith('https')) ? item.cover : "🎵"}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                                <p className="text-xs text-gray-400 truncate mt-0.5">{item.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && query && results.length === 0 && (
                <p className="text-sm text-gray-400">No tracks found matching "{query}".</p>
            )}
        </div>
    )
}

export default Search