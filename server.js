const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const webrtc = require("wrtc");
const { v4: uuidv4 } = require('uuid');
fs = require("fs");
require("dotenv").config();
const { joinUser, removeUser, findUser } = require('./common/users');
var port = process.env.PORT || 3000;
let senderStream = [];
let peerUser = [];
app.use(express.static("public"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// this is where we'll handle our various routes from
require("./routes/routes.js")(app, webrtc, senderStream, peerUser);
// import class bot
const BotRecord = require("./bot/bot-record");

app.post('/upload', (req, res) => {
    fs.writeFileSync(uuidv4() + '.mp3', Buffer.from(req.body.blob.replace('data:audio/mp3;base64,', ''), 'base64'));
    res.status(201).send({ messager: "upload success" })
})

io.on("connection", function(socket) {
    const bot = new BotRecord();
    socket.on("join-room", (data) => {
        joinUser(socket.id, data.user_id, data.room_id, data.is_host)
        socket.join(data.room_id);
        io.to(data.room_id).emit("user-reconnect", data)
        if (data.is_host) {
            bot.setRoomid(data.room_id)
            bot.openUrl()
        }
        // console.log('User id :' + data.user_id + ' has join room');
    });
    // start stream
    socket.on("start-stream", data => {
        io.to(data.room_id).emit("listen-stream", data)
    })
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            if (user.is_host)
                bot.closeBrower()
                // console.log('User id :' + user.user_id + ' has left room');
            io.to(user.room_id).emit("user-disconnect", user)
        }
    });
});

http.listen(port, () => console.log("server started : " + port));