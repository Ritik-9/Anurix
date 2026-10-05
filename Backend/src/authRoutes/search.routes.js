const express = require('express')
const router = express.Router()
const { searchTracks } = require('../controller/search.controller')


router.get('/', searchTracks)

module.exports = router