const express = require('express');
const router = express.Router();
const ProfessionalController = require('../controllers/professional.controller');

router.get('/', ProfessionalController.getByEmailOrId);
router.get('/all', ProfessionalController.getAll);
router.post('/', ProfessionalController.create);
router.put('/', ProfessionalController.update);

module.exports = router;
