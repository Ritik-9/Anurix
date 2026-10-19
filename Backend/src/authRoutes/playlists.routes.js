const express = require('express')
const router = express.Router()
const Playlist = require('../model/playlists')

// 1. Create a new playlist
router.post('/', async (req, res) => {
  try {
    const { name, description, userId } = req.body
    const newPlaylist = new Playlist({
      name,
      description,
      user: userId,
      songs: []
    })
    const savedPlaylist = await newPlaylist.save()
    res.status(201).json(savedPlaylist)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create playlist' })
  }
})

// 2. Get all playlists for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.params.userId })
    res.json(playlists)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch playlists' })
  }
})

// 3. Add a song to a playlist
router.post('/:playlistId/add', async (req, res) => {
  try {
    const { song } = req.body
    const playlist = await Playlist.findById(req.params.playlistId)
    
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' })

    // Check if song already exists in the playlist
    const exists = playlist.songs.some(s => s.audioUrl === song.audioUrl)
    if (!exists) {
      playlist.songs.push(song)
      await playlist.save()
    }
    
    res.json(playlist)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add song to playlist' })
  }
})

// Add song to playlist
router.post('/:playlistId/songs', async (req, res) => {
  try {
    const { playlistId } = req.params
    const { song } = req.body // song object: { title, artist, cover, audioUrl, _id }

    if (!song) {
      return res.status(400).json({ message: 'Song data is required' })
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' })
    }

    // Check if song already exists in playlist to avoid duplicates
    const songExists = playlist.songs.some(
      (s) => s._id === song._id || (s.audioUrl && s.audioUrl === song.audioUrl)
    )

    if (songExists) {
      return res.status(400).json({ message: 'Song already in playlist' })
    }

    playlist.songs.push(song)
    await playlist.save()

    res.status(200).json(playlist)
  } catch (err) {
    console.error('Error adding song to playlist:', err)
    res.status(500).json({ message: 'Server error adding song' })
  }
})

// Remove song from playlist
router.delete('/:playlistId/songs/:songId', async (req, res) => {
  try {
    const { playlistId, songId } = req.params

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' })
    }

    // Filter out the song matching songId or audioUrl
    playlist.songs = playlist.songs.filter(
      (s) => s._id?.toString() !== songId && s.audioUrl !== songId
    )

    await playlist.save()
    res.status(200).json(playlist)
  } catch (err) {
    console.error('Error removing song from playlist:', err)
    res.status(500).json({ message: 'Server error removing song' })
  }
})

module.exports = router