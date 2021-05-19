var userModel = require('../models/user.model');
var jwt = require('jsonwebtoken');
module.exports = class JWTService {
    generateAccessToken(data) {
        return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '7889232s' })
    }
    async verifyAccessToken(token) {
        let user = await jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) return null;
            return user;
        })
        return await userModel.findById(user.id).exec();
    }
}