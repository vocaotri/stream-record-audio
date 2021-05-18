var { validationResult } = require('express-validator');
var userModel = require('../models/user.model');
var usersController = {
    listUsers(req, res) {
        const filter = JSON.parse(req.query.filter)
        delete req.query.filter;
        const options = {
            page: req.query.page ? ? 1,
            limit: req.query.limit ? ? 10,
            collation: {
                locale: req.query.area ? ? 'en',
            },
        }
        userModel.getUser(filter, options, (err, data) => {
            if (err)
                console.error(err);
            else
                res.send({ data: data })
        })
    },
    user(req, res) {
        const filter = {...req.query }
        userModel.getOneUser(filter, (err, data) => {
            if (err)
                console.error(err);
            else
                res.send({ data: data })
        })
    },
    addUser(req, res) {
        // Validate incoming input
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const user = {...req.body };
        userModel.addUser(user, (err, data) => {
            if (err)
                console.error(err)
            else
                res.status(201).send({ data: data })
        })
    },
    updateUser(req, res) {
        const filter = {...req.body.filter }
        delete req.body.filter;
        const data = {...req.body }
        userModel.updateUser(filter, data, (err, data) => {
            if (err)
                console.error(err)
            else
                res.status(202).send({ data: data })
        })
    },
    deleteUser(req, res) {
        const filter = {...req.body }
        userModel.deleteUser(filter, (err, data) => {
            if (err)
                console.error(err)
            else
                res.status(203).send({ data: data })
        })
    }
}
module.exports = usersController;