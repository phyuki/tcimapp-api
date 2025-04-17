const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patient.controller');

router.get('/byEmail', PatientController.getByEmail);
router.get('/', PatientController.getAllByProfessionalId);
router.post('/', PatientController.create);
router.put('/', PatientController.update);

module.exports = router;
