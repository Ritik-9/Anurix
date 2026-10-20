const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const Upload = require('../model/upload')

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Saves files inside Backend/uploads/
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

// File Filter (Accept only audio files)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true)
  } else {
    cb(new Error('Only audio files (.mp3, .wav, etc.) are allowed!'), false)
  }
}

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB max file size
})

// GET /api/creatorupload/user/:userId - Fetch user's own uploads
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const uploads = await Upload.find({ uploaderId: userId }).sort({ createdAt: -1 })
    res.json(uploads)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user uploads', error: err.message })
  }
})

// GET /api/creatorupload/public - Fetch community public uploads
router.get('/public', async (req, res) => {
  try {
    const publicUploads = await Upload.find({ isPublic: true }).sort({ createdAt: -1 })
    res.json(publicUploads)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching public uploads', error: err.message })
  }
})

// POST /api/creatorupload - Upload a new track with file upload
router.post('/', upload.single('audioFile'), async (req, res) => {
  try {
    const { title, artist, coverUrl, uploaderId, uploaderName, isPublic } = req.body

    // Determine audio URL: prioritize uploaded file, fallback to body audioUrl
    let audioUrl = req.body.audioUrl
    if (req.file) {
      audioUrl = `http://localhost:3000/uploads/${req.file.filename}`
    }

    if (!title || !artist || !audioUrl || !uploaderId) {
      return res.status(400).json({ message: 'Title, artist, audio file, and uploaderId are required.' })
    }

    const newUpload = new Upload({
      title,
      artist,
      audioUrl,
      coverUrl: coverUrl || '🎵',
      uploaderId,
      uploaderName: uploaderName || 'Creator',
      isPublic: isPublic === 'true' || isPublic === true
    })

    const savedUpload = await newUpload.save()
    res.status(201).json(savedUpload)
  } catch (err) {
    res.status(500).json({ message: 'Error saving upload', error: err.message })
  }
})

// PATCH /api/creatorupload/:id/privacy - Toggle public/private status
router.patch('/:id/privacy', async (req, res) => {
  try {
    const { isPublic } = req.body
    const updated = await Upload.findByIdAndUpdate(
      req.params.id, 
      { isPublic }, 
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Error updating privacy status', error: err.message })
  }
})

module.exports = router