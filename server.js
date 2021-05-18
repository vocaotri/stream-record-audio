const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const webrtc = require("wrtc");
fs = require("fs");
var mongoose = require('mongoose')
require("dotenv").config();
const { joinUser, removeUser } = require('./common/users');
var port = process.env.PORT || 3000;
let senderStream = [];
let peerUser = [];
app.use(express.static("public"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// connect mongoose
mongoose.connect(`mongodb://localhost:27017/${process.env.DB}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to database')).catch(error => console.log('error occured', error))

// this is where we'll handle our various routes from
require("./routes/routes.js")(app, webrtc, senderStream, peerUser);
// import class bot
const BotRecord = require("./bot/bot-record");
// import disconnect socket
const dcn = require("./common/disconnect");

io.on("connection", function (socket) {
    let bot = new BotRecord();
    socket.on("join-room", (data) => {
        joinUser(socket.id, data.user_id, data.room_id, data.is_host)
        socket.join(data.room_id);
        io.to(data.room_id).emit("user-reconnect", data)
        if (data.is_host) {
            bot.setRoomid(data.room_id)
            bot.openUrl()
        }
        socket.on("chat-room", data => {
            io.to(data.room_id).emit("listen-chat", { ...data, record_time: bot.getRecordTime() })
        });
    });
    // start stream
    socket.on("start-stream", data => {
        if (data.is_host)
            io.to(data.room_id).emit("listen-stream", data)
        bot.setRecordTime()
    })
    // fail record
    socket.on("fail-record", data => {
        io.to(data.room_id).emit("listen-fail-stream", data)
    })
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            if (user.is_host)
                bot.closeBrower()
            peerUser = dcn.userDisconnect(user, peerUser)
            io.to(user.room_id).emit("user-disconnect", user)
        }
    });
});


http.listen(port, () => console.log("server started : " + port));