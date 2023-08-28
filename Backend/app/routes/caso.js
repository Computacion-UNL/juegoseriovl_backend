
const express = require('express');
const router = express.Router();    
const caseController = require('../controllers/caso.controller')
const checkAuth = require("../utils/validators/authCheck")

 
router.post('/',              checkAuth(['DECE','TEACHER','STUDENT']),  caseController.create);
router.post('/test/student',  checkAuth(['DECE','TEACHER','STUDENT']),  caseController.testStudent);
router.put('/:id', checkAuth(['DECE','TEACHER','STUDENT']),  caseController.update);
router.post('/test/teacher',  checkAuth(['DECE','TEACHER','STUDENT']),  caseController.testTeacher);
router.get('/casos/:id',      checkAuth(['DECE','TEACHER','STUDENT']),  caseController.findAll);
router.get('/:id',            checkAuth(['DECE','TEACHER','STUDENT']),  caseController.getCaso);
router.get('/reporte/:id',            checkAuth(['DECE','TEACHER','STUDENT']),  caseController.getReporte);
router.get('/teacher/:id',    checkAuth(['DECE','TEACHER','STUDENT']),  caseController.getAllStudentsXTeacher);
router.delete('/:id',         checkAuth(['DECE','TEACHER','STUDENT']),  caseController.delete);

module.exports = router;