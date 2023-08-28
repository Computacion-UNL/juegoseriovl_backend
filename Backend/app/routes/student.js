const express = require('express');
const router = express.Router();
const checkAuth = require("../utils/validators/authCheck")
const studentController = require('../controllers/student.controller');


router.post('/',    checkAuth(['STUDENT','DECE','ADMIN']), studentController.createStudent);
router.get('/',     checkAuth(['STUDENT','DECE','ADMIN']),  studentController.getStudents);
router.get('/:id',  checkAuth(['STUDENT','DECE','ADMIN']), studentController.getStudent);
router.put('/:id',  checkAuth(['STUDENT','DECE','ADMIN']), studentController.updateStudent);
router.delete('/:id', checkAuth(['STUDENT','DECE', 'ADMIN']), studentController.deleteStudent);
router.post('/generate', checkAuth(['STUDENT','DECE']), studentController.generatePassStudent);
router.post('/login', studentController.loginStudent);

module.exports = router;
