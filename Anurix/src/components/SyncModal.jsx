import React, { useState } from 'react'
import { Users, Radio, X, Copy, Check, PlayCircle } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { useMusic } from '../context/MusicContext'

const SyncModal = ({ isOpen, onClose }) => {
  const [inputRoomId, setInputRoomId] = useState('')
  const [copied, setCopied] = useState(false)
  const { joinRoom, activeRoom, roomState, setIsHost } = useSocket()
  const { user } = useMusic()

  if (!isOpen) return null

  const handleCreateRoom = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    // console.log("Generated Room Code:", randomCode)
    // console.log("Current User Object:", user)
    setIsHost(true)
    joinRoom(randomCode, user)
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    if (!inputRoomId.trim()) return
    setIsHost(false)
    joinRoom(inputRoomId.trim().toUpperCase(), user)
  }

  const copyRoomCode = () => {
    if (activeRoom) {
      navigator.clipboard.writeText(activeRoom)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12141c] border border-gray-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative animate-fadeIn">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#00f2fe]/10 text-[#00f2fe] rounded-xl border border-[#00f2fe]/20">
            <Radio size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Anurix Sync Rooms</h2>
            <p className="text-xs text-gray-400">Listen together in real-time with friends</p>
          </div>
        </div>

        {/* Active Room View */}
        {activeRoom ? (
          <div className="flex flex-col gap-6">
            <div className="bg-[#1a1d29] p-4 rounded-xl border border-gray-800 flex flex-col items-center justify-center gap-2">
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

            {/* Connected Members List */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                <Users size={14} /> Room Members ({roomState?.members?.length || 1})
              </span>
              <div className="bg-[#161922] rounded-xl p-3 max-h-36 overflow-y-auto flex flex-col gap-2 border border-gray-800/60">
                {roomState?.members?.map((member) => (
                  <div key={member.socketId} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-[#1a1d29]/50">
                    <span className="text-white font-medium">{member.userName}</span>
                    {member.socketId === roomState.hostSocketId && (
                      <span className="text-[10px] bg-[#00f2fe]/15 text-[#00f2fe] px-2 py-0.5 rounded-full font-semibold">Host</span>
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
          /* Join / Create Options */
          <div className="flex flex-col gap-6">
            {/* Create Room Option */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400">Host a Session</span>
              <button 
                onClick={handleCreateRoom}
                className="w-full py-3 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-bold rounded-xl text-sm shadow-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <PlayCircle size={18} /> Create Sync Room
              </button>
            </div>

            <div className="flex items-center gap-3 text-gray-600 text-xs my-1">
              <div className="flex-1 h-[1px] bg-gray-800"></div>
              <span>OR JOIN FRIEND</span>
              <div className="flex-1 h-[1px] bg-gray-800"></div>
            </div>

            {/* Join Room Form */}
            <form onSubmit={handleJoinRoom} className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400">Enter Room Code</span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. A4B9X2" 
                  value={inputRoomId}
                  onChange={(e) => setInputRoomId(e.target.value)}
                  className="flex-1 bg-[#1a1d29] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00f2fe] uppercase tracking-wider"
                  maxLength={6}
                />
                <button 
                  type="submit"
                  className="px-5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}

export default SyncModal