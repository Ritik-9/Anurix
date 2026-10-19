const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [{ 
    title: String,
    artist: String,
    cover: String,
    audioUrl: String,
    _id: String
  }],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Playlist', playlistSchema)