const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.post('/register', AuthController.register);
router.get('/login', AuthController.login);

module.exports = router;
