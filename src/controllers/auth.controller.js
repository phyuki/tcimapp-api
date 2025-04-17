const AuthService = require('../services/auth.service');

exports.register = async (req, res) => {
    const result = await AuthService.register(req.body);
    res.status(result.status).json(result.data);
};

exports.login = async (req, res) => {
    const result = await AuthService.login(req.query);
    res.json(result);
};