const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const webrtc = require("wrtc");
fs = require("fs");
require("dotenv").config();
const { joinUser, removeUser, findUser } = require('./common/users');
var port = process.env.PORT || 3000;
let senderStream = [];
let peerUser = [];
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this is where we'll handle our various routes from
require("./routes/routes.js")(app, webrtc, senderStream, peerUser);

io.on("connection", function (socket) {
  socket.on("join-room", (data) => {
    joinUser(socket.id, data.user_id, data.room_id, data.is_host)
    socket.join(data.room_id);
    // console.log('User id :' + data.user_id + ' has join room');
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      // console.log('User id :' + user.user_id + ' has left room');
      io.to(user.room_id).emit("user-disconnect", user)
    }
  });
});

http.listen(port, () => console.log("server started : " + port));