var userModel = require('../models/user.model');
const registrationSchema = {
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
        custom: {
            options: (value) => {
                return new Promise(function (resolve, reject) {
                    userModel.getOneUser({ email: value }, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result)
                        }
                    });
                }).then(function (result) {
                    if (result) {
                        throw new Error('Email has been taken')
                    }
                })
            },
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
const loginSchema = {
    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Password is required',
        },
    },
    email: {
        in: ['body'],
        custom: {
            options: (value) => {
                return new Promise(function (resolve, reject) {
                    userModel.getOneUser({ email: value }, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result)
                        }
                    });
                }).then(function (result) {
                    if (result === null) {
                        throw new Error("Email or password doesn't match")
                    }
                })
            },
        },
        notEmpty: {
            errorMessage: 'Email is required',
        },
        isEmail: {
            errorMessage: 'Email is invalid',
        },
    },
}
module.exports = {
    registrationSchema: registrationSchema,
    loginSchema: loginSchema
}