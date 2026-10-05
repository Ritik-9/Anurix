const Music = require('../model/music.model')

// Handle artist/user track & album uploads
const handleUpload = async (req, res) => {
  try {
    const { title, artist, cover, duration, audioUrl } = req.body

    // Basic validation
    if (!title || !artist || !audioUrl) {
      return res.status(400).json({ message: "Please provide title, artist, and a valid audio URL." })
    }

    const newTrack = new Music({
      title,
      artist,
      cover: cover || "🎵",
      duration: duration || "3:00",
      audioUrl
    })

    await newTrack.save()
    res.status(201).json({ 
      message: "Track successfully uploaded to Anurix library!", 
      track: newTrack 
    })
  } catch (error) {
    res.status(500).json({ message: "Server error during upload", error: error.message })
  }
}

module.exports = { handleUpload }