require('events').EventEmitter.prototype._maxListeners = 0;

const express = require('express')
var bodyParser = require('body-parser');
const fs = require('fs');
const app = express()
const { RoomHandler, User } = require('./room')
var ExpressPeerServer = require('peer').ExpressPeerServer;

const server = require('https').createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/socket.capstone-cryptalk.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/socket.capstone-cryptalk.com/fullchain.pem'),
  requestCert: false,
  rejectUnauthorized: false
}, app)

const roomHandler = new RoomHandler()

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
  res.render("index", {
    rooms: roomHandler.rooms
  })
})

const io = require('socket.io')(server, {
  cors: {
    origins: ["*"]
  }
})

app.use('/peer', ExpressPeerServer(server, {
    debug: true
  }
));

io.on('connection', (socket) => {
  console.log(`. > ${socket.id}`)


  socket.on('room::join', (roomID, user) => {
    roomHandler.initializeRoom(roomID)
    const room = roomHandler.getRoomById(roomID)

    room.join(new User(socket.id, user.username, user.sub))

    socket.join(roomID)
    socket.to(roomID).emit('room::userJoined', user)

    // Data storage for later disconnect cleanup
    socket.userData = user
    socket.currentRoom = roomID
  })

  socket.on('room::leave', (roomID, user) => {
    const room = roomHandler.getRoomById(roomID)
    socket.leave(roomID)
    room.leave(user.sub)
    socket.to(roomID).emit('room::userLeft', user)
    socket.currentRoom = null
  })

  // UI Listeners
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

  // On socket disconnection
  socket.on('disconnect', () => {
    console.log(`- > ${socket.id}`)
    roomHandler.removeBySocket(socket.id)
    if (socket.currentRoom !== null) {
      socket.to(socket.currentRoom).emit('room::userLeft', socket.userData)
    }
  })
})

server.listen(443)
console.clear()
console.log('[server] $ Server started \n')
