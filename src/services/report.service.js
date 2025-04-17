const model = require('../models');

exports.getAllByPatient = async (patientId) => {
    const scores = await model.scidscores.findAll({ where: { patientId } });

    if (!scores.length) return '';

    const items = scores.map(item => {
        const date = new Date(item.createdAt).toISOString().split('T')[0];
        return [
            item.lifetime_criteria,
            item.past_criteria,
            item.disorder,
            date
        ];
    });

    let allDisorders = 0, index = 0;
    const grouped = items.reduce((acc, curr) => {
        if (allDisorders === 0) acc[index] = [];
        acc[index].push(curr);
        if (allDisorders === 13) {
            allDisorders = -1;
            index++;
        }
        allDisorders++;
        return acc;
    }, {});

    return Object.values(grouped).map(subArray => subArray.flat());
};

exports.getByDisorder = async (patientId, disorder) => {
    const scores = await model.scidscores.findAll({
        where: { patientId, disorder }
    });

    if (!scores.length) return '';

    return scores.map(item => {
        const date = new Date(item.createdAt).toISOString().split('T')[0];
        return [item.lifetime_criteria, item.past_criteria, date];
    });
};

exports.create = async ({ disorders, scores, patientId, answers, questionId }) => {
    const reportScores = scores.map((score, i) => ({
        lifetime_criteria: score[0],
        past_criteria: score[1],
        disorder: disorders[i],
        patientId
    }));

    const savedScores = await model.scidscores.bulkCreate(reportScores);

    let savedAnswers = [];

    for (let i = 0; i < disorders.length; i++) {
        const details = questionId[i].map((qId, j) => ({
            questionId: qId,
            answer: answers[i][j],
            patientId,
            disorder: disorders[i]
        }));
        savedAnswers = await model.scidanswers.bulkCreate(details);
    }

    return savedScores;
};
