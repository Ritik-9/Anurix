import React, { useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useMusic } from '../context/MusicContext'
import { Copy, Check, Users, Music, X } from 'lucide-react'

const SyncModal = ({ isOpen, onClose }) => {
  const { activeRoom, roomState, joinRoom } = useSocket()
  const { user } = useMusic()
  const [roomCodeInput, setRoomCodeInput] = useState('')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCreateRoom = () => {
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    joinRoom(generatedCode, user)
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    if (roomCodeInput.trim()) {
      joinRoom(roomCodeInput.trim().toUpperCase(), user)
    }
  }

  const copyRoomCode = () => {
    if (activeRoom) {
      navigator.clipboard.writeText(activeRoom)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Extract current track from room state
  const currentPlayingTrack = roomState?.currentTrack || roomState?.currentPlayback?.currentTrack

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#12141d] border border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center">
            <Music size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Anurix Sync Rooms</h3>
            <p className="text-xs text-gray-400">Listen together in real-time with friends</p>
          </div>
        </div>

        {activeRoom ? (
          <div className="flex flex-col gap-5">
            {/* Room Code Header */}
            <div className="bg-[#1a1d29] p-4 rounded-xl border border-gray-800 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400">Your Active Room Code</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-widest text-[#00f2fe]">{activeRoom}</span>
                <button 
                  onClick={copyRoomCode}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition cursor-pointer"
                  title="Copy Code"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected & Synchronizing
              </span>
            </div>

            {/* 🎵 NOW PLAYING CARD IN ROOM */}
            <div className="bg-[#161922] p-3 rounded-xl border border-gray-800 flex items-center gap-3">
              <div className="w-11 h-11 bg-gray-800 rounded-lg flex items-center justify-center text-lg overflow-hidden shrink-0 relative">
                {currentPlayingTrack?.cover && (currentPlayingTrack.cover.startsWith('http') || currentPlayingTrack.cover.startsWith('https')) ? (
                  <img src={currentPlayingTrack.cover} alt="cover" className="w-full h-full object-cover" />
                ) : (
                  <span>{currentPlayingTrack?.cover || '🎵'}</span>
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <span className="text-[10px] text-[#00f2fe] font-semibold uppercase tracking-wider block">Now Playing in Room</span>
                <h4 className="text-xs font-bold text-white truncate">{currentPlayingTrack?.title || "Waiting for host..."}</h4>
                <p className="text-[11px] text-gray-400 truncate">{currentPlayingTrack?.artist || "Anurix Stream"}</p>
              </div>
            </div>

            {/* Room Members List */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <Users size={14} /> Room Members ({roomState?.members?.length || 1})
              </span>
              <div className="bg-[#161922] rounded-xl p-3 max-h-36 overflow-y-auto flex flex-col gap-2 border border-gray-800/60">
                {roomState?.members?.map((member, idx) => (
                  <div key={member.socketId || idx} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#1a1d29]/50">
                    <span className="text-white font-medium">{member.userName || `User ${idx + 1}`}</span>
                    {member.socketId === roomState.hostSocketId ? (
                      <span className="text-[10px] bg-[#00f2fe]/15 text-[#00f2fe] px-2 py-0.5 rounded-full font-semibold">Host</span>
                    ) : (
                      <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">Listener</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Leave Room
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleCreateRoom}
              className="w-full py-3 bg-[#00f2fe] hover:bg-[#00d8e4] text-black font-bold rounded-xl text-sm transition cursor-pointer"
            >
              Create Sync Room
            </button>
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-gray-800 w-full"></div>
              <span className="bg-[#12141d] px-3 text-xs text-gray-500 absolute">OR</span>
            </div>
            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Code"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                className="flex-1 bg-[#1a1d29] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f2fe]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl text-sm transition cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default SyncModal