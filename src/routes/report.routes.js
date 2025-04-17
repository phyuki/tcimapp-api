const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');

router.get('/', ReportController.getAllByPatient);
router.get('/byDisorder', ReportController.getByDisorder);
router.post('/', ReportController.create);

module.exports = router;
