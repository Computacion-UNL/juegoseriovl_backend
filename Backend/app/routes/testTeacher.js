const express = require('express');
const router = express.Router();
const testTeacherController = require('../controllers/testTeacher.controller');
const checkAuth = require("../utils/validators/authCheck")


router.get('/teacher/:id',       checkAuth(['ADMIN','DECE','TEACHER']),  testTeacherController.findAll);
router.get('/:id',    checkAuth(['ADMIN','DECE','TEACHER']),  testTeacherController.getTestTeacher);
router.delete('/:id', checkAuth(['ADMIN','DECE','TEACHER']),  testTeacherController.deleteOne);

module.exports = router;
