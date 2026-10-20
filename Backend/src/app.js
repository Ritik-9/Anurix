const express = require('express')
const app = express()
const path = require('path') // <-- 1. Add path module
const cors = require('cors')
const cookieParser = require('cookie-parser')
const musicRoutes = require('./authRoutes/music.routes')
const uploadRoutes = require('./authRoutes/upload.routes')
const searchRoutes = require('./authRoutes/search.routes')
const authRoutes = require('./authRoutes/auth.routes')
const playlistsRoutes = require('./authRoutes/playlists.routes')
const creatorUploadRoutes = require('./authRoutes/creatorUploads.route')

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

// 2. Serve uploaded files statically so the frontend can play them
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/music', musicRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/playlists', playlistsRoutes)
app.use('/api/creatorupload', creatorUploadRoutes)

module.exports = app