const express = require('express');
const router = express.Router();
const testQuestionController = require('../controllers/testQuestion.controller');
const checkAuth = require("../utils/validators/authCheck")


router.post('/',      checkAuth(['ADMIN','DECE']),  testQuestionController.create);
router.get('/',       checkAuth(['ADMIN','DECE','TEACHER']),   testQuestionController.findAll);
router.get('/:id',    checkAuth(['ADMIN','DECE']),  testQuestionController.findOne);
router.put('/:id',    checkAuth(['ADMIN','DECE']),  testQuestionController.update);
router.delete('/:id', checkAuth(['ADMIN','DECE']),  testQuestionController.delete);

module.exports = router;