const socket = require("socket.io");
const express = require("express");
const cors = require("cors");
const app = express();

const { get_user, user_connect, user_disconnect } = require("./users");

app.use(express());
app.use(cors());

const port = 8000;

var server = app.listen(
  port,
  console.log(`Server is running on the port no: ${(port)} `)
);

const io = socket(server);

io.on("connection", (socket) => {
  socket.on("user_connect", (user) => {
    const net_user = user_connect(user);
    if (net_user) {
      socket.join("main")
      console.log("io:connection => user_connect => " + net_user.username)
      // console.log("io:connection => SocketID: " + socket.id)
    }
  });

  socket.on("user_disconnect", (userSub) => {
    console.log("io:connection => user_disconnect => " + userSub)
    user_disconnect(userSub);
  });

})
