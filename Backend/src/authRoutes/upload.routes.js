const express = require('express')
const router = express.Router()
const { handleUpload } = require('../controller/upload.controller')

router.post('/', handleUpload)

module.exports= router 