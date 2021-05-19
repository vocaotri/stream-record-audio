var { validationResult } = require('express-validator');
var userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
var JWTService = require('../services/jwt.service')
var usersController = {
    listUsers(req, res) {
        const filter = JSON.parse(req.query.filter)
        delete req.query.filter;
        const options = {
            page: req.query.page ?? 1,
            limit: req.query.limit ?? 10,
            collation: {
                locale: req.query.area ?? 'en',
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
        const filter = { ...req.query }
        userModel.getOneUser(filter, (err, data) => {
            if (err)
                console.error(err);
            else
                res.send({ data: data })
        })
    },
    async addUser(req, res) {
        // Validate incoming input
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 11);
        const user = { ...req.body, password: hashedPassword };
        userModel.addUser(user, async (err, data) => {
            if (err)
                console.error(err)
            else {
                const dataToken = {
                    id: data.id,
                    email: data.email,
                };
                const jwtService = new JWTService();
                const dataResult = { ...data._doc, access_token: await jwtService.generateAccessToken(dataToken) }
                res.status(201).send({ data: dataResult })
            }
        })
    },
    async login(req, res) {
        // Validate incoming input
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const user = await userModel.findOne({ email: req.body.email });
        const isPasswordMatching = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordMatching)
            return res.status(400).json({
                errors: [{
                    value: "", msg: "Email or password doesn't match", param: "password", location: "body"
                }]
            });
        const dataToken = {
            id: user.id,
            email: user.email,
        };
        const jwtService = new JWTService();
        const dataResult = { ...user._doc, access_token: await jwtService.generateAccessToken(dataToken) }
        res.status(201).send({ data: dataResult })
    },
    updateUser(req, res) {
        const filter = { ...req.body.filter }
        delete req.body.filter;
        const data = { ...req.body }
        userModel.updateUser(filter, data, (err, data) => {
            if (err)
                console.error(err)
            else
                res.status(202).send({ data: data })
        })
    },
    deleteUser(req, res) {
        const filter = { ...req.body }
        userModel.deleteUser(filter, (err, data) => {
            if (err)
                console.error(err)
            else
                res.status(203).send({ data: data })
        })
    }
}
module.exports = usersController;