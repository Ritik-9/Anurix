const Music = require('../model/music.model')

const getAllTracks = async (req, res) => {
  try {
    const tracks = await Music.find()
    res.status(200).json(tracks)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tracks", error: error.message })
  }
}

const seedTracks = async (req, res) => {
  try {
    let formattedTracks = []

    try {
      const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0/tracks/?client_id=709fa152&format=json&limit=20&audioformat=mp32'
      const response = await fetch(JAMENDO_API_URL)
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        formattedTracks = data.results.map(track => ({
          title: track.name,
          artist: track.artist_name,
          cover: track.image || '🎵',
          duration: Math.floor(track.duration / 60) + ':' + (track.duration % 60 < 10 ? '0' : '') + (track.duration % 60),
          audioUrl: track.audio
        }))
      }
    } catch (apiError) {
      console.log("Jamendo API fetch skipped/blocked, using high-definition fallback tracks.")
    }

    if (formattedTracks.length === 0) {
      formattedTracks = [
        { title: "Midnight Drive", artist: "Synthwave Collective", cover: "🎵", duration: "3:45", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { title: "Focus Flow", artist: "Ambient Soundscapes", cover: "🎹", duration: "4:12", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { title: "Neon Bloom", artist: "Cyber Pulse", cover: "🌆", duration: "2:58", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
        { title: "Starlight Echo", artist: "Luna Phase", cover: "✨", duration: "3:30", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
      ]
    }

    await Music.deleteMany({})
    const seededTracks = await Music.insertMany(formattedTracks)
    
    res.status(201).json({ 
      message: `Database successfully seeded with ${seededTracks.length} tracks!`, 
      seededTracks 
    })
  } catch (error) {
    res.status(500).json({ message: "Failed to seed database", error: error.message })
  }
}

module.exports = {
  getAllTracks,
  seedTracks
}