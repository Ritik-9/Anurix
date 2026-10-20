const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  audioUrl: { type: String, required: true },
  coverUrl: { type: String, default: '🎵' },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploaderName: { type: String, default: 'Anonymous Creator' },
  isPublic: { type: Boolean, default: false }, // Private by default, toggleable to Public
}, { timestamps: true })

module.exports = mongoose.model('Upload', uploadSchema)