const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origins: ["*"]
  }
})
const cors = require('cors')
const { v4: uuidV4 } = require('uuid')

app.use(cors())

var rooms = {}

io.on('connection', (socket) => {
  socket.on('room::join', (roomID, user) => {
    leaveAll(user)

    socket.join(roomID)

    join(roomID, {...user, socketID: socket.id})
    socket.to(roomID).emit('room::userJoined', user)

    socket.on('disconnect', () => {
      leave(roomID, user)
    })
  })

  socket.on('disconnect', () => {
    leaveAllBySocket(socket)
  })
})

function join(roomID, user) {
  if (!rooms[roomID]) {
    rooms[roomID] = [user]
    return;
  }

  if (!rooms[roomID].includes(user)) {
    rooms[roomID].push(user)
  }
}

function leave(roomID, user) {
  if (rooms[roomID]) {
    rooms[roomID] = rooms[roomID].filter(u => u.sub !== user.sub)
  }
}

function leaveAll(user) {
  for (let [key, value] of Object.entries(rooms)) {
    if (!rooms[key].includes(user)) {
      rooms[key] = rooms[key].filter(u => u.sub !== user.sub)
    }
  }
}

function leaveAllBySocket(socket) {
  for (let [key, value] of Object.entries(rooms)) {
    rooms[key] = rooms[key].filter(u => u.socketID !== socket.id)
  }
}

server.listen(3333)
console.clear()
console.log('[Cryptalk::server] $ Listening on 3333')
