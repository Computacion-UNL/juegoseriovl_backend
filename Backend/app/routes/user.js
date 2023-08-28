const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkAuth = require("../utils/validators/authCheck")
const {validateCreateUser} = require('../utils/validators/user.validator')


router.post('/',       checkAuth(['ADMIN']),  userController.createUser);
router.get('/',        checkAuth(['ADMIN']), userController.getUsers);
router.get('/:id',     checkAuth(['ADMIN']), userController.getUser);
router.put('/:id',     checkAuth(['ADMIN']), userController.updateUser);
router.post('/status', checkAuth(['ADMIN']), userController.updateUserStatus);
router.post('/pass', checkAuth(['ADMIN']), userController.changePasswordUser);
router.delete('/:id',  checkAuth(['ADMIN']), userController.deleteUser);

module.exports = router;