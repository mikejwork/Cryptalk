class RoomHandler {
  constructor() {
    this.rooms = []
  }

  initializeRoom = (roomID) => {
    let x = this.rooms.filter(room => room._id === roomID)

    if (x.length === 0) {
      this.rooms.push(new Room(roomID))
    }
  }

  getRoomById = (roomID) => {
    let x = this.rooms.filter(room => room._id === roomID)
    return x[0]
  }

  removeBySocket = (socketID) => {
    this.rooms.forEach((room) => {
      room.leaveBySocket(socketID)
    })
  }
}

class Room {
  constructor(id) {
    this._id = id
    this.users = []
  }

  join = (user) => {
    let x = this.users.filter(u => u._id === user._id)
    if (x.length === 0) {
      this.users.push(user)
    }
  }

  leave = (userID) => {
    this.users = this.users.filter(u => u._id !== userID)
  }

  leaveBySocket = (socketID) => {
    this.users = this.users.filter(u => u.socket_id !== socketID)
  }
}

class User {
  constructor(socketId, username, id) {
    this.socket_id = socketId
    this.username = username
    this._id = id
  }
}

exports.RoomHandler = RoomHandler
exports.Room = Room
exports.User = User
