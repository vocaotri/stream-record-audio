const { v4: uuidv4 } = require('uuid');
const uploadRoutes = (app) => {
    app.post('/upload', (req, res) => {
        fs.writeFileSync(uuidv4() + '.mp3', Buffer.from(req.body.blob.replace('data:audio/mp3;base64,', ''), 'base64'));
        res.status(201).send({ messager: "upload success" })
    })
};
module.exports = uploadRoutes;