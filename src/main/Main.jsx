import React from 'react'

const Main = () => {
    const song=[
      { title: "Midnight Drive", artist: "Synthwave Collective" },
      { title: "Focus Flow", artist: "Ambient Soundscapes" },
      { title: "Neon Bloom", artist: "Cyber Pulse" },
      { title: "Starlight Echo", artist: "Luna Phase" }
    ]
  return (
    <div className="bg-[#12141c] rounded-2xl p-6 overflow-y-auto">
        <div className="relative w-full h-70 rounded-2xl overflow-hidden p-8 flex flex-col justify-end bg-linear-to-r from-[#1a2332] to-[#0f141f] border border-gray-800/50 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col gap-3">
                    <span className="text-xs uppercase tracking-widest text-[#00f2fe] font-semibold">Featured Album</span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">Midnight Drive</h1>
                    <p className="text-sm text-gray-400 font-medium">SYNTHWAVE COLLECTIVE • 12 Songs</p>
                    <div>
                        <button className="mt-3 bg-[#00f2fe] text-black font-bold px-7 py-3 rounded-xl flex items-center gap-2 hover:bg-[#35f5ff] transition-all shadow-[0_0_25px_rgba(0,242,254,0.3)] cursor-pointer">
                            ▶ Play Now
                        </button>
                    </div>
                </div>
        </div>
        <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-white">Recently Played</h2>
                <span className="text-xs text-gray-400 hover:text-white cursor-pointer transition-colors">See all</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {song.map((item, index) => (
                <div key={index} className="bg-[#161922] p-4 rounded-xl flex flex-col gap-3 group hover:bg-[#1c202d] transition-all cursor-pointer border border-gray-800/40">
                    <div className="w-full h-36 bg-linear-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🎵</span>
                    </div>
                    <div>
                    <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{item.artist}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Main
