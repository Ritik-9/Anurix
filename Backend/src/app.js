const express=require('express')
const app=express()
const cors = require('cors')
const cookieParser=require('cookie-parser')
const musicRoutes = require('./authRoutes/music.routes')
const uploadRoutes=require('./authRoutes/upload.routes')
const searchRoutes=require('./authRoutes/search.routes')
const authRoutes=require('./authRoutes/auth.routes')

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

app.use('/api/music', musicRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/auth',authRoutes)
module.exports=app