const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config()

const app=require('./src/app')
const connectDB=require('./src/db/db')

connectDB()

const http= require('http')
const {Server}= require('socket.io');
const { timeStamp } = require('console');

const server= http.createServer(app)

const io=new Server(server,{
    cors:{
        origin: 'http://localhost:5173',
        credentials:true,
        methods:["GET","POST"]
    }
})

const syncRooms={}

io.on('connection',(socket)=>{
    console.log(`[Socket Connected] User Socket ID: ${socket.id}`)

    socket.on("room:join",({roomId,user})=>{
        socket.join(roomId)

        if(!syncRooms[roomId]){
            syncRooms[roomId]={
                roomId,
                hostSocketId: socket.id,
                hostUser: user,
                currentTrack: null,
                isPlaying: false,
                currentTime: 0,
                lastUpdated: Date.now(),
                members: [],
                queue: []
            }
            console.log(`[Socket Room Created] Room: ${roomId} by Host: ${user?.userName || socket.id}`)
        }
        const room= syncRooms[roomId]
        const existingMember=room.members.find(m=>  m.socketId===socket.id)
        if(!existingMember){
            room.members.push({
                socketId: socket.id,
                userId: user?._id ||user?.id,
                userName: user?.userName || 'Anonymous Listener'
            })
        }

        socket.on('player:sync',({roomId, currentTrack, isPlaying, currentTime})=>{
            const room= syncRooms[roomId]
            if(room && room.hostSocketId===socket.id){
                room.currentTrack=currentTrack
                room.isPlaying=isPlaying
                room.currentTime=currentTime
                room.lastUpdated=Date.now()

                socket.to(roomId).emit('player:sync_listener',{
                    currentTrack,
                    isPlaying,
                    currentTime,
                    timeStamp: room.lastUpdated
                })
            }
        })
        socket.on('disconnect',()=>{
            console.log(`[Socket Disconnected] ${socket.id}`)
            for (const roomId in syncRooms) {
                const room = syncRooms[roomId];
                room.members = room.members.filter(
                    m => m.socketId !== socket.id
                );
                if (room.members.length === 0){
                    delete syncRooms[roomId];
                    console.log(`[Sync Room Deleted] Room ${roomId} is empty.`);
                }
                else if(room.hostSocketId===socket.id){
                    room.hostSocketId= room.members[0].socketId
                    room.hostUser= {userName: room.members[0].userName}
                    io.to(roomId).emit('room:state_update',room)
                }
            }
        })
    })
})
server.listen(3000,()=>{
        console.log("Server and Socket.io successfully running.")
    })