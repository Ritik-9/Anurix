import React, { useState } from 'react'
import { useMusic } from '../context/MusicContext'

const UploadTrackModal = ({ isOpen, onClose, onSongUploaded }) => {
  const { user, token, showToast } = useMusic()

  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [coverUrl, setCoverUrl] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userId = user?._id || user?.id || user?.userId
    const userName = user?.userName || user?.name || 'Creator'

    if (!userId) {
      if (showToast) showToast('Please log in to upload tracks.')
      return
    }

    if (!audioFile) {
      if (showToast) showToast('Please select an audio file.')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('artist', artist)
      formData.append('audioFile', audioFile)
      formData.append('coverUrl', coverUrl)
      formData.append('uploaderId', userId)
      formData.append('uploaderName', userName)
      formData.append('isPublic', isPublic)

      const res = await fetch('http://localhost:3000/api/creatorupload', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      })

      const data = await res.json()

      if (res.ok) {
        if (showToast) showToast(isPublic ? 'Track published publicly!' : 'Track saved privately!')
        if (onSongUploaded) onSongUploaded(data)
        onClose()
        setTitle('')
        setArtist('')
        setAudioFile(null)
        setCoverUrl('')
        setIsPublic(false)
      } else {
        if (showToast) showToast(data.message || 'Failed to upload track')
      }
    } catch (err) {
      console.error('Upload error:', err)
      if (showToast) showToast('Server error during upload')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-[#161922] border border-gray-800 p-6 rounded-2xl w-full max-w-md flex flex-col gap-4 shadow-2xl text-white">
        <h3 className="text-lg font-bold text-white">Upload Original Track</h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium">Song Title *</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Midnight Waves"
            required
            className="bg-[#0f141f] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f2fe]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium">Artist Name *</label>
          <input 
            type="text" 
            value={artist} 
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g., Ritik Paras"
            required
            className="bg-[#0f141f] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f2fe]"
          />
        </div>

        {/* Audio File Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium">Audio File (.mp3, .wav) *</label>
          <input 
            type="file" 
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
            required
            className="bg-[#0f141f] border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#00f2fe] file:text-black hover:file:bg-[#35f5ff] cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium">Cover URL or Emoji (Optional)</label>
          <input 
            type="text" 
            value={coverUrl} 
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="Image URL or 🎧"
            className="bg-[#0f141f] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f2fe]"
          />
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between p-3 bg-[#0f141f] border border-gray-800 rounded-xl mt-1">
          <div>
            <p className="text-sm font-semibold">{isPublic ? '🌐 Public Track' : '🔒 Private Track'}</p>
            <p className="text-xs text-gray-400">
              {isPublic ? 'Visible to everyone on Anurix.' : 'Only visible in Your Creations.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all cursor-pointer ${
              isPublic ? 'bg-[#00f2fe]' : 'bg-gray-700'
            }`}
          >
            <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
              isPublic ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 mt-2">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={submitting}
            className="bg-[#00f2fe] text-black font-bold px-5 py-2 rounded-xl text-sm hover:bg-[#35f5ff] transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Uploading...' : 'Publish Track'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UploadTrackModal