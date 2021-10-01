const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const channels = {
  "main": []
};

io.on('connection', socket => {

  socket.on('$connect', async (data) => {
    // Clear all connections
    await clearConnections(socket.id, socket)

    // If the channel doesnt exist, initialize it
    await channelInit(data.channel)

    // Connect to the channel
    await channelConnect({name: data.username, sub: data.sub, socketId: socket.id}, data.channel)
    socket.join(data.channel);
    io.to(data.channel).emit("channelUsers", channels[data.channel])
  })

  socket.on('sendSignal', (data) => {
    console.log('sendSignal')
    console.log(data)
    console.log('')
    io.to(data.theirId).emit('userJoined', { signal: data.signal, callerId: data.callerId });
  })

  socket.on('returnSignal', (data) => {
    console.log('returnSignal')
    console.log(data)
    console.log('')
    io.to(data.callerId).emit('recieveReturnSignal', { signal: data.signal, id: socket.id });
  })

  socket.on('disconnect', (data) => {
    // Clear all connections
    clearConnections(socket.id, socket)
  })

  socket.on('forceDisconnect', () => {
    socket.disconnect(true)
  })
})

async function channelConnect(user, channelName) {
  channels[channelName].push(user)
}

async function clearConnections(socketId, socket) {
  for (const [key, value] of Object.entries(channels)) {
    socket.leave(key);
    value.forEach(async (user) => {
      if (socketId === user.socketId) {
        channels[key] = await value.filter(user => socketId !== user.socketId)
        io.to(key).emit("channelUsers", channels[key])
      }
    })
  }
}

async function channelInit(channelName) {
  if (!channels[channelName]) {
    channels[channelName] = []
  }
}

server.listen(8000, () => {
  console.log('\n\n\n\n\n\n\n\n\n\n[Cryptalk::server] Listening on 8000..')
})
