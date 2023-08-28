const express = require('express');
const router = express.Router();
const personController = require('../controllers/person.controller');
const checkAuth = require("../utils/validators/authCheck")


router.post('/',      checkAuth,  personController.createPerson);
router.get('/',       checkAuth,  personController.getPersons);
router.get('/:id',    checkAuth,  personController.getPerson);
router.put('/:id',    checkAuth,  personController.updatePerson);
router.delete('/:id', checkAuth,  personController.deletePerson);

module.exports = router;
