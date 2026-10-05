const Music = require('../model/music.model')

const searchTracks = async (req, res) => {
  try {
    const query = req.query.q || ""
    

    const localResults = await Music.find({
      $or: [
        { title: { $regex: query,$options: 'i' } },
        { artist: { $regex: query,$options: 'i' } }
      ]
    })

    let externalResults = []

    try {
     
      const response = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`
      const apiRes = await fetch(response)
      const data = await apiRes.json()

      if (data.results && data.results.length > 0) {
        externalResults = data.results.map((track, index) => ({
          _id: `ext-${index}-${track.trackId}`,
          title: track.trackName,
          artist: track.artistName,
          cover: track.artworkUrl100 ? track.artworkUrl100.replace('100x100', '300x300') : '🎵',
          duration: "3:30", 
          audioUrl: track.previewUrl 
        }))
      }
    } catch (apiErr) {
      console.log("Live external API fetch failed:", apiErr.message)
    }

    const combinedResults = [...localResults, ...externalResults]

    res.status(200).json({
      query,
      count: combinedResults.length,
      results: combinedResults
    })
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message })
  }
}

module.exports = { searchTracks }