var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    city: String,
    state: String,
    country: String
}, { timestamps: true })

userSchema.plugin(mongoosePaginate)

var userModel = module.exports = mongoose.model('user', userSchema)
module.exports.getUser = (filter, options, cb) => {
    userModel.paginate(filter, options, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            cb(null, data)
        }
    })
}

module.exports.getOneUser = (filter, cb) => {
    userModel.findOne(filter, cb)
}

module.exports.addUser = (newUser, cb) => {
    const user = new userModel(newUser)
    user.save(cb)
}

module.exports.updateUser = (filter, updateUser, cb) => {
    const op = { new: true }
    userModel.findOneAndUpdate(filter, updateUser, op, cb)
}

module.exports.deleteUser = (filter, cb) => {
    userModel.deleteOne(filter, cb)
}