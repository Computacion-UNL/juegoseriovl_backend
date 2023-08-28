const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const checkAuth = require("../utils/validators/authCheck")



router.post('/',      checkAuth(['ADMIN', 'DECE']),  teacherController.createTeacher);
router.get('/',       checkAuth(['ADMIN', 'DECE']),   teacherController.getTeachers);
router.post('/casos/',       checkAuth(['ADMIN', 'DECE']),   teacherController.getTeachersCasos);
router.get('/:id',    checkAuth(['ADMIN', 'DECE']),  teacherController.getTeacher);
router.delete('/:id', checkAuth(['ADMIN', 'DECE']),  teacherController.deleteTeacher);
router.put('/:id',    checkAuth(['ADMIN', 'DECE']),  teacherController.updateTeacher);

module.exports = router;