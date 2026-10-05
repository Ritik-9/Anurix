const express=require('express')
const app=express()
const cors = require('cors')
const musicRoutes = require('./authRoutes/music.routes')
const uploadRoutes=require('./authRoutes/upload.routes')
const searchRoutes=require('./authRoutes/search.routes')

app.use(express.json())
app.use(cors())

app.use('/api/music', musicRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/search', searchRoutes)

module.exports=app