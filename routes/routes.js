const customerRoutes = require("./customer");
const broadcastRoutes = require("./broadcast");
const botRoutes = require("./bot-record");
const uploadRoutes = require("./upload");
const userRoutes = require("./user.route");
const appRouter = (app, webrtc, senderStream, peerUser) => {
    app.use('/user/', userRoutes)
    app.use(function (req, res, next) {
        const allowedOrigins = [
            "http://127.0.0.1:3000",
            "http://localhost:3000",
            "http://localhost:8000",
            "http://127.0.0.1:8080",
            "http://localhost:9000",
            "https://webrct-sfu-demo.herokuapp.com/",
        ];
        const origin = req.headers.origin;
        // Website you wish to allow to connect
        if (allowedOrigins.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        }

        // Request methods you wish to allow
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );

        // Request headers you wish to allow
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept,x-socket-id,x-csrf-token"
        );

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader("Access-Control-Allow-Credentials", true);

        // Pass to next layer of middleware
        next();
    });
    customerRoutes(app, webrtc, senderStream, peerUser);
    broadcastRoutes(app, webrtc, senderStream, peerUser);
    botRoutes(app, webrtc, senderStream, peerUser);
    uploadRoutes(app);
};

module.exports = appRouter;