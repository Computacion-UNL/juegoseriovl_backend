const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institution.controller');
const checkAuth = require("../utils/validators/authCheck")

router.post('/',      checkAuth(['ADMIN']),  institutionController.createInstitution);
router.get('/',       checkAuth(['ADMIN','DECE']),  institutionController.getInstitutions);
router.get('/:id',    checkAuth(['ADMIN']),  institutionController.getInstitution);
router.put('/:id',    checkAuth(['ADMIN']),  institutionController.updateInstitution);
router.delete('/:id', checkAuth(['ADMIN']),  institutionController.deleteInstitution);

module.exports = router;