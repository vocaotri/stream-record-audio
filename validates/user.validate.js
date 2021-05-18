var userModel = require('../models/user.model');
module.exports = registrationSchema = {
    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Password is required',
        },
        isLength: {
            errorMessage: 'Password max 12 char and min 7 char',
            options: { min: 7, max: 12 },
        },
    },
    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Email is required',
        },
        isEmail: {
            errorMessage: 'Email is invalid',
        },
    },
    firstname: {
        in: ['body'],
        custom: {
            options: (value) => {
                return new Promise(function (resolve, reject) {
                    userModel.getOneUser({ firstname: value }, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result)
                        }
                    });
                }).then(function (result) {
                    if (result) {
                        throw new Error('First name has been taken')
                    }
                })
            },
        },
        notEmpty: {
            errorMessage: 'First name is required',
        },
    }
}