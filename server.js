const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socket = require('socket.io')
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

const users={}

io.on('connection', socket => {
    //generate username against a socket connection and store it
    const userid = socket.handshake.query['user']
    if(!users[userid]){
        users[userid] = socket.id
    }
    
    socket.on('disconnect', () => {
        delete users[userid]
    })

    socket.on('callUser', (data) => {
        io.to(users[data.userToCall]).emit('hey', { signal: data.signalData, from: data.from })
    })

    socket.on('acceptCall', (data) => {
        io.to(users[data.to]).emit('callAccepted', data.signal)
    })

    socket.on('close', (data) => {
        io.to(users[data.to]).emit('close')
    })

    socket.on('rejected', (data) => {
        io.to(users[data.to]).emit('rejected')
    })
})

const port = process.env.PORT || 8000

server.listen(port, ()=>{
    console.log(`Server running on port ${ port }`)
})