import React from 'react'

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0b0c10] flex flex-col items-center justify-center select-none overflow-hidden">
      <div className="absolute w-72 h-72 bg-[#00f2fe]/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="flex flex-col items-center gap-6 z-10 animate-fadeIn">
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-2 bg-linear-to-r from-[#00f2fe] to-[#4facfe] rounded-2xl opacity-30 blur-md animate-pulse"></div>
          <div className="relative bg-[#12141c] p-5 rounded-2xl border border-gray-800 shadow-2xl flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00f2fe]">
              <rect x="2" y="7" width="3.5" height="10" rx="1.75" fill="currentColor" className="animate-bounce [animation-delay:-0.3s]"/>
              <rect x="7.5" y="3" width="3.5" height="18" rx="1.75" fill="currentColor" className="animate-bounce [animation-delay:-0.15s]"/>
              <rect x="13" y="9" width="3.5" height="6" rx="1.75" fill="currentColor" className="animate-bounce [animation-delay:-0.3s]"/>
              <rect x="18.5" y="5" width="3.5" height="14" rx="1.75" fill="currentColor" className="animate-bounce"/>
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <h1 className="text-3xl font-extrabold tracking-widest text-white uppercase font-sans">
            Anur<span className="text-[#00f2fe]">ix</span>
          </h1>
          <p className="text-xs text-gray-400 tracking-wider font-medium">Futuristic Audio Experience</p>
        </div>

        <div className="w-36 h-1 bg-gray-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-linear-to-r from-[#00f2fe] to-[#4facfe] w-full origin-left animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen