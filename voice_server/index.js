process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs');

const server = require('https').createServer({
  key: fs.readFileSync('./certs/custom.key'),
  cert: fs.readFileSync('./certs/certificate.pem'),
  requestCert: false,
  rejectUnauthorized: false
}, app)

const io = require('socket.io')(server, {
  cors: {
    origins: ["*"]
  }
})

app.use(cors())

// Documentation -- Events

// room::join( roomID, user: {username, sub} )
// room::leave( roomID, user: {username, sub} )
// room::userJoined( user: {username, sub} )
// room::userLeft( user: {username, sub} )
// room::enableVoice( user: {username, sub} )
// room::disableVoice( user: {username, sub} )
// room::enableVideo( user: {username, sub} )
// room::disableVideo( user: {username, sub} )

var rooms = {}

io.on('connection', (socket) => {
  socket.on('room::join', (roomID, user) => {
    leaveAll(user)

    socket.join(roomID)
    join(roomID, {...user, socketID: socket.id})
    socket.to(roomID).emit('room::userJoined', user)

    socket.on('disconnect', () => {
      leave(socket, roomID, user)
      socket.leave(roomID)
    })
  })

  socket.on('room::leave', (roomID, user) => {
    leave(socket, roomID, user)
    socket.leave(roomID)
  })

  socket.on('room::enableVoice', (roomID, user) => {
    socket.to(roomID).emit('room::enableVoice', user)
  })

  socket.on('room::disableVoice', (roomID, user) => {
    socket.to(roomID).emit('room::disableVoice', user)
  })

  socket.on('room::enableVideo', (roomID, user) => {
    socket.to(roomID).emit('room::enableVideo', user)
  })

  socket.on('room::disableVideo', (roomID, user) => {
    socket.to(roomID).emit('room::disableVideo', user)
  })

  socket.on('disconnect', () => {
    leaveAllBySocket(socket)
  })
})

function join(roomID, user) {
  // If room does not exist, create one with the user inside
  if (!rooms[roomID]) {
    rooms[roomID] = [user]
    return;
  }

  // If user does not already exist in the room, add
  if (!rooms[roomID].includes(user)) {
    rooms[roomID].push(user)
  }
}

function leave(socket, roomID, user) {
  if (rooms[roomID]) {
    rooms[roomID] = rooms[roomID].filter(u => u.sub !== user.sub)
    socket.to(roomID).emit('room::userLeft', user)
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
