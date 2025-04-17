const DassService = require('../services/dass.service');

exports.getQuestions = async (req, res) => {
    const result = await DassService.getQuestions();
    res.json(result);
};

exports.saveScore = async (req, res) => {
    const result = await DassService.saveScore(req.body);
    res.json(result);
};

exports.getScores = async (req, res) => {
    const result = await DassService.getScores(req.query.patient);
    res.json(result);
};

exports.saveAnswers = async (req, res) => {
    const result = await DassService.saveAnswers(req.body);
    res.json(result);
};
