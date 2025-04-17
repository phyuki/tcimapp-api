const model = require('../models');

exports.getQuestions = async () => {
    const questions = await model.dassQuestions.findAll();
    return questions.map(q => q.dataValues);
};

exports.saveScore = async ({ scoreA, scoreD, scoreE, patientId }) => {
    const report = await model.dassscores.create({
        scoreA,
        scoreD,
        scoreE,
        patientId
    });
    return report;
};

exports.getScores = async (patientId) => {
    const scores = await model.dassscores.findAll({
        where: { patientId }
    });

    if (!scores.length) return '';

    return scores.map(score => {
        const date = new Date(score.createdAt).toISOString().split('T')[0];
        return [
            score.scoreA,
            score.scoreD,
            score.scoreE,
            date
        ];
    });
};

exports.saveAnswers = async ({ answers, questionId, patientId }) => {
    const details = questionId.map((id, index) => ({
        questionId: id,
        answer: answers[index],
        patientId
    }));

    return await model.dassanswers.bulkCreate(details);
};
