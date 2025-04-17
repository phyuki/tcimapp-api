const express = require('express');
const router = express.Router();
const DassController = require('../controllers/dass.controller');

router.get('/', DassController.getQuestions);
router.post('/', DassController.saveScore);
router.get('/scores', DassController.getScores);
router.post('/answers', DassController.saveAnswers);

module.exports = router;
