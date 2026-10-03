const mongoose = require('mongoose')

const musicSchema = new mongoose.Schema({

  title: { type: String, required: true },
  artist: { type: String, required: true },
  cover: { type: String, default: '🎵' },
  duration: { type: String, default: '3:45' },
  audioUrl: { type: String, required: true }
  
}, { timestamps: true })

module.exports = mongoose.model('Music', musicSchema)