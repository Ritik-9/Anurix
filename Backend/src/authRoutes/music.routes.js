const express = require('express')
const router = express.Router()
const { getAllTracks, seedTracks } = require('../controller/music.controller')

router.get('/', getAllTracks)
router.post('/seed', seedTracks)

module.exports = router