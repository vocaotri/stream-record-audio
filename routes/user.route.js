var express = require('express');
var userController = require('../controllers/user.controller');
var router = express.Router();
router.get('/list-user', userController.listUsers);
router.get('/user', userController.user)
router.post('/add-user', userController.addUser);
router.put('/update-user', userController.updateUser);
router.delete('/delete-user', userController.deleteUser);
module.exports = router;