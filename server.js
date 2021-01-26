const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const app = express()
const server = http.createServer(app)
const routes = require('./routes')
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

const users={}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

app.use((req, res, next) => {
  resourceMonitorMiddlewareCB(req, res, next, function(diffJson){
    console.log(' diffJson : ', diffJson)
  })
})

app.use('/', routes)

io.on('connection', socket => {
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