var express = require('express');
var userController = require('../controllers/user.controller');
const { checkSchema } = require('express-validator');
var { registrationSchema, loginSchema } = require('../validates/user.validate')
var router = express.Router();
router.get('/list-user', userController.listUsers);
router.get('/user', userController.user)
router.post('/add-user', checkSchema(registrationSchema), userController.addUser);
router.post('/login', checkSchema(loginSchema), userController.login);
router.put('/update-user', userController.updateUser);
router.delete('/delete-user', userController.deleteUser);
module.exports = router;